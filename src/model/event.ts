import { Moment } from 'moment';

export enum EnumEventLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

export enum EnumEventSortField {
  APPLICATION = 'APPLICATION',
  CLIENT_ADDRESS = 'CLIENT_ADDRESS',
  TIMESTAMP = 'TIMESTAMP',
}

export const ApplicationDeploymentNames = [
  'api-gateway',
  'admin-gateway',
  'bpm-engine',
  'bpm-worker',
  'catalogueapi',
  'ingest',
  'keycloak',
  'mailer',
  'messenger',
  'pid',
  'profile',
];

export interface EventQuery {
  applications: string[];
  clientAddresses: string[];
  fromDate: Date;
  levels: EnumEventLevel[];
  toDate: Date;
  loggers: string[];
  userNames: string[];
  clientAddress?: string;
}

export interface Event {
  application: string;
  clientAddress: string;
  exception: string;
  exceptionMessage: string;
  facility: string;
  hostname: string;
  id: number | null;
  level: EnumEventLevel;
  logger: string;
  message: string;
  procId: number;
  programName: string;
  severityNumber: string;
  tag: string;
  thread: string;
  timestamp: Moment;
  userName: string;
}