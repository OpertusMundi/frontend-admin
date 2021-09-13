import { PageResult, Sorting } from 'model/response';
import { EnumEventSortField, Event, EventQuery } from 'model/event';

import {
  EventActions,
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
} from './types';


// Action Creators
export function setPager(page: number, size: number): EventActions {
  return {
    type: SET_PAGER,
    page,
    size,
  };
}

export function resetPager(): EventActions {
  return {
    type: RESET_PAGER,
  };
}

export function setFilter(query: Partial<EventQuery>): EventActions {
  return {
    type: SET_FILTER,
    query,
  };
}

export function resetFilter(): EventActions {
  return {
    type: RESET_FILTER,
  };
}

export function setSorting(sorting: Sorting<EnumEventSortField>[]): EventActions {
  return {
    type: SET_SORTING,
    sorting,
  };
}

export function searchInit(): EventActions {
  return {
    type: SEARCH_INIT,
  };
}

export function searchFailure(): EventActions {
  return {
    type: SEARCH_FAILURE,
  };
}

export function searchComplete(result: PageResult<Event>): EventActions {
  return {
    type: SEARCH_COMPLETE,
    result,
  };
}

export function addToSelection(selected: Event[]): EventActions {
  return {
    type: ADD_SELECTED,
    selected,
  };
}

export function removeFromSelection(removed: Event[]): EventActions {
  return {
    type: REMOVE_SELECTED,
    removed,
  };
}

export function resetSelection(): EventActions {
  return {
    type: RESET_SELECTED,
  };
}
