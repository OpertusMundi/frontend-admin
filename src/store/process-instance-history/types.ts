import { Moment } from 'moment';

import { LogoutInitAction } from 'store/security/types';
import {
  PageRequest,
  PageResult,
  Sorting,
} from 'model/response';
import {
  EnumProcessInstanceHistorySortField,
  ProcessInstanceQuery,
  ProcessInstance,
  HistoryProcessInstanceDetails,
} from 'model/bpm-process-instance';


// State
export interface ProcessInstanceState {
  lastUpdated: Moment | null;
  loading: boolean;
  loadingProcessInstance: boolean,
  pagination: PageRequest;
  processInstance: HistoryProcessInstanceDetails | null,
  query: ProcessInstanceQuery;
  result: PageResult<ProcessInstance> | null;
  selected: ProcessInstance[];
  sorting: Sorting<EnumProcessInstanceHistorySortField>[];
}

// Actions
export const SET_PAGER = 'workflow/process-instance-history/SET_PAGER';
export const RESET_PAGER = 'workflow/process-instance-history/RESET_PAGER';
export const SET_FILTER = 'workflow/process-instance-history/SET_FILTER';
export const RESET_FILTER = 'workflow/process-instance-history/RESET_FILTER';
export const SEARCH_INIT = 'workflow/process-instance-history/SEARCH_INIT';
export const SEARCH_FAILURE = 'workflow/process-instance-history/SEARCH_FAILURE';
export const SEARCH_COMPLETE = 'workflow/process-instance-history/SEARCH_COMPLETE';
export const ADD_SELECTED = 'workflow/process-instance-history/ADD_SELECTED';
export const REMOVE_SELECTED = 'workflow/process-instance-history/REMOVE_SELECTED';
export const SET_SORTING = 'workflow/process-instance-history/SET_SORTING';
export const RESET_SELECTED = 'workflow/process-instance-history/RESET_SELECTED';

export const RESET_INSTANCE = 'workflow/process-instance-history/RESET_INSTANCE';
export const LOAD_INIT = 'workflow/process-instance-history/LOAD_INIT';
export const LOAD_SUCCESS = 'workflow/process-instance-history/LOAD_SUCCESS';
export const LOAD_FAILURE = 'workflow/process-instance-history/LOAD_FAILURE';

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
  sorting: Sorting<EnumProcessInstanceHistorySortField>[];
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

export interface LoadInitAction {
  type: typeof LOAD_INIT;
  processInstance: string,
}

export interface LoadSuccessAction {
  type: typeof LOAD_SUCCESS;
  processInstance: HistoryProcessInstanceDetails,
}

export interface LoadFailureAction {
  type: typeof LOAD_FAILURE;
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
  | LoadInitAction
  | LoadSuccessAction
  | LoadFailureAction
  ;
