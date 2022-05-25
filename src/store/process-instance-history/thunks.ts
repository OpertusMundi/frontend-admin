import { ThunkAction } from 'redux-thunk'

// Redux
import { RootState } from 'store';
import { ProcessInstanceActions } from './types';
import {
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

// Model
import {
  EnumProcessInstanceHistorySortField,
  ProcessInstance,
  HistoryProcessInstanceDetails,
} from 'model/bpm-process-instance';
import { PageRequest, Sorting, PageResult } from 'model/response';

// Helper thunk result type
type ThunkResult<R> = ThunkAction<Promise<R>, RootState, unknown, ProcessInstanceActions>;

export const find = (
  pageRequest?: PageRequest, sorting?: Sorting<EnumProcessInstanceHistorySortField>[]
): ThunkResult<PageResult<ProcessInstance> | null> => async (dispatch, getState) => {
  // Get query form state (filters are always set synchronously)
  const query = getState().workflow.instances.history.query;

  // Update sorting or use the existing value
  if (sorting) {
    dispatch(setSorting(sorting));
  } else {
    sorting = getState().workflow.instances.history.sorting;
  }

  // Update page or user the existing value (i.e. data page refresh)
  if (pageRequest) {
    const { page, size } = pageRequest;

    dispatch(setPager(page, size));
  } else {
    pageRequest = getState().workflow.instances.history.pagination
  }

  // Initialize search
  dispatch(searchInit());

  // Get response
  const api = new WorkflowApi();

  const response = await api.findHistory(query, pageRequest, sorting);

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
): ThunkResult<HistoryProcessInstanceDetails | null> => async (dispatch, getState) => {
  dispatch(loadInit(businessKey, processInstance));
  // Get response
  const api = new WorkflowApi();

  const response = await api.findOneHistory(businessKey, processInstance);

  // Update state
  if (response.data.success) {
    dispatch(loadSuccess(response.data.result!));
    return response.data.result!;
  }

  dispatch(loadFailure());
  return null;
}
