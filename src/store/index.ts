import * as Redux from 'redux';
import * as ReduxLogger from 'redux-logger';
import * as ReduxThunk from 'redux-thunk';

import { loadingBarReducer } from 'react-redux-loading-bar';

import { analyticsReducer } from './analytics/reducer';
import { configurationReducer } from './config/reducer';
import { contractReducer } from './contract/reducer';
import { draftReducer } from './draft/reducer';
import { eventReducer } from './event/reducer';
import { helpdeskAccountReducer } from './account/reducer';
import { helpdeskInboxReducer } from './message-inbox-helpdesk/reducer';
import { i18nReducer } from './i18n/reducer';
import { incidentReducer } from './incident/reducer';
import { mapViewerReducer } from './map/reducer';
import { marketplaceAccountReducer } from './account-marketplace/reducer';
import { orderReducer } from './order/reducer';
import { payInReducer } from './payin/reducer';
import { payOutReducer } from './payout/reducer';
import { processInstanceReducer } from './process-instance/reducer';
import { processInstanceHistoryReducer } from './process-instance-history/reducer';
import { providerReducer } from './provider/reducer';
import { securityReducer } from './security/reducer';
import { transferReducer } from './transfer/reducer';
import { userInboxReducer } from './message-inbox-user/reducer';
import { viewportReducer } from './viewport/reducer';

// Combine reducers
export const rootReducer = Redux.combineReducers({
  account: Redux.combineReducers({
    helpdesk: helpdeskAccountReducer,
    marketplace: marketplaceAccountReducer,
    provider: providerReducer,
  }),
  analytics: analyticsReducer,
  billing: Redux.combineReducers({
    order: orderReducer,
    payin: payInReducer,
    payout: payOutReducer,
    transfer: transferReducer,
  }),
  message: Redux.combineReducers({
    helpdeskInbox: helpdeskInboxReducer,
    userInbox: userInboxReducer,
  }),
  config: configurationReducer,
  contract: contractReducer,
  draft: draftReducer,
  event: eventReducer,
  i18n: i18nReducer,
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
  // Syncs loading bar and store
  loadingBar: loadingBarReducer,
});

// Declare root state type
export type RootState = ReturnType<typeof rootReducer>;

// Configure middleware components
const middleware: Redux.Middleware<any, any, any>[] = [
  // Support dispatching of functions
  ReduxThunk.default,
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
