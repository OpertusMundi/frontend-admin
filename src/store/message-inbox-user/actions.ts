import { Sorting } from 'model/response';
import {
  ClientMessage,
  ClientMessageCommand,
  ClientMessageCollectionResponse,
  ClientMessageThreadResponse,
  EnumMessageSortField,
  MessageQuery,
  ClientContact,
} from 'model/chat';

import {
  MessageActions,
  SET_PAGER,
  RESET_PAGER,
  SET_FILTER,
  RESET_FILTER,
  SEARCH_INIT,
  SEARCH_FAILURE,
  SEARCH_COMPLETE,
  ADD_SELECTED,
  REMOVE_SELECTED,
  SET_SORTING,
  RESET_SELECTED,
  LOAD_THREAD_INIT,
  LOAD_THREAD_FAILURE,
  LOAD_THREAD_SUCCESS,
  COUNT_INIT,
  COUNT_FAILURE,
  COUNT_SUCCESS,
  READ_MESSAGE_INIT,
  READ_MESSAGE_FAILURE,
  READ_MESSAGE_SUCCESS,
  READ_THREAD_INIT,
  READ_THREAD_FAILURE,
  READ_THREAD_SUCCESS,
  SEND_INIT,
  SEND_FAILURE,
  SEND_SUCCESS,
  GET_CONTACTS_INIT,
  GET_CONTACTS_COMPLETE,
} from './types';


// Action Creators
export function setPager(page: number, size: number): MessageActions {
  return {
    type: SET_PAGER,
    page,
    size,
  };
}

export function resetPager(): MessageActions {
  return {
    type: RESET_PAGER,
  };
}

export function setFilter(query: Partial<MessageQuery>): MessageActions {
  return {
    type: SET_FILTER,
    query,
  };
}

export function resetFilter(): MessageActions {
  return {
    type: RESET_FILTER,
  };
}

export function setSorting(sorting: Sorting<EnumMessageSortField>[]): MessageActions {
  return {
    type: SET_SORTING,
    sorting,
  };
}

export function searchInit(): MessageActions {
  return {
    type: SEARCH_INIT,
  };
}

export function searchFailure(): MessageActions {
  return {
    type: SEARCH_FAILURE,
  };
}

export function searchComplete(response: ClientMessageCollectionResponse): MessageActions {
  return {
    type: SEARCH_COMPLETE,
    response,
  };
}

export function addToSelection(selected: ClientMessage[]): MessageActions {
  return {
    type: ADD_SELECTED,
    selected,
  };
}

export function removeFromSelection(removed: ClientMessage[]): MessageActions {
  return {
    type: REMOVE_SELECTED,
    removed,
  };
}

export function resetSelection(): MessageActions {
  return {
    type: RESET_SELECTED,
  };
}

export function loadThreadInit(messageKey: string | null, threadKey: string): MessageActions {
  return {
    type: LOAD_THREAD_INIT,
    messageKey,
    threadKey,
  };
}

export function loadThreadFailure(): MessageActions {
  return {
    type: LOAD_THREAD_FAILURE,
  };
}

export function loadThreadSuccess(response: ClientMessageThreadResponse, messageKey: string): MessageActions {
  return {
    type: LOAD_THREAD_SUCCESS,
    messageKey,
    response,
  };
}

export function countInit(): MessageActions {
  return {
    type: COUNT_INIT,
  };
}

export function countFailure(): MessageActions {
  return {
    type: COUNT_FAILURE,
  };
}

export function countSuccess(count: number): MessageActions {
  return {
    type: COUNT_SUCCESS,
    count,
  };
}

export function readMessageInit(messageKey: string): MessageActions {
  return {
    type: READ_MESSAGE_INIT,
    messageKey,
  };
}

export function readMessageFailure(): MessageActions {
  return {
    type: READ_MESSAGE_FAILURE,
  };
}

export function readMessageSuccess(message: ClientMessage): MessageActions {
  return {
    type: READ_MESSAGE_SUCCESS,
    message,
  };
}

export function readThreadInit(threadKey: string): MessageActions {
  return {
    type: READ_THREAD_INIT,
    threadKey,
  };
}

export function readThreadFailure(): MessageActions {
  return {
    type: READ_THREAD_FAILURE,
  };
}

export function readThreadSuccess(response: ClientMessageThreadResponse): MessageActions {
  return {
    type: READ_THREAD_SUCCESS,
    response,
  };
}

export function sendInit(command: ClientMessageCommand): MessageActions {
  return {
    type: SEND_INIT,
    command,
  };
}

export function sendFailure(): MessageActions {
  return {
    type: SEND_FAILURE,
  };
}

export function sendSuccess(message: ClientMessage): MessageActions {
  return {
    type: SEND_SUCCESS,
    message,
  };
}

export function getContactsInit(): MessageActions {
  return {
    type: GET_CONTACTS_INIT,
  };
}

export function getContactsComplete(contacts: ClientContact[]): MessageActions {
  return {
    type: GET_CONTACTS_COMPLETE,
    contacts,
  };
}