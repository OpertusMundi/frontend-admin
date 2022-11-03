import { Moment } from 'moment';

import { LogoutInitAction } from 'store/security/types';
import { PageResult, PageRequest, Sorting, ObjectResponse } from 'model/response';
import { EnumSubscriptionBillingBatchSortField, SubscriptionBillingBatch, SubscriptionBillingBatchQuery } from 'model/subscription-billing';

// State
export interface SubscriptionBillingBatchManagerState {
  configureTask: {
    month: number | null;
    year: number | null;
  } | null;
  lastUpdated: Moment | null;
  loading: boolean;
  pagination: PageRequest;
  query: SubscriptionBillingBatchQuery;
  record: SubscriptionBillingBatch | null;
  result: PageResult<SubscriptionBillingBatch> | null;
  selected: SubscriptionBillingBatch[];
  sorting: Sorting<EnumSubscriptionBillingBatchSortField>[];
}

// Actions
export const SET_PAGER = 'subscription-billing-batch/manager/SET_PAGER';
export const RESET_PAGER = 'subscription-billing-batch/manager/RESET_PAGER';

export const SET_SORTING = 'subscription-billing-batch/manager/SET_SORTING';

export const SET_FILTER = 'subscription-billing-batch/manager/SET_FILTER';
export const RESET_FILTER = 'subscription-billing-batch/manager/RESET_FILTER';

export const SEARCH_INIT = 'subscription-billing-batch/manager/SEARCH_INIT';
export const SEARCH_FAILURE = 'subscription-billing-batch/manager/SEARCH_FAILURE';
export const SEARCH_COMPLETE = 'subscription-billing-batch/manager/SEARCH_COMPLETE';

export const LOAD_RECORD_INIT = 'subscription-billing-batch/manager/LOAD_RECORD_INIT';
export const LOAD_RECORD_SUCCESS = 'subscription-billing-batch/manager/LOAD_RECORD_SUCCESS';
export const LOAD_RECORD_FAILURE = 'subscription-billing-batch/manager/LOAD_RECORD_FAILURE';

export const TOGGLE_BILLING_TASK_FORM = 'subscription-billing-batch/manager/TOGGLE_BILLING_TASK_FORM';
export const SET_BILLING_TASK_PARAMS = 'subscription-billing-batch/manager/SET_BILLING_TASK_PARAMS';

export const CREATE_BILLING_TASK_INIT = 'subscription-billing-batch/manager/CREATE_BILLING_TASK_INIT';
export const CREATE_BILLING_TASK_SUCCESS = 'subscription-billing-batch/manager/CREATE_BILLING_TASK_SUCCESS';
export const CREATE_BILLING_TASK_FAILURE = 'subscription-billing-batch/manager/CREATE_BILLING_TASK_FAILURE';


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
  sorting: Sorting<EnumSubscriptionBillingBatchSortField>[];
}

export interface SetFilterAction {
  type: typeof SET_FILTER;
  query: Partial<SubscriptionBillingBatchQuery>;
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
  result: PageResult<SubscriptionBillingBatch>;
}

export interface LoadRecordInitAction {
  type: typeof LOAD_RECORD_INIT;
  key: string;
}

export interface LoadRecordSuccessAction {
  type: typeof LOAD_RECORD_SUCCESS;
  record: SubscriptionBillingBatch;
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
  response: ObjectResponse<SubscriptionBillingBatch>;
}

export interface CreateBillingFailureTask {
  type: typeof CREATE_BILLING_TASK_FAILURE;
  year: number;
  month: number;
  response: ObjectResponse<SubscriptionBillingBatch | null> | null;
}

export type SubscriptionBillingBatchActions =
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
