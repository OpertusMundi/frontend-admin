import { PageResult, Sorting, ObjectResponse } from 'model/response';
import { EnumSortField, Contract, ContractQuery } from 'model/contract';

import {
  ContractManagerActions,
  SET_PAGER,
  RESET_PAGER,
  SET_FILTER,
  RESET_FILTER,
  SEARCH_INIT,
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
export function setPager(page: number, size: number): ContractManagerActions {
  return {
    type: SET_PAGER,
    page,
    size,
  };
}

export function resetPager(): ContractManagerActions {
  return {
    type: RESET_PAGER,
  };
}

export function setFilter(query: Partial<ContractQuery>): ContractManagerActions {
  return {
    type: SET_FILTER,
    query,
  };
}

export function resetFilter(): ContractManagerActions {
  return {
    type: RESET_FILTER,
  };
}

export function setSorting(sorting: Sorting<EnumSortField>[]): ContractManagerActions {
  return {
    type: SET_SORTING,
    sorting,
  };
}

export function searchInit(): ContractManagerActions {
  return {
    type: SEARCH_INIT,
  };
}

export function searchComplete(result: PageResult<Contract>): ContractManagerActions {
  return {
    type: SEARCH_COMPLETE,
    result,
  };
}

export function saveInit(): ContractManagerActions {
  return {
    type: SAVE_INIT,
  };
}

export function saveComplete(response: ObjectResponse<Contract>): ContractManagerActions {
  return {
    type: SAVE_COMPLETE,
    response,
  };
}

export function addToSelection(selected: Contract[]): ContractManagerActions {
  return {
    type: ADD_SELECTED,
    selected,
  };
}

export function removeFromSelection(removed: Contract[]): ContractManagerActions {
  return {
    type: REMOVE_SELECTED,
    removed,
  };
}

export function resetSelection(): ContractManagerActions {
  return {
    type: RESET_SELECTED,
  };
}

export function setSelectedContract(contract: Contract | null): ContractManagerActions {
  return {
    type: SET_SELECTED_CONTRACT,
    contract,
  };
}

export function setSelectedContractState(state: string | null): ContractManagerActions {
  return {
    type: SET_SELECTED_CONTRACT_STATE,
    state,
  };
}

export function setModifiedContract(contract: Contract): ContractManagerActions {
  return {
    type: SET_MODIFIED_CONTRACT,
    contract,
  };
}
