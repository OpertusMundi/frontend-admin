import * as Redux from 'redux';
import * as ReduxLogger from 'redux-logger';
import * as ReduxThunk from 'redux-thunk';

import { connectRouter, routerMiddleware } from 'connected-react-router';
import { loadingBarReducer } from 'react-redux-loading-bar';

import { history } from 'routing';

import { analyticsReducer } from './analytics/reducer';
import { configurationReducer } from './config/reducer';
import { contractReducer } from './contract/reducer';
import { draftReducer } from './draft/reducer';
import { helpdeskAccountReducer } from './account/reducer';
import { incidentReducer } from './incident/reducer';
import { mapViewerReducer } from './map/reducer';
import { marketplaceAccountReducer } from './account-marketplace/reducer';
import { messageReducer } from './i18n/reducer';
import { orderReducer } from './order/reducer';
import { payInReducer } from './payin/reducer';
import { processInstanceReducer } from './process-instance/reducer';
import { processInstanceHistoryReducer } from './process-instance-history/reducer';
import { securityReducer } from './security/reducer';
import { viewportReducer } from './viewport/reducer';

// Combine reducers
export const rootReducer = Redux.combineReducers({
  account: Redux.combineReducers({
    helpdesk: helpdeskAccountReducer,
    marketplace: marketplaceAccountReducer,
  }),
  analytics: analyticsReducer,
  billing: Redux.combineReducers({
    order: orderReducer,
    payin: payInReducer,
  }),
  config: configurationReducer,
  contract: contractReducer,
  draft: draftReducer,
  i18n: messageReducer,
  map: mapViewerReducer,
  security: securityReducer,
  viewport: viewportReducer,
  workflow: Redux.combineReducers({
    instances: Redux.combineReducers({
      runtime: processInstanceReducer,
      history: processInstanceHistoryReducer,
    }),
    incidents: incidentReducer,
  }),
  // Syncs history and store
  router: connectRouter(history),
  // Syncs loading bar and store
  loadingBar: loadingBarReducer,
});

// Declare root state type
export type RootState = ReturnType<typeof rootReducer>;

// Configure middleware components
const middleware = [
  // Support dispatching of functions
  ReduxThunk.default,
  // Intercept navigation actions
  routerMiddleware(history),
];

if ((process as any).env.REACT_APP_ENABLE_LOGGER === 'true') {
  // The logger middleware should always be last
  middleware.push(ReduxLogger.createLogger({ colors: {} }));
}

const store = Redux.createStore(
  rootReducer,
  {},
  Redux.applyMiddleware(...middleware)
);

export default store;
