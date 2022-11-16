import { ThunkAction } from 'redux-thunk'

// Redux
import { RootState } from 'store';
import { DeploymentActions } from './types';
import {
  deleteInit,
  deleteSuccess,
  deleteFailure,
  setSorting,
  searchInit,
  searchComplete,
  searchFailure,
} from './actions';

// Services
import WorkflowApi from 'service/bpm-workflow';

// Model
import {
  Deployment, EnumDeploymentSortField,
} from 'model/bpm-process-instance';
import { Sorting, SimpleResponse } from 'model/response';

// Helper thunk result type
type ThunkResult<R> = ThunkAction<Promise<R>, RootState, unknown, DeploymentActions>;

export const find = (sorting?: Sorting<EnumDeploymentSortField>[]): ThunkResult<Deployment[] | null> => async (dispatch, getState) => {
    // Update sorting or use the existing value
    if (sorting) {
      dispatch(setSorting(sorting));
    } else {
      sorting = getState().workflow.deployments.sorting;
    }


  // Initialize search
  dispatch(searchInit());

  // Get response
  const api = new WorkflowApi();

  const response = await api.getDeployments(sorting);

  // Update state
  if (response.data.success) {
    dispatch(searchComplete(response.data.result!));
    return response.data.result!;
  }

  dispatch(searchFailure());
  return null;
}

export const deleteDeployment = (id: string, cascade: boolean): ThunkResult<SimpleResponse> => async (dispatch, getState) => {
  dispatch(deleteInit(id, cascade));
  // Get response
  const api = new WorkflowApi();

  const response = await api.deleteDeployment(id, cascade);

  // Update state
  if (response.data.success) {
    dispatch(deleteSuccess());
  } else {
    dispatch(deleteFailure());
  }

  return response.data;
}
