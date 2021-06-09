import _ from 'lodash';

import moment from 'utils/moment-localized';

import {
  LOGOUT_INIT,
} from 'store/security/types';

import {
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
  ProcessInstanceActions,
  ProcessInstanceState,
} from 'store/process-instance/types';

import { Order } from 'model/response';
import { EnumProcessInstanceSortField } from 'model/workflow';

const initialState: ProcessInstanceState = {
  loading: false,
  lastUpdated: null,
  pagination: {
    page: 0,
    size: 10,
  },
  query: {
    businessKey: '',
  },
  sorting: [{
    id: EnumProcessInstanceSortField.STARTED_ON,
    order: Order.DESC,
  }],
  result: null,
  selected: [],
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

    default:
      return state;
  }

}
