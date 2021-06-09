import { ThunkAction } from 'redux-thunk'

// Redux
import { RootState } from 'store';
import { ProcessInstanceActions } from './types';
import {
  searchInit,
  searchComplete,
  searchFailure,
  setSorting,
  setPager,
} from './actions';

// Services
import WorkflowApi from 'service/workflow';

// Model
import { EnumProcessInstanceSortField, ProcessInstance } from 'model/workflow';
import { PageRequest, Sorting, PageResult } from 'model/response';

// Helper thunk result type
type ThunkResult<R> = ThunkAction<Promise<R>, RootState, unknown, ProcessInstanceActions>;

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
  const api = new WorkflowApi();

  const response = await api.getInstances(query, pageRequest, sorting);

  // Update state
  if (response.data.success) {
    dispatch(searchComplete(response.data.result));
    return response.data.result;
  }

  dispatch(searchFailure());
  return null;
}
