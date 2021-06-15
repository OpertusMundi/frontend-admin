import { Moment } from 'moment';

import { LogoutInitAction } from 'store/security/types';
import { ObjectResponse } from 'model/response';
import { SalesQuery, DataSeries } from 'model/analytics';

// State
export interface AnalyticsManagerState {
  lastUpdated: Moment | null;
  loading: boolean;
  query: SalesQuery;
  response: ObjectResponse<DataSeries> | null;
}

// Actions
export const SET_FILTER = 'order/manager/SET_FILTER';
export const RESET_FILTER = 'order/manager/RESET_FILTER';

export const QUERY_INIT = 'order/manager/QUERY_INIT';
export const QUERY_FAILURE = 'order/manager/QUERY_FAILURE';
export const QUERY_COMPLETE = 'order/manager/QUERY_COMPLETE';

export interface SetFilterAction {
  type: typeof SET_FILTER;
  query: Partial<SalesQuery>;
}

export interface ResetFilterAction {
  type: typeof RESET_FILTER;
}

export interface QueryInitAction {
  type: typeof QUERY_INIT;
}

export interface QueryFailureAction {
  type: typeof QUERY_FAILURE;
}

export interface QueryCompleteAction {
  type: typeof QUERY_COMPLETE;
  response: ObjectResponse<DataSeries>;
}

export type AnalyticsActions =
  | LogoutInitAction
  | SetFilterAction
  | ResetFilterAction
  | QueryInitAction
  | QueryFailureAction
  | QueryCompleteAction
  ;
