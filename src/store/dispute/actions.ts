import { PageResult, Sorting } from 'model/response';
import { EnumDisputeSortField, Dispute, DisputeQuery } from 'model/dispute';

import {
  DisputeActions,
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
export function setPager(page: number, size: number): DisputeActions {
  return {
    type: SET_PAGER,
    page,
    size,
  };
}

export function resetPager(): DisputeActions {
  return {
    type: RESET_PAGER,
  };
}

export function setFilter(query: Partial<DisputeQuery>): DisputeActions {
  return {
    type: SET_FILTER,
    query,
  };
}

export function resetFilter(): DisputeActions {
  return {
    type: RESET_FILTER,
  };
}

export function setSorting(sorting: Sorting<EnumDisputeSortField>[]): DisputeActions {
  return {
    type: SET_SORTING,
    sorting,
  };
}

export function searchInit(): DisputeActions {
  return {
    type: SEARCH_INIT,
  };
}

export function searchFailure(): DisputeActions {
  return {
    type: SEARCH_FAILURE,
  };
}

export function searchComplete(result: PageResult<Dispute>): DisputeActions {
  return {
    type: SEARCH_COMPLETE,
    result,
  };
}
