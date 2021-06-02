import { ThunkAction } from 'redux-thunk'

// Redux
import { RootState } from 'store';
import { WorkflowActions } from './types';
import {
  countIncidentComplete,
  countIncidentsFailure,
  countIncidentsInit,
  getIncidentComplete,
  getIncidentsFailure,
  getIncidentsInit,
} from './actions';

// Services
import WorkflowApi from 'service/workflow';

// Model
import { Incident } from 'model/workflow';

// Helper thunk result type
type ThunkResult<R> = ThunkAction<Promise<R>, RootState, unknown, WorkflowActions>;

export const getIncidents = (): ThunkResult<Incident[] | null> => async (dispatch, getState) => {
  dispatch(getIncidentsInit());

  // Get response
  const api = new WorkflowApi();

  const response = await api.getIncidents();

  // Update state
  if (response.data.success) {
    dispatch(getIncidentComplete(response.data.result));
    return response.data.result;
  }

  dispatch(getIncidentsFailure());
  return null;
}

export const countIncidents = (): ThunkResult<number | null> => async (dispatch, getState) => {
  dispatch(countIncidentsInit());

  // Get response
  const api = new WorkflowApi();

  const response = await api.countIncidents();

  // Update state
  if (response.data.success) {
    dispatch(countIncidentComplete(response.data.result));
    return response.data.result;
  }

  dispatch(countIncidentsFailure());
  return null;
}
