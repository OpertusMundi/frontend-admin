import { Moment } from 'moment';

import { LogoutInitAction } from 'store/security/types';
import { PageResult, PageRequest, Sorting, ObjectResponse } from 'model/response';
import { EnumTransferSortField, TransferQuery, Transfer, PayInItemType } from 'model/order';

// State
export interface TransferManagerState {
  executingCommand: boolean;
  loading: boolean;
  lastUpdated: Moment | null;
  pagination: PageRequest;
  query: TransferQuery;
  result: PageResult<PayInItemType> | null;
  sorting: Sorting<EnumTransferSortField>[];
  response: ObjectResponse<PayInItemType> | null;
}

// Actions
export const SET_PAGER = 'transfers/manager/SET_PAGER';
export const RESET_PAGER = 'transfers/manager/RESET_PAGER';

export const SET_SORTING = 'transfers/manager/SET_SORTING';

export const SET_FILTER = 'transfers/manager/SET_FILTER';
export const RESET_FILTER = 'transfers/manager/RESET_FILTER';

export const SEARCH_INIT = 'transfers/manager/SEARCH_INIT';
export const SEARCH_FAILURE = 'transfers/manager/SEARCH_FAILURE';
export const SEARCH_COMPLETE = 'transfers/manager/SEARCH_COMPLETE';

export const CREATE_TRANSFER_INIT = 'transfers/manager/CREATE_TRANSFER_INIT';
export const CREATE_TRANSFER_SUCCESS = 'transfers/manager/CREATE_TRANSFER_SUCCESS';
export const CREATE_TRANSFER_FAILURE = 'transfers/manager/CREATE_TRANSFER_FAILURE';

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
  sorting: Sorting<EnumTransferSortField>[];
}

export interface SetFilterAction {
  type: typeof SET_FILTER;
  query: Partial<TransferQuery>;
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
  result: PageResult<PayInItemType>;
}

export interface CreateTransferInitAction {
  type: typeof CREATE_TRANSFER_INIT;
  key: string;
}

export interface CreateTransferSuccessAction {
  type: typeof CREATE_TRANSFER_SUCCESS;
  transfers: Transfer[],
}

export interface CreateTransferFailureAction {
  type: typeof CREATE_TRANSFER_FAILURE;
}

export type TransferActions =
  | LogoutInitAction
  | SetPagerAction
  | ResetPagerAction
  | SetSortingAction
  | SetFilterAction
  | ResetFilterAction
  | SearchInitAction
  | SearchFailureAction
  | SearchCompleteAction
  | CreateTransferInitAction
  | CreateTransferSuccessAction
  | CreateTransferFailureAction
  ;
