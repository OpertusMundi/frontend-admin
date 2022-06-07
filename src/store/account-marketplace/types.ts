import { Moment } from 'moment';

import { LogoutInitAction } from 'store/security/types';
import { PageResult, PageRequest, Sorting, ObjectResponse } from 'model/response';
import {
  EnumMarketplaceAccountSortField,
  MarketplaceAccountQuery,
  MarketplaceAccount,
  MarketplaceAccountSummary,
} from 'model/account-marketplace';

// State
export interface MarketplaceAccountManagerState {
  account: MarketplaceAccount | null;
  lastUpdated: Moment | null;
  loading: boolean;
  pagination: PageRequest;
  query: MarketplaceAccountQuery;
  response: ObjectResponse<MarketplaceAccount> | null;
  result: PageResult<MarketplaceAccountSummary> | null;
  selected: MarketplaceAccountSummary[];
  sorting: Sorting<EnumMarketplaceAccountSortField>[];
}

// Actions
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
  ;
