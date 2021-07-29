import { Moment } from 'moment';

import { LogoutInitAction } from 'store/security/types';
import { PageResult, PageRequest, Sorting, ObjectResponse } from 'model/response';
import { EnumHelpdeskAccountSortField, HelpdeskAccount, HelpdeskAccountQuery } from 'model/account';

// State
export interface HelpdeskAccountManagerState {
  loading: boolean;
  lastUpdated: Moment | null;
  pagination: PageRequest;
  query: HelpdeskAccountQuery;
  result: PageResult<HelpdeskAccount> | null;
  selected: HelpdeskAccount[];
  sorting: Sorting<EnumHelpdeskAccountSortField>[];
  response: ObjectResponse<HelpdeskAccount> | null;
}

// Actions
export const SET_PAGER = 'helpdesk-account/manager/SET_PAGER';
export const RESET_PAGER = 'helpdesk-account/manager/RESET_PAGER';

export const SET_SORTING = 'helpdesk-account/manager/SET_SORTING';

export const SET_FILTER = 'helpdesk-account/manager/SET_FILTER';
export const RESET_FILTER = 'helpdesk-account/manager/RESET_FILTER';

export const SEARCH_INIT = 'helpdesk-account/manager/SEARCH_INIT';
export const SEARCH_FAILURE = 'helpdesk-account/manager/SEARCH_FAILURE';
export const SEARCH_COMPLETE = 'helpdesk-account/manager/SEARCH_COMPLETE';

export const SAVE_INIT = 'helpdesk-account/manager/SAVE_INIT';
export const SAVE_COMPLETE = 'helpdesk-account/manager/SAVE_COMPLETE';

export const ADD_SELECTED = 'helpdesk-account/manager/ADD_SELECTED';
export const REMOVE_SELECTED = 'helpdesk-account/manager/REMOVE_SELECTED';
export const RESET_SELECTED = 'helpdesk-account/manager/RESET_SELECTED';


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
  sorting: Sorting<EnumHelpdeskAccountSortField>[];
}

export interface SetFilterAction {
  type: typeof SET_FILTER;
  query: Partial<HelpdeskAccountQuery>;
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
  result: PageResult<HelpdeskAccount>;
}

export interface SaveInitAction {
  type: typeof SAVE_INIT;
}

export interface SaveCompleteAction {
  type: typeof SAVE_COMPLETE;
  response: ObjectResponse<HelpdeskAccount>;
}

export interface SetSelectedAction {
  type: typeof ADD_SELECTED;
  selected: HelpdeskAccount[];
}

export interface RemoveFromSelectionAction {
  type: typeof REMOVE_SELECTED;
  removed: HelpdeskAccount[];
}

export interface ResetSelectionAction {
  type: typeof RESET_SELECTED;
}

export type AccountActions =
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
  | SaveInitAction
  | SaveCompleteAction
  ;
