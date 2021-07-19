import { PageResult, Sorting, ObjectResponse, SimpleResponse } from 'model/response';
import { EnumMasterContractSortField, MasterContract, MasterContractHistory, MasterContractQuery } from 'model/contract';

import {
  ContractActions,
  SET_PAGER,
  RESET_PAGER,
  SET_FILTER,
  RESET_FILTER,
  SEARCH_INIT,
  SEARCH_FAILURE,
  SEARCH_COMPLETE,
  ADD_SELECTED,
  REMOVE_SELECTED,
  SET_SORTING,
  RESET_SELECTED,
  SAVE_INIT,
  SAVE_COMPLETE,
  SET_SELECTED_CONTRACT,
  SET_SELECTED_CONTRACT_STATE,
  SET_MODIFIED_CONTRACT
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

export function searchComplete(result: PageResult<MasterContractHistory>): ContractActions {
  return {
    type: SEARCH_COMPLETE,
    result,
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

export function setSelectedContract(contract: MasterContractHistory | null): ContractActions {
  return {
    type: SET_SELECTED_CONTRACT,
    contract,
  };
}

export function setSelectedContractState(state: string | null): ContractActions {
  return {
    type: SET_SELECTED_CONTRACT_STATE,
    state,
  };
}

export function setModifiedContract(contract: MasterContract): ContractActions {
  return {
    type: SET_MODIFIED_CONTRACT,
    contract,
  };
}
