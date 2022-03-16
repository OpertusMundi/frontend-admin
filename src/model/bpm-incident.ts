import { Moment } from 'moment';

export enum EnumIncidentSortField {
  BUSINESS_KEY = 'BUSINESS_KEY',
  PROCESS_DEFINITION = 'PROCESS_DEFINITION',
  REPORTED_ON = 'REPORTED_ON',
  TASK_NAME = 'TASK_NAME',
  TASK_WORKER = 'TASK_WORKER',
}

export interface IncidentQuery {
  businessKey: string;
}

export interface Incident {
  processDefinitionId: string;
  processDefinitionName: string;
  processDefinitionKey: string;
  processDefinitionVersion: number;
  processDefinitionVersionTag: string;
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
