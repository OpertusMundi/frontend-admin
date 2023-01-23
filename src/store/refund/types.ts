import { Moment } from 'moment';

import { LogoutInitAction } from 'store/security/types';
import { PageResult, PageRequest, Sorting } from 'model/response';
import { EnumRefundSortField, Refund, RefundQuery } from 'model/refund';

// State
export interface RefundManagerState {
  lastUpdated: Moment | null;
  loading: boolean;
  pagination: PageRequest;
  query: RefundQuery;
  record: Refund | null;
  result: PageResult<Refund> | null;
  selected: Refund[];
  sorting: Sorting<EnumRefundSortField>[];
}

// Actions
export const SET_PAGER = 'refund/manager/SET_PAGER';
export const RESET_PAGER = 'refund/manager/RESET_PAGER';

export const SET_SORTING = 'refund/manager/SET_SORTING';

export const SET_FILTER = 'refund/manager/SET_FILTER';
export const RESET_FILTER = 'refund/manager/RESET_FILTER';

export const SEARCH_INIT = 'refund/manager/SEARCH_INIT';
export const SEARCH_FAILURE = 'refund/manager/SEARCH_FAILURE';
export const SEARCH_COMPLETE = 'refund/manager/SEARCH_COMPLETE';

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
  sorting: Sorting<EnumRefundSortField>[];
}

export interface SetFilterAction {
  type: typeof SET_FILTER;
  query: Partial<RefundQuery>;
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
  result: PageResult<Refund>;
}

export type RefundActions =
  | LogoutInitAction
  | SetPagerAction
  | ResetPagerAction
  | SetSortingAction
  | SetFilterAction
  | ResetFilterAction
  | SearchInitAction
  | SearchFailureAction
  | SearchCompleteAction
  ;
