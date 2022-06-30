import React from 'react';

import { connect, ConnectedProps } from 'react-redux';
import { Route, Routes, Navigate } from 'react-router-dom';

// 3rd party components
import { ToastContainer } from 'react-toastify';

// State
import { RootState } from 'store';

// Components
import AccountForm from 'components/account/account-form';
import AssetDraftManager from 'components/draft/draft-grid';
import ConsumerManager from 'components/consumer/consumer-grid';
import ContractForm from 'components/contract/contract-form';
import ContractManager from 'components/contract/contract-grid';
import DashboardComponent from 'components/dashboard';
import DraftContractViewer from 'components/draft/contract-viewer/contract-viewer';
import ErrorPage from 'components/error-page';
import EventManager from 'components/event/event-manager';
import HelpdeskAccountManager from 'components/account/account-grid';
import Home from 'components/home';
import IncidentManager from 'components/workflow/incident-manager';
import Login from 'components/login';
import SettingsManager from 'components/system/settings-manager';
import MapViewerComponent from 'components/map-viewer';
import MarketplaceAccountManager from 'components/account-marketplace/account-grid';
import MarketplaceAccountView from 'components/account-marketplace/account-form';
import MessageInboxHelpdesk from 'components/message-inbox-helpdesk/message-grid';
import MessageInboxUser from 'components/message-inbox-user/message-grid';
import PayInDetails from 'components/payin/payin-details';
import PayInManager from 'components/payin/payin-manager';
import PayOutDetails from 'components/payout/payout-details';
import PayOutManager from 'components/payout/payout-manager';
import PlaceHolder from 'components/placeholder';
import ProcessInstanceForm from 'components/workflow/process-instance-form';
import ProcessInstanceTaskForm from 'components/workflow/process-instance-task-form';
import ProcessInstanceHistoryForm from 'components/workflow/process-instance-history-form';
import ProcessInstanceManager from 'components/workflow/process-instance-manager';
import ProcessInstanceTaskManager from 'components/workflow/task-manager';
import ProcessInstanceHistoryManager from 'components/workflow/process-instance-history-manager';
import Profile from 'components/profile';
import ProviderManager from 'components/provider/provider-grid';
import OrderDetails from 'components/order/order-details';
import OrderManager from 'components/order/order-manager';
import QueryEditor from './analytics/query-editor';
import SecureRoute from 'components/secure-route';
import SubscriptionBillingManager from 'components/subscription-billing-batch/billing-manager';
import TransferManager from 'components/transfer/transfer-grid';

// Model
import { DynamicRoutes, ErrorPages, Pages, StaticRoutes } from 'model/routes';
import { EnumHelpdeskRole as EnumRole } from 'model/role';

class ContentRoot extends React.Component<PropsFromRedux> {

  render() {
    let authenticated = (this.props.profile != null);
    let routes;

    if (!authenticated) {
      routes = (
        <Routes>
          {/* Handle errors first */}
          <Route path={ErrorPages.Unauthorized} element={<ErrorPage code={401} color={'secondary'} />} />
          <Route path={ErrorPages.Forbidden} element={<ErrorPage code={403} color={'secondary'} />} />
          <Route path={ErrorPages.NotFound} element={<ErrorPage code={404} color={'primary'} />} />
          <Route path={ErrorPages.InternalServerError} element={<ErrorPage code={500} color={'secondary'} />} />
          {/* Public paths */}
          <Route path={Pages.Login} element={<Login />} />
          <Route path={Pages.ResetPassword} element={<PlaceHolder />} />
          {/* Default redirect */}
          <Route path={Pages.ResetPassword} element={<PlaceHolder />} />
          <Route path="*" element={<Navigate to={Pages.Login} replace />} />
        </Routes>
      );
    } else {
      routes = (
        <Routes>
          {/* Handle errors first */}
          <Route path={ErrorPages.Unauthorized} element={<ErrorPage code={401} color={'secondary'} />} />
          <Route path={ErrorPages.Forbidden} element={<ErrorPage code={403} color={'secondary'} />} />
          <Route path={ErrorPages.NotFound} element={<ErrorPage code={404} color={'primary'} />} />
          <Route path={ErrorPages.InternalServerError} element={<ErrorPage code={500} color={'secondary'} />} />
          {/*
            Redirect for authenticated users. Navigation after a successful login operation
            occurs after the component hierarchy is rendered due to state change and causes
            /error/404 to render
          */}
          <Route path={Pages.Login} element={<Navigate to={StaticRoutes.Dashboard} replace />} />
          <Route path={Pages.ResetPassword} element={<Navigate to={StaticRoutes.Dashboard} replace />} />

          {/* Layout */}
          <Route path="/" element={<Home />}>
            {/* Default component */}
            <Route path="/" element={<Navigate to={StaticRoutes.Dashboard} replace />} />

            {/* Dynamic */}
            <Route path={DynamicRoutes.AccountUpdate} element={<AccountForm />} />
            <Route path={DynamicRoutes.AccountCreate} element={<AccountForm />} />
            <Route path={DynamicRoutes.ContractCreate} element={<ContractForm />} />
            <Route path={DynamicRoutes.ContractUpdate} element={<ContractForm />} />
            <Route path={DynamicRoutes.DraftContractViewer} element={<DraftContractViewer />} />
            <Route path={DynamicRoutes.OrderTimeline} element={<OrderDetails />} />
            <Route path={DynamicRoutes.MarketplaceAccountView} element={<MarketplaceAccountView />} />
            <Route path={DynamicRoutes.ProcessInstanceHistoryView} element={<ProcessInstanceHistoryForm />} />
            <Route path={DynamicRoutes.ProcessInstanceView} element={<ProcessInstanceForm />} />
            <Route path={DynamicRoutes.ProcessInstanceTaskView} element={<ProcessInstanceTaskForm />} />
            <Route path={DynamicRoutes.PayInView} element={<PayInDetails />} />
            <Route path={DynamicRoutes.PayOutView} element={<PayOutDetails />} />
            {/* Static */}
            <Route path={StaticRoutes.Analytics} element={<QueryEditor />} />
            <Route path={StaticRoutes.Dashboard} element={<DashboardComponent />} />
            <Route path={StaticRoutes.ConsumerManager} element={<ConsumerManager />} />
            <Route path={StaticRoutes.ContractManager} element={<ContractManager />} />
            <Route path={StaticRoutes.DraftManager} element={<AssetDraftManager />} />
            <Route path={StaticRoutes.EventManager} element={<EventManager />} />
            <Route path={StaticRoutes.OrderManager} element={<OrderManager />} />
            <Route path={StaticRoutes.PayInManager} element={<PayInManager />} />
            <Route path={StaticRoutes.PayOutManager} element={<PayOutManager />} />
            <Route path={StaticRoutes.ProviderManager} element={<ProviderManager />} />
            <Route path={StaticRoutes.SubscriptionBillingManager} element={<SubscriptionBillingManager />} />
            <Route path={StaticRoutes.TransferManager} element={<TransferManager />} />
            <Route path={StaticRoutes.SettingsManager} element={<SettingsManager />} />
            <Route path={StaticRoutes.Map} element={<MapViewerComponent />} />
            <Route path={StaticRoutes.MessageInboxHelpdesk} element={<MessageInboxHelpdesk />} />
            <Route path={StaticRoutes.MessageInboxUser} element={<MessageInboxUser />} />
            <Route path={StaticRoutes.Profile} element={<Profile />} />
            <Route path={StaticRoutes.Settings} element={<PlaceHolder />} />

            {/* Secured paths */}
            <Route path={StaticRoutes.HelpdeskAccountManager} element={<SecureRoute roles={[EnumRole.ADMIN]} />}>
              <Route path={StaticRoutes.HelpdeskAccountManager} element={<HelpdeskAccountManager />} />
            </Route>
            <Route path={StaticRoutes.IncidentManager} element={<SecureRoute roles={[EnumRole.ADMIN]} />}>
              <Route path={StaticRoutes.IncidentManager} element={<IncidentManager />} />
            </Route>
            <Route path={StaticRoutes.MarketplaceAccountManager} element={<SecureRoute roles={[EnumRole.ADMIN]} />}>
              <Route path={StaticRoutes.MarketplaceAccountManager} element={<MarketplaceAccountManager />} />
            </Route>
            <Route path={StaticRoutes.ProcessInstanceManager} element={<SecureRoute roles={[EnumRole.ADMIN]} />}>
              <Route path={StaticRoutes.ProcessInstanceManager} element={<ProcessInstanceManager />} />
            </Route>
            <Route path={StaticRoutes.ProcessInstanceTaskManager} element={<SecureRoute roles={[EnumRole.ADMIN]} />}>
              <Route path={StaticRoutes.ProcessInstanceTaskManager} element={<ProcessInstanceTaskManager />} />
            </Route>
            <Route path={StaticRoutes.ProcessInstanceHistoryManager} element={<SecureRoute roles={[EnumRole.ADMIN]} />}>
              <Route path={StaticRoutes.ProcessInstanceHistoryManager} element={<ProcessInstanceHistoryManager />} />
            </Route>

            {/* Default */}
            <Route path="*" element={<Navigate to={ErrorPages.NotFound} replace />} />
          </Route>
        </Routes>
      );
    }

    return (
      <div>
        {routes}
        <ToastContainer
          className="opertusmundi-toastify"
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnHover
          icon={false}
        />
      </div>
    );
  }
}

//
// Container component
//

const mapState = (state: RootState) => ({
  profile: state.security.profile,
});

const connector = connect(
  mapState,
);

type PropsFromRedux = ConnectedProps<typeof connector>


export default connector(ContentRoot)