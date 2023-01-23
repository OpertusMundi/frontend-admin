import { Moment } from 'moment';

import { LogoutInitAction } from 'store/security/types';
import { PageResult, PageRequest, Sorting } from 'model/response';
import { EnumDisputeSortField, Dispute, DisputeQuery } from 'model/dispute';

// State
export interface DisputeManagerState {
  lastUpdated: Moment | null;
  loading: boolean;
  pagination: PageRequest;
  query: DisputeQuery;
  record: Dispute | null;
  result: PageResult<Dispute> | null;
  selected: Dispute[];
  sorting: Sorting<EnumDisputeSortField>[];
}

// Actions
export const SET_PAGER = 'dispute/manager/SET_PAGER';
export const RESET_PAGER = 'dispute/manager/RESET_PAGER';

export const SET_SORTING = 'dispute/manager/SET_SORTING';

export const SET_FILTER = 'dispute/manager/SET_FILTER';
export const RESET_FILTER = 'dispute/manager/RESET_FILTER';

export const SEARCH_INIT = 'dispute/manager/SEARCH_INIT';
export const SEARCH_FAILURE = 'dispute/manager/SEARCH_FAILURE';
export const SEARCH_COMPLETE = 'dispute/manager/SEARCH_COMPLETE';

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
  sorting: Sorting<EnumDisputeSortField>[];
}

export interface SetFilterAction {
  type: typeof SET_FILTER;
  query: Partial<DisputeQuery>;
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
  result: PageResult<Dispute>;
}

export type DisputeActions =
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
