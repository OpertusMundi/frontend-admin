import { Moment } from 'moment';

import { LogoutInitAction } from 'store/security/types';
import { PageResult, PageRequest, Sorting } from 'model/response';
import { EnumPayOutSortField, PayOut, PayOutQuery } from 'model/order';

// State
export interface PayOutManagerState {
  lastUpdated: Moment | null;
  loading: boolean;
  pagination: PageRequest;
  query: PayOutQuery;
  record: PayOut | null;
  result: PageResult<PayOut> | null;
  selected: PayOut[];
  sorting: Sorting<EnumPayOutSortField>[];
}

// Actions
export const SET_PAGER = 'payout/manager/SET_PAGER';
export const RESET_PAGER = 'payout/manager/RESET_PAGER';

export const SET_SORTING = 'payout/manager/SET_SORTING';

export const SET_FILTER = 'payout/manager/SET_FILTER';
export const RESET_FILTER = 'payout/manager/RESET_FILTER';

export const SEARCH_INIT = 'payout/manager/SEARCH_INIT';
export const SEARCH_FAILURE = 'payout/manager/SEARCH_FAILURE';
export const SEARCH_COMPLETE = 'payout/manager/SEARCH_COMPLETE';

export const ADD_SELECTED = 'payout/manager/ADD_SELECTED';
export const REMOVE_SELECTED = 'payout/manager/REMOVE_SELECTED';
export const RESET_SELECTED = 'payout/manager/RESET_SELECTED';

export const LOAD_PAYOUT_INIT = 'payout/manager/LOAD_PAYOUT_INIT';
export const LOAD_PAYOUT_SUCCESS = 'payout/manager/LOAD_PAYOUT_SUCCESS';
export const LOAD_PAYOUT_FAILURE = 'payout/manager/LOAD_PAYOUT_FAILURE';

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
  sorting: Sorting<EnumPayOutSortField>[];
}

export interface SetFilterAction {
  type: typeof SET_FILTER;
  query: Partial<PayOutQuery>;
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
  result: PageResult<PayOut>;
}

export interface SetSelectedAction {
  type: typeof ADD_SELECTED;
  selected: PayOut[];
}

export interface RemoveFromSelectionAction {
  type: typeof REMOVE_SELECTED;
  removed: PayOut[];
}

export interface ResetSelectionAction {
  type: typeof RESET_SELECTED;
}

export interface LoadPayOutInitAction {
  type: typeof LOAD_PAYOUT_INIT;
  key: string;
}

export interface LoadPayOutSuccessAction {
  type: typeof LOAD_PAYOUT_SUCCESS;
  record: PayOut;
}

export interface LoadPayOutFailureAction {
  type: typeof LOAD_PAYOUT_FAILURE;
}

export type PayOutActions =
  | LogoutInitAction
  | SetPagerAction
  | ResetPagerAction
  | SetSortingAction
  | SetFilterAction
  | ResetFilterAction
  | SearchInitAction
  | SearchFailureAction
  | SearchCompleteAction
  | SetSelectedAction
  | RemoveFromSelectionAction
  | ResetSelectionAction
  | LoadPayOutInitAction
  | LoadPayOutSuccessAction
  | LoadPayOutFailureAction
  ;
