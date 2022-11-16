import moment from 'utils/moment-localized';

import {
  LOGOUT_INIT,
} from 'store/security/types';

import {
  SET_SORTING,
  SEARCH_INIT,
  SEARCH_FAILURE,
  SEARCH_COMPLETE,
  DELETE_INIT,
  DELETE_SUCCESS,
  DELETE_FAILURE,
  DeploymentActions,
  DeploymentState,
} from 'store/process-deployment/types';
import { Order } from 'model/response';
import { EnumDeploymentSortField } from 'model/bpm-process-instance';

const initialState: DeploymentState = {
  lastUpdated: null,
  loading: false,
  result: null,
  sorting: [{
    id: EnumDeploymentSortField.DEPLOYMENT_TIME,
    order: Order.DESC,
  }],
};

export function processDeploymentReducer(
  state = initialState,
  action: DeploymentActions
): DeploymentState {

  switch (action.type) {
    case LOGOUT_INIT:
      return {
        ...initialState
      };

    case SET_SORTING:
      return {
        ...state,
        sorting: action.sorting,
      };

    case SEARCH_INIT:
      return {
        ...state,
        loading: true,
      };

    case SEARCH_FAILURE:
      return {
        ...state,
        result: null,
        lastUpdated: moment(),
        loading: false,
      };

    case SEARCH_COMPLETE:
      return {
        ...state,
        result: action.result,
        lastUpdated: moment(),
        loading: false,
      };

    case DELETE_INIT:
      return {
        ...state,
        loading: true,
      };

    case DELETE_FAILURE:
    case DELETE_SUCCESS:
      return {
        ...state,
        loading: false,
      };

    default:
      return state;
  }
}
