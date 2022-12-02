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

// Icons
import Icon from '@mdi/react';
import { mdiCommentAlertOutline } from '@mdi/js';

// Services
import message from 'service/message';
import WorkflowApi from 'service/bpm-workflow';

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
} from 'store/process-instance-task/actions';
import { find } from 'store/process-instance-task/thunks';

// Model
import { buildPath, DynamicRoutes } from 'model/routes';
import { PageRequest, Sorting } from 'model/response';
import { EnumProcessInstanceTaskSortField, ProcessInstanceTask } from 'model/bpm-process-instance';

// Components
import DateTime from 'components/common/date-time';
import TaskFilters from './process-instance-tasks/filter';
import TaskTable from './process-instance-tasks/table';

const styles = (theme: Theme) => createStyles({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  item: {
    padding: theme.spacing(0, 1),
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
  textField: {
    margin: 0,
    padding: 0,
    width: '100%',
  },
});

interface WorkflowManagerState {
  confirm: boolean;
  instance: ProcessInstanceTask | null;
  businessKey: string | null;
}

interface WorkflowManagerProps extends PropsFromRedux, WithStyles<typeof styles> {
  intl: IntlShape;
  navigate: NavigateFunction;
  location: Location;
}

class ProcessInstanceManager extends React.Component<WorkflowManagerProps, WorkflowManagerState> {

  private api: WorkflowApi;

  constructor(props: WorkflowManagerProps) {
    super(props);

    this.api = new WorkflowApi();

    this.viewProcessInstance = this.viewProcessInstance.bind(this);
    this.viewProcessInstanceTask = this.viewProcessInstanceTask.bind(this);
  }

  state: WorkflowManagerState = {
    confirm: false,
    instance: null,
    businessKey: null,
  }

  showDeleteConfirmDialog(instance: ProcessInstanceTask): void {
    this.setState({
      confirm: true,
      instance,
      businessKey: '',
    });
  }

  hideDeleteConfirmDialog(): void {
    this.setState({
      confirm: false,
      instance: null,
      businessKey: null,
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

  viewProcessInstance(processInstance: string): void {
    const path = buildPath(DynamicRoutes.ProcessInstanceView, null, { processInstance });
    this.props.navigate(path);
  }

  viewProcessInstanceTask(processInstance: string, taskName: string): void {
    const path = buildPath(DynamicRoutes.ProcessInstanceTaskView, [processInstance, taskName]);
    this.props.navigate(path);
  }

  setSorting(sorting: Sorting<EnumProcessInstanceTaskSortField>[]): void {
    this.props.setSorting(sorting);
    this.find();
  }

  render() {
    const {
      addToSelection,
      classes,
      config: { processDefinitions },
      workflow: { tasks: { query, result, pagination, selected, sorting, loading, lastUpdated } },
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
            <TaskFilters
              query={query}
              setFilter={setFilter}
              resetFilter={resetFilter}
              find={find}
              disabled={loading}
              processDefinitions={processDefinitions!}
            />
            {lastUpdated &&
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="caption" display="block" gutterBottom className={classes.caption}>
                    <FormattedMessage id="workflow.last-update" />
                    <DateTime value={lastUpdated.toDate()} day='numeric' month='numeric' year='numeric' />
                  </Typography>
                </Grid>
              </Grid>
            }
          </Paper>

          <Paper className={classes.paperTable}>
            <TaskTable
              find={this.props.find}
              query={query}
              result={result}
              pagination={pagination}
              selected={selected}
              setPager={setPager}
              setSorting={(sorting: Sorting<EnumProcessInstanceTaskSortField>[]) => this.setSorting(sorting)}
              addToSelection={addToSelection}
              removeFromSelection={removeFromSelection}
              resetSelection={resetSelection}
              sorting={sorting}
              loading={loading}
              viewProcessInstance={this.viewProcessInstance}
              viewProcessInstanceTask={this.viewProcessInstanceTask}
            />
          </Paper>
        </div>
      </>
    );
  }

}

const mapState = (state: RootState) => ({
  config: state.config,
  workflow: state.workflow,
});

const mapDispatch = {
  addToSelection,
  find: (pageRequest?: PageRequest, sorting?: Sorting<EnumProcessInstanceTaskSortField>[]) => find(pageRequest, sorting),
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
const styledComponent = withStyles(styles)(ProcessInstanceManager);

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
