import { Moment } from 'moment';

import { LogoutInitAction } from 'store/security/types';
import { PageResult, PageRequest, Sorting, ObjectResponse } from 'model/response';
import { EnumEventSortField, Event, EventQuery } from 'model/event';

// State
export interface EventManagerState {
  loading: boolean;
  lastUpdated: Moment | null;
  pagination: PageRequest;
  query: Partial<EventQuery>;
  result: PageResult<Event> | null;
  selected: Event[];
  sorting: Sorting<EnumEventSortField>[];
  response: ObjectResponse<Event> | null;
}

// Actions
export const SET_PAGER = 'event/manager/SET_PAGER';
export const RESET_PAGER = 'event/manager/RESET_PAGER';

export const SET_SORTING = 'event/manager/SET_SORTING';

export const SET_FILTER = 'event/manager/SET_FILTER';
export const RESET_FILTER = 'event/manager/RESET_FILTER';

export const SEARCH_INIT = 'event/manager/SEARCH_INIT';
export const SEARCH_FAILURE = 'event/manager/SEARCH_FAILURE';
export const SEARCH_COMPLETE = 'event/manager/SEARCH_COMPLETE';

export const ADD_SELECTED = 'event/manager/ADD_SELECTED';
export const REMOVE_SELECTED = 'event/manager/REMOVE_SELECTED';
export const RESET_SELECTED = 'event/manager/RESET_SELECTED';

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
  sorting: Sorting<EnumEventSortField>[];
}

export interface SetFilterAction {
  type: typeof SET_FILTER;
  query: Partial<EventQuery>;
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
  result: PageResult<Event>;
}

export interface SetSelectedAction {
  type: typeof ADD_SELECTED;
  selected: Event[];
}

export interface RemoveFromSelectionAction {
  type: typeof REMOVE_SELECTED;
  removed: Event[];
}

export interface ResetSelectionAction {
  type: typeof RESET_SELECTED;
}

export type EventActions =
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
  ;
