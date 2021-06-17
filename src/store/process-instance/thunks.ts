import { ThunkAction } from 'redux-thunk'

// Redux
import { RootState } from 'store';
import { ProcessInstanceActions } from './types';
import {
  countProcessInstancesComplete,
  countProcessInstancesFailure,
  countProcessInstancesInit,
  loadInit,
  loadSuccess,
  loadFailure,
  searchInit,
  searchComplete,
  searchFailure,
  setSorting,
  setPager,
} from './actions';

// Services
import ProcessInstanceApi from 'service/bpm-process-instance';

// Model
import { EnumProcessInstanceSortField, ProcessInstance, ProcessInstanceDetails } from 'model/bpm-process-instance';
import { PageRequest, Sorting, PageResult } from 'model/response';

// Helper thunk result type
type ThunkResult<R> = ThunkAction<Promise<R>, RootState, unknown, ProcessInstanceActions>;

export const countProcessInstances = (): ThunkResult<number | null> => async (dispatch, getState) => {
  dispatch(countProcessInstancesInit());
  // Get response
  const api = new ProcessInstanceApi();

  const response = await api.count();

  // Update state
  if (response.data.success) {

    dispatch(countProcessInstancesComplete(response.data.result));
    return response.data.result;
  }

  dispatch(countProcessInstancesFailure());
  return null;
}

export const find = (
  pageRequest?: PageRequest, sorting?: Sorting<EnumProcessInstanceSortField>[]
): ThunkResult<PageResult<ProcessInstance> | null> => async (dispatch, getState) => {
  // Get query form state (filters are always set synchronously)
  const query = getState().workflow.instances.query;

  // Update sorting or use the existing value
  if (sorting) {
    dispatch(setSorting(sorting));
  } else {
    sorting = getState().workflow.instances.sorting;
  }

  // Update page or user the existing value (i.e. data page refresh)
  if (pageRequest) {
    const { page, size } = pageRequest;

    dispatch(setPager(page, size));
  } else {
    pageRequest = getState().workflow.instances.pagination
  }

  // Initialize search
  dispatch(searchInit());

  // Get response
  const api = new ProcessInstanceApi();

  const response = await api.find(query, pageRequest, sorting);

  // Update state
  if (response.data.success) {
    dispatch(searchComplete(response.data.result));
    return response.data.result;
  }

  dispatch(searchFailure());
  return null;
}

export const findOne = (processInstance: string): ThunkResult<ProcessInstanceDetails | null> => async (dispatch, getState) => {
  dispatch(loadInit(processInstance));
  // Get response
  const api = new ProcessInstanceApi();

  const response = await api.findOne(processInstance);

  // Update state
  if (response.data.success) {
    dispatch(loadSuccess(response.data.result));
    return response.data.result;
  }

  dispatch(loadFailure());
  return null;
}
