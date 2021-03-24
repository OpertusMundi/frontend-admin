import { Moment } from 'moment';

import { LogoutInitAction } from 'store/security/types';
import { Incident } from 'model/workflow';

// State
export interface WorkflowManagerState {
  loading: boolean;
  lastUpdated: Moment | null;
  countIncidents: number;
  incidents: Incident[];
  selected: Incident | null
}

// Actions
export const COUNT_INCIDENT_INIT = 'workflow/manager/COUNT_INCIDENT_INIT';
export const COUNT_INCIDENT_FAILURE = 'workflow/manager/COUNT_INCIDENT_FAILURE';
export const COUNT_INCIDENT_COMPLETE = 'workflow/manager/COUNT_INCIDENT_COMPLETE';
export const GET_INCIDENT_INIT = 'workflow/manager/GET_INCIDENT_INIT';
export const GET_INCIDENT_FAILURE = 'workflow/manager/GET_INCIDENT_FAILURE';
export const GET_INCIDENT_COMPLETE = 'workflow/manager/GET_INCIDENT_COMPLETE';
export const SET_SELECTED_INCIDENT = 'workflow/manager/SET_SELECTED_INCIDENT';

export interface CountIncidentInitAction {
  type: typeof COUNT_INCIDENT_INIT;
}

export interface CountIncidentFailureAction {
  type: typeof COUNT_INCIDENT_FAILURE;
}

export interface CountIncidentCompleteAction {
  type: typeof COUNT_INCIDENT_COMPLETE;
  result: number;
}

export interface GetIncidentInitAction {
  type: typeof GET_INCIDENT_INIT;
}

export interface GetIncidentFailureAction {
  type: typeof GET_INCIDENT_FAILURE;
}

export interface GetIncidentCompleteAction {
  type: typeof GET_INCIDENT_COMPLETE;
  result: Incident[];
}

export interface SetSelectedIncidentAction {
  type: typeof SET_SELECTED_INCIDENT;
  selected: Incident | null;
}

export type WorkflowActions =
  | LogoutInitAction
  | CountIncidentInitAction
  | CountIncidentFailureAction
  | CountIncidentCompleteAction
  | GetIncidentInitAction
  | GetIncidentFailureAction
  | GetIncidentCompleteAction
  | SetSelectedIncidentAction
  ;
