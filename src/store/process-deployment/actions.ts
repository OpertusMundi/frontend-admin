import { Sorting } from 'model/response';
import {
  Deployment, EnumDeploymentSortField,
} from 'model/bpm-process-instance';

import {
  DeploymentActions,
  SET_SORTING,
  SEARCH_INIT,
  SEARCH_FAILURE,
  SEARCH_COMPLETE,
  DELETE_INIT,
  DELETE_SUCCESS,
  DELETE_FAILURE,
} from './types';


// Action Creators
export function setSorting(sorting: Sorting<EnumDeploymentSortField>[]): DeploymentActions {
  return {
    type: SET_SORTING,
    sorting,
  };
}


export function searchInit(): DeploymentActions {
  return {
    type: SEARCH_INIT,
  };
}

export function searchFailure(): DeploymentActions {
  return {
    type: SEARCH_FAILURE,
  };
}

export function searchComplete(result: Deployment[]): DeploymentActions {
  return {
    type: SEARCH_COMPLETE,
    result,
  };
}

export function deleteInit(id: string, cascade: boolean): DeploymentActions {
  return {
    type: DELETE_INIT,
    id,
    cascade,
  };
}

export function deleteSuccess(): DeploymentActions {
  return {
    type: DELETE_SUCCESS,
  };
}

export function deleteFailure(): DeploymentActions {
  return {
    type: DELETE_FAILURE,
  };
}