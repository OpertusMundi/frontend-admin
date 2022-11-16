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
  SEARCH_FAILURE,
  SEARCH_SUCCESS,
  LOAD_INIT,
  LOAD_FAILURE,
  LOAD_SUCCESS,
  ADD_SELECTED,
  REMOVE_SELECTED,
  RESET_SELECTED,
  SET_SORTING,
  ContractActions,
  ContractManagerState,
  SAVE_COMPLETE,
  SAVE_INIT,
  GET_PROVIDERS_INIT,
  GET_PROVIDERS_COMPLETE,
  TOGGLE_PROVIDER_DIALOG,
  SET_PROVIDER,
  CREATE_DRAFT,
  MODIFY_CONTRACT,
} from 'store/contract/types';
import { EnumMasterContractSortField } from 'model/contract';
import { Order } from 'model/response';

const initialState: ContractManagerState = {
  contract: null,
  contractViewModel: null,
  contractId: null,
  contractProvider: null,
  contractProviderDialog: false,
  lastUpdated: null,
  loading: false,
  pagination: {
    page: 0,
    size: 10,
  },
  providers: {
    query: '',
    result: [],
    selected: null,
  },
  query: {
    defaultContract: null,
    title: '',
    status: [],
  },
  response: null,
  result: null,
  selected: [],
  sorting: [{
    id: EnumMasterContractSortField.MODIFIED_ON,
    order: Order.DESC,
  }],
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

    case SEARCH_FAILURE:
      return {
        ...state,
        lastUpdated: moment(),
        loading: false,
      };

    case SEARCH_SUCCESS:
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

    case CREATE_DRAFT:
      return {
        ...state,
        contractViewModel: {
          id: null,
          provider: null,
          title: 'Document title',
          subtitle: 'Document subtitle',
          sections: [],
        },
      };

    case LOAD_INIT:
      return {
        ...state,
        contract: null,
        contractProvider: null,
        loading: true,
      };

    case LOAD_FAILURE:
      return {
        ...state,
        loading: false,
      };

    case LOAD_SUCCESS: {
      const contract = action.contract;

      return {
        ...state,
        contract,
        contractViewModel: {
          id: contract.id,
          provider: contract.provider || null,
          title: contract.title,
          subtitle: contract.subtitle || '',
          sections: [...(contract.sections || [])],
        },
        contractProvider: action.contract.provider || null,
        loading: false,
      };
    }

    case MODIFY_CONTRACT: {
      return {
        ...state,
        contractViewModel: {
          ...state.contractViewModel!,
          ...action.contractViewModel,
        }
      };
    }

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
      };

    case TOGGLE_PROVIDER_DIALOG:
      return {
        ...state,
        contractProviderDialog: !state.contractProviderDialog,
      };

    case GET_PROVIDERS_INIT:
      return {
        ...state,
        loading: true,
      };

    case GET_PROVIDERS_COMPLETE: {
      const { query, selected } = state.providers;

      return {
        ...state,
        providers: {
          query,
          result: action.providers,
          selected: action.providers.find(p => p.id === selected?.id) || null,
        }
      };
    }

    case SET_PROVIDER:
      return {
        ...state,
        contractViewModel: {
          ...state.contractViewModel!,
          provider: action.provider,
        },
      };

    default:
      return state;
  }

}
