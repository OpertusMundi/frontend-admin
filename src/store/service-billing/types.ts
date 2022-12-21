import { Moment } from 'moment';

import { LogoutInitAction } from 'store/security/types';
import { PageResult, PageRequest, Sorting, ObjectResponse } from 'model/response';
import { EnumServiceBillingBatchSortField, ServiceBillingBatch, ServiceBillingBatchQuery } from 'model/service-billing';

// State
export interface ServiceBillingBatchManagerState {
  configureTask: {
    month: number | null;
    year: number | null;
  } | null;
  lastUpdated: Moment | null;
  loading: boolean;
  pagination: PageRequest;
  query: ServiceBillingBatchQuery;
  record: ServiceBillingBatch | null;
  result: PageResult<ServiceBillingBatch> | null;
  selected: ServiceBillingBatch[];
  sorting: Sorting<EnumServiceBillingBatchSortField>[];
}

// Actions
export const SET_PAGER = 'service-billing-batch/manager/SET_PAGER';
export const RESET_PAGER = 'service-billing-batch/manager/RESET_PAGER';

export const SET_SORTING = 'service-billing-batch/manager/SET_SORTING';

export const SET_FILTER = 'service-billing-batch/manager/SET_FILTER';
export const RESET_FILTER = 'service-billing-batch/manager/RESET_FILTER';

export const SEARCH_INIT = 'service-billing-batch/manager/SEARCH_INIT';
export const SEARCH_FAILURE = 'service-billing-batch/manager/SEARCH_FAILURE';
export const SEARCH_COMPLETE = 'service-billing-batch/manager/SEARCH_COMPLETE';

export const LOAD_RECORD_INIT = 'service-billing-batch/manager/LOAD_RECORD_INIT';
export const LOAD_RECORD_SUCCESS = 'service-billing-batch/manager/LOAD_RECORD_SUCCESS';
export const LOAD_RECORD_FAILURE = 'service-billing-batch/manager/LOAD_RECORD_FAILURE';

export const TOGGLE_BILLING_TASK_FORM = 'service-billing-batch/manager/TOGGLE_BILLING_TASK_FORM';
export const SET_BILLING_TASK_PARAMS = 'service-billing-batch/manager/SET_BILLING_TASK_PARAMS';

export const CREATE_BILLING_TASK_INIT = 'service-billing-batch/manager/CREATE_BILLING_TASK_INIT';
export const CREATE_BILLING_TASK_SUCCESS = 'service-billing-batch/manager/CREATE_BILLING_TASK_SUCCESS';
export const CREATE_BILLING_TASK_FAILURE = 'service-billing-batch/manager/CREATE_BILLING_TASK_FAILURE';


export interface SetPagerAction {
  type: typeof SET_PAGER;
  page: number;
  size: number;
}

export interface ResetPagerAction {
  type: typeof RESET_PAGER
}

export interface SetSortingAction {
  type: typeof SET_SORTING;
  sorting: Sorting<EnumServiceBillingBatchSortField>[];
}

export interface SetFilterAction {
  type: typeof SET_FILTER;
  query: Partial<ServiceBillingBatchQuery>;
}

export interface ResetFilterAction {
  type: typeof RESET_FILTER;
}

export interface SearchInitAction {
  type: typeof SEARCH_INIT;
}

export interface SearchFailureAction {
  type: typeof SEARCH_FAILURE;
}

export interface SearchCompleteAction {
  type: typeof SEARCH_COMPLETE;
  result: PageResult<ServiceBillingBatch>;
}

export interface LoadRecordInitAction {
  type: typeof LOAD_RECORD_INIT;
  key: string;
}

export interface LoadRecordSuccessAction {
  type: typeof LOAD_RECORD_SUCCESS;
  record: ServiceBillingBatch;
}

export interface LoadRecordFailureAction {
  type: typeof LOAD_RECORD_FAILURE;
}

export interface ToggleBillingTaskFormAction {
  type: typeof TOGGLE_BILLING_TASK_FORM;
  show: boolean;
}

export interface SetBillingTaskParamsAction {
  type: typeof SET_BILLING_TASK_PARAMS;
  year: number;
  month: number;
}

export interface CreateBillingTaskInitAction {
  type: typeof CREATE_BILLING_TASK_INIT
  year: number;
  month: number;
}

export interface CreateBillingTaskSuccessAction {
  type: typeof CREATE_BILLING_TASK_SUCCESS;
  year: number;
  month: number;
  response: ObjectResponse<ServiceBillingBatch>;
}

export interface CreateBillingFailureTask {
  type: typeof CREATE_BILLING_TASK_FAILURE;
  year: number;
  month: number;
  response: ObjectResponse<ServiceBillingBatch | null> | null;
}

export type ServiceBillingBatchActions =
  | LogoutInitAction
  | SetPagerAction
  | ResetPagerAction
  | SetSortingAction
  | SetFilterAction
  | ResetFilterAction
  | SearchInitAction
  | SearchFailureAction
  | SearchCompleteAction
  | LoadRecordInitAction
  | LoadRecordSuccessAction
  | LoadRecordFailureAction
  | ToggleBillingTaskFormAction
  | SetBillingTaskParamsAction
  | CreateBillingTaskInitAction
  | CreateBillingTaskSuccessAction
  | CreateBillingFailureTask
  ;
