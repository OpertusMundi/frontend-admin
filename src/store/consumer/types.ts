import { Moment } from 'moment';

import { LogoutInitAction } from 'store/security/types';
import { PageResult, PageRequest, Sorting, ObjectResponse } from 'model/response';
import {
  EnumMarketplaceAccountSortField,
  MarketplaceAccountQuery,
  MarketplaceAccount,
  MarketplaceAccountDetails,
} from 'model/account-marketplace';

// State
export interface MarketplaceAccountManagerState {
  account: MarketplaceAccountDetails | null;
  lastUpdated: Moment | null;
  loading: boolean;
  pagination: PageRequest;
  query: MarketplaceAccountQuery;
  response: ObjectResponse<MarketplaceAccount> | null;
  result: PageResult<MarketplaceAccount> | null;
  selected: MarketplaceAccount[];
  sorting: Sorting<EnumMarketplaceAccountSortField>[];
}

// Actions
export const SET_PAGER = 'consumer/manager/SET_PAGER';
export const RESET_PAGER = 'consumer/manager/RESET_PAGER';

export const SET_SORTING = 'consumer/manager/SET_SORTING';

export const SET_FILTER = 'consumer/manager/SET_FILTER';
export const RESET_FILTER = 'consumer/manager/RESET_FILTER';

export const SEARCH_INIT = 'consumer/manager/SEARCH_INIT';
export const SEARCH_FAILURE = 'consumer/manager/SEARCH_FAILURE';
export const SEARCH_COMPLETE = 'consumer/manager/SEARCH_COMPLETE';

export const ADD_SELECTED = 'consumer/manager/ADD_SELECTED';
export const REMOVE_SELECTED = 'consumer/manager/REMOVE_SELECTED';
export const RESET_SELECTED = 'consumer/manager/RESET_SELECTED';

export const LOAD_ACCOUNT_INIT = 'consumer/manager/LOAD_ACCOUNT_INIT';
export const LOAD_ACCOUNT_FAILURE = 'consumer/manager/LOAD_ACCOUNT_FAILURE';
export const LOAD_ACCOUNT_SUCCESS = 'consumer/manager/LOAD_ACCOUNT_SUCCESS';

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
  result: PageResult<MarketplaceAccount>;
}

export interface SetSelectedAction {
  type: typeof ADD_SELECTED;
  selected: MarketplaceAccount[];
}

export interface RemoveFromSelectionAction {
  type: typeof REMOVE_SELECTED;
  removed: MarketplaceAccount[];
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
  account: MarketplaceAccountDetails;
}

export interface LoadAccountFailureAction {
  type: typeof LOAD_ACCOUNT_FAILURE,
}

export type ConsumerActions =
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
