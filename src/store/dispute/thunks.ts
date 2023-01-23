import { ThunkAction } from 'redux-thunk'

// Redux
import { RootState } from 'store';
import { DisputeActions } from './types';
import {
  searchInit, searchComplete, searchFailure, setSorting, setPager,
} from './actions';

// Services
import DisputeApi from 'service/dispute';

// Model
import { PageRequest, Sorting, PageResult } from 'model/response';
import { EnumDisputeSortField, Dispute } from 'model/dispute';

// Helper thunk result type
type ThunkResult<R> = ThunkAction<Promise<R>, RootState, unknown, DisputeActions>;

export const find = (
  pageRequest?: PageRequest, sorting?: Sorting<EnumDisputeSortField>[]
): ThunkResult<PageResult<Dispute> | null> => async (dispatch, getState) => {
  // Get query form state (filters are always set synchronously)
  const query = getState().billing.dispute.query;

  // Update sorting or use the existing value
  if (sorting) {
    dispatch(setSorting(sorting));
  } else {
    sorting = getState().billing.dispute.sorting;
  }

  // Update page or user the existing value (i.e. data page refresh)
  if (pageRequest) {
    const { page, size } = pageRequest;

    dispatch(setPager(page, size));
  } else {
    pageRequest = getState().billing.dispute.pagination
  }

  // Initialize search
  dispatch(searchInit());

  // Get response
  const api = new DisputeApi();

  const response = await api.find(query, pageRequest, sorting);

  // Update state
  if (response.data.success) {
    dispatch(searchComplete(response.data.result!));
    return response.data.result!;
  }

  dispatch(searchFailure());
  return null;
}
