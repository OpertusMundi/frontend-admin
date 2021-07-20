import React from 'react';

// State, routing and localization
import { connect, ConnectedProps } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { FormattedMessage, FormattedTime, FormattedNumber, injectIntl, IntlShape } from 'react-intl';

// Material UI
import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

// Icons
import Icon from '@mdi/react';
import {
  mdiBankCheck,
  mdiBankRemove,
  mdiBankTransferOut,
  mdiCommentAlertOutline,
  mdiUndoVariant,
} from '@mdi/js';

// Services
import message from 'service/message';
import MarketplaceAccountApi from 'service/account-marketplace';
import PayOutApi from 'service/payout';

// Store
import { RootState } from 'store';
import { addToSelection, removeFromSelection, resetFilter, resetSelection, setFilter, setPager, setSorting } from 'store/provider/actions';
import { find } from 'store/provider/thunks';

// Utilities
import { FieldMapperFunc, localizeErrorCodes } from 'utils/error';

// Model
import { Message } from 'model/message';
import { PageRequest, Sorting } from 'model/response';
import {
  EnumMarketplaceAccountSortField,
  CustomerProfessional,
  MarketplaceAccountDetails
} from 'model/account-marketplace';

// Components
import Dialog, { DialogAction, EnumDialogAction } from 'components/dialog';

import ProviderFilters from './grid/filter';
import ProviderTable from './grid/table';

import Spinner from 'components/spinner';

const styles = (theme: Theme) => createStyles({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  paper: {
    padding: theme.spacing(1),
    margin: theme.spacing(1),
    color: theme.palette.text.secondary,
    borderRadius: 0,
  },
  paperTable: {
    padding: theme.spacing(1),
    margin: theme.spacing(1),
    color: theme.palette.text.secondary,
    borderRadius: 0,
    overflowX: 'auto',
  },
  caption: {
    paddingLeft: 8,
    fontSize: '0.7rem',
  },
  dialogHeader: {
    display: 'flex',
    alignItems: 'center',
  },
  listItem: {
    padding: theme.spacing(1, 0),
  },
  total: {
    fontWeight: 700,
  },
  title: {
    marginTop: theme.spacing(2),
  },
  spinner: {
    margin: 0,
    float: 'right',
  }
});

const fieldMapper: FieldMapperFunc = (field: string): string | null => {
  switch (field) {
    case 'debitedFunds':
      return 'account.marketplace.dialog.funds';
  }

  return null;
};

const mapErrorCodeToText = (intl: IntlShape, message: Message, fieldMapper?: FieldMapperFunc) => {
  switch (message.code) {
    case 'BasicMessageCode.Validation':
      switch (message.description) {
        case 'DecimalMin':
          if (message.field && fieldMapper) {
            const key = fieldMapper(message.field);
            if (key) {
              const field = intl.formatMessage({ id: key });

              return intl.formatMessage({ id: `error.validation.${message.description}` }, { field, min: '0.00' });
            }
          }
          break;
      }
      break;
    case 'PaymentMessageCode.VALIDATION_ERROR':
      return message.description;
  }

  return null;
};

interface ProviderManagerState {
  payOut: boolean;
  account: MarketplaceAccountDetails | null;
  processing: boolean;
}

interface ProviderManagerProps extends PropsFromRedux, WithStyles<typeof styles>, RouteComponentProps {
  intl: IntlShape,
}

class ProviderManager extends React.Component<ProviderManagerProps, ProviderManagerState> {

  private accountApi: MarketplaceAccountApi;
  private payOutApi: PayOutApi;

  constructor(props: ProviderManagerProps) {
    super(props);

    this.accountApi = new MarketplaceAccountApi();
    this.payOutApi = new PayOutApi();

    this.createPayOut = this.createPayOut.bind(this);
  }

  state: ProviderManagerState = {
    payOut: false,
    account: null,
    processing: false,
  }

  createPayOut(key: string) {
    this.accountApi.refreshWallets(key)
      .then((response) => {
        const { success, result } = response.data;
        if (success) {
          this.showPayOutDialog(result!);
        }
      })
      .catch((err) => {
        message.errorHtml("Failed to update wallet funds", () => (<Icon path={mdiCommentAlertOutline} size="3rem" />));
      });
  }

  showPayOutDialog(account: MarketplaceAccountDetails): void {
    this.setState({
      payOut: true,
      account,
    });
  }

  hidePayOutDialog(): void {
    this.setState({
      payOut: false,
      account: null,
    });
  }

  payOutActionHandler(action: DialogAction): void {
    switch (action.key) {
      case EnumDialogAction.Yes: {
        const { account } = this.state;
        const provider = account?.profile.provider.current;

        if (account && provider) {
          this.setState({
            processing: true,
          });

          this.payOutApi.createPayOut(account.key, provider.walletFunds)
            .then((response) => {
              const { success } = response.data;
              if (success) {
                message.infoHtml(
                  <FormattedMessage
                    id={'billing.payout.message.payout-success'}
                  />,
                  () => (<Icon path={mdiBankTransferOut} size="3rem" />),
                );

                this.find();

                this.hidePayOutDialog();
              } else {
                const messages = localizeErrorCodes(
                  this.props.intl, response.data, true, fieldMapper, mapErrorCodeToText
                );
                message.errorHtml(messages, () => (<Icon path={mdiBankRemove} size="3rem" />));
              }
            })
            .catch((err) => {
              message.errorHtml("Failed to create PayOut", () => (<Icon path={mdiCommentAlertOutline} size="3rem" />));
            })
            .finally(() => {
              this.setState({
                processing: false,
              });
            });
        }
        break;
      }
      default:
        this.hidePayOutDialog();
        break;
    }
  }

  componentDidMount() {
    this.find();
  }

  find(): void {
    this.props.find().then((result) => {
      if (!result) {
        message.errorHtml("Find operation has failed", () => (<Icon path={mdiCommentAlertOutline} size="3rem" />));
      }
    });
  }

  setSorting(sorting: Sorting<EnumMarketplaceAccountSortField>[]): void {
    this.props.setSorting(sorting);
    this.find();
  }

  render() {
    const {
      addToSelection,
      classes,
      explorer: { query, result, pagination, loading, lastUpdated, selected, sorting },
      find,
      setPager,
      setFilter,
      removeFromSelection,
      resetFilter,
    } = this.props;

    return (
      <>
        <div>
          <Paper className={classes.paper}>
            <ProviderFilters
              query={query}
              setFilter={setFilter}
              resetFilter={resetFilter}
              find={find}
              disabled={loading}
            />
            {lastUpdated &&
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="caption" display="block" gutterBottom className={classes.caption}>
                    <FormattedMessage id="account.marketplace.last-update" />
                    <FormattedTime value={lastUpdated.toDate()} day='numeric' month='numeric' year='numeric' />
                  </Typography>
                </Grid>
              </Grid>
            }
          </Paper>

          <Paper className={classes.paperTable}>
            <ProviderTable
              createPayOut={this.createPayOut}
              find={this.props.find}
              query={query}
              result={result}
              pagination={pagination}
              selected={selected}
              setPager={setPager}
              setSorting={(sorting: Sorting<EnumMarketplaceAccountSortField>[]) => this.setSorting(sorting)}
              addToSelection={addToSelection}
              removeFromSelection={removeFromSelection}
              resetSelection={resetSelection}
              sorting={sorting}
              loading={loading}
            />
          </Paper>
        </div >
        {this.renderPayOutForm()}
      </>
    );
  }

  renderAddress(account: MarketplaceAccountDetails): React.ReactNode | null {
    const provider = account.profile.provider.current! as CustomerProfessional;
    const address = provider.headquartersAddress;

    if (!address) {
      return null;
    }
    return (
      <>
        <Typography gutterBottom>{address.line1}</Typography>
        <Typography gutterBottom>{[address.city, address.region, address.postalCode, address.country].join(', ')}</Typography>
      </>
    );
  }

  renderBankAccount(account: MarketplaceAccountDetails): React.ReactNode | null {
    const provider = account.profile.provider.current! as CustomerProfessional;
    const bankAccount = provider.bankAccount;

    if (!bankAccount) {
      return null;
    }
    return (
      <>
        <Typography gutterBottom>{bankAccount.iban}</Typography>
        <Typography gutterBottom>{bankAccount.ownerName}</Typography>
      </>
    );
  }

  renderPayOutForm() {
    const _t = this.props.intl.formatMessage;

    const { payOut, account, processing } = this.state;
    if (!account) {
      return null;
    }

    const provider = account.profile.provider.current as CustomerProfessional;
    const { classes } = this.props;

    if (!payOut || !provider) {
      return null;
    }

    return (
      <Dialog
        actions={[
          {
            key: EnumDialogAction.Yes,
            label: _t({ id: 'view.shared.action.yes' }),
            iconClass: () => (<Icon path={mdiBankCheck} size="1.5rem" />),
            color: 'primary',
            disabled: provider.walletFunds <= 0 || processing,
          }, {
            key: EnumDialogAction.No,
            label: _t({ id: 'view.shared.action.no' }),
            iconClass: () => (<Icon path={mdiUndoVariant} size="1.5rem" />)
          }
        ]}
        handleClose={() => this.hidePayOutDialog()}
        handleAction={(action) => this.payOutActionHandler(action)}
        header={
          <div className={classes.dialogHeader}>
            <Icon path={mdiBankTransferOut} size="1.5rem" style={{ marginRight: 16 }} />
            <FormattedMessage id="account.marketplace.dialog.create-payout-header" />
          </div>
        }
        open={payOut}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" gutterBottom className={classes.title}>
              <FormattedMessage id={'account.marketplace.dialog.provider'} />
            </Typography>
            <Typography gutterBottom>
              {provider.name}
            </Typography>
            {this.renderAddress(account)}
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" gutterBottom className={classes.title}>
              <FormattedMessage id={'account.marketplace.dialog.bank-account'} />
            </Typography>
            <Typography gutterBottom>
              {provider.name}
            </Typography>
            {this.renderBankAccount(account)}
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom className={classes.title}>
              <FormattedMessage id={'account.marketplace.dialog.funds'} />
            </Typography>
            <Typography variant="h2" className={classes.total}>
              <FormattedNumber value={provider.walletFunds} style={'currency'} currency={'EUR'} />
            </Typography>
          </Grid>
        </Grid>
      </Dialog>
    );
  }
}

const mapState = (state: RootState) => ({
  config: state.config,
  explorer: state.account.provider,
});

const mapDispatch = {
  addToSelection,
  find: (pageRequest?: PageRequest, sorting?: Sorting<EnumMarketplaceAccountSortField>[]) => find(pageRequest, sorting),
  removeFromSelection,
  resetFilter,
  resetSelection,
  setFilter,
  setPager,
  setSorting,
};

const connector = connect(
  mapState,
  mapDispatch,
);

type PropsFromRedux = ConnectedProps<typeof connector>

// Apply styles
const styledComponent = withStyles(styles)(ProviderManager);

// Inject i18n resources
const localizedComponent = injectIntl(styledComponent);

// Inject state
export default connector(localizedComponent);