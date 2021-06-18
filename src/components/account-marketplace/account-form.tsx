import React from 'react';

// State, routing and localization
import { connect, ConnectedProps } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { injectIntl, IntlShape } from 'react-intl';

// Components
import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';

// Store
import { RootState } from 'store';
import { findOne, review } from 'store/account-marketplace/thunks';

// Model
import {
  MarketplaceAccountDetails,
} from 'model/account-marketplace';

// Service
import AccountApi from 'service/account-marketplace';

const styles = (theme: Theme) => createStyles({
  root: {
    display: 'flex',
    padding: 0,
  },
  paper: {
    padding: '6px 16px',
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
});

interface RouteParams {
  key?: string | undefined;
}

interface CustomerReviewProps extends PropsFromRedux, WithStyles<typeof styles>, RouteComponentProps<RouteParams> {
  intl: IntlShape,
}

class CustomerReview extends React.Component<CustomerReviewProps> {

  api: AccountApi;

  constructor(props: CustomerReviewProps) {
    super(props);

    this.api = new AccountApi();
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

  render() {
    const { classes, config, account = null } = this.props;
    const _t = this.props.intl.formatMessage;

    if (!account) {
      return null;
    }

    return (
      <Grid container item xs={12} justify="center">

      </Grid >
    );
  }

}

const mapState = (state: RootState) => ({
  config: state.config,
  account: state.account.marketplace.account,
});

const mapDispatch = {
  findOne: (key: string) => findOne(key),
  accept: (key: string) => review(key, true),
  reject: (key: string, reason: string) => review(key, false, reason),
};

const connector = connect(
  mapState,
  mapDispatch,
);

type PropsFromRedux = ConnectedProps<typeof connector>

// Apply styles
const styledComponent = withStyles(styles)(CustomerReview);

// Inject i18n resources
const localizedComponent = injectIntl(styledComponent);

// Inject state
export default connector(localizedComponent);
