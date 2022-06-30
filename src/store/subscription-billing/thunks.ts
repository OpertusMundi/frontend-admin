import { ThunkAction } from 'redux-thunk'

// Redux
import { RootState } from 'store';
import { SubscriptionBillingBatchActions } from './types';
import {
  searchInit, searchComplete, searchFailure, setSorting, setPager,
  loadRecordInit, loadRecordSuccess, loadRecordFailure,
} from './actions';

// Services
import SubscriptionBillingApi from 'service/subscription-billing';

// Model
import { PageRequest, Sorting, PageResult } from 'model/response';
import { EnumSubscriptionBillingBatchSortField, SubscriptionBillingBatch } from 'model/subscription-billing';

// Helper thunk result type
type ThunkResult<R> = ThunkAction<Promise<R>, RootState, unknown, SubscriptionBillingBatchActions>;

export const find = (
  pageRequest?: PageRequest, sorting?: Sorting<EnumSubscriptionBillingBatchSortField>[]
): ThunkResult<PageResult<SubscriptionBillingBatch> | null> => async (dispatch, getState) => {
  // Get query form state (filters are always set synchronously)
  const query = getState().billing.subscriptionBilling.query;

  // Update sorting or use the existing value
  if (sorting) {
    dispatch(setSorting(sorting));
  } else {
    sorting = getState().billing.subscriptionBilling.sorting;
  }

  // Update page or user the existing value (i.e. data page refresh)
  if (pageRequest) {
    const { page, size } = pageRequest;

    dispatch(setPager(page, size));
  } else {
    pageRequest = getState().billing.subscriptionBilling.pagination
  }

  // Initialize search
  dispatch(searchInit());

  // Get response
  const api = new SubscriptionBillingApi();

  const response = await api.find(query, pageRequest, sorting);

  // Update state
  if (response.data.success) {
    dispatch(searchComplete(response.data.result!));
    return response.data.result!;
  }

  dispatch(searchFailure());
  return null;
}

export const findOne = (key: string): ThunkResult<SubscriptionBillingBatch | null> => async (dispatch, getState) => {
  dispatch(loadRecordInit(key));

  // Get response
  const api = new SubscriptionBillingApi();

  const response = await api.findOne(key);

  // Update state
  if (response.data.success) {
    dispatch(loadRecordSuccess(response.data.result!));
    return response.data.result!;
  }

  dispatch(loadRecordFailure());
  return null;
}
