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
} from './actions';

// Services
import WorkflowApi from 'service/workflow';

// Model
import { EnumIncidentSortField, Incident } from 'model/workflow';
import { PageRequest, Sorting, PageResult } from 'model/response';

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
  const api = new WorkflowApi();

  const response = await api.getIncidents(query, pageRequest, sorting);

  // Update state
  if (response.data.success) {
    dispatch(searchComplete(response.data.result));
    return response.data.result;
  }

  dispatch(searchFailure());
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
