import React from 'react';

// State, routing and localization
import { connect, ConnectedProps } from 'react-redux';
import { useNavigate, useLocation, NavigateFunction, Location } from 'react-router-dom';
import { FormattedMessage, FormattedTime, injectIntl, IntlShape } from 'react-intl';

// Material UI
import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

// Icons
import Icon from '@mdi/react';
import { mdiCommentAlertOutline, mdiShieldRefreshOutline, mdiTrashCan, mdiUndoVariant } from '@mdi/js';

// Services
import message from 'service/message';
import MarketplaceAccountApi from 'service/account-marketplace';

// Store
import { RootState } from 'store';
import { addToSelection, removeFromSelection, resetFilter, resetSelection, setFilter, setPager, setSorting } from 'store/account-marketplace/actions';
import { find } from 'store/account-marketplace/thunks';

// Model
import { buildPath, DynamicRoutes } from 'model/routes';
import { PageRequest, Sorting } from 'model/response';
import { EnumMarketplaceAccountSortField, MarketplaceAccount } from 'model/account-marketplace';

// Components
import Dialog, { DialogAction, EnumDialogAction } from 'components/dialog';

import AccountFilters from './grid/filter';
import AccountTable from './grid/table';

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
  }
});

interface AccountManagerState {
  confirm: boolean;
  record: MarketplaceAccount | null
}

interface AccountManagerProps extends PropsFromRedux, WithStyles<typeof styles> {
  intl: IntlShape,
  navigate: NavigateFunction;
  location: Location;
}

class AccountManager extends React.Component<AccountManagerProps, AccountManagerState> {

  private api: MarketplaceAccountApi;

  constructor(props: AccountManagerProps) {
    super(props);

    this.api = new MarketplaceAccountApi();

    this.refreshKycStatus = this.refreshKycStatus.bind(this);
  }

  state: AccountManagerState = {
    confirm: false,
    record: null,
  }

  viewRow(key: string): void {
    const path = buildPath(DynamicRoutes.MarketplaceAccountView, [key]);

    this.props.navigate(path);
  }

  showConfirmDialog(record: MarketplaceAccount): void {
    this.setState({
      confirm: true,
      record,
    });
  }

  hideConfirmDialog(): void {
    this.setState({
      confirm: false,
      record: null,
    });
  }

  confirmDialogHandler(action: DialogAction): void {
    switch (action.key) {
      case EnumDialogAction.Yes:
        break;

    }

    this.hideConfirmDialog();
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

  refreshKycStatus(row: MarketplaceAccount): void {
    this.api.refreshKycStatus(row.key)
      .then((response) => {
        if (response.data!.success) {
          message.infoHtml(
            <FormattedMessage
              id={'account.message.kyc-refresh-success'}
            />,
            () => (<Icon path={mdiShieldRefreshOutline} size="3rem" />),
          );
          this.find();
        } else {
          message.error('account.message.kyc-refresh-failure');
        }
      })
      .catch(() => {
        message.error('account.message.kyc-refresh-failure');
      });
  }

  render() {
    const {
      addToSelection,
      classes,
      config,
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
            <AccountFilters
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
            <AccountTable
              config={config}
              loading={loading}
              query={query}
              result={result}
              pagination={pagination}
              selected={selected}
              sorting={sorting}
              addToSelection={addToSelection}
              find={this.props.find}
              refreshKycStatus={this.refreshKycStatus}
              removeFromSelection={removeFromSelection}
              resetSelection={resetSelection}
              setPager={setPager}
              setSorting={(sorting: Sorting<EnumMarketplaceAccountSortField>[]) => this.setSorting(sorting)}
              view={(key: string) => this.viewRow(key)}
            />
          </Paper>
        </div >
        {this.renderConfirm()}
      </>
    );
  }

  renderConfirm() {
    const _t = this.props.intl.formatMessage;

    const { confirm, record } = this.state;

    if (!confirm || !record) {
      return null;
    }

    return (
      <Dialog
        actions={[
          {
            key: EnumDialogAction.Yes,
            label: _t({ id: 'view.shared.action.yes' }),
            iconClass: () => (<Icon path={mdiTrashCan} size="1.5rem" />),
            color: 'primary',
          }, {
            key: EnumDialogAction.No,
            label: _t({ id: 'view.shared.action.no' }),
            iconClass: () => (<Icon path={mdiUndoVariant} size="1.5rem" />)
          }
        ]}
        handleClose={() => this.hideConfirmDialog()}
        handleAction={(action) => this.confirmDialogHandler(action)}
        header={
          <span>
            <i className={'mdi mdi-comment-question-outline mr-2'}></i>
            <FormattedMessage id="view.shared.dialog.title" />
          </span>
        }
        open={confirm}
      >
        <FormattedMessage id="view.shared.message.delete-confirm" values={{ name: record.email }} />
      </Dialog>
    );
  }
}

const mapState = (state: RootState) => ({
  config: state.config,
  explorer: state.account.marketplace,
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
const StyledComponent = withStyles(styles)(AccountManager);

// Inject i18n resources
const LocalizedComponent = injectIntl(StyledComponent);

// Inject state
const ConnectedComponent = connector(LocalizedComponent);

const RoutedComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <ConnectedComponent navigate={navigate} location={location} />
  );
}

// Inject state
export default RoutedComponent;
