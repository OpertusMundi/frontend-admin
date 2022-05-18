import React from 'react';

// State, routing and localization
import { connect, ConnectedProps } from 'react-redux';
import { useNavigate, useLocation, useParams, NavigateFunction, Location } from 'react-router-dom';
import { FormattedMessage, FormattedTime, FormattedNumber, injectIntl, IntlShape } from 'react-intl';

// Components
import { Link } from 'react-router-dom';

import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import { grey, indigo } from '@material-ui/core/colors';

// Icons
import Icon from '@mdi/react';
import {
  mdiPackageVariantClosed,
  mdiFaceAgent,
  mdiBankTransfer,
} from '@mdi/js';

// Store
import { RootState } from 'store';
import { findOne } from 'store/payin/thunks';
import { setFilter } from 'store/payin/actions';

// Model
import { buildPath, DynamicRoutes, StaticRoutes } from 'model/routes';
import { EnumPaymentMethod } from 'model/enum';
import { EnumMangopayUserType, Address, CustomerIndividual, CustomerProfessional, Customer } from 'model/account-marketplace';
import {
  EnumTransactionStatus,
  BankwirePayIn, PayIn,
  PayInItem,
  EnumPayInItemType,
  OrderPayInItem,
  PayInAddress,
  SubscriptionBillingPayInItem,
  PayInType,
  CardDirectPayIn,
} from 'model/order';

// Service
import PayInApi from 'service/payin';

// Helper methods
import { mapPaymentMethodToIcon } from 'components/billing/common';
import { CustomerDetails, PricingModelDetails } from 'components/common';

const styles = (theme: Theme) => createStyles({
  alignCenter: {
    display: 'flex',
    alignSelf: 'center',
  },
  avatar: {
    backgroundColor: indigo[500],
  },
  card: {
    borderRadius: 0,
    padding: theme.spacing(0, 1),
    margin: theme.spacing(1),
  },
  cardContent: {
    borderRadius: 0,
    padding: theme.spacing(0, 1),
    margin: theme.spacing(0, 1),
  },
  cardActions: {
    justifyContent: 'flex-end',
  },
  divider: {
    marginTop: theme.spacing(1),
  },
  inline: {
    display: 'inline',
    marginRight: theme.spacing(2),
  },
  link: {
    color: 'inherit',
  },
  listItem: {
    padding: theme.spacing(1, 0),
  },
  listItemTotal: {
    padding: theme.spacing(1, 0),
  },
  listItemTotalDetails: {
    padding: theme.spacing(1, 0),
    justifyContent: 'flex-end',
  },
  paper: {
    padding: '6px 16px',
  },
  status: {
    color: grey[50],
    borderRadius: theme.spacing(0.5),
    padding: theme.spacing(0.5),
  },
  total: {
    fontWeight: 700,
  },
  title: {
    marginTop: theme.spacing(2),
  },
  underline: {
    textDecoration: 'underline',
    cursor: 'pointer',
  }
});

interface RouteParams {
  key?: string | undefined;
}

interface PayInDetailsState {
  transferFunds: number;
  transferFees: number;
}

interface PayInDetailsProps extends PropsFromRedux, WithStyles<typeof styles> {
  intl: IntlShape;
  navigate: NavigateFunction;
  location: Location;
  params: RouteParams;
}

class PayInDetails extends React.Component<PayInDetailsProps, PayInDetailsState> {

  api: PayInApi;

  constructor(props: PayInDetailsProps) {
    super(props);

    this.api = new PayInApi();

    this.state = {
      transferFunds: 0,
      transferFees: 0,
    };
  }

  get key(): string | null {
    const { key } = this.props.params;

    return key || null;
  }

  componentDidMount() {
    if (this.key) {
      this.props.findOne(this.key)
        .then((payin) => {
          if (payin != null) {
            let transferFunds = 0, transferFees = 0;

            payin.items!.forEach(i => {
              transferFunds += i.transfer ? i.transfer!.creditedFunds : 0;
              transferFees += i.transfer ? i.transfer!.fees : 0;
            });

            this.setState({
              transferFunds,
              transferFees,
            });
          }
        })
        .catch((err) => {
          // TODO: Redirect to grid view?
        });
    } else {
      // TODO: Redirect to grid view?
    }
  }

  showMangopayPage(payin: PayInType) {
    window.open(`https://dashboard.sandbox.mangopay.com/PayIn/${payin.providerPayIn}`);
  }

  showPayInManager(e: React.MouseEvent, payin: PayInType) {
    e.preventDefault();

    this.props.setFilter({ referenceNumber: payin.referenceNumber });

    this.props.navigate(StaticRoutes.PayInManager);
  }

  getCustomerName(customer?: Customer): string {
    if (!customer) {
      return '';
    }
    if (customer.type === EnumMangopayUserType.INDIVIDUAL) {
      const c = customer as CustomerIndividual;
      return [c.firstName, c.lastName].join(' ');
    }
    if (customer.type === EnumMangopayUserType.PROFESSIONAL) {
      const c = customer as CustomerProfessional;
      return c.name;
    }
    return '';
  }

  renderCustomerAddress(payin: PayIn): React.ReactNode | null {
    let a: Address | null = null;

    if (payin?.consumer!.type === EnumMangopayUserType.INDIVIDUAL) {
      const c = payin?.consumer as CustomerIndividual;
      a = c.address;
    }
    if (payin?.consumer!.type === EnumMangopayUserType.PROFESSIONAL) {
      const c = payin?.consumer as CustomerProfessional;
      a = c.headquartersAddress;
    }

    return this.renderAddress(a);
  }

  renderBillingAddress(payin: PayInType): React.ReactNode | null {
    switch (payin.paymentMethod) {
      case EnumPaymentMethod.CARD_DIRECT:
        return this.renderPayInAddress(payin.billing);

      default:
        return (
          <span>-</span>
        );
    }
  }

  renderShippingAddress(payin: PayInType): React.ReactNode | null {
    switch (payin.paymentMethod) {
      case EnumPaymentMethod.CARD_DIRECT:
        return this.renderPayInAddress(payin.shipping);

      default:
        return (
          <span>-</span>
        );
    }
  }

  renderAddress(a: Address | null): React.ReactNode | null {
    if (!a) {
      return null;
    }
    return (
      <>
        <Typography gutterBottom>{a.line1}</Typography>
        <Typography gutterBottom>{[a.city, a.region, a.postalCode, a.country].filter(p => !!p).join(', ')}</Typography>
      </>
    );
  }

  renderPayInAddress(a: PayInAddress | null): React.ReactNode | null {
    if (!a) {
      return (
        <span>-</span>
      );
    }
    return (
      <>
        <Typography gutterBottom>{[a.firstName, a.lastName].join(' ')}</Typography>
        {this.renderAddress(a)}
      </>
    );
  }

  renderPaymentDetails(payin: PayIn): React.ReactNode {
    switch (payin.paymentMethod) {
      case EnumPaymentMethod.FREE:
        return this.renderFreePaymentDetails(payin);
      case EnumPaymentMethod.BANKWIRE:
        return this.renderBankwirePaymentDetails(payin);
      case EnumPaymentMethod.CARD_DIRECT:
        return this.renderCardPaymentDetails(payin);
    }
  }

  renderFreePaymentDetails(payin: PayIn): React.ReactNode {
    const { classes } = this.props;

    return (
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom className={classes.title}>
            <FormattedMessage id={'billing.payin.details.sections.bankwire.status'} />
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography className={classes.inline} variant="caption">Created On</Typography>
          <Typography gutterBottom>
            <FormattedTime value={payin.createdOn.toDate()} day='numeric' month='numeric' year='numeric' />
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography className={classes.inline} variant="caption">Executed On</Typography>
          <Typography gutterBottom>
            {payin.executedOn
              ? <FormattedTime value={payin.executedOn.toDate()} day='numeric' month='numeric' year='numeric' />
              : '-'
            }
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography className={classes.inline} variant="caption">Status</Typography>
          <Typography gutterBottom className={classes.status} style={{ background: this.mapStatusToColor(payin) }}>
            <FormattedMessage id={`enum.transaction-status.${payin.status}`} />
          </Typography>
        </Grid>
      </Grid>
    )
  }

  renderBankwirePaymentDetails(payin: PayIn): React.ReactNode {
    const p = payin as BankwirePayIn;

    const { classes } = this.props;
    const { bankAccount, wireReference } = p;

    return (
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom className={classes.title}>
            <FormattedMessage id={'billing.payin.details.sections.bankwire.status'} />
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography className={classes.inline} variant="caption">Created On</Typography>
          <Typography gutterBottom>
            <FormattedTime value={payin.createdOn.toDate()} day='numeric' month='numeric' year='numeric' />
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography className={classes.inline} variant="caption">Executed On</Typography>
          <Typography gutterBottom>
            {payin.executedOn
              ? <FormattedTime value={payin.executedOn.toDate()} day='numeric' month='numeric' year='numeric' />
              : '-'
            }
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography className={classes.inline} variant="caption">Status</Typography>
          <Typography gutterBottom className={classes.status} style={{ background: this.mapStatusToColor(payin) }}>
            <FormattedMessage id={`enum.transaction-status.${payin.status}`} />
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom className={classes.title}>
            <FormattedMessage id={'billing.payin.details.sections.transaction'} />
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography className={classes.inline} variant="caption">Provider Transaction</Typography>
          <Typography gutterBottom>
            <span className={classes.underline} onClick={() => this.showMangopayPage(p)}>{p.providerPayIn}</span>
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <Typography className={classes.inline} variant="caption">Provider Result</Typography>
          <Typography gutterBottom>
            {p.providerResultCode ? `${p.providerResultCode} - ${p.providerResultMessage}` : '-'}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h6" gutterBottom className={classes.title}>
            <FormattedMessage id={'billing.payin.details.sections.bankwire.bank-account'} />
          </Typography>
          <Typography className={classes.inline} variant="caption">IBAN</Typography>
          <Typography gutterBottom>{bankAccount!.iban}</Typography>
          <Typography className={classes.inline} variant="caption">BIC</Typography>
          <Typography gutterBottom>{bankAccount!.bic}</Typography>
          <Typography className={classes.inline} variant="caption">Wire Reference</Typography>
          <Typography gutterBottom>{wireReference}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h6" gutterBottom className={classes.title}>
            <FormattedMessage id={'billing.payin.details.sections.bankwire.bank-account-owner'} />
          </Typography>
          <Typography gutterBottom>{bankAccount!.ownerName}</Typography>
          {this.renderAddress(bankAccount!.ownerAddress)}
        </Grid>
      </Grid>
    )
  }

  renderCardPaymentDetails(payin: PayIn): React.ReactNode {
    const p = payin as CardDirectPayIn;

    const { classes } = this.props;

    return (
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom className={classes.title}>
            <FormattedMessage id={'billing.payin.details.sections.bankwire.status'} />
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography className={classes.inline} variant="caption">Created On</Typography>
          <Typography gutterBottom>
            <FormattedTime value={payin.createdOn.toDate()} day='numeric' month='numeric' year='numeric' />
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography className={classes.inline} variant="caption">Executed On</Typography>
          <Typography gutterBottom>
            {payin.executedOn
              ? <FormattedTime value={payin.executedOn.toDate()} day='numeric' month='numeric' year='numeric' />
              : '-'
            }
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography className={classes.inline} variant="caption">Status</Typography>
          <Typography gutterBottom className={classes.status} style={{ background: this.mapStatusToColor(payin) }}>
            <FormattedMessage id={`enum.transaction-status.${payin.status}`} />
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom className={classes.title}>
            <FormattedMessage id={'billing.payin.details.sections.transaction'} />
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography className={classes.inline} variant="caption">Provider Transaction</Typography>
          <Typography gutterBottom>
            <span className={classes.underline} onClick={() => this.showMangopayPage(p)}>{p.providerPayIn}</span>
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <Typography className={classes.inline} variant="caption">Provider Result</Typography>
          <Typography gutterBottom>
            {p.providerResultCode ? `${p.providerResultCode} - ${p.providerResultMessage}` : '-'}
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography className={classes.inline} variant="caption">Requested 3DS version</Typography>
          <Typography gutterBottom>
            {p.providerResultCode ? `${p.requested3dsVersion}` : '-'}
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography className={classes.inline} variant="caption">Applied 3DS version</Typography>
          <Typography gutterBottom>
            {p.providerResultCode ? `${p.applied3dsVersion}` : '-'}
          </Typography>
        </Grid>
      </Grid>
    )
  }

  mapStatusToColor(payin: PayIn) {
    switch (payin.status) {
      case EnumTransactionStatus.FAILED:
        return '#f44336';
      case EnumTransactionStatus.SUCCEEDED:
        return '#4CAF50';
      default:
        return '#757575';
    }
  }

  renderConsumer(payin: PayInType) {
    const { classes } = this.props;

    return (
      <Card className={classes.card}>
        <CardHeader
          avatar={
            <Avatar className={classes.avatar}>
              <Icon path={mdiFaceAgent} size="1.5rem" />
            </Avatar>
          }
          title={
            <Link to={buildPath(DynamicRoutes.MarketplaceAccountView, [payin.consumer!.key])} className={classes.link}>
              {this.getCustomerName(payin?.consumer)}
            </Link>
          }
        ></CardHeader>
        <CardContent className={classes.cardContent}>
          <CustomerDetails customer={payin!.consumer!} />
        </CardContent>
      </Card>
    );
  }

  renderPaymentMethod(payin: PayInType) {
    const { classes } = this.props;
    const _t = this.props.intl.formatMessage;

    return (
      <Card className={classes.card}>
        <CardHeader
          avatar={
            <Avatar className={classes.avatar}>
              {mapPaymentMethodToIcon(payin)}
            </Avatar>
          }
          title={_t({ id: `enum.payment-method.${payin.paymentMethod}` })}
        ></CardHeader>
        <CardContent className={classes.cardContent}>
          {this.renderPaymentDetails(payin)}
          <Grid container spacing={2}>
            <Grid item container direction="column" xs={12} sm={6}>
              <Typography variant="h6" gutterBottom className={classes.title}>
                <FormattedMessage id={'billing.payin.details.sections.billing-address'} />
              </Typography>
              {this.renderBillingAddress(payin)}
            </Grid>
            <Grid item container direction="column" xs={12} sm={6}>
              <Typography variant="h6" gutterBottom className={classes.title}>
                <FormattedMessage id={'billing.payin.details.sections.shipping-address'} />
              </Typography>
              {this.renderShippingAddress(payin)}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  }

  renderPayInItem(index: number, item: PayInItem) {
    switch (item.type) {
      case EnumPayInItemType.ORDER:
        return this.renderPayInOrderItem(index, item as OrderPayInItem);
      case EnumPayInItemType.SUBSCRIPTION_BILLING:
        return this.renderPayInSubscriptionItem(index, item as SubscriptionBillingPayInItem);
    }
  }

  renderPayInOrderItem(itemIndex: number, payInItem: OrderPayInItem) {
    const { classes, config } = this.props;
    const order = payInItem.order;

    return order.items!.map((orderItem, orderItemIndex) => (
      <div key={`order-${itemIndex}-item-${orderItemIndex}`}>
        <Grid container>
          <Grid item xs={2}>
            <Typography variant="caption">Ref. Number</Typography>
            <Typography
              variant="body2"
              color="textSecondary"
            >
              <Link to={buildPath(DynamicRoutes.OrderTimeline, [order.key])} className={classes.link}>
                {order.referenceNumber}
              </Link>
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="caption">Asset</Typography>
            <Typography
              variant="body2"
              color="textSecondary"
            >
              <a className={classes.link} href={`${config.marketplaceUrl}/catalogue/${orderItem.assetId}`} target="_blank" rel="noreferrer">
                {orderItem.description}
              </a>
            </Typography>
            <Typography variant="caption">
              <PricingModelDetails item={orderItem} />
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="caption">Provider</Typography>
            <Typography
              variant="body2"
              color="textSecondary"
            >
              <Link to={buildPath(DynamicRoutes.MarketplaceAccountView, [orderItem.provider!.key])} className={classes.link}>
                {(orderItem.provider! as CustomerProfessional).name}
              </Link>
            </Typography>
          </Grid>
          <Grid container item xs={2} justifyContent={"flex-end"}>
            <Typography variant="body2" className={classes.alignCenter}>
              <FormattedNumber value={orderItem.totalPrice} style={'currency'} currency={order.currency} />
            </Typography>
          </Grid>
        </Grid>
        <Divider className={classes.divider} />
      </div >
    ));
  }

  renderPayInSubscriptionItem(index: number, item: SubscriptionBillingPayInItem) {
    return null;
  }

  renderTransferItem(index: number, item: PayInItem) {
    switch (item.type) {
      case EnumPayInItemType.ORDER:
        return this.renderTransferOrderItem(index, item as OrderPayInItem);
      case EnumPayInItemType.SUBSCRIPTION_BILLING:
        return this.renderTransferSubscriptionItem(index, item as SubscriptionBillingPayInItem);
    }
  }

  renderTransferOrderItem(itemIndex: number, payInItem: OrderPayInItem) {
    const { classes, config } = this.props;
    const order = payInItem.order;
    const transfer = payInItem.transfer;

    return order.items!.map((orderItem, orderItemIndex) => (
      <div key={`order-${itemIndex}-item-${orderItemIndex}`}>
        <Grid container>
          <Grid item xs={2}>
            <Typography
              variant="body2"
              color="textSecondary"
            >
              {transfer
                ? <FormattedTime value={transfer.createdOn.toDate()} day='numeric' month='numeric' year='numeric' />
                : <span>-</span>
              }
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography
              variant="body2"
              color="textSecondary"
            >
              <a className={classes.link} href={`${config.marketplaceUrl}/catalogue/${orderItem.assetId}`} target="_blank" rel="noreferrer">
                {orderItem.description}
              </a>
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography
              variant="body2"
              color="textSecondary"
            >
              <Link to={buildPath(DynamicRoutes.MarketplaceAccountView, [orderItem.provider!.key])} className={classes.link}>
                {(orderItem.provider! as CustomerProfessional).name}
              </Link>
            </Typography>
          </Grid>
          <Grid container item xs={2} justifyContent={"flex-end"}>
            <Typography variant="body2" className={classes.alignCenter}>
              {transfer
                ? <FormattedNumber value={transfer.fees} style={'currency'} currency={order.currency} />
                : <span>-</span>
              }
            </Typography>
          </Grid>
          <Grid container item xs={2} justifyContent={"flex-end"}>
            <Typography variant="body2" className={classes.alignCenter}>
              {transfer
                ? <FormattedNumber value={transfer.creditedFunds} style={'currency'} currency={order.currency} />
                : <span>-</span>
              }
            </Typography>
          </Grid>
        </Grid>
        <Divider className={classes.divider} />
      </div >
    ));
  }

  renderTransferSubscriptionItem(index: number, item: SubscriptionBillingPayInItem) {
    return null;
  }

  renderPayInItems() {
    const { transferFunds, transferFees } = this.state;
    const { classes, payin = null } = this.props;
    const _t = this.props.intl.formatMessage;

    if (!payin) {
      return null;
    }

    return (
      <Card className={classes.card}>
        <CardHeader
          avatar={
            <Avatar className={classes.avatar}>
              <Icon path={mdiPackageVariantClosed} size="1.5rem" />
            </Avatar>
          }
          title={_t({ id: 'billing.payin.details.sections.items' })}
        ></CardHeader>
        <CardContent className={classes.cardContent}>
          <List disablePadding>
            {payin.items!.map((item, index) => (
              this.renderPayInItem(index, item)
            ))}
            <ListItem className={classes.listItemTotal}>
              <ListItemText primary="Total" />
              <Typography variant="subtitle1" className={classes.total}>
                <FormattedNumber value={payin.totalPrice} style={'currency'} currency={payin.currency} />
              </Typography>
            </ListItem>
            {payin.status === EnumTransactionStatus.SUCCEEDED && payin.paymentMethod !== EnumPaymentMethod.FREE && transferFunds === 0 &&
              <>
                <Divider />
                <ListItem className={classes.listItemTotalDetails}>
                  <ListItemText primary={
                    <a onClick={(e) => this.showPayInManager(e, payin)} className={classes.link} href="/">
                      Transfer funds to providers
                    </a>
                  } />
                </ListItem>
              </>
            }
            {transferFunds > 0 &&
              <>
                <Divider />
                <ListItem className={classes.listItemTotalDetails}>
                  <ListItemText primary="Funds" />
                  <Typography variant="subtitle1" className={classes.total}>
                    <FormattedNumber value={transferFunds} style={'currency'} currency={payin.currency} />
                  </Typography>
                </ListItem>
                <ListItem className={classes.listItemTotalDetails}>
                  <ListItemText primary="Platform Fees" />
                  <Typography variant="subtitle1" className={classes.total}>
                    <FormattedNumber value={transferFees} style={'currency'} currency={payin.currency} />
                  </Typography>
                </ListItem>
              </>
            }
          </List>
        </CardContent>
      </Card>
    );
  }

  renderTransferItems() {
    const { transferFees, transferFunds } = this.state;
    const { classes, payin = null } = this.props;
    const _t = this.props.intl.formatMessage;

    if (!payin) {
      return null;
    }

    return (
      <Card className={classes.card}>
        <CardHeader
          avatar={
            <Avatar className={classes.avatar}>
              <Icon path={mdiBankTransfer} size="1.5rem" />
            </Avatar>
          }
          title={_t({ id: 'billing.payin.details.sections.transfer-items' })}
        ></CardHeader>
        <CardContent className={classes.cardContent}>
          <List disablePadding>
            <Grid container>
              <Grid item xs={2}>
                <Typography variant="caption">Date</Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="caption">Asset</Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="caption">Provider</Typography>
              </Grid>
              <Grid container item xs={2} justifyContent={"flex-end"}>
                <Typography variant="caption">Fees</Typography>
              </Grid>
              <Grid container item xs={2} justifyContent={"flex-end"}>
                <Typography variant="caption">Credited Funds</Typography>
              </Grid>
            </Grid>
            {payin.items!.map((item, index) => (
              this.renderTransferItem(index, item)
            ))}
          </List>
          <Grid container>
            <Grid item xs={8}>
            </Grid>
            <Grid container item xs={2} justifyContent="flex-end">
              <Typography variant="subtitle1" className={classes.total}>
                <FormattedNumber value={transferFees} style={'currency'} currency={payin.currency} />
              </Typography>
            </Grid>
            <Grid container item xs={2} justifyContent="flex-end">
              <Typography variant="subtitle1" className={classes.total}>
                <FormattedNumber value={transferFunds} style={'currency'} currency={payin.currency} />
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    )
  }

  render() {
    const { transferFunds } = this.state;
    const { payin = null } = this.props;

    if (!payin) {
      return null;
    }

    return (
      <Grid container item xs={12} justifyContent="center">
        <Grid container item>
          <Grid item xs={12} lg={6}>
            {this.renderPaymentMethod(payin)}
          </Grid>
          <Grid item xs={12} lg={6}>
            {this.renderConsumer(payin)}
          </Grid>
        </Grid>
        <Grid item xs={12}>
          {this.renderPayInItems()}
        </Grid>
        {transferFunds > 0 &&
          <Grid item xs={12}>
            {this.renderTransferItems()}
          </Grid>
        }
      </Grid >
    );
  }

}

const mapState = (state: RootState) => ({
  config: state.config,
  payin: state.billing.payin.record,
});

const mapDispatch = {
  findOne: (key: string) => findOne(key),
  setFilter,
};

const connector = connect(
  mapState,
  mapDispatch,
);

type PropsFromRedux = ConnectedProps<typeof connector>

// Apply styles
const styledComponent = withStyles(styles)(PayInDetails);

// Inject i18n resources
const LocalizedComponent = injectIntl(styledComponent);

// Inject state
const ConnectedComponent = connector(LocalizedComponent);

const RoutedComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params: RouteParams = useParams();

  return (
    <ConnectedComponent navigate={navigate} location={location} params={params} />
  );
}

export default RoutedComponent;
