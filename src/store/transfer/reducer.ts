import moment from 'utils/moment-localized';

import { Order } from 'model/response';
import { EnumTransferSortField } from 'model/order';

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
  CREATE_TRANSFER_INIT,
  CREATE_TRANSFER_SUCCESS,
  CREATE_TRANSFER_FAILURE,
  TransferActions,
  TransferManagerState,
} from 'store/transfer/types';

const initialState: TransferManagerState = {
  executingCommand: false,
  loading: false,
  query: {
    referenceNumber: '',
    status: [],
  },
  pagination: {
    page: 0,
    size: 10,
  },
  sorting: [{
    id: EnumTransferSortField.EXECUTED_ON,
    order: Order.DESC,
  }],
  result: null,
  lastUpdated: null,
  response: null,
};

export function transferReducer(
  state = initialState,
  action: TransferActions
): TransferManagerState {

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
      };

    case SET_SORTING:
      return {
        ...state,
        sorting: action.sorting,
      };

    case SEARCH_INIT:
      return {
        ...state,
        response: null,
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

    case CREATE_TRANSFER_INIT:
    case CREATE_TRANSFER_FAILURE:
      return {
        ...state,
        executingCommand: true,
      };

    case CREATE_TRANSFER_SUCCESS:
      return {
        ...state,
        executingCommand: false,
      };

    default:
      return state;
  }

}
