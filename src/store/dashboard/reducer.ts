import moment from 'utils/moment-localized';

import {
  LOGOUT_INIT,
} from 'store/security/types';

import {
  QUERY_INIT,
  QUERY_COMPLETE,
  QUERY_FAILURE,
  DashboardActions,
  DashboardState,
} from 'store/dashboard/types';

const initialState: DashboardState = {
  data: null,
  lastUpdated: null,
  loading: false,
};

export function dashboardReducer(
  state = initialState,
  action: DashboardActions
): DashboardState {

  switch (action.type) {
    case LOGOUT_INIT:
      return {
        ...initialState
      };

    case QUERY_INIT:
      return {
        ...state,
        loading: true,
      };

    case QUERY_FAILURE:
      return {
        ...state,
        lastUpdated: moment(),
        loading: false,
      };

    case QUERY_COMPLETE:
      return {
        ...state,
        lastUpdated: moment(),
        loading: false,
        data: action.response.result || null
      };

    default:
      return state;
  }

}
