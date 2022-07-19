import React from 'react';

// State, routing and localization
import { connect, ConnectedProps } from 'react-redux';
import { useNavigate, useLocation, NavigateFunction, Location } from 'react-router-dom';
import { FormattedMessage, FormattedTime, injectIntl, IntlShape } from 'react-intl';

// Material UI
import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

// Icons
import Icon from '@mdi/react';
import { mdiCheckOutline, mdiCommentAlertOutline, mdiUndoVariant } from '@mdi/js';

// Services
import message from 'service/message';
import IncidentApi from 'service/bpm-incident';

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
} from 'store/incident/actions';
import { find, retryExternalTask } from 'store/incident/thunks';

// Model
import { buildPath, DynamicRoutes } from 'model/routes';
import { PageRequest, SimpleResponse, Sorting } from 'model/response';
import { EnumIncidentSortField, Incident } from 'model/bpm-incident';

// Components
import Dialog, { DialogAction, EnumDialogAction } from 'components/dialog';

import IncidentFilters from './incident/filter';
import IncidentTable from './incident/table';
import { AxiosError } from 'axios';

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
  }
});

interface IncidentManagerState {
  retry: boolean;
  errorDetails: boolean,
  incident: Incident | null,
}

interface IncidentManagerProps extends PropsFromRedux, WithStyles<typeof styles> {
  intl: IntlShape;
  navigate: NavigateFunction;
  location: Location;
}

class IncidentManager extends React.Component<IncidentManagerProps, IncidentManagerState> {

  private api: IncidentApi;

  constructor(props: IncidentManagerProps) {
    super(props);

    this.api = new IncidentApi();

    this.retryExternalTask = this.retryExternalTask.bind(this);
    this.viewErrorDetails = this.viewErrorDetails.bind(this);
    this.viewProcessInstance = this.viewProcessInstance.bind(this);
  }

  state: IncidentManagerState = {
    retry: false,
    errorDetails: false,
    incident: null,
  }

  showRetryDialog(incident: Incident): void {
    this.setState({
      retry: true,
      incident,
    });
  }

  hideRetryDialog(): void {
    this.setState({
      retry: false,
      incident: null,
    });
  }

  confirmDialogHandler(action: DialogAction): void {
    const { incident } = this.state;

    switch (action.key) {
      case EnumDialogAction.Accept: {
        if (incident) {
          this.props.retryExternalTask(incident.processInstanceId, incident.activityId)
            .then((response) => {
              if (response.success) {
                message.info('error.incident.retry-success');
                this.find();
              } else {
                message.error('error.incident.retry-failure', () => (<Icon path={mdiCommentAlertOutline} size="3rem" />));
              }
            })
            .catch((err: AxiosError<SimpleResponse>) => {
              message.error('error.incident.retry-failure', () => (<Icon path={mdiCommentAlertOutline} size="3rem" />));
            });
        }
        break;
      }
      case EnumDialogAction.Cancel:
        break;
    }

    this.hideRetryDialog();
  }

  viewErrorDetails(incident: Incident | null = null, errorDetails: boolean = true): void {
    this.setState({
      errorDetails,
      incident,
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

  retryExternalTask(incident: Incident): void {
    this.setState({
      retry: true,
      incident,
    })
  }

  setSorting(sorting: Sorting<EnumIncidentSortField>[]): void {
    this.props.setSorting(sorting);
    this.find();
  }

  render() {
    const { errorDetails } = this.state;
    const {
      addToSelection,
      classes,
      workflow: { incidents: { query, result, pagination, selected, sorting, loading, lastUpdated } },
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
            <IncidentFilters
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
                    <FormattedMessage id="workflow.last-update" />
                    <FormattedTime value={lastUpdated.toDate()} day='numeric' month='numeric' year='numeric' />
                  </Typography>
                </Grid>
              </Grid>
            }
          </Paper>

          <Paper className={classes.paperTable}>
            <IncidentTable
              find={this.props.find}
              query={query}
              result={result}
              pagination={pagination}
              selected={selected}
              setPager={setPager}
              setSorting={(sorting: Sorting<EnumIncidentSortField>[]) => this.setSorting(sorting)}
              addToSelection={addToSelection}
              removeFromSelection={removeFromSelection}
              resetSelection={resetSelection}
              retryExternalTask={this.retryExternalTask}
              viewErrorDetails={this.viewErrorDetails}
              viewProcessInstance={(processInstance: string) => this.viewProcessInstance(processInstance)}
              sorting={sorting}
              loading={loading}
            />
          </Paper>
        </div >
        {this.renderRetryTaskDialog()}
        <Drawer anchor={'top'} open={errorDetails} onClose={() => this.viewErrorDetails(null, false)}>
          {this.renderErrorDetails()}
        </Drawer>
      </>
    );
  }

  viewProcessInstance(processInstance: string): void {
    const path = buildPath(DynamicRoutes.ProcessInstanceView, null, { processInstance });
    this.props.navigate(path);
  }

  renderRetryTaskDialog() {
    const _t = this.props.intl.formatMessage;

    const { retry, incident: record } = this.state;

    if (!retry || !record) {
      return null;
    }

    return (
      <Dialog
        actions={[
          {
            key: EnumDialogAction.Accept,
            label: _t({ id: 'view.shared.action.accept' }),
            iconClass: () => (<Icon path={mdiCheckOutline} size="1.5rem" />),
            color: 'primary',
          }, {
            key: EnumDialogAction.Cancel,
            label: _t({ id: 'view.shared.action.cancel' }),
            iconClass: () => (<Icon path={mdiUndoVariant} size="1.5rem" />)
          }
        ]}
        handleClose={() => this.hideRetryDialog()}
        handleAction={(action) => this.confirmDialogHandler(action)}
        header={
          <span>
            <i className={'mdi mdi-comment-question-outline mr-2'}></i>
            <FormattedMessage id="view.shared.dialog.title" />
          </span>
        }
        open={retry}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormattedMessage
              id="workflow.message.retry"
              values={{ type: record.processDefinitionName, businessKey: record.businessKey }}
            />
          </Grid>
        </Grid>
      </Dialog>
    );
  }

  renderErrorDetails() {
    const { incident } = this.state;
    const { classes } = this.props;

    const details = incident?.taskErrorDetails?.split('||') || null;

    return (
      <div className={classes.drawer}>
        <Grid container spacing={2} className={classes.drawer}>
          <Grid item xs={12} sm={2}>
            <Typography variant="subtitle2" gutterBottom className={classes.title}>
              <FormattedMessage id={'workflow.header.incident.process-definition-name'} />
            </Typography>
            <Typography gutterBottom>{incident?.processDefinitionName}</Typography>
            <Typography variant="subtitle2" gutterBottom className={classes.title}>
              <FormattedMessage id={'workflow.header.incident.task-worker'} />
            </Typography>
            <Typography gutterBottom>{incident?.taskWorker}</Typography>
          </Grid>
          <Grid item container direction="column" xs={12} sm={10}>
            <Typography variant="subtitle2" gutterBottom className={classes.title}>
              <FormattedMessage id={'workflow.header.incident.error-message'} />
            </Typography>
            <Typography variant="body2" gutterBottom className={classes.title}>
              {incident?.taskErrorMessage}
            </Typography>
            <Typography variant="subtitle2" gutterBottom className={classes.title}>
              <FormattedMessage id={'workflow.header.incident.error-details'} />
            </Typography>
            {details && details.map((text, index) => (
              <Typography key={`detail-line-${index}`} variant="body2" gutterBottom className={classes.title}>
                {text}
              </Typography>
            ))}
          </Grid>
        </Grid>
      </div>
    );
  }
}

const mapState = (state: RootState) => ({
  config: state.config,
  workflow: state.workflow,
});

const mapDispatch = {
  addToSelection,
  find: (pageRequest?: PageRequest, sorting?: Sorting<EnumIncidentSortField>[]) => find(pageRequest, sorting),
  removeFromSelection,
  resetFilter,
  resetSelection,
  retryExternalTask: (processInstanceId: string, externalTaskId: string) => retryExternalTask(processInstanceId, externalTaskId),
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
const styledComponent = withStyles(styles)(IncidentManager);

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
