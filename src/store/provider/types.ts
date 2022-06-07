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
export const SET_PAGER = 'provider/manager/SET_PAGER';
export const RESET_PAGER = 'provider/manager/RESET_PAGER';

export const SET_SORTING = 'provider/manager/SET_SORTING';

export const SET_FILTER = 'provider/manager/SET_FILTER';
export const RESET_FILTER = 'provider/manager/RESET_FILTER';

export const SEARCH_INIT = 'provider/manager/SEARCH_INIT';
export const SEARCH_FAILURE = 'provider/manager/SEARCH_FAILURE';
export const SEARCH_COMPLETE = 'provider/manager/SEARCH_COMPLETE';

export const ADD_SELECTED = 'provider/manager/ADD_SELECTED';
export const REMOVE_SELECTED = 'provider/manager/REMOVE_SELECTED';
export const RESET_SELECTED = 'provider/manager/RESET_SELECTED';

export const LOAD_ACCOUNT_INIT = 'provider/manager/LOAD_ACCOUNT_INIT';
export const LOAD_ACCOUNT_FAILURE = 'provider/manager/LOAD_ACCOUNT_FAILURE';
export const LOAD_ACCOUNT_SUCCESS = 'provider/manager/LOAD_ACCOUNT_SUCCESS';

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
  ;
