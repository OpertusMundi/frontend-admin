import { ThunkAction } from 'redux-thunk'

// Redux
import { RootState } from 'store';
import { AccountActions } from './types';
import { searchInit, searchComplete, searchFailure, setSorting, setPager, loadAccountInit, loadAccountSuccess, loadAccountFailure, reviewAccountInit, reviewAccountSuccess, reviewAccountFailure } from './actions';

// Services
import MarketplaceAccountApi from 'service/account-marketplace';

// Model
import { PageRequest, Sorting, PageResult } from 'model/response';
import { EnumMarketplaceAccountSortField, MarketplaceAccount, MarketplaceAccountDetails } from 'model/account-marketplace';

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
    dispatch(searchComplete(response.data.result!));
    return response.data.result!;
  }

  dispatch(searchFailure());
  return null;
}

export const findOne = (key: string): ThunkResult<MarketplaceAccountDetails | null> => async (dispatch, getState) => {
  dispatch(loadAccountInit(key));

  // Get response
  const api = new MarketplaceAccountApi();

  const response = await api.findOne(key);

  // Update state
  if (response.data.success) {
    dispatch(loadAccountSuccess(response.data.result!));
    return response.data.result!;
  }

  dispatch(loadAccountFailure());
  return null;
}

export const review = (
  key: string, acceptChanges: boolean, rejectReason?: string
): ThunkResult<MarketplaceAccountDetails | null> => async (dispatch, getState) => {
  dispatch(reviewAccountInit(key, acceptChanges, rejectReason));

  // Get response
  const api = new MarketplaceAccountApi();

  const response = await api.review(key, acceptChanges, rejectReason);

  // Update state
  if (response.data.success) {
    dispatch(reviewAccountSuccess(response.data.result!));
    return response.data.result!;
  }

  dispatch(reviewAccountFailure());
  return null;
}
