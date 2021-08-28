import { Sorting } from 'model/response';
import {
  ClientMessage,
  ClientMessageCollectionResponse,
  EnumMessageSortField,
  MessageQuery,
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
  ASSIGN_MESSAGE_INIT,
  ASSIGN_MESSAGE_FAILURE,
  ASSIGN_MESSAGE_SUCCESS,
  COUNT_INIT,
  COUNT_FAILURE,
  COUNT_SUCCESS,
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

export function assignMessageInit(messageKey: string): MessageActions {
  return {
    type: ASSIGN_MESSAGE_INIT,
    messageKey,
  };
}

export function assignMessageFailure(): MessageActions {
  return {
    type: ASSIGN_MESSAGE_FAILURE,
  };
}

export function assignMessageSuccess(message: ClientMessage): MessageActions {
  return {
    type: ASSIGN_MESSAGE_SUCCESS,
    message,
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