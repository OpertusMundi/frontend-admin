import { PageResult, Sorting } from 'model/response';
import { EnumOrderSortField, Order, OrderQuery } from 'model/order';

import {
  OrderActions,
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
export function setPager(page: number, size: number): OrderActions {
  return {
    type: SET_PAGER,
    page,
    size,
  };
}

export function resetPager(): OrderActions {
  return {
    type: RESET_PAGER,
  };
}

export function setFilter(query: Partial<OrderQuery>): OrderActions {
  return {
    type: SET_FILTER,
    query,
  };
}

export function resetFilter(): OrderActions {
  return {
    type: RESET_FILTER,
  };
}

export function setSorting(sorting: Sorting<EnumOrderSortField>[]): OrderActions {
  return {
    type: SET_SORTING,
    sorting,
  };
}

export function searchInit(): OrderActions {
  return {
    type: SEARCH_INIT,
  };
}

export function searchFailure(): OrderActions {
  return {
    type: SEARCH_FAILURE,
  };
}

export function searchComplete(result: PageResult<Order>): OrderActions {
  return {
    type: SEARCH_COMPLETE,
    result,
  };
}

export function addToSelection(selected: Order[]): OrderActions {
  return {
    type: ADD_SELECTED,
    selected,
  };
}

export function removeFromSelection(removed: Order[]): OrderActions {
  return {
    type: REMOVE_SELECTED,
    removed,
  };
}

export function resetSelection(): OrderActions {
  return {
    type: RESET_SELECTED,
  };
}

export function loadOrderInit(key: string): OrderActions {
  return {
    type: LOAD_ORDER_INIT,
    key,
  };
}

export function loadOrderSuccess(order: Order): OrderActions {
  return {
    type: LOAD_ORDER_SUCCESS,
    order,
  };
}

export function loadOrderFailure(): OrderActions {
  return {
    type: LOAD_ORDER_FAILURE,
  };
}
