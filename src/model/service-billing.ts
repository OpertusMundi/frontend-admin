import { Moment } from 'moment';
import { SimpleHelpdeskAccount } from './account';

export enum EnumServiceBillingBatchSortField {
  CREATED_ON = 'CREATED_ON',
  DUE_DATE = 'DUE_DATE',
  FROM_DATE = 'FROM_DATE',
  STATUS = 'STATUS',
  TOTAL_PRICE = 'TOTAL_PRICE',
  UPDATED_ON = 'UPDATED_ON',
}

export enum EnumServiceBillingBatchStatus {
  RUNNING = 'RUNNING',
  SUCCEEDED = 'SUCCEEDED',
  FAILED = 'FAILED',
}

export interface ServiceBillingBatchQuery {
  status: EnumServiceBillingBatchStatus[];
}

export interface ServiceBillingBatch {
  createdBy: SimpleHelpdeskAccount;
  createdOn: Moment;
  dueDate: Moment;
  fromDate: Moment;
  key: string;
  processDefinition: string;
  processInstance: string;
  updatedOn: Moment;
  status: EnumServiceBillingBatchStatus;
  toDate: Moment;
  totalPrice: number;
  totalPriceExcludingTax: number;
  totalTax: number;
  totalSubscriptions: number;
}

export interface ServiceBillingBatchCommand {
  year: number;
  month: number;
  quotationOnly: boolean;
}
