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
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

// Icons
import Icon from '@mdi/react';
import { mdiCommentAlertOutline, mdiDeleteAlertOutline, mdiUndoVariant } from '@mdi/js';

// Services
import message from 'service/message';
import ProcessInstanceApi from 'service/bpm-process-instance';

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
} from 'store/process-instance/actions';
import { find, deleteInstance } from 'store/process-instance/thunks';

// Model
import { buildPath, DynamicRoutes } from 'model/routes';
import { PageRequest, Sorting, SimpleResponse } from 'model/response';
import { EnumProcessInstanceSortField, ProcessInstance } from 'model/bpm-process-instance';

// Components
import Dialog, { DialogAction, EnumDialogAction } from 'components/dialog';

import ProcessInstanceFilters from './process-instance/filter';
import ProcessInstanceTable from './process-instance/table';

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
  instance: ProcessInstance | null;
  businessKey: string | null;
}

interface WorkflowManagerProps extends PropsFromRedux, WithStyles<typeof styles> {
  intl: IntlShape;
  navigate: NavigateFunction;
  location: Location;
}

class ProcessInstanceManager extends React.Component<WorkflowManagerProps, WorkflowManagerState> {

  private api: ProcessInstanceApi;

  constructor(props: WorkflowManagerProps) {
    super(props);

    this.api = new ProcessInstanceApi();

    this.deleteInstance = this.deleteInstance.bind(this);
    this.viewProcessInstance = this.viewProcessInstance.bind(this);
  }

  state: WorkflowManagerState = {
    confirm: false,
    instance: null,
    businessKey: null,
  }

  showDeleteConfirmDialog(instance: ProcessInstance): void {
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

  confirmDialogHandler(action: DialogAction): void {
    const _t = this.props.intl.formatMessage;
    const { instance } = this.state;

    switch (action.key) {
      case EnumDialogAction.Accept: {
        if (instance) {
          this.props.deleteInstance(instance.processInstanceId)
            .then((r: SimpleResponse) => {
              if (r.success) {
                message.info('workflow.message.delete-success');
                this.props.find();
              } else {
                message.errorHtml(
                  _t({ id: 'workflow.message.delete-failure' }),
                  () => (<Icon path={mdiCommentAlertOutline} size="3rem" />)
                );
              }
            })
            .catch(() => {
              message.errorHtml(
                _t({ id: 'workflow.message.delete-failure' }),
                () => (<Icon path={mdiCommentAlertOutline} size="3rem" />)
              );
            })
            .finally(() => {
              this.hideDeleteConfirmDialog();
            });
        }
        break;
      }
      case EnumDialogAction.Cancel:
        this.hideDeleteConfirmDialog();
        break;
    }
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

  deleteInstance(instance: ProcessInstance): void {
    this.showDeleteConfirmDialog(instance);
  }

  viewProcessInstance(processInstance: string): void {
    const path = buildPath(DynamicRoutes.ProcessInstanceView, null, { processInstance });
    this.props.navigate(path);
  }

  setSorting(sorting: Sorting<EnumProcessInstanceSortField>[]): void {
    this.props.setSorting(sorting);
    this.find();
  }

  render() {
    const {
      addToSelection,
      classes,
      config: { processDefinitions },
      workflow: { instances: { runtime: { query, result, pagination, selected, sorting, loading, lastUpdated } } },
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
            <ProcessInstanceFilters
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
                    <FormattedTime value={lastUpdated.toDate()} day='numeric' month='numeric' year='numeric' />
                  </Typography>
                </Grid>
              </Grid>
            }
          </Paper>

          <Paper className={classes.paperTable}>
            <ProcessInstanceTable
              find={this.props.find}
              query={query}
              result={result}
              pagination={pagination}
              selected={selected}
              setPager={setPager}
              setSorting={(sorting: Sorting<EnumProcessInstanceSortField>[]) => this.setSorting(sorting)}
              addToSelection={addToSelection}
              removeFromSelection={removeFromSelection}
              resetSelection={resetSelection}
              viewProcessInstance={(processInstance: string) => this.viewProcessInstance(processInstance)}
              sorting={sorting}
              loading={loading}
              deleteInstance={this.deleteInstance}
            />
          </Paper>
        </div >
        {this.renderReviewDialog()}
      </>
    );
  }

  renderReviewDialog() {
    const _t = this.props.intl.formatMessage;

    const { confirm, instance: record, businessKey } = this.state;
    const { classes } = this.props;

    if (!confirm || !record) {
      return null;
    }

    return (
      <Dialog
        actions={[
          {
            key: EnumDialogAction.Accept,
            label: _t({ id: 'view.shared.action.delete' }),
            iconClass: () => (<Icon path={mdiDeleteAlertOutline} size="1.5rem" />),
            color: 'secondary',
            disabled: businessKey !== record.businessKey,
          }, {
            key: EnumDialogAction.Cancel,
            label: _t({ id: 'view.shared.action.cancel' }),
            iconClass: () => (<Icon path={mdiUndoVariant} size="1.5rem" />)
          }
        ]}
        handleClose={() => this.hideDeleteConfirmDialog()}
        handleAction={(action) => this.confirmDialogHandler(action)}
        header={
          <span>
            <i className={'mdi mdi-comment-question-outline mr-2'}></i>
            <FormattedMessage id="view.shared.dialog.title" />
          </span>
        }
        open={confirm}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} className={classes.item}>
            <FormattedMessage
              id="workflow.message.delete-confirm.1"
              tagName={'p'}
              values={{ id: <b>{record.businessKey}</b>, type: <b>{record.processDefinitionName}</b> }}
            />
            <Typography variant="h5" display="block" gutterBottom color="secondary">
              <FormattedMessage
                id="workflow.message.delete-confirm.2"
                tagName={'p'}
              />
            </Typography>
            <FormattedMessage
              id="workflow.message.delete-confirm.3"
              tagName={'p'}
            />
          </Grid>
          <Grid item xs={12} className={classes.item}>
            <TextField
              id="name"
              label={_t({ id: 'workflow.header.instance.business-key' })}
              variant="standard"
              margin="normal"
              className={classes.textField}
              value={businessKey || ''}
              onChange={e => this.setState({ businessKey: e.target.value })}
            />
          </Grid>
        </Grid>
      </Dialog>
    );
  }

}

const mapState = (state: RootState) => ({
  config: state.config,
  workflow: state.workflow,
});

const mapDispatch = {
  addToSelection,
  deleteInstance,
  find: (pageRequest?: PageRequest, sorting?: Sorting<EnumProcessInstanceSortField>[]) => find(pageRequest, sorting),
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
