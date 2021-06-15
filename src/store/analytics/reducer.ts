import moment from 'utils/moment-localized';

import { EnumSalesQueryMetric } from 'model/analytics';

import {
  LOGOUT_INIT,
} from 'store/security/types';

import {
  SET_FILTER,
  RESET_FILTER,
  QUERY_INIT,
  QUERY_COMPLETE,
  QUERY_FAILURE,
  AnalyticsActions,
  AnalyticsManagerState,
} from 'store/analytics/types';

const initialState: AnalyticsManagerState = {
  lastUpdated: null,
  loading: false,
  query: {
    metric: EnumSalesQueryMetric.SUM_SALES,
  },
  response: null,
};

export function analyticsReducer(
  state = initialState,
  action: AnalyticsActions
): AnalyticsManagerState {

  switch (action.type) {
    case LOGOUT_INIT:
      return {
        ...initialState
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
          ...initialState.query
        },
      };

    case QUERY_INIT:
      return {
        ...state,
        loading: true,
        response: null,
      };

    case QUERY_FAILURE:
      return {
        ...state,
        lastUpdated: moment(),
        loading: false,
        response: null,
      };

    case QUERY_COMPLETE:
      return {
        ...state,
        lastUpdated: moment(),
        loading: false,
        response: action.response,
      };

    default:
      return state;
  }

}
