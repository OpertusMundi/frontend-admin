import { Moment } from 'moment';

import { LogoutInitAction } from 'store/security/types';
import { PageRequest, Sorting } from 'model/response';
import {
  EnumMessageSortField,
  MessageQuery,
  ClientMessage,
  ClientMessageCollectionResponse,
} from 'model/chat';

// State
export interface MessageManagerState {
  count: number;
  lastUpdated: Moment | null;
  loading: boolean;
  pagination: PageRequest;
  query: Partial<MessageQuery>;
  messages: ClientMessageCollectionResponse | null;
  selected: ClientMessage[];
  sorting: Sorting<EnumMessageSortField>[];
}

// Actions
export const SET_PAGER = 'message/helpdesk-inbox/SET_PAGER';
export const RESET_PAGER = 'message/helpdesk-inbox/RESET_PAGER';

export const SET_SORTING = 'message/helpdesk-inbox/SET_SORTING';

export const SET_FILTER = 'message/helpdesk-inbox/SET_FILTER';
export const RESET_FILTER = 'message/helpdesk-inbox/RESET_FILTER';

export const SEARCH_INIT = 'message/helpdesk-inbox/SEARCH_INIT';
export const SEARCH_FAILURE = 'message/helpdesk-inbox/SEARCH_FAILURE';
export const SEARCH_COMPLETE = 'message/helpdesk-inbox/SEARCH_COMPLETE';

export const ADD_SELECTED = 'message/helpdesk-inbox/ADD_SELECTED';
export const REMOVE_SELECTED = 'message/helpdesk-inbox/REMOVE_SELECTED';
export const RESET_SELECTED = 'message/helpdesk-inbox/RESET_SELECTED';

export const ASSIGN_MESSAGE_INIT = 'message/helpdesk-inbox/ASSIGN_MESSAGE_INIT';
export const ASSIGN_MESSAGE_FAILURE = 'message/helpdesk-inbox/ASSIGN_MESSAGE_FAILURE';
export const ASSIGN_MESSAGE_SUCCESS = 'message/helpdesk-inbox/ASSIGN_MESSAGE_SUCCESS';

export const COUNT_INIT = 'message/helpdesk-inbox/COUNT_INIT';
export const COUNT_FAILURE = 'message/helpdesk-inbox/COUNT_FAILURE';
export const COUNT_SUCCESS = 'message/helpdesk-inbox/COUNT_SUCCESS';

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
  sorting: Sorting<EnumMessageSortField>[];
}

export interface SetFilterAction {
  type: typeof SET_FILTER;
  query: Partial<MessageQuery>;
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
  response: ClientMessageCollectionResponse;
}

export interface SetSelectedAction {
  type: typeof ADD_SELECTED;
  selected: ClientMessage[];
}

export interface RemoveFromSelectionAction {
  type: typeof REMOVE_SELECTED;
  removed: ClientMessage[];
}

export interface ResetSelectionAction {
  type: typeof RESET_SELECTED;
}

export interface AssignMessageInitAction {
  type: typeof ASSIGN_MESSAGE_INIT,
  messageKey: string;
}

export interface AssignMessageCompleteAction {
  type: typeof ASSIGN_MESSAGE_SUCCESS,
  message: ClientMessage;
}

export interface AssignMessageFailureAction {
  type: typeof ASSIGN_MESSAGE_FAILURE,
}

export interface CountInitAction {
  type: typeof COUNT_INIT,
}

export interface CountCompleteAction {
  type: typeof COUNT_SUCCESS,
  count: number;
}

export interface CountFailureAction {
  type: typeof COUNT_FAILURE,
}

export type MessageActions =
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
  | AssignMessageInitAction
  | AssignMessageCompleteAction
  | AssignMessageFailureAction
  | CountInitAction
  | CountCompleteAction
  | CountFailureAction
  ;
