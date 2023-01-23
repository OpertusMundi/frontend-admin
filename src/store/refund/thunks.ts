import { ThunkAction } from 'redux-thunk'

// Redux
import { RootState } from 'store';
import { RefundActions } from './types';
import {
  searchInit, searchComplete, searchFailure, setSorting, setPager,
} from './actions';

// Services
import RefundApi from 'service/refund';

// Model
import { PageRequest, Sorting, PageResult } from 'model/response';
import { EnumRefundSortField, Refund } from 'model/refund';

// Helper thunk result type
type ThunkResult<R> = ThunkAction<Promise<R>, RootState, unknown, RefundActions>;

export const find = (
  pageRequest?: PageRequest, sorting?: Sorting<EnumRefundSortField>[]
): ThunkResult<PageResult<Refund> | null> => async (dispatch, getState) => {
  // Get query form state (filters are always set synchronously)
  const query = getState().billing.refund.query;

  // Update sorting or use the existing value
  if (sorting) {
    dispatch(setSorting(sorting));
  } else {
    sorting = getState().billing.refund.sorting;
  }

  // Update page or user the existing value (i.e. data page refresh)
  if (pageRequest) {
    const { page, size } = pageRequest;

    dispatch(setPager(page, size));
  } else {
    pageRequest = getState().billing.refund.pagination
  }

  // Initialize search
  dispatch(searchInit());

  // Get response
  const api = new RefundApi();

  const response = await api.find(query, pageRequest, sorting);

  // Update state
  if (response.data.success) {
    dispatch(searchComplete(response.data.result!));
    return response.data.result!;
  }

  dispatch(searchFailure());
  return null;
}

