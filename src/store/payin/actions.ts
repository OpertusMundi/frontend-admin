import { PageResult, Sorting } from 'model/response';
import { EnumPayInSortField, PayInQuery, PayInType } from 'model/order';

import {
  PayInActions,
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
export function setPager(page: number, size: number): PayInActions {
  return {
    type: SET_PAGER,
    page,
    size,
  };
}

export function resetPager(): PayInActions {
  return {
    type: RESET_PAGER,
  };
}

export function setFilter(query: Partial<PayInQuery>): PayInActions {
  return {
    type: SET_FILTER,
    query,
  };
}

export function resetFilter(): PayInActions {
  return {
    type: RESET_FILTER,
  };
}

export function setSorting(sorting: Sorting<EnumPayInSortField>[]): PayInActions {
  return {
    type: SET_SORTING,
    sorting,
  };
}

export function searchInit(): PayInActions {
  return {
    type: SEARCH_INIT,
  };
}

export function searchFailure(): PayInActions {
  return {
    type: SEARCH_FAILURE,
  };
}

export function searchComplete(result: PageResult<PayInType>): PayInActions {
  return {
    type: SEARCH_COMPLETE,
    result,
  };
}

export function addToSelection(selected: PayInType[]): PayInActions {
  return {
    type: ADD_SELECTED,
    selected,
  };
}

export function removeFromSelection(removed: PayInType[]): PayInActions {
  return {
    type: REMOVE_SELECTED,
    removed,
  };
}

export function resetSelection(): PayInActions {
  return {
    type: RESET_SELECTED,
  };
}

export function loadPayInInit(key: string): PayInActions {
  return {
    type: LOAD_ORDER_INIT,
    key,
  };
}

export function loadPayInSuccess(record: PayInType): PayInActions {
  return {
    type: LOAD_ORDER_SUCCESS,
    record,
  };
}

export function loadPayInFailure(): PayInActions {
  return {
    type: LOAD_ORDER_FAILURE,
  };
}
