import { PageResult, Sorting } from 'model/response';
import { EnumIncidentSortField, IncidentQuery, Incident } from 'model/bpm-incident';

import {
  IncidentActions,
  COUNT_INCIDENT_INIT,
  COUNT_INCIDENT_FAILURE,
  COUNT_INCIDENT_COMPLETE,
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
  RETRY_INIT,
  RETRY_FAILURE,
  RETRY_SUCCESS,
} from './types';


// Action Creators
export function countIncidentsInit(): IncidentActions {
  return {
    type: COUNT_INCIDENT_INIT,
  };
}

export function countIncidentsFailure(): IncidentActions {
  return {
    type: COUNT_INCIDENT_FAILURE,
  };
}

export function countIncidentComplete(incidentCounter: number): IncidentActions {
  return {
    type: COUNT_INCIDENT_COMPLETE,
    incidentCounter,
  };
}

export function setPager(page: number, size: number): IncidentActions {
  return {
    type: SET_PAGER,
    page,
    size,
  };
}

export function resetPager(): IncidentActions {
  return {
    type: RESET_PAGER,
  };
}

export function setFilter(query: Partial<IncidentQuery>): IncidentActions {
  return {
    type: SET_FILTER,
    query,
  };
}

export function resetFilter(): IncidentActions {
  return {
    type: RESET_FILTER,
  };
}

export function setSorting(sorting: Sorting<EnumIncidentSortField>[]): IncidentActions {
  return {
    type: SET_SORTING,
    sorting,
  };
}

export function searchInit(): IncidentActions {
  return {
    type: SEARCH_INIT,
  };
}

export function searchFailure(): IncidentActions {
  return {
    type: SEARCH_FAILURE,
  };
}

export function searchComplete(result: PageResult<Incident>): IncidentActions {
  return {
    type: SEARCH_COMPLETE,
    result,
  };
}

export function addToSelection(selected: Incident[]): IncidentActions {
  return {
    type: ADD_SELECTED,
    selected,
  };
}

export function removeFromSelection(removed: Incident[]): IncidentActions {
  return {
    type: REMOVE_SELECTED,
    removed,
  };
}

export function resetSelection(): IncidentActions {
  return {
    type: RESET_SELECTED,
  };
}

export function retryInit(processInstanceId: string, externalTaskId: string): IncidentActions {
  return {
    type: RETRY_INIT,
    processInstanceId,
    externalTaskId,
  };
}

export function retryFailure(): IncidentActions {
  return {
    type: RETRY_FAILURE,
  };
}

export function retrySuccess(): IncidentActions {
  return {
    type: RETRY_SUCCESS,
  };
}
