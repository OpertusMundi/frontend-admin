import _ from 'lodash';

import moment from 'utils/moment-localized';

import {
  LOGOUT_INIT,
} from 'store/security/types';

import {
  COUNT_PROCESS_INSTANCE_COMPLETE,
  COUNT_PROCESS_INSTANCE_FAILURE,
  COUNT_PROCESS_INSTANCE_INIT,
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
  ProcessInstanceActions,
  ProcessInstanceState,
} from 'store/process-instance/types';

import { Order } from 'model/response';
import { EnumProcessInstanceSortField } from 'model/bpm-process-instance';

const initialState: ProcessInstanceState = {
  lastUpdated: null,
  loading: false,
  loadingProcessInstance: false,
  pagination: {
    page: 0,
    size: 10,
  },
  processInstance: null,
  processInstanceCounter: 0,
  query: {
    businessKey: '',
    processDefinitionKey: '',
    task: '',
  },
  result: null,
  selected: [],
  sorting: [{
    id: EnumProcessInstanceSortField.STARTED_ON,
    order: Order.DESC,
  }],
};

export function processInstanceReducer(
  state = initialState,
  action: ProcessInstanceActions
): ProcessInstanceState {

  switch (action.type) {
    case LOGOUT_INIT:
      return {
        ...initialState
      };

    case COUNT_PROCESS_INSTANCE_INIT:
      return {
        ...state,
        loading: true,
      };

    case COUNT_PROCESS_INSTANCE_FAILURE:
      return {
        ...state,
        processInstanceCounter: null,
        lastUpdated: moment(),
        loading: false,
      };

    case COUNT_PROCESS_INSTANCE_COMPLETE:
      return {
        ...state,
        processInstanceCounter: action.processInstanceCounter,
        lastUpdated: moment(),
        loading: false,
      };

    case SET_PAGER:
      return {
        ...state,
        pagination: {
          page: action.page,
          size: action.size,
        },
      };

    case RESET_PAGER:
      return {
        ...state,
        pagination: {
          ...initialState.pagination
        },
        selected: [],
      };

    case SET_FILTER: {
      return {
        ...state,
        query: {
          ...state.query,
          ...action.query,
        },
      };
    }

    case RESET_FILTER:
      return {
        ...state,
        query: {
          ...initialState.query,
        },
        selected: [],
      };

    case SET_SORTING:
      return {
        ...state,
        sorting: action.sorting,
      };

    case SEARCH_INIT:
      return {
        ...state,
        selected: [],
        loading: true,
      };

    case SEARCH_FAILURE:
      return {
        ...state,
        result: null,
        pagination: {
          page: 0,
          size: state.pagination.size,
        },
        lastUpdated: moment(),
        loading: false,
      };

    case SEARCH_COMPLETE:
      return {
        ...state,
        result: action.result,
        pagination: {
          page: action.result.pageRequest.page,
          size: action.result.pageRequest.size,
        },
        lastUpdated: moment(),
        loading: false,
      };

    case ADD_SELECTED:
      return {
        ...state,
        selected: _.uniqBy([...state.selected, ...action.selected], 'id'),
      };

    case REMOVE_SELECTED:
      return {
        ...state,
        selected: state.selected.filter(s => !action.removed.some(r => r.processInstanceId === s.processInstanceId)),
      };

    case RESET_SELECTED:
      return {
        ...state,
        selected: [],
      };

    case RESET_INSTANCE:
      return {
        ...state,
        processInstance: null,
      };

    case LOAD_INIT:
      return {
        ...state,
        loadingProcessInstance: true,
      };

    case LOAD_SUCCESS:
      return {
        ...state,
        loadingProcessInstance: false,
        processInstance: action.processInstance,
      };

    case LOAD_FAILURE:
      return {
        ...state,
        loadingProcessInstance: false,
      };

    case DELETE_INIT:
      return {
        ...state,
        loading: true,
        loadingProcessInstance: true,
      };

    case DELETE_FAILURE:
    case DELETE_SUCCESS:
      return {
        ...state,
        loading: false,
        loadingProcessInstance: false,
      };

    default:
      return state;
  }

}
