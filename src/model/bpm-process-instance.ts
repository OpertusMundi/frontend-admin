import { Moment } from 'moment';
import { MarketplaceAccountDetails } from './account-marketplace';

export enum EnumProcessInstanceSortField {
  BUSINESS_KEY = 'BUSINESS_KEY',
  INCIDENT_COUNT = 'INCIDENT_COUNT',
  PROCESS_DEFINITION = 'PROCESS_DEFINITION',
  STARTED_ON = 'STARTED_ON',
}

export interface ProcessInstanceQuery {
  businessKey: string;
}

export interface ProcessInstance {
  processDefinitionId: string;
  processDefinitionName: string;
  processDefinitionKey: string;
  processDefinitionVersion: number;
  processDefinitionDeployedOn: Moment;
  processInstanceId: string
  businessKey: string;
  incidentCount: number;
  startedOn: Moment;
}

export type ActivityType = 'startEvent' | 'serviceTask' | 'userTask' | 'endEvent';

export interface RetryExternalTaskCommand {
  processInstanceId: string;
  externalTaskId: string;
}

export interface BpmProcessInstance {
  id: string;
  businessKey: string;
  processDefinitionId: string;
  processDefinitionKey: string;
  processDefinitionName: string;
  processDefinitionVersion: number;
  startTime: Moment;
  endTime: Moment,
  removalTime: Moment;
  durationInMillis: number;
  startUserId: string;
  startActivityId: string;
  deleteReason: null,
  rootProcessInstanceId: string;
  superProcessInstanceId: string;
  superCaseInstanceId: string;
  caseInstanceId: string;
  tenantId: string;
  state: string;
}

export interface BpmVariable {
  type: string;
  value: string | number | boolean | null;
}

export interface BpmIncident {
  id: string;
  processDefinitionId: string;
  processInstanceId: string;
  executionId: string;
  incidentTimestamp: Moment,
  incidentType: string;
  activityId: string;
  failedActivityId: string;
  causeIncidentId: string;
  rootCauseIncidentId: string;
  configuration: string;
  incidentMessage: string;
  tenantId: string;
  jobDefinitionId: string;
}

export interface BpmActivity {
  id: string;
  parentActivityInstanceId: string;
  activityId: string;
  activityName: string;
  activityType: string;
  processDefinitionKey: string;
  processDefinitionId: string;
  processInstanceId: string;
  executionId: string;
  taskId: string;
  calledProcessInstanceId: string;
  calledCaseInstanceId: string;
  assignee: string;
  startTime: Moment;
  endTime: Moment;
  durationInMillis: number;
  canceled: boolean;
  completeScope: boolean;
  tenantId: string;
  removalTime: Moment;
  rootProcessInstanceId: string;
}

export interface ProcessInstanceDetails {
  activities: BpmActivity[];
  errorDetails: { [activity: string]: string };
  incidents: BpmIncident[];
  instance: BpmProcessInstance;
  owner: MarketplaceAccountDetails;
  variables: { [name: string]: BpmVariable };
}
