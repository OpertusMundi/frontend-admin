import moment from 'utils/moment-localized';

import { Order } from 'model/response';

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
  LOAD_RECORD_INIT,
  LOAD_RECORD_SUCCESS,
  LOAD_RECORD_FAILURE,
  SubscriptionBillingBatchActions,
  SubscriptionBillingBatchManagerState,
} from 'store/subscription-billing/types';
import {
  EnumSubscriptionBillingBatchSortField,
} from 'model/subscription-billing';

const initialState: SubscriptionBillingBatchManagerState = {
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
    id: EnumSubscriptionBillingBatchSortField.UPDATED_ON,
    order: Order.DESC,
  }],
};

export function subscriptionBillingReducer(
  state = initialState,
  action: SubscriptionBillingBatchActions
): SubscriptionBillingBatchManagerState {

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

    case LOAD_RECORD_INIT:
    case LOAD_RECORD_FAILURE:
      return {
        ...state,
        record: null,
      };

    case LOAD_RECORD_SUCCESS:
      return {
        ...state,
        record: action.record,
      };

    default:
      return state;
  }

}
