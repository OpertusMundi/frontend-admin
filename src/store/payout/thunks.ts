import { ThunkAction } from 'redux-thunk'

// Redux
import { RootState } from 'store';
import { PayOutActions } from './types';
import {
  searchInit, searchComplete, searchFailure, setSorting, setPager,
  loadPayOutInit, loadPayOutSuccess, loadPayOutFailure,
} from './actions';

// Services
import PayOutApi from 'service/payout';

// Model
import { PageRequest, Sorting, PageResult } from 'model/response';
import { EnumPayOutSortField, PayOut } from 'model/order';

// Helper thunk result type
type ThunkResult<R> = ThunkAction<Promise<R>, RootState, unknown, PayOutActions>;

export const find = (
  pageRequest?: PageRequest, sorting?: Sorting<EnumPayOutSortField>[]
): ThunkResult<PageResult<PayOut> | null> => async (dispatch, getState) => {
  // Get query form state (filters are always set synchronously)
  const query = getState().billing.payout.query;

  // Update sorting or use the existing value
  if (sorting) {
    dispatch(setSorting(sorting));
  } else {
    sorting = getState().billing.payout.sorting;
  }

  // Update page or user the existing value (i.e. data page refresh)
  if (pageRequest) {
    const { page, size } = pageRequest;

    dispatch(setPager(page, size));
  } else {
    pageRequest = getState().billing.payout.pagination
  }

  // Initialize search
  dispatch(searchInit());

  // Get response
  const api = new PayOutApi();

  const response = await api.find(query, pageRequest, sorting);

  // Update state
  if (response.data.success) {
    dispatch(searchComplete(response.data.result!));
    return response.data.result!;
  }

  dispatch(searchFailure());
  return null;
}

export const findOne = (key: string): ThunkResult<PayOut | null> => async (dispatch, getState) => {
  dispatch(loadPayOutInit(key));

  // Get response
  const api = new PayOutApi();

  const response = await api.findOne(key);

  // Update state
  if (response.data.success) {
    dispatch(loadPayOutSuccess(response.data.result!));
    return response.data.result!;
  }

  dispatch(loadPayOutFailure());
  return null;
}
