import {
  LOGOUT_INIT,
} from 'store/security/types';

import {
  CONFIG_LOAD_COMPLETE,
  ConfigurationTypes,
  ConfigurationState,
} from 'store/config/types';

const initialState: ConfigurationState = {
  authProviders: [],
  marketplaceUrl: '',
};

export function configurationReducer(
  state = initialState,
  action: ConfigurationTypes
): ConfigurationState {

  switch (action.type) {
    case LOGOUT_INIT:
      return {
        ...initialState,
        authProviders: state.authProviders,
        clientId: state.clientId,
        marketplaceUrl: state.marketplaceUrl,
      };

    case CONFIG_LOAD_COMPLETE:
      return {
        ...state,
        ...action.config
      };

    default:
      return state;
  }
}
