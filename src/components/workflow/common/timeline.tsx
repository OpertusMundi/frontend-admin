import moment from 'moment';
import React from 'react';

// State, routing and localization
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';

// Components
import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import Typography from '@material-ui/core/Typography';

import DateTime from 'components/common/date-time';

// Icons
import Icon from '@mdi/react';
import {
  mdiCloseOutline,
  mdiCogSyncOutline,
  mdiSourceCommitEndLocal,
  mdiSourceCommitStartNextLocal,
  mdiAccountCogOutline,
  mdiEmailOutline,
  mdiClockOutline,
  mdiArrowDecisionOutline,
  mdiAutorenew,
  mdiAntenna,
} from '@mdi/js';

// Model
import {
  ActiveProcessInstanceDetails,
  BpmActivity,
  BpmProcessInstance,
  EnumBpmProcessInstanceState,
  HistoryProcessInstanceDetails,
  ProcessInstanceDetails,
  TimelineIncident,
} from 'model/bpm-process-instance';

const styles = (theme: Theme) => createStyles({
  action: {
    width: 18,
    cursor: 'pointer',
    margin: theme.spacing(0.5, 0, 0, 1),
  },
  details: {
    lineBreak: 'anywhere',
  },
  incidentError: {
    display: 'flex',
    alignItems: 'start',
  },
  paper: {
    padding: '6px 16px',
  },
});

interface ProcessInstanceTimelineProps extends WithStyles<typeof styles> {
  intl: IntlShape;
  activeProcessInstance?: ActiveProcessInstanceDetails;
  historyProcessInstance?: HistoryProcessInstanceDetails;
  retryExternalTask?: (instance: BpmProcessInstance, incident: TimelineIncident) => void,
}

const supportedTasks = [
  'eventBasedGateway',
  'intermediateMessageCatch',
  'intermediateTimer',
  'noneEndEvent',
  'serviceTask',
  'startEvent',
  'signalStartEvent',
  'userTask',
];

const intermediateElements = [
  'eventBasedGateway',
  'intermediateMessageCatch',
  'intermediateTimer',
  'serviceTask',
  'signalStartEvent',
  'userTask',
];

const signalElements = [
  'signalStartEvent',
];


class ProcessInstanceTimeline extends React.Component<ProcessInstanceTimelineProps> {

  mapActivityToMessage(activity: BpmActivity, instance: ProcessInstanceDetails, incidents: TimelineIncident[]) {
    const { classes } = this.props;
    const { errorDetails } = instance;

    const incident = incidents.find((i) => i.activityId === activity.activityId && i.executionId === activity.executionId) || null;

    switch (activity.activityType) {
      case 'startEvent':
        return (
          <FormattedMessage id={'workflow.instance.activity.started'} values={{
            timestamp: (
              <DateTime value={activity.startTime.toDate()} day='numeric' month='numeric' year='numeric' />
            ),
          }} />
        );
      case 'noneEndEvent':
        return (
          <FormattedMessage id={'workflow.instance.activity.completed'} values={{
            timestamp: (
              <DateTime value={activity.endTime.toDate()} day='numeric' month='numeric' year='numeric' />
            ),
          }} />
        );
      case 'eventBasedGateway':
        return (
          <FormattedMessage
            id={`workflow.instance.activity.${activity.activityType}.${activity.endTime ? 'completed' : 'running'}`}
            values={{
              timestamp: (
                <DateTime value={activity.endTime?.toDate()} day='numeric' month='numeric' year='numeric' />
              ),
            }}
          />
        );

      case 'signalStartEvent':
        return (
          <FormattedMessage
            id={`workflow.instance.activity.${activity.activityType}.received`}
            values={{
              timestamp: (
                <DateTime value={activity.endTime?.toDate()} day='numeric' month='numeric' year='numeric' />
              ),
            }}
          />
        );
    }

    if (incident) {
      return (
        <>
          <div className={classes.incidentError}>
            <FormattedMessage
              id={`workflow.instance.activity.${activity.activityType}.error`}
              values={{
                activity: activity.activityName,
                timestamp: (
                  <DateTime value={incident.createTime.toDate()} day='numeric' month='numeric' year='numeric' />
                ),
              }}
            />
            {this.props.retryExternalTask && incident.externalTaskId &&
              <i onClick={() => this.props.retryExternalTask!(instance.instance, incident)}>
                <Icon path={mdiAutorenew} className={classes.action} title={'Retry'} />
              </i>
            }
          </div>
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
              {(errorDetails[incident.activityId].split('||') || []).map((text, index) => (
                <div key={`detail-line-${index}`} className={classes.details}>
                  <Typography variant="caption" >
                    {text}
                  </Typography>
                </div>
              ))}
            </>
          }
          {incident.resolved && incident.endTime &&
            <>
              <Divider />
              <Typography variant="subtitle1" >
                {'Resolved'}
              </Typography>
              <Typography variant="caption" >
                <FormattedMessage
                  id={`workflow.instance.activity.resolved`}
                  values={{
                    timestamp: (
                      <DateTime value={incident.endTime?.toDate()} day='numeric' month='numeric' year='numeric' />
                    ),
                  }}
                />
              </Typography>
            </>
          }
        </>
      );
    }

    if (activity.endTime) {
      const event = activity.canceled ? 'cancelled' : 'completed';
      return (
        <FormattedMessage id={`workflow.instance.activity.${activity.activityType}.${event}`} values={{
          activity: activity.activityName,
          timestamp: (
            <DateTime value={activity.endTime.toDate()} day='numeric' month='numeric' year='numeric' />
          ),
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
      case 'noneEndEvent':
        return (<Icon path={mdiSourceCommitEndLocal} size="1.5rem" />);
      case 'intermediateMessageCatch':
        return (<Icon path={mdiEmailOutline} size="1.5rem" />);
      case 'eventBasedGateway':
        return (<Icon path={mdiArrowDecisionOutline} size="1.5rem" />);
      case 'intermediateTimer':
        return (<Icon path={mdiClockOutline} size="1.5rem" />);
      case 'signalStartEvent':
        return (<Icon path={mdiAntenna} size="1.5rem" />);
    }
  }

  mapActivityToColor(activity: BpmActivity, instance: ProcessInstanceDetails, incidents: TimelineIncident[]) {
    const incident = incidents.find((i) => i.activityId === activity.activityId) || null;

    if (activity.activityType === 'signalStartEvent') {
      return '#5E35B1';
    }
    if (incident && ['userTask', 'serviceTask'].includes(activity.activityType)) {
      return incident.resolved ? '#757575' : '#f44336';
    }
    if (['eventBasedGateway', 'intermediateTimer'].includes(activity.activityType)) {
      return '#1565C0';
    }
    if (!activity.startTime || activity.canceled) {
      return activity.canceled ? '#F44336' : '#757575';
    }
    if (!activity.endTime) {
      return '#1565C0';
    }

    return '#4CAF50';
  }

  render() {
    const { classes, activeProcessInstance, historyProcessInstance } = this.props;
    const processInstance: ProcessInstanceDetails | null = historyProcessInstance || activeProcessInstance || null;

    if (processInstance == null) {
      return null;
    }

    const { instance, activities: allActivities } = processInstance;

    const incidents: TimelineIncident[] = historyProcessInstance ? historyProcessInstance.incidents.map(i => ({
      activityId: i.activityId,
      createTime: i.createTime,
      endTime: i.endTime,
      executionId: i.executionId,
      incidentMessage: i.incidentMessage,
      resolved: i.resolved,
      externalTaskId: null,
    })) : activeProcessInstance ? activeProcessInstance.incidents.map(i => ({
      activityId: i.activityId,
      createTime: i.incidentTimestamp,
      endTime: null,
      executionId: i.executionId,
      incidentMessage: i.incidentMessage,
      resolved: false,
      externalTaskId: i.configuration,
    })) : [];

    if (!instance) {
      return null;
    }
    const terminated =
      instance.state === EnumBpmProcessInstanceState.EXTERNALLY_TERMINATED ||
      instance.state === EnumBpmProcessInstanceState.INTERNALLY_TERMINATED;

    const activities = allActivities.filter((a) =>
      supportedTasks.includes(a.activityType)
    );

    const items = activities.map((a, index) => (
      <TimelineItem key={`status-${index}`}>
        <TimelineOppositeContent>
          <Typography variant="body2" color="textSecondary">
            <DateTime value={a.startTime.toDate()} day='numeric' month='numeric' year='numeric' />
          </Typography>
          {a.endTime && intermediateElements.includes(a.activityType) &&
            <Typography variant="body2" color="textSecondary">
              <FormattedMessage
                id={`workflow.instance.activity.${signalElements.includes(a.activityType) ? 'transmission' : 'duration'}`}
                values={{ duration: moment.duration(1000 * (a.endTime.unix() - a.startTime.unix())).humanize() }}
              />
            </Typography>
          }
        </TimelineOppositeContent>
        <TimelineSeparator>
          <TimelineDot style={{ background: this.mapActivityToColor(a, processInstance, incidents) }}>
            {this.mapActivityToIcon(a)}
          </TimelineDot>
          {(activities.length - 1 !== index || terminated) &&
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
              {this.mapActivityToMessage(a, processInstance, incidents)}
            </Typography>
          </Paper>
        </TimelineContent>
      </TimelineItem>
    ));

    if (terminated) {
      items.push(
        <TimelineItem key={`status-${instance.state}`}>
          <TimelineOppositeContent>
            <Typography variant="body2" color="textSecondary">
              <DateTime value={instance.endTime.toDate()} day='numeric' month='numeric' year='numeric' />
            </Typography>
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot style={{ background: '#f44336' }}>
              <Icon path={mdiCloseOutline} size="1.5rem" />
            </TimelineDot>
          </TimelineSeparator>
          <TimelineContent>
            <Paper elevation={3} className={classes.paper}>
              <Typography variant="caption">
                <FormattedMessage
                  id={`workflow.instance.state.${instance.state}`}
                  values={{
                    timestamp: (
                      <DateTime value={instance.endTime.toDate()} day='numeric' month='numeric' year='numeric' />
                    ),
                  }}
                />
              </Typography>
            </Paper>
          </TimelineContent>
        </TimelineItem>
      );
    }

    return (
      <Timeline align="alternate">
        {items}
      </Timeline>
    );
  }

}

// Apply styles
const styledComponent = withStyles(styles)(ProcessInstanceTimeline);

// Inject i18n resources
const localizedComponent = injectIntl(styledComponent);

// Inject state
export default localizedComponent;
