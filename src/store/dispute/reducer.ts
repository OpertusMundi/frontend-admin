import moment from 'utils/moment-localized';

import { Order } from 'model/response';
import { EnumDisputeSortField } from 'model/dispute';

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
  SET_SORTING,
  SEARCH_FAILURE,
  DisputeActions,
  DisputeManagerState,
} from 'store/dispute/types';

const initialState: DisputeManagerState = {
  lastUpdated: null,
  loading: false,
  pagination: {
    page: 0,
    size: 10,
  },
  query: {
    status: [],
  },
  record: null,
  result: null,
  selected: [],
  sorting: [{
    id: EnumDisputeSortField.CREATED_ON,
    order: Order.DESC,
  }],
};

export function disputeReducer(
  state = initialState,
  action: DisputeActions
): DisputeManagerState {

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
        record: null,
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

    default:
      return state;
  }

}
