import { Moment } from 'moment';

export enum EnumEventLevel {
  TRACE = 'TRACE',
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

export enum EnumEventSortField {
  CLIENT_ADDRESS = 'CLIENT_ADDRESS',
  TIMESTAMP = 'TIMESTAMP',
  USER_NAME = 'USER_NAME',
}

export interface EventQuery {
  level: EnumEventLevel[];
  logger?: string;
  userName?: string;
  clientAddress?: string;
}

export interface Event {
  application: string;
  clientAddress: string;
  createdOn: Moment;
  exception: string;
  id: number;
  level: EnumEventLevel;
  logger: string;
  message: string;
  userName: string;
}