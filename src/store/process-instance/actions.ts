import { PageResult, Sorting } from 'model/response';
import {
  ActiveProcessInstanceDetails,
  EnumProcessInstanceSortField,
  ProcessInstanceQuery,
  ProcessInstance,
} from 'model/bpm-process-instance';

import {
  ProcessInstanceActions,
  COUNT_PROCESS_INSTANCE_INIT,
  COUNT_PROCESS_INSTANCE_FAILURE,
  COUNT_PROCESS_INSTANCE_COMPLETE,
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
  RESET_INSTANCE,
  LOAD_INIT,
  LOAD_SUCCESS,
  LOAD_FAILURE,
  DELETE_INIT,
  DELETE_SUCCESS,
  DELETE_FAILURE,
} from './types';


// Action Creators
export function countProcessInstancesInit(): ProcessInstanceActions {
  return {
    type: COUNT_PROCESS_INSTANCE_INIT,
  };
}

export function countProcessInstancesFailure(): ProcessInstanceActions {
  return {
    type: COUNT_PROCESS_INSTANCE_FAILURE,
  };
}

export function countProcessInstancesComplete(processInstanceCounter: number): ProcessInstanceActions {
  return {
    type: COUNT_PROCESS_INSTANCE_COMPLETE,
    processInstanceCounter,
  };
}

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

export function setSorting(sorting: Sorting<EnumProcessInstanceSortField>[]): ProcessInstanceActions {
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

export function resetInstance(): ProcessInstanceActions {
  return {
    type: RESET_INSTANCE,
  };
}

export function loadInit(businessKey: string | null, processInstance: string | null): ProcessInstanceActions {
  return {
    type: LOAD_INIT,
    businessKey,
    processInstance,
  };
}

export function loadSuccess(processInstance: ActiveProcessInstanceDetails): ProcessInstanceActions {
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

export function deleteInit(processInstance: string): ProcessInstanceActions {
  return {
    type: DELETE_INIT,
    processInstance,
  };
}

export function deleteSuccess(): ProcessInstanceActions {
  return {
    type: DELETE_SUCCESS,
  };
}

export function deleteFailure(): ProcessInstanceActions {
  return {
    type: DELETE_FAILURE,
  };
}