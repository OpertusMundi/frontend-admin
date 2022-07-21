import { Moment } from 'moment';

import { LogoutInitAction } from 'store/security/types';
import { PageRequest, Sorting } from 'model/response';
import {
  EnumMessageSortField,
  MessageQuery,
  ClientMessage,
  ClientMessageCommand,
  ClientMessageThreadResponse,
  ClientMessageCollectionResponse,
  ClientContact,
} from 'model/chat';

// State
export interface MessageManagerState {
  activeMessage: string | null;
  contacts: ClientContact[];
  count: number;
  lastUpdated: Moment | null;
  loading: boolean;
  pagination: PageRequest;
  query: Partial<MessageQuery>;
  messages: ClientMessageCollectionResponse | null;
  thread: ClientMessageThreadResponse | null;
  selectedMessages: ClientMessage[];
  selectedThread: string | null;
  sorting: Sorting<EnumMessageSortField>[];
}

// Actions
export const SET_PAGER = 'message/user-inbox/SET_PAGER';
export const RESET_PAGER = 'message/user-inbox/RESET_PAGER';

export const SET_SORTING = 'message/user-inbox/SET_SORTING';

export const SET_FILTER = 'message/user-inbox/SET_FILTER';
export const RESET_FILTER = 'message/user-inbox/RESET_FILTER';

export const SEARCH_INIT = 'message/user-inbox/SEARCH_INIT';
export const SEARCH_FAILURE = 'message/user-inbox/SEARCH_FAILURE';
export const SEARCH_COMPLETE = 'message/user-inbox/SEARCH_COMPLETE';

export const ADD_SELECTED = 'message/user-inbox/ADD_SELECTED';
export const REMOVE_SELECTED = 'message/user-inbox/REMOVE_SELECTED';
export const RESET_SELECTED = 'message/user-inbox/RESET_SELECTED';

export const LOAD_THREAD_INIT = 'message/user-inbox/LOAD_THREAD_INIT';
export const LOAD_THREAD_FAILURE = 'message/user-inbox/LOAD_THREAD_FAILURE';
export const LOAD_THREAD_SUCCESS = 'message/user-inbox/LOAD_THREAD_SUCCESS';

export const COUNT_INIT = 'message/user-inbox/COUNT_INIT';
export const COUNT_FAILURE = 'message/user-inbox/COUNT_FAILURE';
export const COUNT_SUCCESS = 'message/user-inbox/COUNT_SUCCESS';

export const READ_MESSAGE_INIT = 'message/user-inbox/READ_MESSAGE_INIT';
export const READ_MESSAGE_FAILURE = 'message/user-inbox/READ_MESSAGE_FAILURE';
export const READ_MESSAGE_SUCCESS = 'message/user-inbox/READ_MESSAGE_SUCCESS';

export const READ_THREAD_INIT = 'message/user-inbox/READ_THREAD_INIT';
export const READ_THREAD_FAILURE = 'message/user-inbox/READ_THREAD_FAILURE';
export const READ_THREAD_SUCCESS = 'message/user-inbox/READ_THREAD_SUCCESS';

export const SEND_INIT = 'message/user-inbox/SEND_INIT';
export const SEND_FAILURE = 'message/user-inbox/SEND_FAILURE';
export const SEND_SUCCESS = 'message/user-inbox/SEND_SUCCESS';

export const GET_CONTACTS_INIT = 'message/user-inbox/GET_CONTACTS_INIT';
export const GET_CONTACTS_COMPLETE = 'message/user-inbox/GET_CONTACTS_COMPLETE';

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

export interface LoadThreadInitAction {
  type: typeof LOAD_THREAD_INIT;
  messageKey: string | null;
  threadKey: string;
}

export interface LoadThreadCompleteAction {
  type: typeof LOAD_THREAD_SUCCESS;
  messageKey: string;
  response: ClientMessageThreadResponse;
}

export interface LoadThreadFailureAction {
  type: typeof LOAD_THREAD_FAILURE;
}

export interface CountInitAction {
  type: typeof COUNT_INIT;
}

export interface CountCompleteAction {
  type: typeof COUNT_SUCCESS;
  count: number;
}

export interface CountFailureAction {
  type: typeof COUNT_FAILURE;
}

export interface ReadMessageInitAction {
  type: typeof READ_MESSAGE_INIT;
  messageKey: string;
}

export interface ReadMessageCompleteAction {
  type: typeof READ_MESSAGE_SUCCESS
  message: ClientMessage;
}

export interface ReadMessageFailureAction {
  type: typeof READ_MESSAGE_FAILURE;
}

export interface ReadThreadInitAction {
  type: typeof READ_THREAD_INIT;
  threadKey: string;
}

export interface ReadThreadCompleteAction {
  type: typeof READ_THREAD_SUCCESS
  response: ClientMessageThreadResponse;
}

export interface ReadThreadFailureAction {
  type: typeof READ_THREAD_FAILURE;
}


export interface SendInitAction {
  type: typeof SEND_INIT;
  command: ClientMessageCommand;
}

export interface SendCompleteAction {
  type: typeof SEND_SUCCESS;
  message: ClientMessage;
}

export interface SendFailureAction {
  type: typeof SEND_FAILURE;
}

export interface GetContactsInitAction {
  type: typeof GET_CONTACTS_INIT;
}

export interface GetContactsCompleteAction {
  type: typeof GET_CONTACTS_COMPLETE;
  contacts: ClientContact[];
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
  | LoadThreadInitAction
  | LoadThreadCompleteAction
  | LoadThreadFailureAction
  | CountInitAction
  | CountCompleteAction
  | CountFailureAction
  | ReadMessageInitAction
  | ReadMessageCompleteAction
  | ReadMessageFailureAction
  | ReadThreadInitAction
  | ReadThreadCompleteAction
  | ReadThreadFailureAction
  | SendInitAction
  | SendCompleteAction
  | SendFailureAction
  | GetContactsInitAction
  | GetContactsCompleteAction
  ;
