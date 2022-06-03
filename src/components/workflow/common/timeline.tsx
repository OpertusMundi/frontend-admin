import moment, { Moment } from 'moment';
import React from 'react';

// State, routing and localization
import { FormattedMessage, FormattedTime, injectIntl, IntlShape } from 'react-intl';

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
} from '@mdi/js';

// Model
import {
  ActiveProcessInstanceDetails,
  BpmActivity,
  EnumBpmProcessInstanceState,
  HistoryProcessInstanceDetails,
  ProcessInstanceDetails,
} from 'model/bpm-process-instance';

const styles = (theme: Theme) => createStyles({
  paper: {
    padding: '6px 16px',
  },
  details: {
    lineBreak: 'anywhere',
  }
});

interface Incident {
  activityId: string;
  createTime: Moment;
  endTime: Moment | null;
  executionId: string;
  incidentMessage: string;
  resolved: boolean;
}

interface ProcessInstanceTimelineProps extends WithStyles<typeof styles> {
  intl: IntlShape;
  activeProcessInstance?: ActiveProcessInstanceDetails;
  historyProcessInstance?: HistoryProcessInstanceDetails;
}

class ProcessInstanceTimeline extends React.Component<ProcessInstanceTimelineProps> {

  mapActivityToMessage(activity: BpmActivity, instance: ProcessInstanceDetails, incidents: Incident[]) {
    const _t = this.props.intl.formatTime;
    const { classes } = this.props;
    const { errorDetails } = instance;

    const incident = incidents.find((i) => i.activityId === activity.activityId && i.executionId === activity.executionId) || null;

    switch (activity.activityType) {
      case 'startEvent':
        return (
          <FormattedMessage id={'workflow.instance.activity.started'} values={{
            timestamp: _t(activity.startTime.toDate(), { day: 'numeric', month: 'numeric', year: 'numeric' }),
          }} />
        );
      case 'noneEndEvent':
        return (
          <FormattedMessage id={'workflow.instance.activity.completed'} values={{
            timestamp: _t(activity.endTime.toDate(), { day: 'numeric', month: 'numeric', year: 'numeric' }),
          }} />
        );
    }

    if (incident) {
      return (
        <>
          <FormattedMessage
            id={`workflow.instance.activity.${activity.activityType}.error`}
            values={{
              activity: activity.activityName,
              timestamp: _t(incident.createTime.toDate(), { day: 'numeric', month: 'numeric', year: 'numeric' }), //
            }}
          />
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
                    timestamp: _t(incident.endTime?.toDate(), { day: 'numeric', month: 'numeric', year: 'numeric' }),
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
      case 'noneEndEvent':
        return (<Icon path={mdiSourceCommitEndLocal} size="1.5rem" />);
      case 'intermediateMessageCatch':
        return (<Icon path={mdiEmailOutline} size="1.5rem" />);
      case 'intermediateTimer':
        return (<Icon path={mdiClockOutline} size="1.5rem" />);
    }
  }

  mapActivityToColor(activity: BpmActivity, instance: ProcessInstanceDetails, incidents: Incident[]) {
    const incident = incidents.find((i) => i.activityId === activity.activityId) || null;

    if (incident && ['userTask', 'serviceTask'].includes(activity.activityType)) {
      return incident.resolved ? '#757575' : '#f44336';
    }
    if (activity.activityType === 'intermediateTimer') {
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
    const _t = this.props.intl.formatTime;
    const { classes, activeProcessInstance, historyProcessInstance } = this.props;
    const processInstance: ProcessInstanceDetails | null = historyProcessInstance || activeProcessInstance || null;

    if (processInstance == null) {
      return null;
    }

    const { instance, activities: allActivities } = processInstance;

    const incidents: Incident[] = historyProcessInstance ? historyProcessInstance.incidents.map(i => ({
      activityId: i.activityId,
      createTime: i.createTime,
      endTime: i.endTime,
      executionId: i.executionId,
      incidentMessage: i.incidentMessage,
      resolved: i.resolved,
    })) : activeProcessInstance ? activeProcessInstance.incidents.map(i => ({
      activityId: i.activityId,
      createTime: i.incidentTimestamp,
      endTime: null,
      executionId: i.executionId,
      incidentMessage: i.incidentMessage,
      resolved: false,
    })) : [];

    if (!instance) {
      return null;
    }
    const terminated =
      instance.state === EnumBpmProcessInstanceState.EXTERNALLY_TERMINATED ||
      instance.state === EnumBpmProcessInstanceState.INTERNALLY_TERMINATED;

    const activities = allActivities.filter((a) =>
      ['startEvent', 'serviceTask', 'userTask', 'intermediateMessageCatch', 'noneEndEvent', 'intermediateTimer'].includes(a.activityType)
    );

    const items = activities.map((a, index) => (
      <TimelineItem key={`status-${index}`}>
        <TimelineOppositeContent>
          <Typography variant="body2" color="textSecondary">
            <FormattedTime value={a.startTime.toDate()} day='numeric' month='numeric' year='numeric' />
          </Typography>
          {a.endTime && ['userTask', 'serviceTask', 'intermediateMessageCatch', 'intermediateTimer'].includes(a.activityType) &&
            <Typography variant="body2" color="textSecondary">
              <FormattedMessage
                id={'workflow.instance.activity.duration'}
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
              <FormattedTime value={instance.endTime.toDate()} day='numeric' month='numeric' year='numeric' />
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
                    timestamp: _t(instance.endTime.toDate(), { day: 'numeric', month: 'numeric', year: 'numeric' }),
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
