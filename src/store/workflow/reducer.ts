import _ from 'lodash';

import moment from 'utils/moment-localized';

import {
  LOGOUT_INIT,
} from 'store/security/types';

import {
  COUNT_INCIDENT_COMPLETE,
  COUNT_INCIDENT_FAILURE,
  COUNT_INCIDENT_INIT,
  GET_INCIDENT_COMPLETE,
  GET_INCIDENT_FAILURE,
  GET_INCIDENT_INIT,
  SET_SELECTED_INCIDENT,
  WorkflowActions,
  WorkflowManagerState,
} from 'store/workflow/types';

import { Incident } from 'model/workflow';

const initialState: WorkflowManagerState = {
  loading: false,
  lastUpdated: null,
  countIncidents: 0,
  incidents: [],
  selected: null,
};

export function workflowReducer(
  state = initialState,
  action: WorkflowActions
): WorkflowManagerState {

  switch (action.type) {
    case LOGOUT_INIT:
      return {
        ...initialState
      };

    case COUNT_INCIDENT_INIT:
      return {
        ...state,
        selected: null,
        loading: true,
      };

    case COUNT_INCIDENT_FAILURE:
      return {
        ...state,
        countIncidents: 0,
        lastUpdated: moment(),
        loading: false,
      };

    case COUNT_INCIDENT_COMPLETE:
      return {
        ...state,
        countIncidents: action.result,
        lastUpdated: moment(),
        loading: false,
      };

    case GET_INCIDENT_INIT:
      return {
        ...state,
        selected: null,
        loading: true,
      };

    case GET_INCIDENT_FAILURE:
      return {
        ...state,
        incidents: [],
        lastUpdated: moment(),
        loading: false,
      };

    case GET_INCIDENT_COMPLETE:
      return {
        ...state,
        incidents: action.result,
        lastUpdated: moment(),
        loading: false,
      };

    case SET_SELECTED_INCIDENT:
      return {
        ...state,
        selected: action.selected,
      }

    default:
      return state;
  }

}
