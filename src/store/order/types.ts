import { Moment } from 'moment';

import { LogoutInitAction } from 'store/security/types';
import { PageResult, PageRequest, Sorting, ObjectResponse } from 'model/response';
import { EnumOrderSortField, Order, OrderQuery } from 'model/order';

// State
export interface OrderManagerState {
  loading: boolean;
  lastUpdated: Moment | null;
  pagination: PageRequest;
  query: OrderQuery;
  result: PageResult<Order> | null;
  selected: Order[];
  sorting: Sorting<EnumOrderSortField>[];
  response: ObjectResponse<Order> | null;
  timeline: {
    order: Order | null,
  }
}

// Actions
export const SET_PAGER = 'order/manager/SET_PAGER';
export const RESET_PAGER = 'order/manager/RESET_PAGER';

export const SET_SORTING = 'order/manager/SET_SORTING';

export const SET_FILTER = 'order/manager/SET_FILTER';
export const RESET_FILTER = 'order/manager/RESET_FILTER';

export const SEARCH_INIT = 'order/manager/SEARCH_INIT';
export const SEARCH_FAILURE = 'order/manager/SEARCH_FAILURE';
export const SEARCH_COMPLETE = 'order/manager/SEARCH_COMPLETE';

export const ADD_SELECTED = 'order/manager/ADD_SELECTED';
export const REMOVE_SELECTED = 'order/manager/REMOVE_SELECTED';
export const RESET_SELECTED = 'order/manager/RESET_SELECTED';

export const LOAD_ORDER_INIT = 'order/manager/LOAD_ORDER_INIT';
export const LOAD_ORDER_SUCCESS = 'order/manager/LOAD_ORDER_SUCCESS';
export const LOAD_ORDER_FAILURE = 'order/manager/LOAD_ORDER_FAILURE';

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
  sorting: Sorting<EnumOrderSortField>[];
}

export interface SetFilterAction {
  type: typeof SET_FILTER;
  query: Partial<OrderQuery>;
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
  result: PageResult<Order>;
}

export interface SetSelectedAction {
  type: typeof ADD_SELECTED;
  selected: Order[];
}

export interface RemoveFromSelectionAction {
  type: typeof REMOVE_SELECTED;
  removed: Order[];
}

export interface ResetSelectionAction {
  type: typeof RESET_SELECTED;
}

export interface LoadOrderInitAction {
  type: typeof LOAD_ORDER_INIT;
  key: string;
}

export interface LoadOrderSuccessAction {
  type: typeof LOAD_ORDER_SUCCESS;
  order: Order;
}

export interface LoadOrderFailureAction {
  type: typeof LOAD_ORDER_FAILURE;
}

export type OrderActions =
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
  | LoadOrderInitAction
  | LoadOrderSuccessAction
  | LoadOrderFailureAction
  ;
