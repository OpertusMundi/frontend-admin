import { PageResult, Sorting } from 'model/response';
import {
  EnumMarketplaceAccountSortField,
  MarketplaceAccount,
  MarketplaceAccountQuery,
  MarketplaceAccountSummary,
} from 'model/account-marketplace';

import {
  AccountActions,
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
  LOAD_ACCOUNT_INIT,
  LOAD_ACCOUNT_FAILURE,
  LOAD_ACCOUNT_SUCCESS,
} from './types';


// Action Creators
export function setPager(page: number, size: number): AccountActions {
  return {
    type: SET_PAGER,
    page,
    size,
  };
}

export function resetPager(): AccountActions {
  return {
    type: RESET_PAGER,
  };
}

export function setFilter(query: Partial<MarketplaceAccountQuery>): AccountActions {
  return {
    type: SET_FILTER,
    query,
  };
}

export function resetFilter(): AccountActions {
  return {
    type: RESET_FILTER,
  };
}

export function setSorting(sorting: Sorting<EnumMarketplaceAccountSortField>[]): AccountActions {
  return {
    type: SET_SORTING,
    sorting,
  };
}

export function searchInit(): AccountActions {
  return {
    type: SEARCH_INIT,
  };
}

export function searchFailure(): AccountActions {
  return {
    type: SEARCH_FAILURE,
  };
}

export function searchComplete(result: PageResult<MarketplaceAccountSummary>): AccountActions {
  return {
    type: SEARCH_COMPLETE,
    result,
  };
}

export function addToSelection(selected: MarketplaceAccountSummary[]): AccountActions {
  return {
    type: ADD_SELECTED,
    selected,
  };
}

export function removeFromSelection(removed: MarketplaceAccountSummary[]): AccountActions {
  return {
    type: REMOVE_SELECTED,
    removed,
  };
}

export function resetSelection(): AccountActions {
  return {
    type: RESET_SELECTED,
  };
}

export function loadAccountInit(key: string): AccountActions {
  return {
    type: LOAD_ACCOUNT_INIT,
    key,
  };
}

export function loadAccountFailure(): AccountActions {
  return {
    type: LOAD_ACCOUNT_FAILURE,
  };
}

export function loadAccountSuccess(account: MarketplaceAccount): AccountActions {
  return {
    type: LOAD_ACCOUNT_SUCCESS,
    account,
  };
}
