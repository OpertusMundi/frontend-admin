import { Moment } from 'moment';

import { LogoutInitAction } from 'store/security/types';
import {
  PageRequest,
  PageResult,
  Sorting,
} from 'model/response';
import {
  ActiveProcessInstanceDetails,
  EnumProcessInstanceTaskSortField,
  ProcessInstanceTask,
  ProcessInstanceTaskQuery,
} from 'model/bpm-process-instance';


// State
export interface ProcessInstanceTaskState {
  lastUpdated: Moment | null;
  loading: boolean;
  pagination: PageRequest;
  processInstance: ActiveProcessInstanceDetails | null;
  query: ProcessInstanceTaskQuery;
  result: PageResult<ProcessInstanceTask> | null;
  selected: ProcessInstanceTask[];
  sorting: Sorting<EnumProcessInstanceTaskSortField>[];
  taskCounter: number | null;
}

// Actions
export const COUNT_PROCESS_INSTANCE_TASK_INIT = 'workflow/process-instance-task/COUNT_PROCESS_INSTANCE_TASK_INIT';
export const COUNT_PROCESS_INSTANCE_TASK_FAILURE = 'workflow/process-instance-task/COUNT_PROCESS_INSTANCE_TASK_FAILURE';
export const COUNT_PROCESS_INSTANCE_TASK_COMPLETE = 'workflow/process-instance-task/COUNT_PROCESS_INSTANCE_TASK_COMPLETE';

export const SET_PAGER = 'workflow/process-instance-task/SET_PAGER';
export const RESET_PAGER = 'workflow/process-instance-task/RESET_PAGER';
export const SET_FILTER = 'workflow/process-instance-task/SET_FILTER';
export const RESET_FILTER = 'workflow/process-instance-task/RESET_FILTER';
export const SEARCH_INIT = 'workflow/process-instance-task/SEARCH_INIT';
export const SEARCH_FAILURE = 'workflow/process-instance-task/SEARCH_FAILURE';
export const SEARCH_COMPLETE = 'workflow/process-instance-task/SEARCH_COMPLETE';
export const ADD_SELECTED = 'workflow/process-instance-task/ADD_SELECTED';
export const REMOVE_SELECTED = 'workflow/process-instance-task/REMOVE_SELECTED';
export const SET_SORTING = 'workflow/process-instance-task/SET_SORTING';
export const RESET_SELECTED = 'workflow/process-instance-task/RESET_SELECTED';

export const RESET_INSTANCE = 'workflow/process-instance-task/RESET_INSTANCE';

export const LOAD_INIT = 'workflow/process-instance-task/LOAD_INIT';
export const LOAD_SUCCESS = 'workflow/process-instance-task/LOAD_SUCCESS';
export const LOAD_FAILURE = 'workflow/process-instance-task/LOAD_FAILURE';

export interface CountProcessInstanceTaskInitAction {
  type: typeof COUNT_PROCESS_INSTANCE_TASK_INIT;
}

export interface CountProcessInstanceTaskFailureAction {
  type: typeof COUNT_PROCESS_INSTANCE_TASK_FAILURE;
}

export interface CountProcessInstanceTaskCompleteAction {
  type: typeof COUNT_PROCESS_INSTANCE_TASK_COMPLETE;
  taskCounter: number | null;
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
  sorting: Sorting<EnumProcessInstanceTaskSortField>[];
}

export interface SetFilterAction {
  type: typeof SET_FILTER;
  query: Partial<ProcessInstanceTaskQuery>;
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
  result: PageResult<ProcessInstanceTask>;
}

export interface AddSelectedAction {
  type: typeof ADD_SELECTED;
  selected: ProcessInstanceTask[];
}

export interface RemoveSelectedAction {
  type: typeof REMOVE_SELECTED;
  removed: ProcessInstanceTask[];
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
  processInstanceId: string | null;
}

export interface LoadSuccessAction {
  type: typeof LOAD_SUCCESS;
  processInstance: ActiveProcessInstanceDetails;
}

export interface LoadFailureAction {
  type: typeof LOAD_FAILURE;
}

export type ProcessInstanceTaskActions =
  | LogoutInitAction
  | CountProcessInstanceTaskInitAction
  | CountProcessInstanceTaskFailureAction
  | CountProcessInstanceTaskCompleteAction
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
  ;
