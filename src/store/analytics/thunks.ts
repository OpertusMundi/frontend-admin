import { ThunkAction } from 'redux-thunk'

// Redux
import { RootState } from 'store';
import { AnalyticsActions } from './types';
import { searchInit, searchComplete, searchFailure } from './actions';

// Services
import AnalyticsApi from 'service/analytics';

// Model
import { ObjectResponse } from 'model/response';
import { DataSeries } from 'model/analytics';

// Helper thunk result type
type ThunkResult<R> = ThunkAction<Promise<R>, RootState, unknown, AnalyticsActions>;

export const executeQuery = (): ThunkResult<ObjectResponse<DataSeries> | null> => async (dispatch, getState) => {
  // Get query form state (filters are always set synchronously)
  const query = getState().analytics.query;

  // Initialize search
  dispatch(searchInit());

  // Get response
  const api = new AnalyticsApi();

  const response = await api.executeSalesQuery(query);

  // Update state
  if (response.success) {
    dispatch(searchComplete(response));
    return response;
  }

  dispatch(searchFailure());
  return null;
}
