import { ThunkAction } from 'redux-thunk'

// Redux
import { RootState } from 'store';
import { OrderActions } from './types';
import {
  searchInit, searchComplete, searchFailure, setSorting, setPager,
  loadOrderInit, loadOrderSuccess, loadOrderFailure,
} from './actions';

// Services
import OrderApi from 'service/order';

// Model
import { PageRequest, Sorting, PageResult } from 'model/response';
import { EnumOrderSortField, Order } from 'model/order';

// Helper thunk result type
type ThunkResult<R> = ThunkAction<Promise<R>, RootState, unknown, OrderActions>;

export const find = (
  pageRequest?: PageRequest, sorting?: Sorting<EnumOrderSortField>[]
): ThunkResult<PageResult<Order> | null> => async (dispatch, getState) => {
  // Get query form state (filters are always set synchronously)
  const query = getState().billing.order.query;

  // Update sorting or use the existing value
  if (sorting) {
    dispatch(setSorting(sorting));
  } else {
    sorting = getState().billing.order.sorting;
  }

  // Update page or user the existing value (i.e. data page refresh)
  if (pageRequest) {
    const { page, size } = pageRequest;

    dispatch(setPager(page, size));
  } else {
    pageRequest = getState().billing.order.pagination
  }

  // Initialize search
  dispatch(searchInit());

  // Get response
  const api = new OrderApi();

  const response = await api.find(query, pageRequest, sorting);

  // Update state
  if (response.data.success) {
    dispatch(searchComplete(response.data.result!));
    return response.data.result!;
  }

  dispatch(searchFailure());
  return null;
}

export const findOne = (key: string): ThunkResult<Order | null> => async (dispatch, getState) => {
  dispatch(loadOrderInit(key));

  // Get response
  const api = new OrderApi();

  const response = await api.findOne(key);

  // Update state
  if (response.data.success) {
    dispatch(loadOrderSuccess(response.data.result!));
    return response.data.result!;
  }

  dispatch(loadOrderFailure());
  return null;
}
