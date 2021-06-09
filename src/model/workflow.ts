import { Moment } from 'moment';

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

export enum EnumIncidentSortField {
  BUSINESS_KEY = 'BUSINESS_KEY',
  PROCESS_DEFINITION = 'PROCESS_DEFINITION',
  REPORTED_ON = 'REPORTED_ON',
  TASK_NAME = 'TASK_NAME',
  TASK_WORKER = 'TASK_WORKER',
}

export interface IncidentQuery {
  processInstanceId: string;
}

export interface Incident {
  processDefinitionId: string;
  processDefinitionName: string;
  processDefinitionKey: string;
  processDefinitionVersion: number;
  processDefinitionDeployedOn: Moment;
  processInstanceId: string
  businessKey: string;
  incidentDateTime: Moment;
  incidentId: string;
  incidentMessage: string;
  incidentType: string
  activityName: string;
  activityId: string;
  taskWorker: string;
  taskName: string;
  taskErrorMessage: string;
  taskErrorDetails: string;
}