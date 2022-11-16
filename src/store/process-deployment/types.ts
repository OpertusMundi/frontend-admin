import { Moment } from 'moment';

import { LogoutInitAction } from 'store/security/types';
import {
  Sorting,
} from 'model/response';
import {
  Deployment, EnumDeploymentSortField,
} from 'model/bpm-process-instance';


// State
export interface DeploymentState {
  lastUpdated: Moment | null;
  loading: boolean;
  result: Deployment[] | null;
  sorting: Sorting<EnumDeploymentSortField>[];
}

// Actions
export const SET_SORTING = 'workflow/deployment/SET_SORTING';

export const SEARCH_INIT = 'workflow/deployment/SEARCH_INIT';
export const SEARCH_FAILURE = 'workflow/deployment/SEARCH_FAILURE';
export const SEARCH_COMPLETE = 'workflow/deployment/SEARCH_COMPLETE';

export const DELETE_INIT = 'workflow/deployment/DELETE_INIT';
export const DELETE_SUCCESS = 'workflow/deployment/DELETE_SUCCESS';
export const DELETE_FAILURE = 'workflow/deployment/DELETE_FAILURE';

export interface SetSortingAction {
  type: typeof SET_SORTING;
  sorting: Sorting<EnumDeploymentSortField>[];
}

export interface SearchInitAction {
  type: typeof SEARCH_INIT;
}

export interface SearchFailureAction {
  type: typeof SEARCH_FAILURE;
}

export interface SearchCompleteAction {
  type: typeof SEARCH_COMPLETE;
  result: Deployment[];
}

export interface DeleteInitAction {
  type: typeof DELETE_INIT;
  id: string;
  cascade: boolean;
}

export interface DeleteSuccessAction {
  type: typeof DELETE_SUCCESS;
}

export interface DeleteFailureAction {
  type: typeof DELETE_FAILURE;
}

export type DeploymentActions =
  | LogoutInitAction
  | SetSortingAction
  | SearchInitAction
  | SearchFailureAction
  | SearchCompleteAction
  | DeleteInitAction
  | DeleteSuccessAction
  | DeleteFailureAction
  ;
