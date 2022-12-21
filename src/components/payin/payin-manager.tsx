import React from 'react';

// State, routing and localization
import { connect, ConnectedProps } from 'react-redux';
import { useNavigate, useLocation, NavigateFunction, Location } from 'react-router-dom';
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';

// Material UI
import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

// Icons
import Icon from '@mdi/react';
import { mdiCommentAlertOutline, mdiWalletOutline } from '@mdi/js';

// Services
import message from 'service/message';

// Store
import { RootState } from 'store';
import { addToSelection, removeFromSelection, resetFilter, resetSelection, setFilter, setPager, setSorting } from 'store/payin/actions';
import { find } from 'store/payin/thunks';
import { createTransfer } from 'store/transfer/thunks';
import { toggleSendMessageDialog } from 'store/message/actions';

// Model
import { buildPath, DynamicRoutes } from 'model/routes';
import { PageRequest, Sorting } from 'model/response';
import { EnumOrderStatus, EnumPayInItemType, EnumPayInSortField, OrderPayInItem, PayInType } from 'model/order';
import { ClientContact } from 'model/chat';
import { CustomerIndividual, CustomerProfessional, EnumMangopayUserType } from 'model/account-marketplace';

// Components
import DateTime from 'components/common/date-time';
import PayInFilters from './grid/filter';
import PayInTable from './grid/table';

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

interface PayInManagerProps extends PropsFromRedux, WithStyles<typeof styles> {
  intl: IntlShape;
  navigate: NavigateFunction;
  location: Location;
}

class PayInManager extends React.Component<PayInManagerProps> {

  constructor(props: PayInManagerProps) {
    super(props);

    this.createTransfer = this.createTransfer.bind(this);
    this.viewPayIn = this.viewPayIn.bind(this);
    this.viewProcessInstance = this.viewProcessInstance.bind(this);
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

  viewPayIn(key: string): void {
    const path = buildPath(DynamicRoutes.PayInView, [key]);
    this.props.navigate(path);
  }

  viewProcessInstance(processInstance: string): void {
    const path = buildPath(DynamicRoutes.ProcessInstanceView, null, { processInstance });
    this.props.navigate(path);
  }

  createTransfer(payIn: PayInType): void {
    const _t = this.props.intl.formatMessage;
    const _n = this.props.intl.formatNumber;

    const pending = payIn.items!.find(i => {
      switch (i.type) {
        case EnumPayInItemType.SERVICE_BILLING:
          return false;

        case EnumPayInItemType.ORDER:
          return i.order.status !== EnumOrderStatus.SUCCEEDED;
      }

      return false;
    }) || null;

    if (pending) {
      const order = (pending as OrderPayInItem).order;

      message.warnHtml(
        <FormattedMessage
          id={'billing.payin.message.transfer-pending'}
          values={{
            referenceNumber: (
              <b>{order.referenceNumber}</b>
            ),
            status: (
              <b>{_t({ id: `enum.order-status.${order.status}` })}</b>
            )
          }}
        />,
        () => (<Icon path={mdiWalletOutline} size="3rem" />),
      );
      return;
    }

    this.props.createTransfer(payIn.key)
      .then((response) => {
        if (response && response!.success) {
          const creditedFunds = response!.result!.reduce((total, transfer) => total + transfer.creditedFunds, 0);
          const fees = response!.result!.reduce((total, transfer) => total + transfer.fees, 0);
          message.infoHtml(
            <FormattedMessage
              id={'billing.payin.message.transfer-success'}
              values={{
                count: response!.result!.length,
                creditedFunds: _n(creditedFunds, { currency: 'EUR', style: 'currency', currencyDisplay: 'symbol' }),
                fees: _n(fees, { currency: 'EUR', style: 'currency', currencyDisplay: 'symbol' }),
              }}
            />,
            () => (<Icon path={mdiWalletOutline} size="3rem" />),
          );

          this.find();
        } else {
          message.errorHtml(
            <FormattedMessage
              id={'billing.payin.message.transfer-failure'}
            />,
            () => (<Icon path={mdiWalletOutline} size="3rem" />),
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  setSorting(sorting: Sorting<EnumPayInSortField>[]): void {
    this.props.setSorting(sorting);
    this.find();
  }

  showSendMessageDialog(row: PayInType) {
    const contact = this.getContact(row);
    this.props.toggleSendMessageDialog(contact, `Payment ${row.referenceNumber}`);
  }

  getContact(row: PayInType): ClientContact | null {
    if (row.consumer && row.consumer.type === EnumMangopayUserType.INDIVIDUAL) {
      const c = row.consumer as CustomerIndividual;
      return {
        id: c.key,
        logoImage: null,
        logoImageMimeType: null,
        name: [c.firstName, c.lastName].join(' '),
        email: row.consumer!.email,
      };
    } else if (row.consumer && row.consumer?.type === EnumMangopayUserType.PROFESSIONAL) {
      const c = row.consumer as CustomerProfessional;
      return {
        id: c.key,
        logoImage: c.logoImage,
        logoImageMimeType: c.logoImageMimeType,
        name: c.name,
        email: row.consumer!.email,
      };
    }

    return null;
  }

  render() {
    const {
      addToSelection,
      classes,
      explorer: { query, items, pagination, loading, lastUpdated, selected, sorting },
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
            <PayInFilters
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
                    <FormattedMessage id="billing.payin.last-update" />
                    <DateTime value={lastUpdated.toDate()} day='numeric' month='numeric' year='numeric' />
                  </Typography>
                </Grid>
              </Grid>
            }
          </Paper>

          <Paper className={classes.paperTable}>
            <PayInTable
              loading={loading}
              pagination={pagination}
              query={query}
              result={items}
              selected={selected}
              sorting={sorting}
              addToSelection={addToSelection}
              createTransfer={this.createTransfer}
              find={this.props.find}
              removeFromSelection={removeFromSelection}
              resetSelection={resetSelection}
              sendMessage={(row: PayInType) => this.showSendMessageDialog(row)}
              setPager={setPager}
              setSorting={(sorting: Sorting<EnumPayInSortField>[]) => this.setSorting(sorting)}
              viewPayIn={this.viewPayIn}
              viewProcessInstance={this.viewProcessInstance}
            />
          </Paper>
        </div>
      </>
    );
  }
}

const mapState = (state: RootState) => ({
  config: state.config,
  explorer: state.billing.payin,
});

const mapDispatch = {
  addToSelection,
  createTransfer: (key: string) => createTransfer(key),
  find: (pageRequest?: PageRequest, sorting?: Sorting<EnumPayInSortField>[]) => find(pageRequest, sorting),
  removeFromSelection,
  resetFilter,
  resetSelection,
  setFilter,
  setPager,
  setSorting,
  toggleSendMessageDialog,
};

const connector = connect(
  mapState,
  mapDispatch,
);

type PropsFromRedux = ConnectedProps<typeof connector>

// Apply styles
const styledComponent = withStyles(styles)(PayInManager);

// Inject i18n resources
const LocalizedComponent = injectIntl(styledComponent);

// Inject state
const ConnectedComponent = connector(LocalizedComponent);

const RoutedComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <ConnectedComponent navigate={navigate} location={location} />
  );
}

export default RoutedComponent;
