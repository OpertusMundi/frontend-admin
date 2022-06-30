import { Moment } from 'moment';
import { SimpleHelpdeskAccount } from './account';

export enum EnumSubscriptionBillingBatchSortField {
  CREATED_ON = 'CREATED_ON',
  DUE_DATE = 'DUE_DATE',
  FROM_DATE = 'FROM_DATE',
  STATUS = 'STATUS',
  TOTAL_PRICE = 'TOTAL_PRICE',
  UPDATED_ON = 'UPDATED_ON',
}

export enum EnumSubscriptionBillingBatchStatus {
  RUNNING = 'RUNNING',
  SUCCEEDED = 'SUCCEEDED',
  FAILED = 'FAILED',
}

export interface SubscriptionBillingBatchQuery {
  status: EnumSubscriptionBillingBatchStatus[];
}

export interface SubscriptionBillingBatch {
  createdBy: SimpleHelpdeskAccount;
  createdOn: Moment;
  dueDate: Moment;
  fromDate: Moment;
  key: string;
  processDefinition: string;
  processInstance: string;
  updatedOn: Moment;
  status: EnumSubscriptionBillingBatchStatus;
  toDate: Moment;
  totalPrice: number;
  totalPriceExcludingTax: number;
  totalTax: number;
  totalSubscriptions: number;
}

export interface SubscriptionBillingBatchCommand {
  year: number;
  month: number;
  quotationOnly: boolean;
}
