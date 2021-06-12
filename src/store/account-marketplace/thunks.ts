import { ThunkAction } from 'redux-thunk'

// Redux
import { RootState } from 'store';
import { AccountActions } from './types';
import { searchInit, searchComplete, searchFailure, setSorting, setPager } from './actions';

// Services
import MarketplaceAccountApi from 'service/account-marketplace';

// Model
import { PageRequest, Sorting, PageResult } from 'model/response';
import { EnumMarketplaceAccountSortField, MarketplaceAccount } from 'model/account';

// Helper thunk result type
type ThunkResult<R> = ThunkAction<Promise<R>, RootState, unknown, AccountActions>;

export const find = (
  pageRequest?: PageRequest, sorting?: Sorting<EnumMarketplaceAccountSortField>[]
): ThunkResult<PageResult<MarketplaceAccount> | null> => async (dispatch, getState) => {
  // Get query form state (filters are always set synchronously)
  const query = getState().account.marketplace.query;

  // Update sorting or use the existing value
  if (sorting) {
    dispatch(setSorting(sorting));
  } else {
    sorting = getState().account.marketplace.sorting;
  }

  // Update page or user the existing value (i.e. data page refresh)
  if (pageRequest) {
    const { page, size } = pageRequest;

    dispatch(setPager(page, size));
  } else {
    pageRequest = getState().account.marketplace.pagination
  }

  // Initialize search
  dispatch(searchInit());

  // Get response
  const api = new MarketplaceAccountApi();

  const response = await api.find(query, pageRequest, sorting);

  // Update state
  if (response.data.success) {
    dispatch(searchComplete(response.data.result));
    return response.data.result;
  }

  dispatch(searchFailure());
  return null;
}
