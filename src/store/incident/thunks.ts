import { ThunkAction } from 'redux-thunk'

// Redux
import { RootState } from 'store';
import { IncidentActions } from './types';
import {
  countIncidentComplete,
  countIncidentsFailure,
  countIncidentsInit,
  searchInit,
  searchComplete,
  searchFailure,
  setSorting,
  setPager,
  retryInit,
  retryFailure,
  retrySuccess,
} from './actions';

// Services
import IncidentApi from 'service/bpm-incident';

// Model
import { EnumIncidentSortField, Incident } from 'model/bpm-incident';
import { PageRequest, Sorting, PageResult, SimpleResponse } from 'model/response';

// Helper thunk result type
type ThunkResult<R> = ThunkAction<Promise<R>, RootState, unknown, IncidentActions>;

export const find = (
  pageRequest?: PageRequest, sorting?: Sorting<EnumIncidentSortField>[]
): ThunkResult<PageResult<Incident> | null> => async (dispatch, getState) => {
  // Get query form state (filters are always set synchronously)
  const query = getState().workflow.incidents.query;

  // Update sorting or use the existing value
  if (sorting) {
    dispatch(setSorting(sorting));
  } else {
    sorting = getState().workflow.incidents.sorting;
  }

  // Update page or user the existing value (i.e. data page refresh)
  if (pageRequest) {
    const { page, size } = pageRequest;

    dispatch(setPager(page, size));
  } else {
    pageRequest = getState().workflow.incidents.pagination
  }

  // Initialize search
  dispatch(searchInit());

  // Get response
  const api = new IncidentApi();

  const response = await api.find(query, pageRequest, sorting);

  // Update state
  if (response.data.success) {
    dispatch(searchComplete(response.data.result!));
    return response.data.result!;
  }

  dispatch(searchFailure());
  return null;
}

export const countIncidents = (): ThunkResult<number | null> => async (dispatch, getState) => {
  dispatch(countIncidentsInit());

  // Get response
  const api = new IncidentApi();

  const response = await api.count();

  // Update state
  if (response.data.success) {
    dispatch(countIncidentComplete(response.data.result!));
    return response.data.result!;
  }

  dispatch(countIncidentsFailure());
  return null;
}

export const retryExternalTask = (
  processInstanceId: string, externalTaskId: string
): ThunkResult<SimpleResponse> => async (dispatch, getState) => {
  dispatch(retryInit(processInstanceId, externalTaskId));

  // Get response
  const api = new IncidentApi();

  const response = await api.retryExternalTask(processInstanceId, externalTaskId);

  // Update state
  if (response.data.success) {
    dispatch(retrySuccess());
    return response.data;
  }

  dispatch(retryFailure());
  return response.data;
}