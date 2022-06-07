import { ThunkAction } from 'redux-thunk'

// Redux
import { RootState } from 'store';
import { ConsumerActions } from './types';
import { searchInit, searchComplete, searchFailure, setSorting, setPager, loadAccountInit, loadAccountSuccess, loadAccountFailure, } from './actions';

// Services
import MarketplaceAccountApi from 'service/account-marketplace';

// Model
import { PageRequest, Sorting, PageResult } from 'model/response';
import { EnumMarketplaceAccountSortField, MarketplaceAccount, MarketplaceAccountSummary } from 'model/account-marketplace';

// Helper thunk result type
type ThunkResult<R> = ThunkAction<Promise<R>, RootState, unknown, ConsumerActions>;

export const find = (
  pageRequest?: PageRequest, sorting?: Sorting<EnumMarketplaceAccountSortField>[]
): ThunkResult<PageResult<MarketplaceAccountSummary> | null> => async (dispatch, getState) => {
  // Get query form state (filters are always set synchronously)
  const query = getState().account.consumer.query;

  // Update sorting or use the existing value
  if (sorting) {
    dispatch(setSorting(sorting));
  } else {
    sorting = getState().account.consumer.sorting;
  }

  // Update page or user the existing value (i.e. data page refresh)
  if (pageRequest) {
    const { page, size } = pageRequest;

    dispatch(setPager(page, size));
  } else {
    pageRequest = getState().account.consumer.pagination
  }

  // Initialize search
  dispatch(searchInit());

  // Get response
  const api = new MarketplaceAccountApi();

  const response = await api.findConsumers(query, pageRequest, sorting);

  // Update state
  if (response.data.success) {
    dispatch(searchComplete(response.data.result!));
    return response.data.result!;
  }

  dispatch(searchFailure());
  return null;
}

export const findOne = (key: string): ThunkResult<MarketplaceAccount | null> => async (dispatch, getState) => {
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
