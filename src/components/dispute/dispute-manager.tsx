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

import DateTime from 'components/common/date-time';

// Icons
import Icon from '@mdi/react';
import { mdiCommentAlertOutline } from '@mdi/js';

// Services
import message from 'service/message';

// Store
import { RootState } from 'store';
import {
  resetFilter,
  setFilter,
  setPager,
  setSorting,
} from 'store/dispute/actions';
import { find } from 'store/dispute/thunks';
import { toggleSendMessageDialog } from 'store/message/actions';

// Model
import { PageRequest, Sorting } from 'model/response';
import { EnumDisputeSortField } from 'model/dispute';

// Components
import DisputeFilters from './grid/filter';
import DisputeTable from './grid/table';

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

interface DisputeManagerProps extends PropsFromRedux, WithStyles<typeof styles> {
  intl: IntlShape;
  navigate: NavigateFunction;
  location: Location;
}

class DisputeManager extends React.Component<DisputeManagerProps> {

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

  setSorting(sorting: Sorting<EnumDisputeSortField>[]): void {
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
            <DisputeFilters
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
                    <FormattedMessage id="billing.dispute.last-update" />
                    <DateTime value={lastUpdated.toDate()} day='numeric' month='numeric' year='numeric' />
                  </Typography>
                </Grid>
              </Grid>
            }
          </Paper>

          <Paper className={classes.paperTable}>
            <DisputeTable
              find={this.props.find}
              loading={loading}
              pagination={pagination}
              query={query}
              selected={selected}
              setPager={setPager}
              setSorting={(sorting: Sorting<EnumDisputeSortField>[]) => this.setSorting(sorting)}
              result={result}
              sorting={sorting}
            />
          </Paper>
        </div>
      </>
    );
  }

}

const mapState = (state: RootState) => ({
  config: state.config,
  explorer: state.billing.dispute,
});

const mapDispatch = {
  find: (pageRequest?: PageRequest, sorting?: Sorting<EnumDisputeSortField>[]) => find(pageRequest, sorting),
  resetFilter,
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
const styledComponent = withStyles(styles)(DisputeManager);

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

