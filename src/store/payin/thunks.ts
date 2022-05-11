import { ThunkAction } from 'redux-thunk'

// Redux
import { RootState } from 'store';
import { PayInActions } from './types';
import {
  searchInit, searchComplete, searchFailure, setSorting, setPager,
  loadPayInInit, loadPayInSuccess, loadPayInFailure,
} from './actions';

// Services
import PayInApi from 'service/payin';

// Model
import { PageRequest, Sorting, PageResult } from 'model/response';
import { EnumPayInSortField, PayIn, PayInType } from 'model/order';

// Helper thunk result type
type ThunkResult<R> = ThunkAction<Promise<R>, RootState, unknown, PayInActions>;

export const find = (
  pageRequest?: PageRequest, sorting?: Sorting<EnumPayInSortField>[]
): ThunkResult<PageResult<PayIn> | null> => async (dispatch, getState) => {
  // Get query form state (filters are always set synchronously)
  const query = getState().billing.payin.query;

  // Update sorting or use the existing value
  if (sorting) {
    dispatch(setSorting(sorting));
  } else {
    sorting = getState().billing.payin.sorting;
  }

  // Update page or user the existing value (i.e. data page refresh)
  if (pageRequest) {
    const { page, size } = pageRequest;

    dispatch(setPager(page, size));
  } else {
    pageRequest = getState().billing.payin.pagination
  }

  // Initialize search
  dispatch(searchInit());

  // Get response
  const api = new PayInApi();

  const response = await api.find(query, pageRequest, sorting);

  // Update state
  if (response.data.success) {
    dispatch(searchComplete(response.data.result!));
    return response.data.result!;
  }

  dispatch(searchFailure());
  return null;
}

export const findOne = (key: string): ThunkResult<PayInType | null> => async (dispatch, getState) => {
  dispatch(loadPayInInit(key));

  // Get response
  const api = new PayInApi();

  const response = await api.findOne(key);

  // Update state
  if (response.data.success) {
    dispatch(loadPayInSuccess(response.data.result!));
    return response.data.result!;
  }

  dispatch(loadPayInFailure());
  return null;
}
