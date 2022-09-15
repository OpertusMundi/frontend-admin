import { ThunkAction } from 'redux-thunk'

// Redux
import { RootState } from 'store';
import { ProcessInstanceActions } from './types';
import {
  countProcessInstancesComplete,
  countProcessInstancesFailure,
  countProcessInstancesInit,
  deleteInit,
  deleteSuccess,
  deleteFailure,
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
import WorkflowApi from 'service/bpm-workflow';
import { convertMomentToString } from 'utils/moment-utils';

// Model
import {
  ActiveProcessInstanceDetails,
  EnumProcessInstanceSortField,
  ProcessInstance,
} from 'model/bpm-process-instance';
import { PageRequest, Sorting, PageResult, ObjectResponse, SimpleResponse } from 'model/response';

// Helper thunk result type
type ThunkResult<R> = ThunkAction<Promise<R>, RootState, unknown, ProcessInstanceActions>;

export const countProcessInstances = (): ThunkResult<number | null> => async (dispatch, getState) => {
  dispatch(countProcessInstancesInit());
  // Get response
  const api = new WorkflowApi();

  const response = await api.countProcessInstances();

  // Update state
  if (response.data.success) {

    dispatch(countProcessInstancesComplete(response.data.result!));
    return response.data.result!;
  }

  dispatch(countProcessInstancesFailure());
  return null;
}

export const find = (
  pageRequest?: PageRequest, sorting?: Sorting<EnumProcessInstanceSortField>[]
): ThunkResult<PageResult<ProcessInstance> | null> => async (dispatch, getState) => {
  // Get query form state (filters are always set synchronously)
  const query = getState().workflow.instances.runtime.query;

  // Update sorting or use the existing value
  if (sorting) {
    dispatch(setSorting(sorting));
  } else {
    sorting = getState().workflow.instances.runtime.sorting;
  }

  // Update page or user the existing value (i.e. data page refresh)
  if (pageRequest) {
    const { page, size } = pageRequest;

    dispatch(setPager(page, size));
  } else {
    pageRequest = getState().workflow.instances.runtime.pagination
  }

  // Initialize search
  dispatch(searchInit());

  // Get response
  const api = new WorkflowApi();

  const response = await api.find(query, pageRequest, sorting);

  // Update state
  if (response.data.success) {
    dispatch(searchComplete(response.data.result!));
    return response.data.result!;
  }

  dispatch(searchFailure());
  return null;
}

export const findOne = (
  businessKey: string | null, processInstance: string | null
): ThunkResult<ObjectResponse<ActiveProcessInstanceDetails>> => async (dispatch, getState) => {
  dispatch(loadInit(businessKey, processInstance));
  // Get response
  const api = new WorkflowApi();

  const response = await api.findOne(businessKey, processInstance);

  // Update state
  if (response.data.success) {
    // Replace Moment objects with ISO strings
    convertMomentToString(response.data.result!.resource);

    dispatch(loadSuccess(response.data.result!));
  } else {
    dispatch(loadFailure());
  }

  return response.data;
}

export const deleteInstance = (processInstance: string): ThunkResult<SimpleResponse> => async (dispatch, getState) => {
  dispatch(deleteInit(processInstance));
  // Get response
  const api = new WorkflowApi();

  const response = await api.deleteProcessInstance(processInstance);

  // Update state
  if (response.data.success) {
    dispatch(deleteSuccess());
  } else {
    dispatch(deleteFailure());
  }

  return response.data;
}
