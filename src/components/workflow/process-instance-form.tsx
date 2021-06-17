import moment from 'moment';
import React from 'react';
import { AxiosError } from 'axios';

// State, routing and localization
import { connect, ConnectedProps } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { FormattedMessage, FormattedTime, injectIntl, IntlShape } from 'react-intl';

// Components
import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Paper from '@material-ui/core/Paper';
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import Typography from '@material-ui/core/Typography';

import { red } from '@material-ui/core/colors';

// Icons
import Icon from '@mdi/react';
import {
  mdiCogSyncOutline,
  mdiTimelineClockOutline,
  mdiDatabaseCogOutline,
  mdiClockFast,
  mdiSourceCommitEndLocal,
  mdiSourceCommitStartNextLocal,
  mdiAccountCogOutline,
  mdiVariable,
  mdiContentCopy,
  mdiNumeric,
  mdiText,
  mdiCheckboxMarkedOutline,
  mdiAccountOutline,
  mdiEmailOutline,
} from '@mdi/js';

// Store
import { RootState } from 'store';
import { findOne } from 'store/process-instance/thunks'

// Model
import { BpmActivity, ProcessInstanceDetails } from 'model/bpm-process-instance';

// Service
import AccountApi from 'service/account-marketplace';
import { MarketplaceAccountDetails } from 'model/account-marketplace';

const COPY = 'copy';

const styles = (theme: Theme) => createStyles({
  root: {
    display: 'flex',
    padding: 0,
  },
  item: {
    width: '100%',
  },
  paper: {
    padding: '6px 16px',
  },
  secondaryTail: {
    backgroundColor: theme.palette.secondary.main,
  },
  card: {
    borderRadius: 0,
    padding: theme.spacing(1),
    margin: theme.spacing(1),
  },
  cardActions: {
    justifyContent: 'flex-end',
  },
  avatar: {
    backgroundColor: red[500],
  },
  listItem: {
    padding: theme.spacing(1, 0),
  },
  total: {
    fontWeight: 700,
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
  processInstance?: string | undefined;
}

interface ProcessInstanceProps extends PropsFromRedux, WithStyles<typeof styles>, RouteComponentProps<RouteParams> {
  intl: IntlShape,
}

class ProcessInstance extends React.Component<ProcessInstanceProps> {

  api: AccountApi;

  constructor(props: ProcessInstanceProps) {
    super(props);

    this.api = new AccountApi();
  }

  get processInstanceId(): string | null {
    const { processInstance } = this.props.match.params;

    return processInstance || null;
  }

  componentDidMount() {
    if (this.processInstanceId) {
      this.props.findOne(this.processInstanceId)
        .catch((err: AxiosError) => {
          console.log(err);
          // TODO: Redirect to grid view?
        });
    } else {
      // TODO: Redirect to grid view?
    }
  }

  mapActivityToMessage(activity: BpmActivity, instance: ProcessInstanceDetails) {
    const _t = this.props.intl.formatTime;
    const { incidents = [], errorDetails } = instance;

    const incident = incidents.find((i) => i.activityId === activity.activityId) || null;

    switch (activity.activityType) {
      case 'startEvent':
        return (
          <FormattedMessage id={'workflow.instance.activity.started'} values={{
            timestamp: _t(activity.startTime.toDate(), { day: 'numeric', month: 'numeric', year: 'numeric' }),
          }} />
        );
      case 'endEvent':
        return (
          <FormattedMessage id={'workflow.instance.activity.completed'} values={{
            timestamp: _t(activity.endTime.toDate(), { day: 'numeric', month: 'numeric', year: 'numeric' }),
          }} />
        );
    }

    if (incident) {
      return (
        <>
          <FormattedMessage id={`workflow.instance.activity.${activity.activityType}.error`} values={{
            activity: activity.activityName,
            timestamp: _t(incident.incidentTimestamp.toDate(), { day: 'numeric', month: 'numeric', year: 'numeric' }),
          }} />
          <Divider />
          <Typography variant="subtitle1" >
            {'Message'}
          </Typography>
          <Typography variant="caption" >
            {incident.incidentMessage}
          </Typography>
          {errorDetails[incident.activityId] &&
            <>
              <Divider />
              <Typography variant="subtitle1" >
                {'Details'}
              </Typography>
              <Typography variant="caption" >
                {errorDetails[incident.activityId]}
              </Typography>
            </>
          }
        </>
      );
    }

    if (activity.endTime) {
      return (
        <FormattedMessage id={`workflow.instance.activity.${activity.activityType}.completed`} values={{
          activity: activity.activityName,
          timestamp: _t(activity.endTime.toDate(), { day: 'numeric', month: 'numeric', year: 'numeric' }),
        }} />
      );
    } else {
      return (
        <FormattedMessage id={`workflow.instance.activity.${activity.activityType}.running`} values={{
          activity: activity.activityName,
        }} />
      );
    }
  }

  mapActivityToIcon(activity: BpmActivity) {
    switch (activity.activityType) {
      case 'startEvent':
        return (<Icon path={mdiSourceCommitStartNextLocal} size="1.5rem" />);
      case 'serviceTask':
        return (<Icon path={mdiCogSyncOutline} size="1.5rem" />);
      case 'userTask':
        return (<Icon path={mdiAccountCogOutline} size="1.5rem" />);
      case 'endEvent':
        return (<Icon path={mdiSourceCommitEndLocal} size="1.5rem" />);
      case 'intermediateMessageCatch':
        return (<Icon path={mdiEmailOutline} size="1.5rem" />);

    }
  }

  mapActivityToColor(activity: BpmActivity, instance: ProcessInstanceDetails) {
    const { incidents = [] } = instance;

    const incident = incidents.find((i) => i.activityId === activity.activityId) || null;

    if (incident && ['userTask', 'serviceTask'].includes(activity.activityType)) {
      return '#f44336';
    }

    if (!activity.startTime) {
      return '#757575';
    }
    if (!activity.endTime) {
      return '#1565C0';
    }

    return '#4CAF50';
  }

  mapVariableTypeToIcon(type: string) {
    switch (type.toLocaleLowerCase()) {
      case 'number':
      case 'numeric':
      case 'integer':
      case 'float':
      case 'long':
        return (
          <Icon path={mdiNumeric} size="1rem" />
        );
      case 'boolean':
        return (
          <Icon path={mdiCheckboxMarkedOutline} size="1rem" />
        );
    }
    return (
      <Icon path={mdiText} size="1rem" />
    );
  }

  getAccountAvatar(account: MarketplaceAccountDetails): React.ReactElement {
    const { classes } = this.props;
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

    return (
      <Avatar className={classes.small}>
        <Icon path={mdiAccountOutline} size="1.2rem" />
      </Avatar>
    );
  }

  copyValueToClipboard(value: string | number | boolean | null) {
    if (!value || typeof value === 'boolean') {
      return;
    }
    const element: HTMLInputElement = document.getElementById('copy-to-clipboard') as HTMLInputElement;

    if (element && document.queryCommandSupported(COPY)) {
      element.focus();
      element.value = typeof value === 'number' ? '' + value : value;
      element.select();
      document.execCommand(COPY);
    }
  }

  buildTimeline(processInstance: ProcessInstanceDetails) {
    const { classes } = this.props;
    const { instance, activities: allActivities } = processInstance;

    if (!instance) {
      return null;
    }

    const activities = allActivities.filter((a) =>
      ['startEvent', 'serviceTask', 'userTask', 'intermediateMessageCatch', 'endEvent'].includes(a.activityType)
    );

    const items = activities.map((a, index) => (
      <TimelineItem key={`status-${index}`}>
        <TimelineOppositeContent>
          <Typography variant="body2" color="textSecondary">
            <FormattedTime value={a.startTime.toDate()} day='numeric' month='numeric' year='numeric' />
          </Typography>
          {a.endTime && ['userTask', 'serviceTask', 'intermediateMessageCatch'].includes(a.activityType) &&
            <Typography variant="body2" color="textSecondary">
              <FormattedMessage
                id={'workflow.instance.activity.duration'}
                values={{ duration: moment.duration(1000 * (a.endTime.unix() - a.startTime.unix())).humanize() }}
              />
            </Typography>
          }
        </TimelineOppositeContent>
        <TimelineSeparator>
          <TimelineDot style={{ background: this.mapActivityToColor(a, processInstance) }}>
            {this.mapActivityToIcon(a)}
          </TimelineDot>
          {activities.length - 1 !== index &&
            <TimelineConnector />
          }
        </TimelineSeparator>
        <TimelineContent>
          <Paper elevation={3} className={classes.paper}>
            {a.activityName &&
              <Typography variant="subtitle1" component="h1">
                {a.activityName}
              </Typography>
            }
            <Typography variant="caption">
              {this.mapActivityToMessage(a, processInstance)}
            </Typography>
          </Paper>
        </TimelineContent>
      </TimelineItem>
    ));

    return (
      <Timeline align="alternate">
        {items}
      </Timeline>
    );
  }

  renderDetails(): React.ReactElement | null {
    const { classes, processInstance } = this.props;

    if (!processInstance) {
      return null;
    }

    const { instance, owner } = processInstance;
    const duration = moment.duration(
      1000 * (instance.endTime ? instance.endTime.unix() : moment().unix() - instance.startTime.unix())
    ).humanize();

    return (
      <Card className={classes.card}>
        <CardHeader
          avatar={
            <Avatar className={classes.avatar}>
              <Icon path={mdiDatabaseCogOutline} size="1.5rem" />
            </Avatar>
          }
          title={instance.processDefinitionName}
        ></CardHeader>
        <CardContent>
          <List disablePadding>
            <ListItem className={classes.listItem}>
              <ListItemAvatar>
                {this.getAccountAvatar(owner)}
              </ListItemAvatar>
              <ListItemText primary={'Owner'} secondary={owner ? owner.username : 'System'} />
            </ListItem>
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
    const { classes, processInstance: instance } = this.props;

    if (!instance) {
      return null;
    }

    const _t = this.props.intl.formatMessage;
    const { variables } = instance;

    return (
      <Card className={classes.card}>
        <CardHeader
          avatar={
            <Avatar className={classes.avatar}>
              <Icon path={mdiVariable} size="1.5rem" />
            </Avatar>
          }
          title={_t({ id: 'workflow.instance.variables.title' })}
        ></CardHeader>
        <CardContent>
          <List disablePadding>
            {Object.keys(variables).filter(name => !['startUserKey'].includes(name)).sort().map((name, index) => {
              const value = variables[name].value;

              return (
                <div key={`variable-${name}`}>
                  <ListItem className={classes.listItem}>
                    <ListItemAvatar>
                      <Avatar className={classes.small}>
                        {this.mapVariableTypeToIcon(variables[name].type)}
                      </Avatar>
                    </ListItemAvatar>
                    {typeof value === 'boolean' &&
                      <ListItemText primary={name} secondary={value === true ? 'True' : 'False'} />
                    }
                    {typeof value !== 'boolean' &&
                      <ListItemText primary={name} secondary={value} />
                    }
                    {typeof value !== 'boolean' && variables[name].value &&
                      <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="delete" onClick={() => this.copyValueToClipboard(variables[name].value)}>
                          <Icon path={mdiContentCopy} size="1.2rem" />
                        </IconButton>
                      </ListItemSecondaryAction>
                    }
                  </ListItem>
                </div>
              );
            })}
          </List>
        </CardContent>
      </Card>
    );
  }

  render() {
    const { classes, config, processInstance = null } = this.props;
    const _t = this.props.intl.formatMessage;

    if (!processInstance) {
      return null;
    }

    const { instance } = processInstance;

    return (
      <>
        <Grid container>
          <Grid container item xs={12} lg={5}>
            <Grid item xs={12} className={classes.item}>
              {this.renderDetails()}
            </Grid>
            <Grid item xs={12} className={classes.item}>
              {this.renderVariables()}
            </Grid>
          </Grid>
          <Grid container item xs={12} lg={7}>
            <Grid item className={classes.item}>
              <Card className={classes.card}>
                <CardHeader
                  avatar={
                    <Avatar className={classes.avatar}>
                      <Icon path={mdiTimelineClockOutline} size="1.5rem" />
                    </Avatar>
                  }
                  title={_t({ id: 'billing.order.timeline.timeline-header' })}
                ></CardHeader>
                <CardContent>
                  {this.buildTimeline(processInstance)}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
        <input type="text" id="copy-to-clipboard" defaultValue="" style={{ position: 'absolute', left: -1000 }} />
      </>
    );
  }

}

const mapState = (state: RootState) => ({
  config: state.config,
  processInstance: state.workflow.instances.processInstance,
});

const mapDispatch = {
  findOne: (processInstance: string) => findOne(processInstance),
};

const connector = connect(
  mapState,
  mapDispatch,
);

type PropsFromRedux = ConnectedProps<typeof connector>

// Apply styles
const styledComponent = withStyles(styles)(ProcessInstance);

// Inject i18n resources
const localizedComponent = injectIntl(styledComponent);

// Inject state
export default connector(localizedComponent);
