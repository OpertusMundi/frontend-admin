import { Moment } from 'moment';

import { LogoutInitAction } from 'store/security/types';
import {
  PageRequest,
  PageResult,
  Sorting,
} from 'model/response';
import {
  EnumIncidentSortField,
  Incident,
  IncidentQuery,
} from 'model/bpm-incident';


// State
export interface IncidentManagerState {
  loading: boolean;
  lastUpdated: Moment | null;
  pagination: PageRequest;
  query: IncidentQuery;
  result: PageResult<Incident> | null;
  selected: Incident[];
  sorting: Sorting<EnumIncidentSortField>[];
  incidentCounter: number | null,
}

// Actions
export const COUNT_INCIDENT_INIT = 'workflow/incident/COUNT_INCIDENT_INIT';
export const COUNT_INCIDENT_FAILURE = 'workflow/incident/COUNT_INCIDENT_FAILURE';
export const COUNT_INCIDENT_COMPLETE = 'workflow/incident/COUNT_INCIDENT_COMPLETE';

export const SET_PAGER = 'workflow/incident/SET_PAGER';
export const RESET_PAGER = 'workflow/incident/RESET_PAGER';
export const SET_FILTER = 'workflow/incident/SET_FILTER';
export const RESET_FILTER = 'workflow/incident/RESET_FILTER';
export const SEARCH_INIT = 'workflow/incident/SEARCH_INIT';
export const SEARCH_FAILURE = 'workflow/incident/SEARCH_FAILURE';
export const SEARCH_COMPLETE = 'workflow/incident/SEARCH_COMPLETE';
export const ADD_SELECTED = 'workflow/incident/ADD_SELECTED';
export const REMOVE_SELECTED = 'workflow/incident/REMOVE_SELECTED';
export const SET_SORTING = 'workflow/incident/SET_SORTING';
export const RESET_SELECTED = 'workflow/incident/RESET_SELECTED';

export const RETRY_INIT = 'workflow/incident/RETRY_INIT';
export const RETRY_FAILURE = 'workflow/incident/RETRY_FAILURE';
export const RETRY_SUCCESS = 'workflow/incident/RETRY_SUCCESS';

export interface CountIncidentInitAction {
  type: typeof COUNT_INCIDENT_INIT;
}

export interface CountIncidentFailureAction {
  type: typeof COUNT_INCIDENT_FAILURE;
}

export interface CountIncidentCompleteAction {
  type: typeof COUNT_INCIDENT_COMPLETE;
  incidentCounter: number | null;
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
  sorting: Sorting<EnumIncidentSortField>[];
}

export interface SetFilterAction {
  type: typeof SET_FILTER;
  query: Partial<IncidentQuery>;
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
  result: PageResult<Incident>;
}

export interface AddSelectedAction {
  type: typeof ADD_SELECTED;
  selected: Incident[];
}

export interface RemoveSelectedAction {
  type: typeof REMOVE_SELECTED;
  removed: Incident[];
}

export interface ResetSelectionAction {
  type: typeof RESET_SELECTED;
}

export interface RetryInit {
  type: typeof RETRY_INIT,
  processInstanceId: string;
  externalTaskId: string;
}

export interface RetryFailure {
  type: typeof RETRY_FAILURE,
}

export interface RetrySuccess {
  type: typeof RETRY_SUCCESS,
}

export type IncidentActions =
  | LogoutInitAction
  | CountIncidentInitAction
  | CountIncidentFailureAction
  | CountIncidentCompleteAction
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
  | RetryInit
  | RetryFailure
  | RetrySuccess
  ;
