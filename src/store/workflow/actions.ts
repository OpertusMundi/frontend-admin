import { Incident } from 'model/workflow';

import {
  WorkflowActions,
  COUNT_INCIDENT_INIT,
  COUNT_INCIDENT_FAILURE,
  COUNT_INCIDENT_COMPLETE,
  GET_INCIDENT_INIT,
  GET_INCIDENT_FAILURE,
  GET_INCIDENT_COMPLETE,
  SET_SELECTED_INCIDENT,
} from './types';


// Action Creators
export function countIncidentsInit(): WorkflowActions {
  return {
    type: COUNT_INCIDENT_INIT,
  };
}

export function countIncidentsFailure(): WorkflowActions {
  return {
    type: COUNT_INCIDENT_FAILURE,
  };
}

export function countIncidentComplete(result: number): WorkflowActions {
  return {
    type: COUNT_INCIDENT_COMPLETE,
    result,
  };
}

export function getIncidentsInit(): WorkflowActions {
  return {
    type: GET_INCIDENT_INIT,
  };
}

export function getIncidentsFailure(): WorkflowActions {
  return {
    type: GET_INCIDENT_FAILURE,
  };
}

export function getIncidentComplete(result: Incident[]): WorkflowActions {
  return {
    type: GET_INCIDENT_COMPLETE,
    result,
  };
}

export function setSelectedIncident(selected: Incident | null): WorkflowActions {
  return {
    type: SET_SELECTED_INCIDENT,
    selected,
  };
}
