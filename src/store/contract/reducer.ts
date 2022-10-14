import _ from 'lodash';

import moment from 'utils/moment-localized';

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
  ContractActions,
  ContractManagerState,
  SAVE_COMPLETE,
  SAVE_INIT,
  SET_SELECTED_CONTRACT,
  SET_SELECTED_CONTRACT_STATE,
  SET_MODIFIED_CONTRACT
} from 'store/contract/types';
import { EnumMasterContractSortField } from 'model/contract';
import { Order } from 'model/response';

const initialState: ContractManagerState = {
  loading: false,
  query: {
    defaultContract: null,
    title: '',
    status: [],
  },
  pagination: {
    page: 0,
    size: 10,
  },
  sorting: [{
    id: EnumMasterContractSortField.MODIFIED_ON,
    order: Order.DESC,
  }],
  result: null,
  selected: [],
  lastUpdated: null,
  response: null,
  contract: null,
  contractId: null,
  state: null
};

export function contractReducer(
  state = initialState,
  action: ContractActions
): ContractManagerState {

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
        response: null,
        loading: true,
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

    case SAVE_INIT:
      return {
        ...state,
        loading: true,
      };

    case SAVE_COMPLETE:
      return {
        ...state,
        response: action.response,
        loading: false,
      }

    case SET_SELECTED_CONTRACT:
      return {
        ...state,
        contract: action.contract,
        loading: false,
      }

    case SET_SELECTED_CONTRACT_STATE:
      return {
        ...state,
        state: action.state,
        loading: false,
      }

    case SET_MODIFIED_CONTRACT:
      return {
        ...state,
        contract: action.contract,
        loading: false,
      }
    default:
      return state;
  }

}
