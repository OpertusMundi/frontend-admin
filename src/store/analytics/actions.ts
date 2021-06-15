import { ObjectResponse } from 'model/response';
import { SalesQuery, DataSeries } from 'model/analytics';

import {
  AnalyticsActions,
  SET_FILTER,
  RESET_FILTER,
  QUERY_INIT,
  QUERY_FAILURE,
  QUERY_COMPLETE,
} from './types';


// Action Creators
export function setFilter(query: Partial<SalesQuery>): AnalyticsActions {
  return {
    type: SET_FILTER,
    query,
  };
}

export function resetFilter(): AnalyticsActions {
  return {
    type: RESET_FILTER,
  };
}

export function searchInit(): AnalyticsActions {
  return {
    type: QUERY_INIT,
  };
}

export function searchFailure(): AnalyticsActions {
  return {
    type: QUERY_FAILURE,
  };
}

export function searchComplete(response: ObjectResponse<DataSeries>): AnalyticsActions {
  return {
    type: QUERY_COMPLETE,
    response,
  };
}
