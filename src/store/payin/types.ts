import { Moment } from 'moment';

import { LogoutInitAction } from 'store/security/types';
import { PageResult, PageRequest, Sorting } from 'model/response';
import { EnumPayInSortField, PayIn, PayInQuery, PayInType } from 'model/order';

// State
export interface PayInManagerState {
  items: PageResult<PayIn> | null;
  lastUpdated: Moment | null;
  loading: boolean;
  pagination: PageRequest;
  query: PayInQuery;
  record: PayInType | null,
  selected: PayIn[];
  sorting: Sorting<EnumPayInSortField>[];
}

// Actions
export const SET_PAGER = 'payin/manager/SET_PAGER';
export const RESET_PAGER = 'payin/manager/RESET_PAGER';

export const SET_SORTING = 'payin/manager/SET_SORTING';

export const SET_FILTER = 'payin/manager/SET_FILTER';
export const RESET_FILTER = 'payin/manager/RESET_FILTER';

export const SEARCH_INIT = 'payin/manager/SEARCH_INIT';
export const SEARCH_FAILURE = 'payin/manager/SEARCH_FAILURE';
export const SEARCH_COMPLETE = 'payin/manager/SEARCH_COMPLETE';

export const ADD_SELECTED = 'payin/manager/ADD_SELECTED';
export const REMOVE_SELECTED = 'payin/manager/REMOVE_SELECTED';
export const RESET_SELECTED = 'payin/manager/RESET_SELECTED';

export const LOAD_ORDER_INIT = 'payin/manager/LOAD_ORDER_INIT';
export const LOAD_ORDER_SUCCESS = 'payin/manager/LOAD_ORDER_SUCCESS';
export const LOAD_ORDER_FAILURE = 'payin/manager/LOAD_ORDER_FAILURE';

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
  sorting: Sorting<EnumPayInSortField>[];
}

export interface SetFilterAction {
  type: typeof SET_FILTER;
  query: Partial<PayInQuery>;
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
  result: PageResult<PayIn>;
}

export interface SetSelectedAction {
  type: typeof ADD_SELECTED;
  selected: PayIn[];
}

export interface RemoveFromSelectionAction {
  type: typeof REMOVE_SELECTED;
  removed: PayIn[];
}

export interface ResetSelectionAction {
  type: typeof RESET_SELECTED;
}

export interface LoadPayInInitAction {
  type: typeof LOAD_ORDER_INIT;
  key: string;
}

export interface LoadPayInSuccessAction {
  type: typeof LOAD_ORDER_SUCCESS;
  record: PayInType;
}

export interface LoadPayInFailureAction {
  type: typeof LOAD_ORDER_FAILURE;
}

export type PayInActions =
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
  | LoadPayInInitAction
  | LoadPayInSuccessAction
  | LoadPayInFailureAction
  ;
