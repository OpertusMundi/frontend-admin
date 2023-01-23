import { PageResult, Sorting } from 'model/response';
import { EnumRefundSortField, Refund, RefundQuery } from 'model/refund';

import {
  RefundActions,
  SET_PAGER,
  RESET_PAGER,
  SET_FILTER,
  RESET_FILTER,
  SEARCH_INIT,
  SEARCH_FAILURE,
  SEARCH_COMPLETE,
  SET_SORTING,
} from './types';


// Action Creators
export function setPager(page: number, size: number): RefundActions {
  return {
    type: SET_PAGER,
    page,
    size,
  };
}

export function resetPager(): RefundActions {
  return {
    type: RESET_PAGER,
  };
}

export function setFilter(query: Partial<RefundQuery>): RefundActions {
  return {
    type: SET_FILTER,
    query,
  };
}

export function resetFilter(): RefundActions {
  return {
    type: RESET_FILTER,
  };
}

export function setSorting(sorting: Sorting<EnumRefundSortField>[]): RefundActions {
  return {
    type: SET_SORTING,
    sorting,
  };
}

export function searchInit(): RefundActions {
  return {
    type: SEARCH_INIT,
  };
}

export function searchFailure(): RefundActions {
  return {
    type: SEARCH_FAILURE,
  };
}

export function searchComplete(result: PageResult<Refund>): RefundActions {
  return {
    type: SEARCH_COMPLETE,
    result,
  };
}
