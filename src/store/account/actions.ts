import { PageResult, Sorting, ObjectResponse } from 'model/response';
import { EnumHelpdeskAccountSortField, HelpdeskAccount, HelpdeskAccountQuery } from 'model/account';

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
  SAVE_INIT,
  SAVE_COMPLETE,
  REGISTER_IDP_INIT,
  REGISTER_IDP_COMPLETE,
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

export function setFilter(query: Partial<HelpdeskAccountQuery>): AccountActions {
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

export function setSorting(sorting: Sorting<EnumHelpdeskAccountSortField>[]): AccountActions {
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

export function searchComplete(result: PageResult<HelpdeskAccount>): AccountActions {
  return {
    type: SEARCH_COMPLETE,
    result,
  };
}

export function saveInit(): AccountActions {
  return {
    type: SAVE_INIT,
  };
}

export function saveComplete(response: ObjectResponse<HelpdeskAccount>): AccountActions {
  return {
    type: SAVE_COMPLETE,
    response,
  };
}

export function registerToIdpInit(): AccountActions {
  return {
    type: REGISTER_IDP_INIT,
  };
}

export function registerToIdpComplete(): AccountActions {
  return {
    type: REGISTER_IDP_COMPLETE,
  };
}

export function addToSelection(selected: HelpdeskAccount[]): AccountActions {
  return {
    type: ADD_SELECTED,
    selected,
  };
}

export function removeFromSelection(removed: HelpdeskAccount[]): AccountActions {
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
