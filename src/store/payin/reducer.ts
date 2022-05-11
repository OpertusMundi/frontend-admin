import _ from 'lodash';

import moment from 'utils/moment-localized';

import { Order } from 'model/response';
import { EnumPayInSortField } from 'model/order';

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
  LOAD_ORDER_INIT,
  LOAD_ORDER_SUCCESS,
  LOAD_ORDER_FAILURE,
  PayInActions,
  PayInManagerState,
} from 'store/payin/types';

const initialState: PayInManagerState = {
  items: null,
  loading: false,
  query: {
    email: '',
    referenceNumber: '',
    status: [],
  },
  pagination: {
    page: 0,
    size: 10,
  },
  record: null,
  sorting: [{
    id: EnumPayInSortField.MODIFIED_ON,
    order: Order.DESC,
  }],
  selected: [],
  lastUpdated: null,
};

export function payInReducer(
  state = initialState,
  action: PayInActions
): PayInManagerState {

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
        items: null,
        record: null,
        selected: [],
        loading: true,
      };

    case SEARCH_FAILURE:
      return {
        ...state,
        items: null,
        lastUpdated: moment(),
        loading: false,
        pagination: {
          page: 0,
          size: state.pagination.size,
        },
      };

    case SEARCH_COMPLETE:
      return {
        ...state,
        items: action.result,
        lastUpdated: moment(),
        loading: false,
        pagination: {
          page: action.result.pageRequest.page,
          size: action.result.pageRequest.size,
        },
      };

    case ADD_SELECTED:
      return {
        ...state,
        selected: _.uniqBy([...state.selected, ...action.selected], 'id'),
      };

    case REMOVE_SELECTED:
      return {
        ...state,
        selected: state.selected.filter(s => !action.removed.some(r => r.key === s.key)),
      };

    case RESET_SELECTED:
      return {
        ...state,
        selected: [],
      };

    case LOAD_ORDER_INIT:
    case LOAD_ORDER_FAILURE:
      return {
        ...state,
        record: null
      };

    case LOAD_ORDER_SUCCESS:
      return {
        ...state,
        record: action.record,
      };

    default:
      return state;
  }

}
