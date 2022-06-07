import { PageResult, Sorting } from 'model/response';
import {
  EnumMarketplaceAccountSortField,
  MarketplaceAccount,
  MarketplaceAccountQuery,
  MarketplaceAccountSummary,
} from 'model/account-marketplace';

import {
  ConsumerActions,
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
export function setPager(page: number, size: number): ConsumerActions {
  return {
    type: SET_PAGER,
    page,
    size,
  };
}

export function resetPager(): ConsumerActions {
  return {
    type: RESET_PAGER,
  };
}

export function setFilter(query: Partial<MarketplaceAccountQuery>): ConsumerActions {
  return {
    type: SET_FILTER,
    query,
  };
}

export function resetFilter(): ConsumerActions {
  return {
    type: RESET_FILTER,
  };
}

export function setSorting(sorting: Sorting<EnumMarketplaceAccountSortField>[]): ConsumerActions {
  return {
    type: SET_SORTING,
    sorting,
  };
}

export function searchInit(): ConsumerActions {
  return {
    type: SEARCH_INIT,
  };
}

export function searchFailure(): ConsumerActions {
  return {
    type: SEARCH_FAILURE,
  };
}

export function searchComplete(result: PageResult<MarketplaceAccountSummary>): ConsumerActions {
  return {
    type: SEARCH_COMPLETE,
    result,
  };
}

export function addToSelection(selected: MarketplaceAccountSummary[]): ConsumerActions {
  return {
    type: ADD_SELECTED,
    selected,
  };
}

export function removeFromSelection(removed: MarketplaceAccountSummary[]): ConsumerActions {
  return {
    type: REMOVE_SELECTED,
    removed,
  };
}

export function resetSelection(): ConsumerActions {
  return {
    type: RESET_SELECTED,
  };
}

export function loadAccountInit(key: string): ConsumerActions {
  return {
    type: LOAD_ACCOUNT_INIT,
    key,
  };
}

export function loadAccountFailure(): ConsumerActions {
  return {
    type: LOAD_ACCOUNT_FAILURE,
  };
}

export function loadAccountSuccess(account: MarketplaceAccount): ConsumerActions {
  return {
    type: LOAD_ACCOUNT_SUCCESS,
    account,
  };
}
