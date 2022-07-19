import { Moment } from 'moment';
import { MarketplaceAccount } from './account-marketplace';

export const PUBLISH_CATALOGUE_ASSET_SET_ERROR = "task-publish-catalogue-asset-set-error";
export const PUBLISH_USER_SERVICE_SET_ERROR = "task-publish-user-service-set-error";

export enum EnumWorkflow {
  CONSUMER_REGISTRATION = 'consumer-registration',
  PROVIDER_PUBLISH_ASSET = 'provider-publish-asset',
  PROVIDER_REGISTRATION = 'provider-registration',
  PUBLISH_USER_SERVICE = 'user-publish-service',
  SYSTEM_REMOVE_ALL_USER_DATA = 'system-maintenance-remove-all-user-data',
}

export const SET_ERROR_TASKS = [
  PUBLISH_CATALOGUE_ASSET_SET_ERROR,
  PUBLISH_USER_SERVICE_SET_ERROR,
];

export enum EnumProcessInstanceSortField {
  BUSINESS_KEY = 'BUSINESS_KEY',
  INCIDENT_COUNT = 'INCIDENT_COUNT',
  PROCESS_DEFINITION = 'PROCESS_DEFINITION',
  STARTED_ON = 'STARTED_ON',
  TASK_COUNT = 'TASK_COUNT',
}

export enum EnumProcessInstanceTaskSortField {
  BUSINESS_KEY = 'BUSINESS_KEY',
  INCIDENT_COUNT = 'INCIDENT_COUNT',
  PROCESS_DEFINITION = 'PROCESS_DEFINITION',
  STARTED_ON = 'STARTED_ON',
  TASK_NAME = 'TASK_NAME',
}

export enum EnumProcessInstanceHistorySortField {
  BUSINESS_KEY = 'BUSINESS_KEY',
  COMPLETED_ON = 'COMPLETED_ON',
  PROCESS_DEFINITION = 'PROCESS_DEFINITION',
  STARTED_ON = 'STARTED_ON',
}

export interface ProcessDefinition {
  id: string;
  key: string;
  name: string;
  version: string;
  versionTag: string;
}

export interface ProcessInstanceQuery {
  businessKey: string;
  processDefinitionKey: string;
  task: string;
}

export interface ProcessInstanceTaskQuery {
  businessKey: string;
  processDefinitionKey: string;
  task: string;
}

export interface ProcessInstance {
  processDefinitionId: string;
  processDefinitionName: string;
  processDefinitionKey: string;
  processDefinitionVersion: number;
  processDefinitionVersionTag: string;
  processDefinitionDeployedOn: Moment;
  processInstanceId: string
  businessKey: string;
  incidentCount: number | null;
  startedOn: Moment;
  completedOn: Moment | null;
  taskCount: number,
  taskReviewCount: number,
  taskErrorCount: number,
  taskNames: string[],
  variableNames: string[],
  variableValues: string[],
}

export interface ProcessInstanceTask {
  processDefinitionId: string;
  processDefinitionName: string;
  processDefinitionKey: string;
  processDefinitionVersion: number;
  processDefinitionVersionTag: string;
  processDefinitionDeployedOn: Moment;
  processInstanceId: string
  businessKey: string;
  incidentCount: number | null;
  startedOn: Moment;
  completedOn: Moment | null;
  taskId: string;
  taskName: string,
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
  processDefinitionVersionTag: string;
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
  createTime?: Moment;
  errorMessage?: string;
  name: string;
  removalTime?: Moment | null
  state?: string;
  taskId?: string;
  type: string;
  value: string | number | boolean | Moment | null;
}

export interface BaseBpmIncident {
  activityId: string;
  causeIncidentId: string;
  configuration: string;
  executionId: string;
  failedActivityId: string;
  id: string;
  incidentMessage: string;
  incidentType: string;
  jobDefinitionId: string;
  processDefinitionId: string;
  processInstanceId: string;
  rootCauseIncidentId: string;
  tenantId: string;
}

export interface BpmIncident extends BaseBpmIncident {
  incidentTimestamp: Moment,
}

export interface BpmHistoryIncident extends BaseBpmIncident {
  processDefinitionKey: string;
  rootProcessInstanceId: string;
  createTime: Moment;
  endTime: Moment | null;
  removalTime: Moment | null,
  historyConfiguration: string;
  open: boolean;
  deleted: boolean;
  resolved: boolean;
}

export interface TimelineIncident {
  activityId: string;
  createTime: Moment;
  endTime: Moment | null;
  executionId: string
  externalTaskId: string | null;
  incidentMessage: string;
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
  bpmn2Xml?: string;
  errorDetails: { [activity: string]: string };
  instance: BpmProcessInstance;
  owner?: MarketplaceAccount;
  variables: BpmVariable[];
}

export interface ActiveProcessInstanceDetails extends ProcessInstanceDetails {
  incidents: BpmIncident[];
}

export interface HistoryProcessInstanceDetails extends ProcessInstanceDetails {
  incidents: BpmHistoryIncident[];
}

export interface CompleteTaskTaskCommand {
  taskName: string;
}

export interface SetPublishErrorTaskCommand extends CompleteTaskTaskCommand {
  message: string;
}

export interface ModificationCommand {
  startActivities: string[];
  cancelActivities: string[];
}
