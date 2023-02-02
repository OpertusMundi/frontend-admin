import { ThunkAction } from 'redux-thunk'

// Redux
import { RootState } from 'store';
import { DashboardActions } from './types';
import { searchInit, searchComplete, searchFailure } from './actions';

// Services
import DashboardApi from 'service/dashboard';

// Model
import { ObjectResponse } from 'model/response';
import { Dashboard } from 'model/dashboard';

// Helper thunk result type
type ThunkResult<R> = ThunkAction<Promise<R>, RootState, unknown, DashboardActions>;

export const getSystemStatus = (): ThunkResult<ObjectResponse<Dashboard> | null> => async (dispatch, getState) => {
  // Initialize search
  dispatch(searchInit());

  // Get response
  const api = new DashboardApi();

  const response = await api.getSystemStatus();

  // Update state
  if (response.data.success) {
    dispatch(searchComplete(response.data));
    return response.data;
  }

  dispatch(searchFailure());
  return null;
}
