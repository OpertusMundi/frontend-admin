import { Sorting, ObjectResponse, SimpleResponse } from 'model/response';
import { ClientContact } from 'model/chat';
import {
  EnumMasterContractSortField,
  MasterContract,
  MasterContractHistory,
  MasterContractHistoryResult,
  MasterContractQuery,
  MasterContractViewModel,
} from 'model/contract';

import {
  ContractActions,
  SET_PAGER,
  RESET_PAGER,
  SET_FILTER,
  RESET_FILTER,
  SEARCH_INIT,
  SEARCH_FAILURE,
  SEARCH_SUCCESS,
  CREATE_DRAFT,
  LOAD_INIT,
  LOAD_FAILURE,
  LOAD_SUCCESS,
  ADD_SELECTED,
  REMOVE_SELECTED,
  SET_SORTING,
  RESET_SELECTED,
  SAVE_INIT,
  SAVE_COMPLETE,
  TOGGLE_PROVIDER_DIALOG,
  GET_PROVIDERS_INIT,
  GET_PROVIDERS_COMPLETE,
  SET_PROVIDER,
  MODIFY_CONTRACT,
} from './types';

// Action Creators
export function setPager(page: number, size: number): ContractActions {
  return {
    type: SET_PAGER,
    page,
    size,
  };
}

export function resetPager(): ContractActions {
  return {
    type: RESET_PAGER,
  };
}

export function setFilter(query: Partial<MasterContractQuery>): ContractActions {
  return {
    type: SET_FILTER,
    query,
  };
}

export function resetFilter(): ContractActions {
  return {
    type: RESET_FILTER,
  };
}

export function setSorting(sorting: Sorting<EnumMasterContractSortField>[]): ContractActions {
  return {
    type: SET_SORTING,
    sorting,
  };
}

export function searchInit(): ContractActions {
  return {
    type: SEARCH_INIT,
  };
}

export function searchFailure(response: SimpleResponse): ContractActions {
  return {
    type: SEARCH_FAILURE,
    response,
  };
}

export function searchSuccess(result: MasterContractHistoryResult): ContractActions {
  return {
    type: SEARCH_SUCCESS,
    result,
  };
}

export function createDraft(): ContractActions {
  return {
    type: CREATE_DRAFT,
  };
}

export function loadInit(): ContractActions {
  return {
    type: LOAD_INIT,
  };
}

export function loadFailure(response: SimpleResponse): ContractActions {
  return {
    type: LOAD_FAILURE,
    response,
  };
}

export function loadSuccess(contract: MasterContract): ContractActions {
  return {
    type: LOAD_SUCCESS,
    contract,
  };
}

export function modifyContract(contractViewModel: Partial<MasterContractViewModel>): ContractActions {
  return {
    type: MODIFY_CONTRACT,
    contractViewModel,
  };
}

export function saveInit(): ContractActions {
  return {
    type: SAVE_INIT,
  };
}

export function saveComplete(response: ObjectResponse<MasterContract>): ContractActions {
  return {
    type: SAVE_COMPLETE,
    response,
  };
}

export function addToSelection(selected: MasterContractHistory[]): ContractActions {
  return {
    type: ADD_SELECTED,
    selected,
  };
}

export function removeFromSelection(removed: MasterContractHistory[]): ContractActions {
  return {
    type: REMOVE_SELECTED,
    removed,
  };
}

export function resetSelection(): ContractActions {
  return {
    type: RESET_SELECTED,
  };
}

export function toggleProviderDialog(): ContractActions {
  return {
    type: TOGGLE_PROVIDER_DIALOG,
  };
}

export function getProvidersInit(): ContractActions {
  return {
    type: GET_PROVIDERS_INIT,
  };
}

export function getProvidersComplete(providers: ClientContact[]): ContractActions {
  return {
    type: GET_PROVIDERS_COMPLETE,
    providers,
  };
}

export function setProvider(provider: ClientContact | null): ContractActions {
  return {
    type: SET_PROVIDER,
    provider,
  };
}
