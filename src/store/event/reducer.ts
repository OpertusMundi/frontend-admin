import _ from 'lodash';

import moment from 'utils/moment-localized';

import { Order } from 'model/response';
import { EnumEventLevel, EnumEventSortField } from 'model/event';

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
  EventActions,
  EventManagerState,
  SEARCH_FAILURE,
} from 'store/event/types';

const initialState: EventManagerState = {
  loading: false,
  query: {
    level: [EnumEventLevel.WARN, EnumEventLevel.ERROR],
  },
  pagination: {
    page: 0,
    size: 10,
  },
  sorting: [{
    id: EnumEventSortField.TIMESTAMP,
    order: Order.DESC,
  }],
  result: null,
  selected: [],
  lastUpdated: null,
  response: null,
};

export function eventReducer(
  state = initialState,
  action: EventActions
): EventManagerState {

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
        loading: true,
      };

    case SEARCH_FAILURE:
      return {
        ...state,
        result: null,
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
        result: action.result,
        pagination: {
          page: action.result.pageRequest.page,
          size: action.result.pageRequest.size,
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

    default:
      return state;
  }

}
