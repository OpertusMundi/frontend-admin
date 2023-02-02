import { Moment } from 'moment';

import { LogoutInitAction } from 'store/security/types';
import { ObjectResponse } from 'model/response';
import { Dashboard } from 'model/dashboard';

// State
export interface DashboardState {
  data: Dashboard | null;
  lastUpdated: Moment | null;
  loading: boolean;
}

// Actions
export const QUERY_INIT = 'dashboard/QUERY_INIT';
export const QUERY_FAILURE = 'dashboard/QUERY_FAILURE';
export const QUERY_COMPLETE = 'dashboard/QUERY_COMPLETE';

export interface QueryInitAction {
  type: typeof QUERY_INIT;
}

export interface QueryFailureAction {
  type: typeof QUERY_FAILURE;
}

export interface QueryCompleteAction {
  type: typeof QUERY_COMPLETE;
  response: ObjectResponse<Dashboard>;
}

export type DashboardActions =
  | LogoutInitAction
  | QueryInitAction
  | QueryFailureAction
  | QueryCompleteAction
  ;
