import React from 'react';

// State, routing and localization
import { connect, ConnectedProps } from 'react-redux';
import { FormattedMessage, FormattedTime, injectIntl, IntlShape } from 'react-intl';

// Material UI
import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import PerfectScrollbar from 'react-perfect-scrollbar';

// Icons
import Icon from '@mdi/react';
import { mdiCommentAlertOutline } from '@mdi/js';

// Services
import message from 'service/message';

// Store
import { RootState } from 'store';
import {
  addToSelection,
  removeFromSelection,
  resetFilter,
  resetSelection,
  setFilter,
  setPager,
  setSorting,
} from 'store/event/actions';
import { find } from 'store/event/thunks';

// Model
import { PageRequest, Sorting } from 'model/response';
import { EnumEventSortField, Event } from 'model/event';

// Components
import EventFilters from './grid/filter';
import EventTable from './grid/table';

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
    paddingLeft: 0,
    fontSize: '0.7rem',
  },
  title: {
    marginTop: theme.spacing(2),
  },
  drawer: {
    padding: theme.spacing(1),
    minHeight: 200,
  },
  drawerContent: {
    padding: 0,
    minHeight: 200,
  },
  exception: {
    maxHeight: 400,
  }
});

interface EventManagerState {
  retry: boolean;
  errorDetails: boolean,
  event: Event | null,
}

interface EventManagerProps extends PropsFromRedux, WithStyles<typeof styles> {
  intl: IntlShape,
}

class EventManager extends React.Component<EventManagerProps, EventManagerState> {

  constructor(props: EventManagerProps) {
    super(props);

    this.viewException = this.viewException.bind(this);
  }

  state: EventManagerState = {
    retry: false,
    errorDetails: false,
    event: null,
  }

  showRetryDialog(event: Event): void {
    this.setState({
      retry: true,
      event,
    });
  }

  viewException(event: Event | null = null, errorDetails: boolean = true): void {
    this.setState({
      errorDetails,
      event,
    });
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

  setSorting(sorting: Sorting<EnumEventSortField>[]): void {
    this.props.setSorting(sorting);
    this.find();
  }

  render() {
    const { errorDetails } = this.state;
    const {
      addToSelection,
      classes,
      events: { query, result, pagination, selected, sorting, loading, lastUpdated },
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
            <EventFilters
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
                    <FormattedMessage id="event.last-update" />
                    <FormattedTime value={lastUpdated.toDate()} day='numeric' month='numeric' year='numeric' />
                  </Typography>
                </Grid>
              </Grid>
            }
          </Paper>

          <Paper className={classes.paperTable}>
            <PerfectScrollbar>
              <EventTable
                find={this.props.find}
                query={query}
                result={result}
                pagination={pagination}
                selected={selected}
                setPager={setPager}
                setSorting={(sorting: Sorting<EnumEventSortField>[]) => this.setSorting(sorting)}
                addToSelection={addToSelection}
                removeFromSelection={removeFromSelection}
                resetSelection={resetSelection}
                viewException={this.viewException}
                sorting={sorting}
                loading={loading}
              />
            </PerfectScrollbar>
          </Paper>
        </div >
        <Drawer anchor={'top'} open={errorDetails} onClose={() => this.viewException(null, false)}>
          {this.renderException()}
        </Drawer>
      </>
    );
  }

  renderException() {
    const { event } = this.state;
    const { classes } = this.props;

    return (
      <div className={classes.drawer}>
        <Grid container spacing={2} className={classes.drawerContent}>
          <Grid item container direction="column" xs={12}>
            <Typography variant="subtitle2" gutterBottom className={classes.title}>
              <FormattedMessage id={'event.header.message'} />
            </Typography>
            <Typography variant="caption" gutterBottom className={classes.title}>
              {event?.message}
            </Typography>
            {event?.exception &&
              <>
                <Typography variant="subtitle2" gutterBottom className={classes.title}>
                  <FormattedMessage id={'event.header.exception'} />
                </Typography>
                <PerfectScrollbar className={classes.exception} options={{ suppressScrollX: true }}>
                  <Typography variant="caption" gutterBottom className={classes.title}>
                    {event?.exception}
                  </Typography>
                </PerfectScrollbar>
              </>
            }
          </Grid>
        </Grid>
      </div>
    );
  }
}

const mapState = (state: RootState) => ({
  config: state.config,
  events: state.event,
});

const mapDispatch = {
  addToSelection,
  find: (pageRequest?: PageRequest, sorting?: Sorting<EnumEventSortField>[]) => find(pageRequest, sorting),
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
const styledComponent = withStyles(styles)(EventManager);

// Inject i18n resources
const localizedComponent = injectIntl(styledComponent);

// Inject state
export default connector(localizedComponent);
