import { Moment } from 'moment';
import { MarketplaceAccountDetails } from './account-marketplace';

export enum EnumProcessInstanceSortField {
  BUSINESS_KEY = 'BUSINESS_KEY',
  INCIDENT_COUNT = 'INCIDENT_COUNT',
  PROCESS_DEFINITION = 'PROCESS_DEFINITION',
  STARTED_ON = 'STARTED_ON',
}

export enum EnumProcessInstanceHistorySortField {
  BUSINESS_KEY = 'BUSINESS_KEY',
  COMPLETED_ON = 'COMPLETED_ON',
  PROCESS_DEFINITION = 'PROCESS_DEFINITION',
  STARTED_ON = 'STARTED_ON',
}

export interface ProcessDefinition {
  key: string;
  name: string;
  version: string;
  versionTag: string;
}

export interface ProcessInstanceQuery {
  businessKey: string;
  processDefinitionKey: string;
}

export interface ProcessInstance {
  processDefinitionId: string;
  processDefinitionName: string;
  processDefinitionKey: string;
  processDefinitionVersion: number;
  processDefinitionDeployedOn: Moment;
  processInstanceId: string
  businessKey: string;
  incidentCount: number | null;
  startedOn: Moment;
  completedOn: Moment | null;
}

export type ActivityType = 'startEvent' | 'serviceTask' | 'userTask' | 'noneEndEvent';

export interface RetryExternalTaskCommand {
  processInstanceId: string;
  externalTaskId: string;
}

export enum EnumBpmProcessInstanceState {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  COMPLETED = 'COMPLETED',
  EXTERNALLY_TERMINATED = 'EXTERNALLY_TERMINATED',
  INTERNALLY_TERMINATED = 'INTERNALLY_TERMINATED',
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
  durationInMillis: number | null;
  startUserId: string;
  startActivityId: string;
  deleteReason: null,
  rootProcessInstanceId: string;
  superProcessInstanceId: string;
  superCaseInstanceId: string;
  caseInstanceId: string;
  tenantId: string;
  state: EnumBpmProcessInstanceState;
}

export interface BpmVariable {
  type: string;
  value: string | number | boolean | null;
}

export interface BpmHistoryVariable extends BpmVariable {
  createTime: Moment;
  errorMessage: string;
  name: string;
  removalTime: Moment | null
  state: string;
  taskId: string;

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

export interface BpmHistoryIncident {
  id: string;
  processDefinitionKey: string;
  processDefinitionId: string;
  processInstanceId: string;
  executionId: string;
  rootProcessInstanceId: string;
  createTime: Moment;
  endTime: Moment | null;
  removalTime: Moment | null,
  incidentType: string;
  activityId: string;
  failedActivityId: string;
  causeIncidentId: string;
  rootCauseIncidentId: string;
  configuration: string;
  historyConfiguration: string;
  incidentMessage: string;
  tenantId: string;
  jobDefinitionId: string;
  open: boolean;
  deleted: boolean;
  resolved: boolean;
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
  instance: BpmProcessInstance;
  owner?: MarketplaceAccountDetails;
}

export interface ActiveProcessInstanceDetails extends ProcessInstanceDetails {
  incidents: BpmIncident[];
  variables: { [name: string]: BpmVariable };
}

export interface HistoryProcessInstanceDetails extends ProcessInstanceDetails {
  incidents: BpmHistoryIncident[];
  variables: BpmHistoryVariable[];
}