import _ from 'lodash';

import moment from 'utils/moment-localized';

import { Order } from 'model/response';
import { EnumMessageSortField } from 'model/chat';

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
  ASSIGN_MESSAGE_INIT,
  ASSIGN_MESSAGE_FAILURE,
  ASSIGN_MESSAGE_SUCCESS,
  COUNT_SUCCESS,
  MessageActions,
  MessageManagerState,
} from './types';

const initialState: MessageManagerState = {
  count: 0,
  lastUpdated: null,
  loading: false,
  pagination: {
    page: 0,
    size: 10,
  },
  query: {},
  messages: null,
  selected: [],
  sorting: [{
    id: EnumMessageSortField.DATE_RECEIVED,
    order: Order.ASC,
  }]
};

export function helpdeskInboxReducer(
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
        selected: [],
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
        selected: [],
      };

    case SET_SORTING:
      return {
        ...state,
        sorting: action.sorting,
      };

    case SEARCH_INIT:
      return {
        ...state,
        selected: [],
        messages: null,
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

    case SEARCH_COMPLETE:
      return {
        ...state,
        count: action.response.result!.count,
        messages: action.response,
        pagination: {
          page: action.response.result!.pageRequest.page,
          size: action.response.result!.pageRequest.size,
        },
        lastUpdated: moment(),
        loading: false,
      };

    case ADD_SELECTED:
      return {
        ...state,
        selected: _.uniqBy([...state.selected, ...action.selected], 'id'),
      };

    case REMOVE_SELECTED:
      return {
        ...state,
        selected: state.selected.filter(s => !action.removed.some(r => r.id === s.id)),
      };

    case RESET_SELECTED:
      return {
        ...state,
        selected: [],
      };

    case ASSIGN_MESSAGE_INIT:
      return {
        ...state,
        loading: true,
      };

    case ASSIGN_MESSAGE_FAILURE:
      return {
        ...state,
        loading: false,
      };

    case ASSIGN_MESSAGE_SUCCESS:
      return {
        ...state,
        loading: true,
      };

    case COUNT_SUCCESS:
      return {
        ...state,
        count: action.count
      };

    default:
      return state;
  }

}
