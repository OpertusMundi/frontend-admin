import { PageResult, Sorting } from 'model/response';
import {
  EnumProcessInstanceHistorySortField,
  ProcessInstanceQuery,
  ProcessInstance,
  HistoryProcessInstanceDetails,
} from 'model/bpm-process-instance';

import {
  ProcessInstanceActions,
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
  LOAD_INIT,
  LOAD_SUCCESS,
  LOAD_FAILURE,
} from './types';


// Action Creators
export function setPager(page: number, size: number): ProcessInstanceActions {
  return {
    type: SET_PAGER,
    page,
    size,
  };
}

export function resetPager(): ProcessInstanceActions {
  return {
    type: RESET_PAGER,
  };
}

export function setFilter(query: Partial<ProcessInstanceQuery>): ProcessInstanceActions {
  return {
    type: SET_FILTER,
    query,
  };
}

export function resetFilter(): ProcessInstanceActions {
  return {
    type: RESET_FILTER,
  };
}

export function setSorting(sorting: Sorting<EnumProcessInstanceHistorySortField>[]): ProcessInstanceActions {
  return {
    type: SET_SORTING,
    sorting,
  };
}

export function searchInit(): ProcessInstanceActions {
  return {
    type: SEARCH_INIT,
  };
}

export function searchFailure(): ProcessInstanceActions {
  return {
    type: SEARCH_FAILURE,
  };
}

export function searchComplete(result: PageResult<ProcessInstance>): ProcessInstanceActions {
  return {
    type: SEARCH_COMPLETE,
    result,
  };
}

export function addToSelection(selected: ProcessInstance[]): ProcessInstanceActions {
  return {
    type: ADD_SELECTED,
    selected,
  };
}

export function removeFromSelection(removed: ProcessInstance[]): ProcessInstanceActions {
  return {
    type: REMOVE_SELECTED,
    removed,
  };
}

export function resetSelection(): ProcessInstanceActions {
  return {
    type: RESET_SELECTED,
  };
}

export function loadInit(processInstance: string): ProcessInstanceActions {
  return {
    type: LOAD_INIT,
    processInstance,
  };
}

export function loadSuccess(processInstance: HistoryProcessInstanceDetails): ProcessInstanceActions {
  return {
    type: LOAD_SUCCESS,
    processInstance,
  };
}

export function loadFailure(): ProcessInstanceActions {
  return {
    type: LOAD_FAILURE,
  };
}
