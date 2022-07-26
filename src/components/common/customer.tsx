import React from 'react';

// State, routing and localization
import { connect, ConnectedProps } from 'react-redux';
import { FormattedMessage, FormattedNumber, injectIntl, IntlShape } from 'react-intl';

// Components
import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { indigo } from '@material-ui/core/colors';

// Icons
import Icon from '@mdi/react';
import {
  mdiEmailCheckOutline,
  mdiEmailRemoveOutline,
} from '@mdi/js';

// Store
import { RootState } from 'store';
import { findOne } from 'store/payin/thunks';
import { setFilter } from 'store/payin/actions';

// Model
import { EnumMangopayUserType, Address, CustomerType, EnumKycLevel } from 'model/account-marketplace';

const styles = (theme: Theme) => createStyles({
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
  emailContainer: {
    marginLeft: 0,
  },
  inline: {
    display: 'inline',
    marginRight: theme.spacing(2),
  },
  kycLevel: {
    borderRadius: theme.spacing(0.5),
    color: '#ffffff',
    display: 'table',
    padding: theme.spacing(0.5),
  },
  link: {
    color: 'inherit',
  },
  title: {
    marginTop: theme.spacing(2),
  },
  underline: {
    textDecoration: 'underline',
    cursor: 'pointer',
  },
  walletFunds: {
    fontWeight: 700,
  },
});

interface CustomerDetailsProps extends PropsFromRedux, WithStyles<typeof styles> {
  intl: IntlShape;
  customer: CustomerType;
}

class CustomerDetails extends React.Component<CustomerDetailsProps> {

  showMangopayUser() {
    const { customer } = this.props;

    window.open(`https://dashboard.sandbox.mangopay.com/User/${customer.paymentProviderUser}/Details`);
  }

  showMangopayWallet() {
    const { customer } = this.props;

    window.open(`https://dashboard.sandbox.mangopay.com/User/${customer.paymentProviderUser}/Wallets/${customer.paymentProviderWallet}`);
  }

  getCustomerName(): string {
    const { customer: c } = this.props;

    switch (c.type) {
      case EnumMangopayUserType.INDIVIDUAL:
        return [c.firstName, c.lastName].join(' ');

      case EnumMangopayUserType.PROFESSIONAL:
        return c.name;
    }
  }

  mapKycLevelToColor(level: EnumKycLevel) {
    switch (level) {
      case EnumKycLevel.LIGHT:
        return '#FBC02D';
      case EnumKycLevel.REGULAR:
        return '#4CAF50';
    }
  }

  renderCustomerAddress(): React.ReactNode | null {
    const { customer: c } = this.props;

    switch (c.type) {
      case EnumMangopayUserType.INDIVIDUAL:
        return this.renderAddress(c.address);

      case EnumMangopayUserType.PROFESSIONAL:
        return this.renderAddress(c.headquartersAddress);
    }
  }

  renderAddress(a: Address): React.ReactNode | null {
    return (
      <>
        <Typography gutterBottom>{a.line1}</Typography>
        <Typography gutterBottom>{[a.city, a.region, a.postalCode, a.country].filter(p => !!p).join(', ')}</Typography>
      </>
    );
  }

  renderRepresentative() {
    const { customer } = this.props;

    if (customer.type !== EnumMangopayUserType.PROFESSIONAL) {
      return null;
    }
    const { representative: r } = customer;
    return (
      <>
        <Typography gutterBottom>{[r.firstName, r.lastName].join(' ')}</Typography>
        {this.renderAddress(r.address)}
      </>
    );

  }

  render() {
    const { classes, customer } = this.props;

    return (
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom className={classes.title}>
            <FormattedMessage id={'billing.customer.sections.customer'} />
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <Typography className={classes.inline} variant="caption">Email</Typography>
          <Grid container item justifyContent="flex-start" spacing={1} alignItems="center" className={classes.emailContainer}>
            <Typography gutterBottom>
              {customer.email}
            </Typography>
            <Grid item>
              {customer.emailVerified &&
                <Icon color={'#4CAF50'} path={mdiEmailCheckOutline} size="1.5rem" />
              }
              {!customer.emailVerified &&
                <Icon color={'#FF5722'} path={mdiEmailRemoveOutline} size="1.5rem" />
              }
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={4}>
          <Typography className={classes.inline} variant="caption">KYC Level</Typography>
          <Typography component={'span'}
            gutterBottom
            className={classes.kycLevel}
            style={{ background: this.mapKycLevelToColor(customer.kycLevel) }}
          >
            {customer.kycLevel}
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <Typography className={classes.inline} variant="caption">Name</Typography>
          <Typography gutterBottom>
            {this.getCustomerName()}
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography className={classes.inline} variant="caption">Provider User</Typography>
          <Typography variant="body1" gutterBottom>
            <span className={classes.underline} onClick={() => this.showMangopayUser()}>{customer.paymentProviderUser}</span>
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Grid container>
            <Grid item xs={8}>
              <Typography variant="h6" gutterBottom className={classes.title}>
                <FormattedMessage id={customer.type === EnumMangopayUserType.INDIVIDUAL
                  ? 'billing.customer.sections.address'
                  : 'billing.customer.sections.address-headquarters'}
                />
              </Typography>
              <Typography gutterBottom>{this.getCustomerName()}</Typography>
              {this.renderCustomerAddress()}
            </Grid>
            {customer.type === EnumMangopayUserType.PROFESSIONAL &&
              <Grid item xs={4}>
                <Typography variant="h6" gutterBottom className={classes.title}>
                  <FormattedMessage id={'billing.customer.sections.representative'} />
                </Typography>
                {this.renderRepresentative()}
              </Grid>
            }
            {customer.type === EnumMangopayUserType.PROFESSIONAL &&
              <Grid item xs={8}>
                <Typography variant="h6" gutterBottom className={classes.title}>
                  <FormattedMessage id={'billing.customer.sections.company'}
                  />
                </Typography>
                <Typography className={classes.inline} variant="caption">Name</Typography>
                <Typography gutterBottom>{customer.name}</Typography>
                <Typography className={classes.inline} variant="caption">Company Number (VAT)</Typography>
                <Typography gutterBottom>{customer.companyNumber}</Typography>
              </Grid>
            }
            <Grid item xs={4}>
              <Typography variant="h6" gutterBottom className={classes.title}>
                <FormattedMessage id={'billing.customer.sections.wallet'}
                />
              </Typography>
              <Typography className={classes.inline} variant="caption">Wallet</Typography>
              <Typography variant="body1" gutterBottom>
                <span className={classes.underline} onClick={() => this.showMangopayWallet()}>{customer.paymentProviderWallet}</span>
              </Typography>
              <Typography className={classes.inline} variant="caption">Funds</Typography>
              <Typography variant="subtitle1" className={classes.walletFunds}>
                <FormattedNumber value={customer.walletFunds} style={'currency'} currency={'EUR'} />
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
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
const styledComponent = withStyles(styles)(CustomerDetails);

// Inject i18n resources
const LocalizedComponent = injectIntl(styledComponent);

// Inject state
const ConnectedComponent = connector(LocalizedComponent);

export default ConnectedComponent;
