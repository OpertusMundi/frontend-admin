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
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { grey, indigo } from '@material-ui/core/colors';

// Icons
import Icon from '@mdi/react';
import {
  mdiFaceAgent,
  mdiBankTransferOut,
} from '@mdi/js';

// Store
import { RootState } from 'store';
import { findOne } from 'store/payout/thunks';

// Model
import { buildPath, DynamicRoutes } from 'model/routes';
import { EnumMangopayUserType, Address, CustomerIndividual, CustomerProfessional, Customer } from 'model/account-marketplace';
import {
  EnumTransactionStatus,
  PayOut,
} from 'model/order';

// Service
import PayOutApi from 'service/payout';

// Helper methods
import { CustomerDetails } from 'components/common';

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

interface PayOutDetailsProps extends PropsFromRedux, WithStyles<typeof styles> {
  intl: IntlShape;
  navigate: NavigateFunction;
  location: Location;
  params: RouteParams;
}

class PayOutDetails extends React.Component<PayOutDetailsProps> {

  api: PayOutApi;

  constructor(props: PayOutDetailsProps) {
    super(props);

    this.api = new PayOutApi();
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

  showMangopayPayoutPage(payout: PayOut) {
    window.open(`https://dashboard.sandbox.mangopay.com/PayOut/${payout.providerPayOut}`);
  }

  showMangopayBankAccountPage(user: string, bankAccount: string) {
    window.open(`https://dashboard.sandbox.mangopay.com/User/${user}/BankAccounts/${bankAccount}`);
  }

  getCustomerName(customer: Customer): string {
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

  renderPayOutDetails(payout: PayOut): React.ReactNode {
    const { classes } = this.props;
    const { bankwireRef } = payout;
    const provider = payout.provider!;
    const bankAccount = payout.bankAccount;

    return (
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom className={classes.title}>
            <FormattedMessage id={'billing.payout.details.sections.bankwire.status'} />
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography className={classes.inline} variant="caption">Created On</Typography>
          <Typography gutterBottom>
            {payout.createdOn
              ? <FormattedTime value={payout.createdOn.toDate()} day='numeric' month='numeric' year='numeric' />
              : <span>-</span>
            }
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography className={classes.inline} variant="caption">Executed On</Typography>
          <Typography gutterBottom>
            {payout.executedOn
              ? <FormattedTime value={payout.executedOn.toDate()} day='numeric' month='numeric' year='numeric' />
              : '-'
            }
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography className={classes.inline} variant="caption">Status</Typography>
          <Typography gutterBottom className={classes.status} style={{ background: this.mapStatusToColor(payout) }}>
            <FormattedMessage id={`enum.transaction-status.${payout.status}`} />
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom className={classes.title}>
            <FormattedMessage id={'billing.payout.details.sections.transaction'} />
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography className={classes.inline} variant="caption">Provider Transaction</Typography>
          <Typography gutterBottom>
            <span className={classes.underline} onClick={() => this.showMangopayPayoutPage(payout)}>{payout.providerPayOut}</span>
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <Typography className={classes.inline} variant="caption">Provider Result</Typography>
          <Typography gutterBottom>
            {payout.providerResultCode ? `${payout.providerResultCode} - ${payout.providerResultMessage}` : '-'}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h6" gutterBottom className={classes.title}>
            <FormattedMessage id={'billing.payout.details.sections.bankwire.bank-account'} />
          </Typography>
          <Typography className={classes.inline} variant="caption">Provider Bank Account</Typography>
          <Typography gutterBottom>
            <span
              className={classes.underline}
              onClick={() => this.showMangopayBankAccountPage(provider.paymentProviderUser, bankAccount.id!)}
            >
              {bankAccount.id}
            </span>
          </Typography>
          <Typography className={classes.inline} variant="caption">IBAN</Typography>
          <Typography gutterBottom>{bankAccount!.iban}</Typography>
          <Typography className={classes.inline} variant="caption">BIC</Typography>
          <Typography gutterBottom>{bankAccount!.bic}</Typography>
          <Typography className={classes.inline} variant="caption">Wire Reference</Typography>
          <Typography gutterBottom>{bankwireRef}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h6" gutterBottom className={classes.title}>
            <FormattedMessage id={'billing.payout.details.sections.bankwire.bank-account-owner'} />
          </Typography>
          <Typography gutterBottom>{bankAccount!.ownerName}</Typography>
          {this.renderAddress(bankAccount!.ownerAddress)}
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom className={classes.title}>
            Debited Funds
          </Typography>
          <Typography gutterBottom variant="h2">
            <FormattedNumber value={payout.debitedFunds} style={'currency'} currency={payout.currency} />
          </Typography>
        </Grid>
      </Grid>
    )
  }

  mapStatusToColor(payout: PayOut) {
    switch (payout.status) {
      case EnumTransactionStatus.FAILED:
        return '#f44336';
      case EnumTransactionStatus.SUCCEEDED:
        return '#4CAF50';
      default:
        return '#757575';
    }
  }

  renderProvider(payout: PayOut) {
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
            <Link to={buildPath(DynamicRoutes.MarketplaceAccountView, [payout.provider!.key])} className={classes.link}>
              {this.getCustomerName(payout.provider!)}
            </Link>
          }
        ></CardHeader>
        <CardContent className={classes.cardContent}>
          <CustomerDetails customer={payout!.provider!} />
        </CardContent>
      </Card>
    );
  }

  renderPayout(payout: PayOut) {
    const { classes } = this.props;

    return (
      <Card className={classes.card}>
        <CardHeader
          avatar={
            <Avatar className={classes.avatar}>
              <Icon path={mdiBankTransferOut} size="1.5rem" />
            </Avatar>
          }
          title={payout.bankwireRef}
        ></CardHeader>
        <CardContent className={classes.cardContent}>
          {this.renderPayOutDetails(payout)}
        </CardContent>
      </Card>
    );
  }

  render() {
    const { payout = null } = this.props;

    if (!payout) {
      return null;
    }

    return (
      <Grid container item xs={12} justifyContent="center">
        <Grid container item>
          <Grid item xs={12} lg={6}>
            {this.renderPayout(payout)}
          </Grid>
          <Grid item xs={12} lg={6}>
            {this.renderProvider(payout)}
          </Grid>
        </Grid>
      </Grid >
    );
  }

}

const mapState = (state: RootState) => ({
  config: state.config,
  payout: state.billing.payout.record,
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
const styledComponent = withStyles(styles)(PayOutDetails);

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
