import React from 'react';

// State, routing and localization
import { connect, ConnectedProps } from 'react-redux';
import { useNavigate, useLocation, useParams, NavigateFunction, Location } from 'react-router-dom';
import { FormattedMessage, FormattedNumber, injectIntl, IntlShape } from 'react-intl';

// Components
import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

import { Link } from 'react-router-dom';

import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import Typography from '@material-ui/core/Typography';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import { red } from '@material-ui/core/colors';

// Icons
import Icon from '@mdi/react';
import {
  mdiCogSyncOutline,
  mdiTimelineClockOutline,
  mdiPackageVariantClosed,
  mdiCreditCardOutline,
  mdiBankTransfer,
  mdiCloseOutline,
  mdiCreditCardRefundOutline,
  mdiCheckOutline,
  mdiPiggyBankOutline,
  mdiFaceAgent,
  mdiCartRemove,
  mdiCartCheck,
  mdiCartArrowDown,
  mdiFileSign,
  mdiFileDocumentEditOutline,
  mdiCloudUploadOutline,
  mdiCubeSend,
  mdiTruckDeliveryOutline,
} from '@mdi/js';

// Store
import { RootState } from 'store';
import { findOne } from 'store/order/thunks';

// Model
import { EnumPaymentMethod } from 'model/enum';
import { EnumMangopayUserType, Address, CustomerIndividual, CustomerProfessional } from 'model/account-marketplace';
import { EnumTransactionStatus } from 'model/transaction';
import { EnumOrderStatus, Order, BankwirePayIn } from 'model/order';

// Service
import OrderApi from 'service/order';

// Helper methods
import { buildPath, DynamicRoutes } from 'model/routes';

// Shared components
import { CustomerDetails, DateTime, PricingModelDetails } from 'components/common';

const styles = (theme: Theme) => createStyles({
  avatar: {
    backgroundColor: red[500],
  },
  card: {
    minWidth: 480,
    maxWidth: 640,
    borderRadius: 0,
    padding: theme.spacing(1),
    margin: theme.spacing(1),
  },
  cardActions: {
    justifyContent: 'flex-end',
  },
  listItem: {
    padding: theme.spacing(1, 0),
  },
  paper: {
    padding: '6px 16px',
  },
  total: {
    fontWeight: 700,
  },
  title: {
    marginTop: theme.spacing(2),
  },
  link: {
    color: 'inherit',
  },
  linkIcon: {
    color: 'inherit',
    cursor: 'pointer',
    display: 'inline',
    marginLeft: theme.spacing(1),
  }
});

interface RouteParams {
  key?: string | undefined;
}

interface OrderTimelineProps extends PropsFromRedux, WithStyles<typeof styles> {
  intl: IntlShape;
  navigate: NavigateFunction;
  location: Location;
  params: RouteParams;
}

class OrderDetails extends React.Component<OrderTimelineProps> {

  api: OrderApi;

  constructor(props: OrderTimelineProps) {
    super(props);

    this.api = new OrderApi();
  }

  get key(): string | null {
    const { key } = this.props.params;

    return key || null;
  }

  componentDidMount() {
    if (this.key) {
      this.props.findOne(this.key)
        .catch((err) => {
          // TODO: Redirect to grid view?
        });
    } else {
      // TODO: Redirect to grid view?
    }
  }

  showPayIn(e: React.MouseEvent, order: Order) {
    e.preventDefault();

    const path = buildPath(DynamicRoutes.PayInView, [order.payIn!.key]);

    this.props.navigate(path)
  }

  getCustomerName(order: Order): string {
    if (order.consumer && order.consumer.type === EnumMangopayUserType.INDIVIDUAL) {
      const c = order?.consumer as CustomerIndividual;
      return [c.firstName, c.lastName].join(' ');
    }
    if (order?.consumer && order?.consumer.type === EnumMangopayUserType.PROFESSIONAL) {
      const c = order?.consumer as CustomerProfessional;
      return c.name;
    }
    return '';
  }

  renderCustomerAddress(order: Order): React.ReactNode | null {
    let a: Address | null = null;

    if (order?.consumer!.type === EnumMangopayUserType.INDIVIDUAL) {
      const c = order?.consumer as CustomerIndividual;
      a = c.address;
    }
    if (order?.consumer!.type === EnumMangopayUserType.PROFESSIONAL) {
      const c = order?.consumer as CustomerProfessional;
      a = c.headquartersAddress;
    }
    if (!a) {
      return null;
    }
    return (
      <>
        <Typography gutterBottom>{a.line1}</Typography>
        <Typography gutterBottom>{[a.city, a.region, a.postalCode, a.country].join(', ')}</Typography>
      </>
    );
  }

  renderPaymentDetails(order: Order): React.ReactNode {
    switch (order.paymentMethod) {
      case EnumPaymentMethod.FREE:
        return this.renderFreePaymentDetails(order);
      case EnumPaymentMethod.BANKWIRE:
        return this.renderBankwirePaymentDetails(order);
      case EnumPaymentMethod.CARD_DIRECT:
        return this.renderCardPaymentDetails(order);
    }
  }

  renderFreePaymentDetails(order: Order): React.ReactNode {
    return (
      <>
        <Grid item xs={12}>
          <Typography gutterBottom>
            <FormattedMessage id={`enum.payment-method.${order.paymentMethod}`} />
          </Typography>
        </Grid>
      </>
    )
  }

  renderBankwirePaymentDetails(order: Order): React.ReactNode {
    const p = order.payIn as BankwirePayIn;

    return (
      <>
        <Grid item xs={12}>
          <Typography gutterBottom>
            <FormattedMessage id={`enum.payment-method.${order.paymentMethod}`} />
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography gutterBottom>{p.wireReference}</Typography>
        </Grid>
      </>
    )
  }

  renderCardPaymentDetails(order: Order): React.ReactNode {
    return (
      <Grid item xs={12}>
        <Typography gutterBottom>
          <FormattedMessage id={`enum.payment-method.${order.paymentMethod}`} />
        </Typography>
      </Grid>
    )
  }

  renderDeliveryDetails(order: Order): React.ReactNode {
    return (
      <>
        <Grid item xs={12}>
          <Typography gutterBottom>
            <FormattedMessage id={`enum.delivery-method.${order.deliveryMethod}`} />
          </Typography>
        </Grid>
      </>
    )
  }

  mapStatusToMessage(order: Order, status: EnumOrderStatus) {
    switch (status) {
      case EnumOrderStatus.CHARGED:
        switch (order.payIn!.status) {
          case EnumTransactionStatus.FAILED:
            return order.payIn!.providerResultMessage;
          default:
            return (
              <FormattedMessage id={`billing.order.details.payment.${order.paymentMethod}.${order.payIn!.status}`} />
            );
        }
      default:
        return (
          <FormattedMessage id={`billing.order.details.status.${status}`} />
        );
    }
  }

  mapStatusToIcon(order: Order, status: EnumOrderStatus) {
    switch (status) {
      case EnumOrderStatus.CREATED:
        return (<Icon path={mdiPackageVariantClosed} size="1.5rem" />);
      case EnumOrderStatus.PENDING_PROVIDER_APPROVAL:
        return (<Icon path={mdiCartArrowDown} size="1.5rem" />);
      case EnumOrderStatus.PROVIDER_REJECTED:
        return (<Icon path={mdiCartRemove} size="1.5rem" />);
      case EnumOrderStatus.PROVIDER_ACCEPTED:
        return (<Icon path={mdiCartCheck} size="1.5rem" />);
      case EnumOrderStatus.PENDING_PROVIDER_CONTRACT_UPLOAD:
        return (<Icon path={mdiCloudUploadOutline} size="1.5rem" />);
      case EnumOrderStatus.PENDING_CONSUMER_CONTRACT_ACCEPTANCE:
        return (<Icon path={mdiFileDocumentEditOutline} size="1.5rem" />);
      case EnumOrderStatus.CONTRACT_IS_SIGNED:
        return (<Icon path={mdiFileSign} size="1.5rem" />);
      case EnumOrderStatus.CHARGED: {
        switch (order.paymentMethod) {
          case EnumPaymentMethod.FREE:
            return (<Icon path={mdiPiggyBankOutline} size="1.5rem" />);
          case EnumPaymentMethod.BANKWIRE:
            return (<Icon path={mdiBankTransfer} size="1.5rem" />);
          case EnumPaymentMethod.CARD_DIRECT:
            return (<Icon path={mdiCreditCardOutline} size="1.5rem" />);
        }
        return null;
      }
      case EnumOrderStatus.PENDING_PROVIDER_SEND_CONFIRMATION:
        return (<Icon path={mdiCubeSend} size="1.5rem" />);
      case EnumOrderStatus.PENDING_CONSUMER_RECEIVE_CONFIRMATION:
        return (<Icon path={mdiTruckDeliveryOutline} size="1.5rem" />);
      case EnumOrderStatus.ASSET_REGISTRATION:
        return (<Icon path={mdiCogSyncOutline} size="1.5rem" />);
      case EnumOrderStatus.CANCELLED:
        return (<Icon path={mdiCloseOutline} size="1.5rem" />);
      case EnumOrderStatus.REFUNDED:
        return (<Icon path={mdiCreditCardRefundOutline} size="1.5rem" />);
      case EnumOrderStatus.SUCCEEDED:
        return (<Icon path={mdiCheckOutline} size="1.5rem" />);
    }
  }

  mapStatusToColor(order: Order, status: EnumOrderStatus) {
    switch (status) {
      case EnumOrderStatus.CREATED:
        return '#1565C0';
      case EnumOrderStatus.PENDING_PROVIDER_APPROVAL:
        return '#757575';
      case EnumOrderStatus.PROVIDER_REJECTED:
        return '#757575';
      case EnumOrderStatus.PROVIDER_ACCEPTED:
        return '#757575';
      case EnumOrderStatus.PENDING_PROVIDER_CONTRACT_UPLOAD:
        return '#757575';
      case EnumOrderStatus.PENDING_CONSUMER_CONTRACT_ACCEPTANCE:
        return '#757575';
      case EnumOrderStatus.CONTRACT_IS_SIGNED:
        return '#757575';
      case EnumOrderStatus.CHARGED:
        switch (order.payIn && order.payIn.status) {
          case EnumTransactionStatus.FAILED:
            return '#f44336';
          case EnumTransactionStatus.SUCCEEDED:
            return '#4CAF50';
          default:
            return '#757575';
        }
      case EnumOrderStatus.PENDING_PROVIDER_SEND_CONFIRMATION:
        return '#757575';
      case EnumOrderStatus.PENDING_CONSUMER_RECEIVE_CONFIRMATION:
        return '#757575';
      case EnumOrderStatus.ASSET_REGISTRATION:
        return '#757575';
      case EnumOrderStatus.CANCELLED:
        return '#f44336';
      case EnumOrderStatus.REFUNDED:
        return '#F57F17';
      case EnumOrderStatus.SUCCEEDED:
        return '#4CAF50';
    }
  }

  buildTimeline(order: Order) {
    const { classes } = this.props;
    const { statusHistory: history = [] } = order;

    if (history.length === 0) {
      return null;
    }
    const refund = order.payIn?.refund;
    const steps = history
      .sort((a, b) => a.statusUpdatedOn.isBefore(b.statusUpdatedOn) ? -1 : 1)
      .map((h, index) => (
        <TimelineItem key={`status-${index}`}>
          <TimelineOppositeContent>
            <Typography variant="body2" color="textSecondary">
              <DateTime value={h.statusUpdatedOn.toDate()} day='numeric' month='numeric' year='numeric' />
            </Typography>
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot style={{ background: this.mapStatusToColor(order, h.status) }}>
              {this.mapStatusToIcon(order, h.status)}
            </TimelineDot>
            {(history.length - 1 !== index || refund) &&
              <TimelineConnector />
            }
          </TimelineSeparator>
          <TimelineContent>
            <Paper elevation={3} className={classes.paper}>
              <Typography variant="h6" component="h1">
                <FormattedMessage id={`enum.order-status.${h.status}`} />
              </Typography>
              <Typography>
                {this.mapStatusToMessage(order, h.status)}
              </Typography>
            </Paper>
          </TimelineContent>
        </TimelineItem>
      ));
    if (order.payIn?.refund) {
      const refund = order.payIn.refund;

      steps.push((
        <TimelineItem key={`status-refund}`}>
          <TimelineOppositeContent>
            <Typography variant="body2" color="textSecondary">
              <DateTime value={refund.executionDate.toDate()} day='numeric' month='numeric' year='numeric' />
            </Typography>
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot style={{ background: '#757575' }}>
              <Icon path={mdiCreditCardRefundOutline} size="1.5rem" />
            </TimelineDot>
          </TimelineSeparator>
          <TimelineContent>
            <Paper elevation={3} className={classes.paper}>
              <Typography variant="h6" component="h1">
                Refund
              </Typography>
              <Typography component={'p'}>
                <FormattedMessage id={`enum.refund-reason-type.${refund.refundReasonType}`} />
              </Typography>
              <Typography component={'p'}>
                {refund.refundReasonMessage}
              </Typography>
            </Paper>
          </TimelineContent>
        </TimelineItem>
      ));
    }

    return (
      <Timeline align="alternate">
        {steps}
      </Timeline>
    );
  }

  render() {
    const { classes, config, timeline: { order = null } } = this.props;
    const _t = this.props.intl.formatMessage;

    if (!order) {
      return null;
    }

    const orderItem = order.items![0];

    return (
      <Grid container item xs={12} justifyContent="flex-start">
        <Card className={classes.card}>
          <CardHeader
            avatar={
              <Avatar className={classes.avatar}>
                <Icon path={mdiFaceAgent} size="1.5rem" />
              </Avatar>
            }
            title={_t({ id: 'billing.order.details.consumer-header' })}
          ></CardHeader>
          <CardContent>
            <CustomerDetails customer={order.consumer!} />
          </CardContent>
        </Card >
        <Card className={classes.card}>
          <CardHeader
            avatar={
              <Avatar className={classes.avatar}>
                <Icon path={mdiPackageVariantClosed} size="1.5rem" />
              </Avatar>
            }
            title={_t({ id: 'billing.order.details.order-details-header' }, { referenceNumber: order.referenceNumber })}
          ></CardHeader>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <FormattedMessage id={'billing.order.details.order-summary'} />
            </Typography>
            <List disablePadding>
              {order.items!.map((item, index) => (
                <div key={`order-item-${index}`}>

                  <ListItem className={classes.listItem}>
                    <ListItemText secondary={
                      <a className={classes.link} href={`${config.marketplaceUrl}/catalogue/${item.assetId}`} target="_blank" rel="noreferrer">
                        {item.description}
                      </a>
                    } />
                    <Typography variant="body2">
                      <FormattedNumber value={item.totalPrice} style={'currency'} currency={order.currency} />
                    </Typography>
                  </ListItem>
                  <ListItem className={classes.listItem}>
                    <Typography variant="caption">
                      <PricingModelDetails item={item} />
                    </Typography>
                  </ListItem>
                </div>
              ))}
              <ListItem className={classes.listItem}>
                <ListItemText primary="Total" />
                <Typography variant="subtitle1" className={classes.total}>
                  <FormattedNumber value={order.totalPrice} style={'currency'} currency={order.currency} />
                </Typography>
              </ListItem>
            </List>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6" gutterBottom className={classes.title}>
                  <FormattedMessage id={'billing.order.details.billing-address'} />
                </Typography>
                <Typography gutterBottom>{this.getCustomerName(order)}</Typography>
                {this.renderCustomerAddress(order)}
              </Grid>
              <Grid item container direction="column" xs={12} sm={6}>
                <Typography variant="h6" gutterBottom className={classes.title}>
                  <FormattedMessage id={'billing.order.details.payment-details'} />
                </Typography>
                <Grid container>
                  {this.renderPaymentDetails(order)}
                </Grid>
              </Grid>
              <Grid item container direction="column" xs={12} sm={6}>
                <Typography variant="h6" gutterBottom className={classes.title}>
                  <FormattedMessage id={'billing.order.details.delivery-details'} />
                </Typography>
                <Grid container>
                  {this.renderDeliveryDetails(order)}
                </Grid>
              </Grid>
              <Grid item container direction="column" xs={12} sm={6}>
                <Typography variant="h6" gutterBottom className={classes.title}>
                  <FormattedMessage id={'billing.order.details.provider-details'} />
                </Typography>
                <Grid container>
                  <Link to={buildPath(DynamicRoutes.MarketplaceAccountView, [orderItem.provider!.key])} className={classes.link}>
                    {(orderItem.provider! as CustomerProfessional).name}
                  </Link>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Card className={classes.card}>
          <CardHeader
            avatar={
              <Avatar className={classes.avatar}>
                <Icon path={mdiTimelineClockOutline} size="1.5rem" />
              </Avatar>
            }
            title={_t({ id: 'billing.order.details.timeline-header' })}
          ></CardHeader>
          <CardContent>
            {this.buildTimeline(order)}
          </CardContent>
        </Card>
      </Grid >
    );
  }

}

const mapState = (state: RootState) => ({
  config: state.config,
  timeline: state.billing.order.timeline,
});

const mapDispatch = {
  findOne: (key: string) => findOne(key),
};

const connector = connect(
  mapState,
  mapDispatch,
);

type PropsFromRedux = ConnectedProps<typeof connector>

// Apply styles
const styledComponent = withStyles(styles)(OrderDetails);

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
