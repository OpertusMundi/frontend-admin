import _ from 'lodash';
import moment from 'moment';
import React from 'react';

// State, routing and localization
import { connect, ConnectedProps } from 'react-redux';
import { injectIntl, IntlShape, FormattedMessage } from 'react-intl';
import { useNavigate, useLocation, useParams, NavigateFunction, Location } from 'react-router-dom';

// Components
import { createStyles, Typography, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';

import { red } from '@material-ui/core/colors';

import Spinner from 'components/spinner';
import { ExecutionDetails, ProcessInstanceVariables } from './common';

// Icons
import Icon from '@mdi/react';
import {
  mdiAccountOutline,
  mdiAccountWrenchOutline,
  mdiClockFast,
  mdiCloudOffOutline,
  mdiCommentAlertOutline,
  mdiDatabaseCogOutline,
} from '@mdi/js';

// Store
import { RootState } from 'store';
import { findOne } from 'store/process-instance-task/thunks'

// Model
import { ErrorPages } from 'model/routes';
import { SimpleResponse } from 'model/response';
import { CompleteTaskTaskCommand, ModificationCommand, PUBLISH_SET_ERROR_TASK } from 'model/bpm-process-instance';
import { MarketplaceAccount } from 'model/account-marketplace';

// Service
import message from 'service/message';
import WorkflowApi from 'service/bpm-workflow';

// Components
import { ReviewErrorTask } from './task';

const styles = (theme: Theme) => createStyles({
  item: {
    width: '100%',
  },
  card: {
    borderRadius: 0,
    padding: theme.spacing(1),
    margin: theme.spacing(1),
  },
  avatar: {
    backgroundColor: red[500],
  },
  listItem: {
    padding: theme.spacing(1, 0),
  },
  title: {
    marginTop: theme.spacing(2),
  },
  small: {
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
});

interface RouteParams {
  processInstance?: string;
  taskName?: string
}

interface ProcessInstanceTaskState {
  initialized: boolean;
}

interface ProcessInstanceTaskProps extends PropsFromRedux, WithStyles<typeof styles> {
  intl: IntlShape;
  navigate: NavigateFunction;
  location: Location;
  params: RouteParams;
}

class ProcessInstanceTask extends React.Component<ProcessInstanceTaskProps, ProcessInstanceTaskState> {

  private api: WorkflowApi;

  constructor(props: ProcessInstanceTaskProps) {
    super(props);

    this.api = new WorkflowApi();

    this.state = {
      initialized: false,
    };
  }

  async load() {
    const { processInstance = null } = this.props.params;

    try {
      try {
        const result = await this.props.findOne(null, processInstance);
        if (!result.success) {
          this.props.navigate(ErrorPages.NotFound);
        }
        return result;
      } catch (err) {
        return null;
      }
    } finally {
      this.setState({ initialized: true });
    }
  }

  componentDidMount() {
    this.load();
  }

  async completeTask(command: CompleteTaskTaskCommand): Promise<boolean> {
    const { processInstance } = this.props.params;
    const _t = this.props.intl.formatMessage;

    return this.api.completeTask(processInstance!, command)
      .then(async (r: SimpleResponse) => {
        if (r.success) {
          message.info('workflow.message.task-complete-success');
        } else {
          message.errorHtml(
            r.messages[0].description,
            () => (<Icon path={mdiCommentAlertOutline} size="3rem" />)
          );
        }

        await this.load();
        return true;
      })
      .catch(() => {
        message.errorHtml(
          _t({ id: 'workflow.message.task-complete-failure' }),
          () => (<Icon path={mdiCommentAlertOutline} size="3rem" />)
        );

        return false;
      });
  }

  async modifyProcessInstance(command: ModificationCommand): Promise<boolean> {
    const { processInstance } = this.props.params;
    const _t = this.props.intl.formatMessage;

    return this.api.modifyProcessInstance(processInstance!, command)
      .then(async (r: SimpleResponse) => {
        if (r.success) {
          message.info('workflow.message.modify-process-instance-success');
        } else {
          message.errorHtml(
            r.messages[0].description,
            () => (<Icon path={mdiCommentAlertOutline} size="3rem" />)
          );
        }

        await this.load();

        return true;
      })
      .catch(() => {
        message.errorHtml(
          _t({ id: 'workflow.message.modify-process-instance-failure' }),
          () => (<Icon path={mdiCommentAlertOutline} size="3rem" />)
        );

        return false;
      });
  }

  getAccountAvatar(account: MarketplaceAccount | null): React.ReactElement {
    const { classes } = this.props;

    if (account) {
      const { email, profile, profile: { firstName, lastName } } = account;
      const alt = (firstName || lastName) ? `${firstName} ${lastName}` : email;
      const url = (profile?.image && profile?.imageMimeType) ? `data:${profile.imageMimeType};base64,${profile.image}` : null;

      if (url) {
        return (
          <Avatar
            alt={alt}
            src={url}
            variant="circular"
            className={classes.small}
          />
        );
      }
    }

    return (
      <Avatar className={classes.small}>
        <Icon path={mdiAccountOutline} size="1.2rem" />
      </Avatar>
    );
  }

  renderDetails(): React.ReactElement | null {
    const { classes, config, processInstance } = this.props;

    if (!processInstance) {
      return null;
    }

    const processDefinition = config.processDefinitions!.find(d => d.id === processInstance.instance.processDefinitionId) || null;

    const { instance, owner = null } = processInstance;
    const duration = moment.duration(
      1000 * ((instance.endTime ? instance.endTime.unix() : moment().unix()) - instance.startTime.unix())
    ).humanize();

    return (
      <Card className={classes.card}>
        <CardHeader
          avatar={
            <Avatar className={classes.avatar}>
              <Icon path={mdiDatabaseCogOutline} size="1.5rem" />
            </Avatar>
          }
          title={`${instance.processDefinitionName.split(' ').map(w => _.capitalize(w)).join(' ')} ${processDefinition ? processDefinition.versionTag : ''}`}
        ></CardHeader>
        <CardContent>
          <List disablePadding>
            {owner &&
              <ListItem className={classes.listItem}>
                <ListItemAvatar>
                  {this.getAccountAvatar(owner || null)}
                </ListItemAvatar>
                <ListItemText primary={'Owner'} secondary={owner ? owner.username : 'System'} />
              </ListItem>
            }
            <ListItem className={classes.listItem}>
              <ListItemAvatar>
                <Avatar className={classes.small}>
                  <Icon path={mdiClockFast} size="1.2rem" />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={'Duration'} secondary={duration} />
            </ListItem>
          </List>
        </CardContent>
      </Card>
    );
  }

  renderVariables(): React.ReactElement | null {
    const { processInstance: instance } = this.props;

    if (!instance) {
      return null;
    }

    const { variables } = instance;

    return (
      <ProcessInstanceVariables
        variables={variables}
        exclude={['bpmnBusinessErrorDetails', 'bpmnBusinessErrorMessages']}
      />
    );
  }

  renderTask(): React.ReactElement | null {
    const { classes, config, processInstance = null, params: { taskName } } = this.props;
    if (!processInstance) {
      return null;
    }

    const task = processInstance.activities.find(a => a.activityId === taskName) || null;
    if (!task) {
      return null;
    }

    switch (taskName) {
      case PUBLISH_SET_ERROR_TASK:
        return (
          <ReviewErrorTask
            config={config}
            processInstance={processInstance}
            taskName={taskName}
            completeTask={(c) => this.completeTask(c)}
            modifyProcessInstance={(c) => this.modifyProcessInstance(c)}
          />
        )
    }

    return (
      <Card className={classes.card}>
        <CardHeader
          avatar={
            <Avatar className={classes.avatar}>
              <Icon path={mdiAccountWrenchOutline} size="1.5rem" />
            </Avatar>
          }
          title={'Task'}
        ></CardHeader>
        <CardContent>
          <Grid container direction='column' alignItems='center'>
            <Grid item>
              <Icon path={mdiCloudOffOutline} size="5rem" />
            </Grid>
            <Grid item>
              <Typography component="h1" variant="h6" >
                <FormattedMessage id="workflow.message.task-not-supported" />
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  }

  render() {
    const { initialized } = this.state;
    const { classes, config, processInstance = null } = this.props;

    if (!processInstance || !initialized) {
      return (<Spinner />);
    }

    return (
      <>
        <Grid container>
          <Grid container item xs={12} lg={6}>
            <Grid item xs={12} className={classes.item}>
              <ExecutionDetails config={config} processInstance={processInstance} />
            </Grid>
            <Grid item xs={12} className={classes.item}>
              {this.renderVariables()}
            </Grid>
          </Grid>
          <Grid container item xs={12} lg={6}>
            <Grid item xs={12} className={classes.item}>
              {this.renderTask()}
            </Grid>
          </Grid>
        </Grid>
      </>
    );
  }

}

const mapState = (state: RootState) => ({
  config: state.config,
  processInstance: state.workflow.tasks.processInstance,
});

const mapDispatch = {
  findOne: (businessKey: string | null, processInstance: string | null) => findOne(businessKey, processInstance),
};

const connector = connect(
  mapState,
  mapDispatch,
);

type PropsFromRedux = ConnectedProps<typeof connector>

// Apply styles
const styledComponent = withStyles(styles)(ProcessInstanceTask);

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