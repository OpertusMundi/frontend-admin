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
import { mdiCommentAlertOutline } from '@mdi/js';

// Services
import message from 'service/message';

// Store
import { RootState } from 'store';
import { resetFilter, setFilter, setPager, setSorting } from 'store/subscription-billing/actions';
import { find } from 'store/subscription-billing/thunks';

// Model
import { buildPath, DynamicRoutes } from 'model/routes';
import { PageRequest, Sorting } from 'model/response';
import { EnumSubscriptionBillingBatchSortField } from 'model/subscription-billing';

// Components
import SubscriptionBillingFilters from './grid/filter';
import SubscriptionBillingTable from './grid/table';

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

interface SubscriptionBillingManagerProps extends PropsFromRedux, WithStyles<typeof styles> {
  intl: IntlShape;
  navigate: NavigateFunction;
  location: Location;
}

class SubscriptionBillingManager extends React.Component<SubscriptionBillingManagerProps> {

  constructor(props: SubscriptionBillingManagerProps) {
    super(props);

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

  viewProcessInstance(processInstance: string): void {
    const path = buildPath(DynamicRoutes.ProcessInstanceView, null, { processInstance });
    this.props.navigate(path);
  }

  setSorting(sorting: Sorting<EnumSubscriptionBillingBatchSortField>[]): void {
    this.props.setSorting(sorting);
    this.find();
  }

  render() {
    const {
      classes,
      explorer: { query, result, pagination, loading, lastUpdated, selected, sorting },
      find,
      setPager,
      setFilter,
      resetFilter,
    } = this.props;

    return (
      <>
        <div>
          <Paper className={classes.paper}>
            <SubscriptionBillingFilters
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
                    <FormattedMessage id="billing.subscription-billing-batch.last-update" />
                    <FormattedTime value={lastUpdated.toDate()} day='numeric' month='numeric' year='numeric' />
                  </Typography>
                </Grid>
              </Grid>
            }
          </Paper>

          <Paper className={classes.paperTable}>
            <SubscriptionBillingTable
              find={this.props.find}
              loading={loading}
              pagination={pagination}
              query={query}
              selected={selected}
              setPager={setPager}
              setSorting={(sorting: Sorting<EnumSubscriptionBillingBatchSortField>[]) => this.setSorting(sorting)}
              result={result}
              sorting={sorting}
              viewProcessInstance={this.viewProcessInstance}
            />
          </Paper>
        </div >
      </>
    );
  }

}

const mapState = (state: RootState) => ({
  config: state.config,
  explorer: state.billing.subscriptionBilling,
});

const mapDispatch = {
  find: (pageRequest?: PageRequest, sorting?: Sorting<EnumSubscriptionBillingBatchSortField>[]) => find(pageRequest, sorting),
  resetFilter,
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
const styledComponent = withStyles(styles)(SubscriptionBillingManager);

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

