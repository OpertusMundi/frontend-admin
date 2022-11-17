import React from 'react';

// State, routing and localization
import { connect, ConnectedProps } from 'react-redux';
import { useNavigate, useLocation, NavigateFunction, Location } from 'react-router-dom';
import { FormattedMessage, FormattedTime, injectIntl, IntlShape } from 'react-intl';

// Material UI
import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

// Icons
import Icon from '@mdi/react';
import { mdiCommentAlertOutline, mdiDeleteAlertOutline, mdiUndoVariant } from '@mdi/js';

// Services
import message from 'service/message';

// Store
import { RootState } from 'store';
import { setSorting } from 'store/process-deployment/actions';
import { find, deleteDeployment } from 'store/process-deployment/thunks';

// Model
import { Sorting, SimpleResponse } from 'model/response';
import { EnumDeploymentSortField, Deployment } from 'model/bpm-process-instance';

// Components
import Dialog, { DialogAction, EnumDialogAction } from 'components/dialog';
import DeploymentCard from './process-deployment/deployment-card';

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
  deleteCascade: boolean;
  deployment: Deployment | null;
  deploymentId: string | null;
}

interface WorkflowManagerProps extends PropsFromRedux, WithStyles<typeof styles> {
  intl: IntlShape;
  navigate: NavigateFunction;
  location: Location;
}

class ProcessDeploymentManager extends React.Component<WorkflowManagerProps, WorkflowManagerState> {

  constructor(props: WorkflowManagerProps) {
    super(props);

    this.deleteDeployment = this.deleteDeployment.bind(this);
    this.viewDeployment = this.viewDeployment.bind(this);
  }

  state: WorkflowManagerState = {
    confirm: false,
    deleteCascade: false,
    deployment: null,
    deploymentId: null,
  }

  showDeleteConfirmDialog(deployment: Deployment): void {
    this.setState({
      confirm: true,
      deleteCascade: false,
      deployment,
      deploymentId: '',
    });
  }

  hideDeleteConfirmDialog(): void {
    this.setState({
      confirm: false,
      deployment: null,
      deploymentId: null,
    });
  }

  toggleDeleteCascade(deleteCascade: boolean): void {
    this.setState({
      deleteCascade,
    });
  }

  confirmDialogHandler(action: DialogAction): void {
    const _t = this.props.intl.formatMessage;
    const { deployment } = this.state;

    switch (action.key) {
      case EnumDialogAction.Accept: {
        if (deployment) {
          this.props.deleteDeployment(deployment.id, false)
            .then((r: SimpleResponse) => {
              if (r.success) {
                message.info('workflow.message.delete-deployment-success');
                this.props.find();
              } else {
                message.errorHtml(
                  _t({ id: 'workflow.message.delete-deployment-failure' }),
                  () => (<Icon path={mdiCommentAlertOutline} size="3rem" />)
                );
              }
            })
            .catch(() => {
              message.errorHtml(
                _t({ id: 'workflow.message.delete-deployment-failure' }),
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

  viewDeployment(deployment: Deployment): void {
    this.showDeleteConfirmDialog(deployment);
  }

  deleteDeployment(deployment: Deployment): void {
    this.showDeleteConfirmDialog(deployment);
  }

  setSorting(sorting: Sorting<EnumDeploymentSortField>[]): void {
    this.props.setSorting(sorting);
    this.find();
  }

  render() {
    const {
      classes, workflow: { deployments: { result: deployments } },
    } = this.props;

    return (
      <>
        <div className={classes.container}>
          {deployments?.map((d, index) => (
            <DeploymentCard
              key={d.id}
              allowDelete={deployments.length > 1 && index !== 0}
              deployment={d}
              deleteDeployment={this.deleteDeployment}
              viewDeployment={this.viewDeployment}
            />
          ))}
        </div>
        {this.renderDeleteDialog()}
      </>
    );
  }

  renderDeleteDialog() {
    const _t = this.props.intl.formatMessage;

    const { confirm, deleteCascade, deployment } = this.state;
    const { classes } = this.props;

    if (!confirm || !deployment) {
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
              id="workflow.message.delete-deployment-confirm.1"
              tagName={'p'}
              values={{
                name: <b>{deployment.name}</b>,
                date: <b><FormattedTime value={deployment.deploymentTime.toDate()} day='numeric' month='numeric' year='numeric' /></b>
              }}
            />
            <Typography variant="h5" display="block" gutterBottom color="secondary">
              <FormattedMessage
                id="workflow.message.delete-deployment-confirm.2"
                tagName={'p'}
              />
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={deleteCascade}
                  onChange={
                    (event) => this.toggleDeleteCascade(event.target.checked)
                  }
                  name="deleteCascade"
                  color="primary"
                  disabled
                />
              }
              label={_t({ id: 'workflow.message.delete-deployment-cascade' })}
            />
            <Typography variant="caption" component={'p'}>
              <FormattedMessage id="workflow.message.delete-deployment-cascade-details" />
            </Typography>
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
  find: (sorting?: Sorting<EnumDeploymentSortField>[]) => find(sorting),
  deleteDeployment: (id: string, cascade: boolean) => deleteDeployment(id, cascade),
  setSorting,
};

const connector = connect(
  mapState,
  mapDispatch,
);

type PropsFromRedux = ConnectedProps<typeof connector>

// Apply styles
const styledComponent = withStyles(styles)(ProcessDeploymentManager);

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
