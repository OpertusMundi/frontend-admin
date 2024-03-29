import _ from 'lodash';

import moment from 'utils/moment-localized';

import { Order } from 'model/response';
import { EnumMessageSortField, EnumMessageView } from 'model/chat';

import {
  LOGOUT_INIT,
} from 'store/security/types';

import {
  SET_PAGER,
  RESET_PAGER,
  SET_FILTER,
  RESET_FILTER,
  SEARCH_INIT,
  SEARCH_COMPLETE,
  ADD_SELECTED,
  REMOVE_SELECTED,
  RESET_SELECTED,
  SET_SORTING,
  SEARCH_FAILURE,
  LOAD_THREAD_INIT,
  LOAD_THREAD_FAILURE,
  LOAD_THREAD_SUCCESS,
  COUNT_SUCCESS,
  READ_MESSAGE_INIT,
  READ_MESSAGE_FAILURE,
  READ_MESSAGE_SUCCESS,
  SEND_INIT,
  SEND_FAILURE,
  SEND_SUCCESS,
  MessageActions,
  MessageManagerState,
  GET_CONTACTS_INIT,
  GET_CONTACTS_COMPLETE,
  READ_THREAD_INIT,
  READ_THREAD_FAILURE,
  READ_THREAD_SUCCESS,
} from './types';

const initialState: MessageManagerState = {
  activeMessage: null,
  count: 0,
  contacts: [],
  lastUpdated: null,
  loading: false,
  pagination: {
    page: 0,
    size: 10,
  },
  query: {
    view: EnumMessageView.ALL,
  },
  messages: null,
  thread: null,
  selectedMessages: [],
  selectedThread: null,
  sorting: [{
    id: EnumMessageSortField.DATE_RECEIVED,
    order: Order.ASC,
  }]
};

export function userInboxReducer(
  state = initialState,
  action: MessageActions
): MessageManagerState {

  switch (action.type) {
    case LOGOUT_INIT:
      return {
        ...initialState
      };

    case SET_PAGER:
      return {
        ...state,
        pagination: {
          page: action.page,
          size: action.size,
        },
      };

    case RESET_PAGER:
      return {
        ...state,
        pagination: {
          ...initialState.pagination
        },
        selectedMessages: [],
      };

    case SET_FILTER: {
      return {
        ...state,
        query: {
          ...state.query,
          ...action.query,
        },
      };
    }

    case RESET_FILTER:
      return {
        ...state,
        query: {
          ...initialState.query
        },
        selectedMessages: [],
      };

    case SET_SORTING:
      return {
        ...state,
        sorting: action.sorting,
      };

    case SEARCH_INIT:
      return {
        ...state,
        loading: true,
      };

    case SEARCH_FAILURE:
      return {
        ...state,
        pagination: {
          page: 0,
          size: state.pagination.size,
        },
        lastUpdated: moment(),
        loading: false,
      };

    case SEARCH_COMPLETE: {
      const messages = action.response.result?.items || [];
      const activeMessage = messages.find(m => m.id === state.activeMessage) || null;

      return {
        ...state,
        activeMessage: activeMessage?.id || null,
        messages: action.response,
        pagination: {
          page: action.response.result!.pageRequest.page,
          size: action.response.result!.pageRequest.size,
        },
        // Preserve selection if message exists in the result
        selectedMessages: state.selectedMessages.filter(m1 => !!messages.find(m2 => m1.id === m2.id)),
        selectedThread: activeMessage === null ? null : state.selectedThread,
        thread: activeMessage === null ? null : state.thread,
        lastUpdated: moment(),
        loading: false,
      };
    }

    case ADD_SELECTED:
      return {
        ...state,
        selectedMessages: _.uniqBy([...state.selectedMessages, ...action.selected], 'id'),
      };

    case REMOVE_SELECTED:
      return {
        ...state,
        selectedMessages: state.selectedMessages.filter(s => !action.removed.some(r => r.id === s.id)),
      };

    case RESET_SELECTED:
      return {
        ...state,
        selectedMessages: [],
      };

    case LOAD_THREAD_INIT:
      return {
        ...state,
        activeMessage: action.messageKey,
        loading: true,
        selectedThread: action.threadKey,
        thread: state.selectedThread === action.threadKey ? state.thread : null,
      };

    case LOAD_THREAD_FAILURE:
      return {
        ...state,
        loading: false,
        selectedThread: null,
        thread: null,
      };

    case LOAD_THREAD_SUCCESS:
      return {
        ...state,
        loading: false,
        activeMessage: action.messageKey,
        selectedMessages: action.response.result?.messages.filter(m => m.id === action.messageKey) || [],
        thread: action.response,
      };

    case COUNT_SUCCESS:
      return {
        ...state,
        count: action.count
      };

    case READ_MESSAGE_INIT:
      return {
        ...state,
        loading: true,
      };

    case READ_MESSAGE_FAILURE:
      return {
        ...state,
        loading: false,
      };

    case READ_MESSAGE_SUCCESS:
      return {
        ...state,
        loading: false,
        thread: state.thread ? {
          ...state.thread,
          result: state.thread.result ? {
            ...state.thread.result,
            messages: state.thread.result!.messages.map((m) =>
              m.id === action.message.id ? action.message : m
            ),
          } : undefined,
        } : null,
        messages: state.messages ? {
          ...state.messages,
          result: state.messages.result ? {
            ...state.messages.result,
            items: state.messages.result!.items.map((m) =>
              m.id === action.message.id ? action.message : m
            )
          } : undefined,
        } : null,
      };

    case READ_THREAD_INIT:
      return {
        ...state,
        loading: true,
      };

    case READ_THREAD_FAILURE:
      return {
        ...state,
        loading: false,
      };

    case READ_THREAD_SUCCESS: {
      const lastMessage = action.response.result!.messages[action.response.result!.messages.length - 1];
      return {
        ...state,
        loading: false,
        thread: action.response,
        messages: state.messages ? {
          ...state.messages,
          result: state.messages.result ? {
            ...state.messages.result,
            items: state.messages.result!.items.map((m) =>
              m.id === lastMessage.id ? lastMessage : m
            )
          } : undefined,
        } : null,
      };
    }

    case SEND_INIT:
      return {
        ...state,
        loading: true,
      };

    case SEND_FAILURE:
      return {
        ...state,
        loading: false,
      };

    case SEND_SUCCESS:
      return {
        ...state,
        loading: false,
      };

    case GET_CONTACTS_INIT:
      return {
        ...state,
        loading: true,
      }

    case GET_CONTACTS_COMPLETE: {
      const contact = state.query.contact;

      return {
        ...state,
        contacts: action.contacts,
        query: {
          ...state.query,
          contact: contact && action.contacts.find(c => c.id === contact) ? contact : null,
        }
      }
    }

    default:
      return state;
  }

}
