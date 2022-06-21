import { Moment } from 'moment';

import { LogoutInitAction } from 'store/security/types';
import { PageResult, PageRequest, Sorting, ObjectResponse } from 'model/response';
import {
  EnumMarketplaceAccountSortField,
  MarketplaceAccountQuery,
  MarketplaceAccount,
  MarketplaceAccountSummary,
  EnumSubscriptionSortField,
  AccountSubscription,
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

// State
export interface MarketplaceAccountManagerState {
  account: MarketplaceAccount | null;
  lastUpdated: Moment | null;
  loading: boolean;
  orders: {
    items: PageResult<Order> | null;
    loaded: boolean;
    pagination: PageRequest;
    query: OrderQuery,
    sorting: Sorting<EnumOrderSortField>[];
  },
  pagination: PageRequest;
  payins: {
    items: PageResult<PayIn> | null;
    loaded: boolean;
    pagination: PageRequest;
    query: PayInQuery,
    sorting: Sorting<EnumPayInSortField>[];
  },
  payouts: {
    items: PageResult<PayOut> | null;
    loaded: boolean;
    pagination: PageRequest;
    query: PayOutQuery,
    sorting: Sorting<EnumPayOutSortField>[];
  },
  query: MarketplaceAccountQuery;
  response: ObjectResponse<MarketplaceAccount> | null;
  result: PageResult<MarketplaceAccountSummary> | null;
  selected: MarketplaceAccountSummary[];
  sorting: Sorting<EnumMarketplaceAccountSortField>[];
  tabIndex: number;
  subscriptions: {
    items: PageResult<AccountSubscription> | null;
    loaded: boolean;
    pagination: PageRequest;
    query: SubscriptionQuery,
    sorting: Sorting<EnumSubscriptionSortField>[];
  },
  transfers: {
    items: PageResult<PayInItem> | null;
    loaded: boolean;
    pagination: PageRequest;
    query: TransferQuery,
    sorting: Sorting<EnumTransferSortField>[];
  },
}

// Actions
export const SET_TAB_INDEX = 'marketplace-account/manager/SET_TAB_INDEX';

export const SET_PAGER = 'marketplace-account/manager/SET_PAGER';
export const RESET_PAGER = 'marketplace-account/manager/RESET_PAGER';
export const SET_SORTING = 'marketplace-account/manager/SET_SORTING';
export const SET_FILTER = 'marketplace-account/manager/SET_FILTER';
export const RESET_FILTER = 'marketplace-account/manager/RESET_FILTER';
export const SEARCH_INIT = 'marketplace-account/manager/SEARCH_INIT';
export const SEARCH_FAILURE = 'marketplace-account/manager/SEARCH_FAILURE';
export const SEARCH_COMPLETE = 'marketplace-account/manager/SEARCH_COMPLETE';

export const ADD_SELECTED = 'marketplace-account/manager/ADD_SELECTED';
export const REMOVE_SELECTED = 'marketplace-account/manager/REMOVE_SELECTED';
export const RESET_SELECTED = 'marketplace-account/manager/RESET_SELECTED';

export const LOAD_ACCOUNT_INIT = 'marketplace-account/manager/LOAD_ACCOUNT_INIT';
export const LOAD_ACCOUNT_FAILURE = 'marketplace-account/manager/LOAD_ACCOUNT_FAILURE';
export const LOAD_ACCOUNT_SUCCESS = 'marketplace-account/manager/LOAD_ACCOUNT_SUCCESS';

export const SET_EXTERNAL_PROVIDER_INIT = 'marketplace-account/manager/SET_EXTERNAL_PROVIDER_INIT';
export const SET_EXTERNAL_PROVIDER_COMPLETE = 'marketplace-account/manager/SET_EXTERNAL_PROVIDER_COMPLETE';

export const ORDER_SET_PAGER = 'marketplace-account/manager/ORDER_SET_PAGER';
export const ORDER_RESET_PAGER = 'marketplace-account/manager/ORDER_RESET_PAGER';
export const ORDER_SET_SORTING = 'marketplace-account/manager/ORDER_SET_SORTING';
export const ORDER_SEARCH_INIT = 'marketplace-account/manager/ORDER_SEARCH_INIT';
export const ORDER_SEARCH_FAILURE = 'marketplace-account/manager/ORDER_SEARCH_FAILURE';
export const ORDER_SEARCH_COMPLETE = 'marketplace-account/manager/ORDER_SEARCH_COMPLETE';

export const PAYIN_SET_PAGER = 'marketplace-account/manager/PAYIN_SET_PAGER';
export const PAYIN_RESET_PAGER = 'marketplace-account/manager/PAYIN_RESET_PAGER';
export const PAYIN_SET_SORTING = 'marketplace-account/manager/PAYIN_SET_SORTING';
export const PAYIN_SEARCH_INIT = 'marketplace-account/manager/PAYIN_SEARCH_INIT';
export const PAYIN_SEARCH_FAILURE = 'marketplace-account/manager/PAYIN_SEARCH_FAILURE';
export const PAYIN_SEARCH_COMPLETE = 'marketplace-account/manager/PAYIN_SEARCH_COMPLETE';

export const TRANSFER_SET_PAGER = 'marketplace-account/manager/TRANSFER_SET_PAGER';
export const TRANSFER_RESET_PAGER = 'marketplace-account/manager/TRANSFER_RESET_PAGER';
export const TRANSFER_SET_SORTING = 'marketplace-account/manager/TRANSFER_SET_SORTING';
export const TRANSFER_SEARCH_INIT = 'marketplace-account/manager/TRANSFER_SEARCH_INIT';
export const TRANSFER_SEARCH_FAILURE = 'marketplace-account/manager/TRANSFER_SEARCH_FAILURE';
export const TRANSFER_SEARCH_COMPLETE = 'marketplace-account/manager/TRANSFER_SEARCH_COMPLETE';

export const PAYOUT_SET_PAGER = 'marketplace-account/manager/PAYOUT_SET_PAGER';
export const PAYOUT_RESET_PAGER = 'marketplace-account/manager/PAYOUT_RESET_PAGER';
export const PAYOUT_SET_SORTING = 'marketplace-account/manager/PAYOUT_SET_SORTING';
export const PAYOUT_SEARCH_INIT = 'marketplace-account/manager/PAYOUT_SEARCH_INIT';
export const PAYOUT_SEARCH_FAILURE = 'marketplace-account/manager/PAYOUT_SEARCH_FAILURE';
export const PAYOUT_SEARCH_COMPLETE = 'marketplace-account/manager/PAYOUT_SEARCH_COMPLETE';

export const SUBSCRIPTION_SET_PAGER = 'marketplace-account/manager/SUBSCRIPTION_SET_PAGER';
export const SUBSCRIPTION_RESET_PAGER = 'marketplace-account/manager/SUBSCRIPTION_RESET_PAGER';
export const SUBSCRIPTION_SET_SORTING = 'marketplace-account/manager/SUBSCRIPTION_SET_SORTING';
export const SUBSCRIPTION_SEARCH_INIT = 'marketplace-account/manager/SUBSCRIPTION_SEARCH_INIT';
export const SUBSCRIPTION_SEARCH_FAILURE = 'marketplace-account/manager/SUBSCRIPTION_SEARCH_FAILURE';
export const SUBSCRIPTION_SEARCH_COMPLETE = 'marketplace-account/manager/SUBSCRIPTION_SEARCH_COMPLETE';

export interface SetPagerAction {
  type: typeof SET_PAGER;
  page: number;
  size: number;
}

export interface ResetPagerAction {
  type: typeof RESET_PAGER
}

export interface SetSortingAction {
  type: typeof SET_SORTING;
  sorting: Sorting<EnumMarketplaceAccountSortField>[];
}

export interface SetFilterAction {
  type: typeof SET_FILTER;
  query: Partial<MarketplaceAccountQuery>;
}

export interface ResetFilterAction {
  type: typeof RESET_FILTER;
}

export interface SearchInitAction {
  type: typeof SEARCH_INIT;
}

export interface SearchFailureAction {
  type: typeof SEARCH_FAILURE;
}

export interface SearchCompleteAction {
  type: typeof SEARCH_COMPLETE;
  result: PageResult<MarketplaceAccountSummary>;
}

export interface SetSelectedAction {
  type: typeof ADD_SELECTED;
  selected: MarketplaceAccountSummary[];
}

export interface RemoveFromSelectionAction {
  type: typeof REMOVE_SELECTED;
  removed: MarketplaceAccountSummary[];
}

export interface ResetSelectionAction {
  type: typeof RESET_SELECTED;
}

export interface LoadAccountInitAction {
  type: typeof LOAD_ACCOUNT_INIT,
  key: string;
}

export interface LoadAccountCompleteAction {
  type: typeof LOAD_ACCOUNT_SUCCESS,
  account: MarketplaceAccount;
  tabIndex: number | null;
}

export interface LoadAccountFailureAction {
  type: typeof LOAD_ACCOUNT_FAILURE,
}

export interface setExternalProviderInitAction {
  type: typeof SET_EXTERNAL_PROVIDER_INIT;
}

export interface setExternalProviderCompleteAction {
  type: typeof SET_EXTERNAL_PROVIDER_COMPLETE;
  response: ObjectResponse<MarketplaceAccount>;
}

export interface SetOrderPagerAction {
  type: typeof ORDER_SET_PAGER;
  page: number;
  size: number;
}

export interface ResetOrderPagerAction {
  type: typeof ORDER_RESET_PAGER
}

export interface SetOrderSortingAction {
  type: typeof ORDER_SET_SORTING;
  sorting: Sorting<EnumOrderSortField>[];
}

export interface SearchOrderInitAction {
  type: typeof ORDER_SEARCH_INIT;
}

export interface SearchOrderFailureAction {
  type: typeof ORDER_SEARCH_FAILURE;
}

export interface SearchOrderCompleteAction {
  type: typeof ORDER_SEARCH_COMPLETE;
  result: PageResult<Order>;
}

export interface SetPayInPagerAction {
  type: typeof PAYIN_SET_PAGER;
  page: number;
  size: number;
}

export interface ResetPayInPagerAction {
  type: typeof PAYIN_RESET_PAGER
}

export interface SetPayInSortingAction {
  type: typeof PAYIN_SET_SORTING;
  sorting: Sorting<EnumPayInSortField>[];
}

export interface SearchPayInInitAction {
  type: typeof PAYIN_SEARCH_INIT;
}

export interface SearchPayInFailureAction {
  type: typeof PAYIN_SEARCH_FAILURE;
}

export interface SearchPayInCompleteAction {
  type: typeof PAYIN_SEARCH_COMPLETE;
  result: PageResult<PayIn>;
}

export interface SetTransferPagerAction {
  type: typeof TRANSFER_SET_PAGER;
  page: number;
  size: number;
}

export interface ResetTransferPagerAction {
  type: typeof TRANSFER_RESET_PAGER
}

export interface SetTransferSortingAction {
  type: typeof TRANSFER_SET_SORTING;
  sorting: Sorting<EnumTransferSortField>[];
}

export interface SearchTransferInitAction {
  type: typeof TRANSFER_SEARCH_INIT;
}

export interface SearchTransferFailureAction {
  type: typeof TRANSFER_SEARCH_FAILURE;
}

export interface SearchTransferCompleteAction {
  type: typeof TRANSFER_SEARCH_COMPLETE;
  result: PageResult<PayInItem>;
}

export interface SetPayOutPagerAction {
  type: typeof PAYOUT_SET_PAGER;
  page: number;
  size: number;
}

export interface ResetPayOutPagerAction {
  type: typeof PAYOUT_RESET_PAGER
}

export interface SetPayOutSortingAction {
  type: typeof PAYOUT_SET_SORTING;
  sorting: Sorting<EnumPayOutSortField>[];
}

export interface SearchPayOutInitAction {
  type: typeof PAYOUT_SEARCH_INIT;
}

export interface SearchPayOutFailureAction {
  type: typeof PAYOUT_SEARCH_FAILURE;
}

export interface SearchPayOutCompleteAction {
  type: typeof PAYOUT_SEARCH_COMPLETE;
  result: PageResult<PayOut>;
}

export interface SetTabIndexAction {
  type: typeof SET_TAB_INDEX;
  tabIndex: number;
}




export interface SetSubscriptionPagerAction {
  type: typeof SUBSCRIPTION_SET_PAGER;
  page: number;
  size: number;
}

export interface ResetSubscriptionPagerAction {
  type: typeof SUBSCRIPTION_RESET_PAGER
}

export interface SetSubscriptionSortingAction {
  type: typeof SUBSCRIPTION_SET_SORTING;
  sorting: Sorting<EnumSubscriptionSortField>[];
}

export interface SearchSubscriptionInitAction {
  type: typeof SUBSCRIPTION_SEARCH_INIT;
}

export interface SearchSubscriptionFailureAction {
  type: typeof SUBSCRIPTION_SEARCH_FAILURE;
}

export interface SearchSubscriptionCompleteAction {
  type: typeof SUBSCRIPTION_SEARCH_COMPLETE;
  result: PageResult<AccountSubscription>;
}

export interface SetTabIndexAction {
  type: typeof SET_TAB_INDEX;
  tabIndex: number;
}

export type AccountActions =
  | LogoutInitAction
  | SetPagerAction
  | ResetPagerAction
  | SetSortingAction
  | SetFilterAction
  | ResetFilterAction
  | SearchInitAction
  | SearchFailureAction
  | SearchCompleteAction
  | SetSelectedAction
  | RemoveFromSelectionAction
  | ResetSelectionAction
  | LoadAccountInitAction
  | LoadAccountCompleteAction
  | LoadAccountFailureAction
  | setExternalProviderInitAction
  | setExternalProviderCompleteAction
  | SetOrderPagerAction
  | ResetOrderPagerAction
  | SetOrderSortingAction
  | SearchOrderInitAction
  | SearchOrderFailureAction
  | SearchOrderCompleteAction
  | SetPayInPagerAction
  | ResetPayInPagerAction
  | SetPayInSortingAction
  | SearchPayInInitAction
  | SearchPayInFailureAction
  | SearchPayInCompleteAction
  | SetTransferPagerAction
  | ResetTransferPagerAction
  | SetTransferSortingAction
  | SearchTransferInitAction
  | SearchTransferFailureAction
  | SearchTransferCompleteAction
  | SetPayOutPagerAction
  | ResetPayOutPagerAction
  | SetPayOutSortingAction
  | SearchPayOutInitAction
  | SearchPayOutFailureAction
  | SearchPayOutCompleteAction
  | SetTabIndexAction
  | SetSubscriptionPagerAction
  | ResetSubscriptionPagerAction
  | SetSubscriptionSortingAction
  | SearchSubscriptionInitAction
  | SearchSubscriptionFailureAction
  | SearchSubscriptionCompleteAction
  | SetTabIndexAction
  ;
