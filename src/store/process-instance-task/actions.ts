import { PageResult, Sorting } from 'model/response';
import {
  EnumProcessInstanceTaskSortField,
  ProcessInstanceTaskQuery,
  ProcessInstanceTask,
  ActiveProcessInstanceDetails,
} from 'model/bpm-process-instance';

import {
  ProcessInstanceTaskActions,
  COUNT_PROCESS_INSTANCE_TASK_INIT,
  COUNT_PROCESS_INSTANCE_TASK_FAILURE,
  COUNT_PROCESS_INSTANCE_TASK_COMPLETE,
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
} from './types';


// Action Creators
export function countProcessInstanceTasksInit(): ProcessInstanceTaskActions {
  return {
    type: COUNT_PROCESS_INSTANCE_TASK_INIT,
  };
}

export function countProcessInstanceTasksFailure(): ProcessInstanceTaskActions {
  return {
    type: COUNT_PROCESS_INSTANCE_TASK_FAILURE,
  };
}

export function countProcessInstanceTasksComplete(taskCounter: number): ProcessInstanceTaskActions {
  return {
    type: COUNT_PROCESS_INSTANCE_TASK_COMPLETE,
    taskCounter,
  };
}

export function setPager(page: number, size: number): ProcessInstanceTaskActions {
  return {
    type: SET_PAGER,
    page,
    size,
  };
}

export function resetPager(): ProcessInstanceTaskActions {
  return {
    type: RESET_PAGER,
  };
}

export function setFilter(query: Partial<ProcessInstanceTaskQuery>): ProcessInstanceTaskActions {
  return {
    type: SET_FILTER,
    query,
  };
}

export function resetFilter(): ProcessInstanceTaskActions {
  return {
    type: RESET_FILTER,
  };
}

export function setSorting(sorting: Sorting<EnumProcessInstanceTaskSortField>[]): ProcessInstanceTaskActions {
  return {
    type: SET_SORTING,
    sorting,
  };
}

export function searchInit(): ProcessInstanceTaskActions {
  return {
    type: SEARCH_INIT,
  };
}

export function searchFailure(): ProcessInstanceTaskActions {
  return {
    type: SEARCH_FAILURE,
  };
}

export function searchComplete(result: PageResult<ProcessInstanceTask>): ProcessInstanceTaskActions {
  return {
    type: SEARCH_COMPLETE,
    result,
  };
}

export function addToSelection(selected: ProcessInstanceTask[]): ProcessInstanceTaskActions {
  return {
    type: ADD_SELECTED,
    selected,
  };
}

export function removeFromSelection(removed: ProcessInstanceTask[]): ProcessInstanceTaskActions {
  return {
    type: REMOVE_SELECTED,
    removed,
  };
}

export function resetSelection(): ProcessInstanceTaskActions {
  return {
    type: RESET_SELECTED,
  };
}

export function resetInstance(): ProcessInstanceTaskActions {
  return {
    type: RESET_INSTANCE,
  };
}

export function loadInit(businessKey: string | null, processInstanceId: string | null): ProcessInstanceTaskActions {
  return {
    type: LOAD_INIT,
    businessKey,
    processInstanceId,
  };
}

export function loadSuccess(processInstance: ActiveProcessInstanceDetails): ProcessInstanceTaskActions {
  return {
    type: LOAD_SUCCESS,
    processInstance,
  };
}

export function loadFailure(): ProcessInstanceTaskActions {
  return {
    type: LOAD_FAILURE,
  };
}
