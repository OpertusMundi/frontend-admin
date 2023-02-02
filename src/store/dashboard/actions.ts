import { Dashboard } from 'model/dashboard';
import { ObjectResponse } from 'model/response';
import {
  DashboardActions,
  QUERY_INIT,
  QUERY_FAILURE,
  QUERY_COMPLETE,
} from './types';


// Action Creators
export function searchInit(): DashboardActions {
  return {
    type: QUERY_INIT,
  };
}

export function searchFailure(): DashboardActions {
  return {
    type: QUERY_FAILURE,
  };
}

export function searchComplete(response: ObjectResponse<Dashboard>): DashboardActions {
  return {
    type: QUERY_COMPLETE,
    response,
  };
}
