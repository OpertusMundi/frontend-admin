import { ThunkAction } from 'redux-thunk'

// Redux
import { RootState } from 'store';
import { AccountActions } from './types';
import {
  searchInit,
  searchComplete,
  searchFailure,
  setSorting,
  setPager,
  loadAccountInit,
  loadAccountSuccess,
  loadAccountFailure,
  setExternalProviderInit,
  setExternalProviderComplete,
  setOrderSorting,
  setOrderPager,
  searchOrderComplete,
  searchOrderFailure,
  setPayInSorting,
  setPayInPager,
  searchPayInComplete,
  searchPayInFailure,
  setTransferSorting,
  setTransferPager,
  searchTransferComplete,
  searchTransferFailure,
  setPayOutSorting,
  setPayOutPager,
  searchPayOutComplete,
  searchPayOutFailure,
  setSubscriptionSorting,
  setSubscriptionPager,
  searchSubscriptionComplete,
  searchSubscriptionFailure,
} from './actions';

// Services
import MarketplaceAccountApi from 'service/account-marketplace';
import ConsumerBillingApi from 'service/billing-consumer';
import ProviderBillingApi from 'service/billing-provider';

// Model
import { PageRequest, Sorting, PageResult, ObjectResponse } from 'model/response';
import {
  AccountSubscription,
  EnumMarketplaceAccountSortField,
  EnumSubscriptionSortField,
  ExternalProviderCommand,
  MarketplaceAccount,
  MarketplaceAccountSummary,
  SubscriptionQuery,
} from 'model/account-marketplace';
import {
  EnumOrderSortField,
  EnumPayInSortField,
  EnumPayOutSortField,
  EnumTransferSortField,
  Order,
  OrderQuery,
  PayIn,
  PayInItem,
  PayInQuery,
  PayOut,
  PayOutQuery,
  TransferQuery,
} from 'model/order';

// Helper thunk result type
type ThunkResult<R> = ThunkAction<Promise<R>, RootState, unknown, AccountActions>;

export const find = (
  pageRequest?: PageRequest, sorting?: Sorting<EnumMarketplaceAccountSortField>[]
): ThunkResult<PageResult<MarketplaceAccountSummary> | null> => async (dispatch, getState) => {
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

export const findOne = (key: string, tabIndex: number | null): ThunkResult<ObjectResponse<MarketplaceAccount>> => async (dispatch, getState) => {
  dispatch(loadAccountInit(key));

  // Get response
  const api = new MarketplaceAccountApi();

  const response = await api.findOne(key);

  // Update state
  if (response.data.success) {
    dispatch(loadAccountSuccess(response.data.result!, tabIndex));
  } else {
    dispatch(loadAccountFailure());
  }
  return response.data;
}

export const setExternalProvider = (
  key: string, command: ExternalProviderCommand
): ThunkResult<ObjectResponse<MarketplaceAccount>> => async (dispatch, getState) => {
  dispatch(setExternalProviderInit());

  // Get response
  const api = new MarketplaceAccountApi();

  const response = await api.setExternalProvider(key, command);

  // Update state
  dispatch(setExternalProviderComplete(response.data));

  return response.data;
}

export const findOrders = (
  pageRequest?: PageRequest, sorting?: Sorting<EnumOrderSortField>[]
): ThunkResult<PageResult<Order> | null> => async (dispatch, getState) => {
  // Get query form state (filters are always set synchronously)
  const query: Partial<OrderQuery> = {
    consumerKey: getState().account.marketplace.account?.key,
  }

  // Update sorting or use the existing value
  if (sorting) {
    dispatch(setOrderSorting(sorting));
  } else {
    sorting = getState().account.marketplace.orders.sorting;
  }

  // Update page or user the existing value (i.e. data page refresh)
  if (pageRequest) {
    const { page, size } = pageRequest;

    dispatch(setOrderPager(page, size));
  } else {
    pageRequest = getState().account.marketplace.orders.pagination;
  }

  // Initialize search
  dispatch(searchInit());

  // Get response
  const api = new ConsumerBillingApi();

  const response = await api.findOrders(query, pageRequest, sorting);

  // Update state
  if (response.data.success) {
    dispatch(searchOrderComplete(response.data.result!));
    return response.data.result!;
  }

  dispatch(searchOrderFailure());
  return null;
}

export const findPayIns = (
  pageRequest?: PageRequest, sorting?: Sorting<EnumPayInSortField>[]
): ThunkResult<PageResult<PayIn> | null> => async (dispatch, getState) => {
  // Get query form state (filters are always set synchronously)
  const query: Partial<PayInQuery> = {
    consumerKey: getState().account.marketplace.account?.key,
  }

  // Update sorting or use the existing value
  if (sorting) {
    dispatch(setPayInSorting(sorting));
  } else {
    sorting = getState().account.marketplace.payins.sorting;
  }

  // Update page or user the existing value (i.e. data page refresh)
  if (pageRequest) {
    const { page, size } = pageRequest;

    dispatch(setPayInPager(page, size));
  } else {
    pageRequest = getState().account.marketplace.payins.pagination;
  }

  // Initialize search
  dispatch(searchInit());

  // Get response
  const api = new ConsumerBillingApi();

  const response = await api.findPayIns(query, pageRequest, sorting);

  // Update state
  if (response.data.success) {
    dispatch(searchPayInComplete(response.data.result!));
    return response.data.result!;
  }

  dispatch(searchPayInFailure());
  return null;
}

export const findTransfers = (
  pageRequest?: PageRequest, sorting?: Sorting<EnumTransferSortField>[]
): ThunkResult<PageResult<PayInItem> | null> => async (dispatch, getState) => {
  // Get query form state (filters are always set synchronously)
  const query: Partial<TransferQuery> = {
    providerKey: getState().account.marketplace.account?.key,
  }

  // Update sorting or use the existing value
  if (sorting) {
    dispatch(setTransferSorting(sorting));
  } else {
    sorting = getState().account.marketplace.transfers.sorting;
  }

  // Update page or user the existing value (i.e. data page refresh)
  if (pageRequest) {
    const { page, size } = pageRequest;

    dispatch(setTransferPager(page, size));
  } else {
    pageRequest = getState().account.marketplace.transfers.pagination;
  }

  // Initialize search
  dispatch(searchInit());

  // Get response
  const api = new ProviderBillingApi();

  const response = await api.findTransfers(query, pageRequest, sorting);

  // Update state
  if (response.data.success) {
    dispatch(searchTransferComplete(response.data.result!));
    return response.data.result!;
  }

  dispatch(searchTransferFailure());
  return null;
}

export const findPayOuts = (
  pageRequest?: PageRequest, sorting?: Sorting<EnumPayOutSortField>[]
): ThunkResult<PageResult<PayOut> | null> => async (dispatch, getState) => {
  // Get query form state (filters are always set synchronously)
  const query: Partial<PayOutQuery> = {
    providerKey: getState().account.marketplace.account?.key,
  }

  // Update sorting or use the existing value
  if (sorting) {
    dispatch(setPayOutSorting(sorting));
  } else {
    sorting = getState().account.marketplace.payouts.sorting;
  }

  // Update page or user the existing value (i.e. data page refresh)
  if (pageRequest) {
    const { page, size } = pageRequest;

    dispatch(setPayOutPager(page, size));
  } else {
    pageRequest = getState().account.marketplace.payouts.pagination;
  }

  // Initialize search
  dispatch(searchInit());

  // Get response
  const api = new ProviderBillingApi();

  const response = await api.findPayOuts(query, pageRequest, sorting);

  // Update state
  if (response.data.success) {
    dispatch(searchPayOutComplete(response.data.result!));
    return response.data.result!;
  }

  dispatch(searchPayOutFailure());
  return null;
}

export const findSubscriptions = (
  pageRequest?: PageRequest, sorting?: Sorting<EnumSubscriptionSortField>[]
): ThunkResult<PageResult<AccountSubscription> | null> => async (dispatch, getState) => {
  // Get query form state (filters are always set synchronously)
  const query: Partial<SubscriptionQuery> = {
    consumerKey: getState().account.marketplace.account?.key,
  }

  // Update sorting or use the existing value
  if (sorting) {
    dispatch(setSubscriptionSorting(sorting));
  } else {
    sorting = getState().account.marketplace.subscriptions.sorting;
  }

  // Update page or user the existing value (i.e. data page refresh)
  if (pageRequest) {
    const { page, size } = pageRequest;

    dispatch(setSubscriptionPager(page, size));
  } else {
    pageRequest = getState().account.marketplace.subscriptions.pagination;
  }

  // Initialize search
  dispatch(searchInit());

  // Get response
  const api = new ConsumerBillingApi();

  const response = await api.findSubscriptions(query, pageRequest, sorting);

  // Update state
  if (response.data.success) {
    dispatch(searchSubscriptionComplete(response.data.result!));
    return response.data.result!;
  }

  dispatch(searchSubscriptionFailure());
  return null;
}
