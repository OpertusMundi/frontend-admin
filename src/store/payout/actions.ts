import { PageResult, Sorting } from 'model/response';
import { EnumPayOutSortField, PayOut, PayOutQuery } from 'model/order';

import {
  PayOutActions,
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
  LOAD_ORDER_INIT,
  LOAD_ORDER_SUCCESS,
  LOAD_ORDER_FAILURE,
} from './types';


// Action Creators
export function setPager(page: number, size: number): PayOutActions {
  return {
    type: SET_PAGER,
    page,
    size,
  };
}

export function resetPager(): PayOutActions {
  return {
    type: RESET_PAGER,
  };
}

export function setFilter(query: Partial<PayOutQuery>): PayOutActions {
  return {
    type: SET_FILTER,
    query,
  };
}

export function resetFilter(): PayOutActions {
  return {
    type: RESET_FILTER,
  };
}

export function setSorting(sorting: Sorting<EnumPayOutSortField>[]): PayOutActions {
  return {
    type: SET_SORTING,
    sorting,
  };
}

export function searchInit(): PayOutActions {
  return {
    type: SEARCH_INIT,
  };
}

export function searchFailure(): PayOutActions {
  return {
    type: SEARCH_FAILURE,
  };
}

export function searchComplete(result: PageResult<PayOut>): PayOutActions {
  return {
    type: SEARCH_COMPLETE,
    result,
  };
}

export function addToSelection(selected: PayOut[]): PayOutActions {
  return {
    type: ADD_SELECTED,
    selected,
  };
}

export function removeFromSelection(removed: PayOut[]): PayOutActions {
  return {
    type: REMOVE_SELECTED,
    removed,
  };
}

export function resetSelection(): PayOutActions {
  return {
    type: RESET_SELECTED,
  };
}

export function loadPayOutInit(key: string): PayOutActions {
  return {
    type: LOAD_ORDER_INIT,
    key,
  };
}

export function loadPayOutSuccess(order: PayOut): PayOutActions {
  return {
    type: LOAD_ORDER_SUCCESS,
    order,
  };
}

export function loadPayOutFailure(): PayOutActions {
  return {
    type: LOAD_ORDER_FAILURE,
  };
}
