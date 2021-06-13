import React from 'react';

// State, routing and localization
import { connect, ConnectedProps } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { FormattedMessage, FormattedTime, FormattedNumber, injectIntl, IntlShape } from 'react-intl';

// Components
import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

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
} from '@mdi/js';

// Store
import { RootState } from 'store';
import { findOne } from 'store/order/thunks';

// Model
import { EnumPaymentMethod } from 'model/enum';
import { EnumMangopayUserType, Address, CustomerIndividual, CustomerProfessional } from 'model/customer';
import { EnumOrderStatus, Order, BankwirePayIn, EnumTransactionStatus } from 'model/order';

// Service
import OrderApi from 'service/order';

const styles = (theme: Theme) => createStyles({
  root: {
    display: 'flex',
    padding: 0,
  },
  paper: {
    padding: '6px 16px',
  },
  secondaryTail: {
    backgroundColor: theme.palette.secondary.main,
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
  avatar: {
    backgroundColor: red[500],
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
  link: {
    textDecoration: 'none'
  }
});

interface RouteParams {
  key?: string | undefined;
}

interface OrderTimelineProps extends PropsFromRedux, WithStyles<typeof styles>, RouteComponentProps<RouteParams> {
  intl: IntlShape,
}

class OrderTimeline extends React.Component<OrderTimelineProps> {

  api: OrderApi;

  constructor(props: OrderTimelineProps) {
    super(props);

    this.api = new OrderApi();
  }

  get key(): string | null {
    const { key } = this.props.match.params;

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

  getCustomerName(order: Order): string {
    if (order.customer && order.customer.type === EnumMangopayUserType.INDIVIDUAL) {
      const c = order.customer as CustomerIndividual;
      return [c.firstName, c.lastName].join(' ');
    }
    if (order.customer && order.customer.type === EnumMangopayUserType.PROFESSIONAL) {
      const c = order.customer as CustomerProfessional;
      return c.name;
    }
    return '';
  }

  renderCustomerAddress(order: Order): React.ReactNode | null {
    let a: Address | null = null;

    if (order.customer!.type === EnumMangopayUserType.INDIVIDUAL) {
      const c = order.customer as CustomerIndividual;
      a = c.address;
    }
    if (order.customer!.type === EnumMangopayUserType.PROFESSIONAL) {
      const c = order.customer as CustomerProfessional;
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
      case EnumPaymentMethod.BANKWIRE:
        return this.renderBankwirePaymentDetails(order);
      case EnumPaymentMethod.CARD_DIRECT:
        return this.renderCardPaymentDetails(order);
    }
  }

  renderBankwirePaymentDetails(order: Order): React.ReactNode {
    const p = order.payIn as BankwirePayIn;

    return (
      <>
        <Grid item xs={12}>
          <Typography gutterBottom>
            <FormattedMessage id={`billing.order.timeline.payment-method.${order.paymentMethod}`} />
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
      <>
        <Grid item xs={12}>
          <Typography gutterBottom>
            <FormattedMessage id={`billing.order.timeline.payment-method.${order.paymentMethod}`} />
          </Typography>
        </Grid>
      </>
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
              <FormattedMessage id={`billing.order.timeline.payment.${order.paymentMethod}.${order.payIn!.status}`} />
            );
        }
      default:
        return (
          <FormattedMessage id={`billing.order.timeline.status.${status}`} />
        );
    }
  }

  mapStatusToIcon(order: Order, status: EnumOrderStatus) {
    switch (status) {
      case EnumOrderStatus.CREATED:
        return (<Icon path={mdiPackageVariantClosed} size="1.5rem" />);
      case EnumOrderStatus.CHARGED: {
        switch (order.paymentMethod) {
          case EnumPaymentMethod.BANKWIRE:
            return (<Icon path={mdiBankTransfer} size="1.5rem" />);
          case EnumPaymentMethod.CARD_DIRECT:
            return (<Icon path={mdiCreditCardOutline} size="1.5rem" />);
        }
        return null;
      }
      case EnumOrderStatus.PENDING:
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
      case EnumOrderStatus.CHARGED:
        switch (order.payIn && order.payIn.status) {
          case EnumTransactionStatus.FAILED:
            return '#f44336';
          case EnumTransactionStatus.SUCCEEDED:
            return '#4CAF50';
          default:
            return '#757575';
        }
      case EnumOrderStatus.PENDING:
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
    console.log(this.props);
    if (history.length === 0) {
      return null;
    }

    const steps = history.map((h, index) => (
      <TimelineItem key={`status-${index}`}>
        <TimelineOppositeContent>
          <Typography variant="body2" color="textSecondary">
            <FormattedTime value={h.statusUpdatedOn.toDate()} day='numeric' month='numeric' year='numeric' />
          </Typography>
        </TimelineOppositeContent>

        <TimelineSeparator>
          <TimelineDot style={{ background: this.mapStatusToColor(order, h.status) }}>
            {this.mapStatusToIcon(order, h.status)}
          </TimelineDot>
          {history.length - 1 !== index &&
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

    const h = history[0];
    console.log(h);

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

    return (
      <Grid container item xs={12} justify="center">
        <Card className={classes.card}>
          <CardHeader
            avatar={
              <Avatar className={classes.avatar}>
                <Icon path={mdiPackageVariantClosed} size="1.5rem" />
              </Avatar>
            }
            title={_t({ id: 'billing.order.timeline.order-details-header' }, { referenceNumber: order.referenceNumber })}
          ></CardHeader>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <FormattedMessage id={'billing.order.timeline.order-summary'} />
            </Typography>
            <List disablePadding>
              {order.items.map((item) => (
                <a className={classes.link} href={`${config.marketplaceUrl}/catalogue/${item.item}`} target="_blank" rel="noreferrer">
                  <ListItem className={classes.listItem} key={item.index}>
                    <ListItemText secondary={item.description} />
                    <Typography variant="body2">
                      <FormattedNumber value={item.totalPrice} style={'currency'} currency={order.currency} />
                    </Typography>
                  </ListItem>
                </a>
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
                  <FormattedMessage id={'billing.order.timeline.billing-address'} />
                </Typography>
                <Typography gutterBottom>{this.getCustomerName(order)}</Typography>
                {this.renderCustomerAddress(order)}
              </Grid>
              <Grid item container direction="column" xs={12} sm={6}>
                <Typography variant="h6" gutterBottom className={classes.title}>
                  <FormattedMessage id={'billing.order.timeline.payment-details'} />
                </Typography>
                <Grid container>
                  {this.renderPaymentDetails(order)}
                </Grid>
              </Grid>
              <Grid item container direction="column" xs={12} sm={6}>
                <Typography variant="h6" gutterBottom className={classes.title}>
                  <FormattedMessage id={'billing.order.timeline.delivery-details'} />
                </Typography>
                <Grid container>
                  {this.renderDeliveryDetails(order)}
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
            title={_t({ id: 'billing.order.timeline.timeline-header' })}
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
const styledComponent = withStyles(styles)(OrderTimeline);

// Inject i18n resources
const localizedComponent = injectIntl(styledComponent);

// Inject state
export default connector(localizedComponent);
