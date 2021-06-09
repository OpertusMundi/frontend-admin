import { Moment } from 'moment';

import { LogoutInitAction } from 'store/security/types';
import {
  PageRequest,
  PageResult,
  Sorting,
} from 'model/response';
import {
  EnumProcessInstanceSortField,
  ProcessInstanceQuery,
  ProcessInstance,
} from 'model/workflow';


// State
export interface ProcessInstanceState {
  loading: boolean;
  lastUpdated: Moment | null;
  pagination: PageRequest;
  query: ProcessInstanceQuery;
  result: PageResult<ProcessInstance> | null;
  selected: ProcessInstance[];
  sorting: Sorting<EnumProcessInstanceSortField>[];
}

// Actions
export const COUNT_INCIDENT_COMPLETE = 'workflow/manager/COUNT_INCIDENT_COMPLETE';

export const SET_PAGER = 'workflow/process-instance/SET_PAGER';
export const RESET_PAGER = 'workflow/process-instance/RESET_PAGER';
export const SET_FILTER = 'workflow/process-instance/SET_FILTER';
export const RESET_FILTER = 'workflow/process-instance/RESET_FILTER';
export const SEARCH_INIT = 'workflow/process-instance/SEARCH_INIT';
export const SEARCH_FAILURE = 'workflow/process-instance/SEARCH_FAILURE';
export const SEARCH_COMPLETE = 'workflow/process-instance/SEARCH_COMPLETE';
export const ADD_SELECTED = 'workflow/process-instance/ADD_SELECTED';
export const REMOVE_SELECTED = 'workflow/process-instance/REMOVE_SELECTED';
export const SET_SORTING = 'workflow/process-instance/SET_SORTING';
export const RESET_SELECTED = 'workflow/process-instance/RESET_SELECTED';

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
  sorting: Sorting<EnumProcessInstanceSortField>[];
}

export interface SetFilterAction {
  type: typeof SET_FILTER;
  query: Partial<ProcessInstanceQuery>;
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
  result: PageResult<ProcessInstance>;
}

export interface AddSelectedAction {
  type: typeof ADD_SELECTED;
  selected: ProcessInstance[];
}

export interface RemoveSelectedAction {
  type: typeof REMOVE_SELECTED;
  removed: ProcessInstance[];
}

export interface ResetSelectionAction {
  type: typeof RESET_SELECTED;
}

export type ProcessInstanceActions =
  | LogoutInitAction
  | SetPagerAction
  | ResetPagerAction
  | SetSortingAction
  | SetFilterAction
  | ResetFilterAction
  | SearchInitAction
  | SearchFailureAction
  | SearchCompleteAction
  | AddSelectedAction
  | RemoveSelectedAction
  | ResetSelectionAction
  ;
