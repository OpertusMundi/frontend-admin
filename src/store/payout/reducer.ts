import _ from 'lodash';

import moment from 'utils/moment-localized';

import { Order } from 'model/response';
import { EnumPayOutSortField } from 'model/order';

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
  LOAD_PAYOUT_INIT,
  LOAD_PAYOUT_SUCCESS,
  LOAD_PAYOUT_FAILURE,
  PayOutActions,
  PayOutManagerState,
} from 'store/payout/types';

const initialState: PayOutManagerState = {
  lastUpdated: null,
  loading: false,
  pagination: {
    page: 0,
    size: 10,
  },
  query: {
    bankwireRef: '',
    email: '',
    status: [],
  },
  record: null,
  result: null,
  selected: [],
  sorting: [{
    id: EnumPayOutSortField.MODIFIED_ON,
    order: Order.DESC,
  }],
};

export function payOutReducer(
  state = initialState,
  action: PayOutActions
): PayOutManagerState {

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

    case LOAD_PAYOUT_INIT:
    case LOAD_PAYOUT_FAILURE:
      return {
        ...state,
        record: null,
      };

    case LOAD_PAYOUT_SUCCESS:
      return {
        ...state,
        record: action.record,
      };

    default:
      return state;
  }

}
