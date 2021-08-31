import { Moment } from 'moment';

import { LogoutInitAction } from 'store/security/types';
import {
  PageRequest,
  PageResult,
  Sorting,
} from 'model/response';
import {
  ActiveProcessInstanceDetails,
  EnumProcessInstanceSortField,
  ProcessInstanceQuery,
  ProcessInstance,
} from 'model/bpm-process-instance';


// State
export interface ProcessInstanceState {
  lastUpdated: Moment | null;
  loading: boolean;
  loadingProcessInstance: boolean;
  pagination: PageRequest;
  processInstance: ActiveProcessInstanceDetails | null;
  processInstanceCounter: number | null;
  query: ProcessInstanceQuery;
  result: PageResult<ProcessInstance> | null;
  selected: ProcessInstance[];
  sorting: Sorting<EnumProcessInstanceSortField>[];
}

// Actions
export const COUNT_PROCESS_INSTANCE_INIT = 'workflow/process-instance/COUNT_PROCESS_INSTANCE_INIT';
export const COUNT_PROCESS_INSTANCE_FAILURE = 'workflow/process-instance/COUNT_PROCESS_INSTANCE_FAILURE';
export const COUNT_PROCESS_INSTANCE_COMPLETE = 'workflow/process-instance/COUNT_PROCESS_INSTANCE_COMPLETE';

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

export const RESET_INSTANCE = 'workflow/process-instance/RESET_INSTANCE';

export const LOAD_INIT = 'workflow/process-instance/LOAD_INIT';
export const LOAD_SUCCESS = 'workflow/process-instance/LOAD_SUCCESS';
export const LOAD_FAILURE = 'workflow/process-instance/LOAD_FAILURE';

export const DELETE_INIT = 'workflow/process-instance/DELETE_INIT';
export const DELETE_SUCCESS = 'workflow/process-instance/DELETE_SUCCESS';
export const DELETE_FAILURE = 'workflow/process-instance/DELETE_FAILURE';

export interface CountProcessInstanceInitAction {
  type: typeof COUNT_PROCESS_INSTANCE_INIT;
}

export interface CountProcessInstanceFailureAction {
  type: typeof COUNT_PROCESS_INSTANCE_FAILURE;
}

export interface CountProcessInstanceCompleteAction {
  type: typeof COUNT_PROCESS_INSTANCE_COMPLETE;
  processInstanceCounter: number | null;
}

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

export interface ResetInstanceAction {
  type: typeof RESET_INSTANCE;
}

export interface LoadInitAction {
  type: typeof LOAD_INIT;
  businessKey: string | null;
  processInstance: string | null;
}

export interface LoadSuccessAction {
  type: typeof LOAD_SUCCESS;
  processInstance: ActiveProcessInstanceDetails;
}

export interface LoadFailureAction {
  type: typeof LOAD_FAILURE;
}

export interface DeleteInitAction {
  type: typeof DELETE_INIT;
  processInstance: string;
}

export interface DeleteSuccessAction {
  type: typeof DELETE_SUCCESS;
}

export interface DeleteFailureAction {
  type: typeof DELETE_FAILURE;
}

export type ProcessInstanceActions =
  | LogoutInitAction
  | CountProcessInstanceInitAction
  | CountProcessInstanceFailureAction
  | CountProcessInstanceCompleteAction
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
  | ResetInstanceAction
  | LoadInitAction
  | LoadSuccessAction
  | LoadFailureAction
  | DeleteInitAction
  | DeleteSuccessAction
  | DeleteFailureAction
  ;
