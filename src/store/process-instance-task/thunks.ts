import { ThunkAction } from 'redux-thunk'

// Redux
import { RootState } from 'store';
import { ProcessInstanceTaskActions } from './types';
import {
  countProcessInstanceTasksComplete,
  countProcessInstanceTasksFailure,
  countProcessInstanceTasksInit,
  searchInit,
  searchComplete,
  searchFailure,
  setSorting,
  setPager,
  loadInit,
  loadSuccess,
  loadFailure,
} from './actions';

// Services
import WorkflowApi from 'service/bpm-workflow';

// Model
import {
  ActiveProcessInstanceDetails,
  EnumProcessInstanceTaskSortField,
  ProcessInstanceTask,
} from 'model/bpm-process-instance';
import { PageRequest, Sorting, PageResult, ObjectResponse } from 'model/response';

// Helper thunk result type
type ThunkResult<R> = ThunkAction<Promise<R>, RootState, unknown, ProcessInstanceTaskActions>;

export const countTasks = (): ThunkResult<number | null> => async (dispatch, getState) => {
  dispatch(countProcessInstanceTasksInit());
  // Get response
  const api = new WorkflowApi();

  const response = await api.countTasks();

  // Update state
  if (response.data.success) {

    dispatch(countProcessInstanceTasksComplete(response.data.result!));
    return response.data.result!;
  }

  dispatch(countProcessInstanceTasksFailure());
  return null;
}

export const find = (
  pageRequest?: PageRequest, sorting?: Sorting<EnumProcessInstanceTaskSortField>[]
): ThunkResult<PageResult<ProcessInstanceTask> | null> => async (dispatch, getState) => {
  // Get query form state (filters are always set synchronously)
  const query = getState().workflow.tasks.query;

  // Update sorting or use the existing value
  if (sorting) {
    dispatch(setSorting(sorting));
  } else {
    sorting = getState().workflow.tasks.sorting;
  }

  // Update page or user the existing value (i.e. data page refresh)
  if (pageRequest) {
    const { page, size } = pageRequest;

    dispatch(setPager(page, size));
  } else {
    pageRequest = getState().workflow.tasks.pagination
  }

  // Initialize search
  dispatch(searchInit());

  // Get response
  const api = new WorkflowApi();

  const response = await api.findTasks(query, pageRequest, sorting);

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
    dispatch(loadSuccess(response.data.result!));
  } else {
    dispatch(loadFailure());
  }

  return response.data || null
}