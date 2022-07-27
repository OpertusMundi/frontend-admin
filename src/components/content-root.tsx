import React, { lazy } from 'react';

import { connect, ConnectedProps } from 'react-redux';
import { Route, Routes, Navigate } from 'react-router-dom';

// 3rd party components
import { ToastContainer } from 'react-toastify';

// State
import { RootState } from 'store';
import { toggleSendMessageDialog } from 'store/message/actions';

// Components
import DashboardComponent from 'components/dashboard';
import ErrorPage from 'components/error-page';
import Home from 'components/home';
import Login from 'components/login';
import PlaceHolder from 'components/placeholder';

// Model
import { DynamicRoutes, ErrorPages, Pages, StaticRoutes } from 'model/routes';
import { EnumHelpdeskRole as EnumRole } from 'model/role';

// Lazy loaded components
const AccountForm = lazy(() => import('components/account/account-form'));
const AssetDraftManager = lazy(() => import('components/draft/draft-grid'));
const ConsumerManager = lazy(() => import('components/consumer/consumer-grid'));
const ContractForm = lazy(() => import('components/contract/contract-form'));
const ContractManager = lazy(() => import('components/contract/contract-grid'));
const DraftContractViewer = lazy(() => import('components/draft/contract-viewer/contract-viewer'));
const EventManager = lazy(() => import('components/event/event-manager'));
const HelpdeskAccountManager = lazy(() => import('components/account/account-grid'));
const IncidentManager = lazy(() => import('components/workflow/incident-manager'));
const SettingsManager = lazy(() => import('components/system/settings-manager'));
const MaintenanceTasks = lazy(() => import('components/system/maintenance-tasks'));
const MapViewerComponent = lazy(() => import('components/map-viewer'));
const MarketplaceAccountManager = lazy(() => import('components/account-marketplace/account-grid'));
const MarketplaceAccountView = lazy(() => import('components/account-marketplace/account-form'));
const MessageDialogComponent = lazy(() => import('components/message/message-send-dialog'));
const MessageInboxHelpdesk = lazy(() => import('components/message-inbox-helpdesk/message-grid'));
const MessageInboxUser = lazy(() => import('components/message-inbox-user/message-grid'));
const PayInDetails = lazy(() => import('components/payin/payin-details'));
const PayInManager = lazy(() => import('components/payin/payin-manager'));
const PayOutDetails = lazy(() => import('components/payout/payout-details'));
const PayOutManager = lazy(() => import('components/payout/payout-manager'));
const ProcessInstanceForm = lazy(() => import('components/workflow/process-instance-form'));
const ProcessInstanceTaskForm = lazy(() => import('components/workflow/process-instance-task-form'));
const ProcessInstanceHistoryForm = lazy(() => import('components/workflow/process-instance-history-form'));
const ProcessInstanceManager = lazy(() => import('components/workflow/process-instance-manager'));
const ProcessInstanceTaskManager = lazy(() => import('components/workflow/task-manager'));
const ProcessInstanceHistoryManager = lazy(() => import('components/workflow/process-instance-history-manager'));
const Profile = lazy(() => import('components/profile'));
const ProviderManager = lazy(() => import('components/provider/provider-grid'));
const OrderDetails = lazy(() => import('components/order/order-details'));
const OrderManager = lazy(() => import('components/order/order-manager'));
const QueryEditor = lazy(() => import('./analytics/query-editor'));
const SecureRoute = lazy(() => import('components/secure-route'));
const SubscriptionBillingManager = lazy(() => import('components/subscription-billing-batch/billing-manager'));
const TransferManager = lazy(() => import('components/transfer/transfer-grid'));

class ContentRoot extends React.Component<PropsFromRedux> {

  closeSendMessageDialog() {
    this.props.toggleSendMessageDialog();
  }

  render() {
    const { profile, sendMessageContact, sendMessageSubject } = this.props;
    const authenticated = profile != null;

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
            <Route path={StaticRoutes.MaintenanceTasks} element={<MaintenanceTasks />} />
            <Route path={StaticRoutes.Map} element={<MapViewerComponent />} />
            <Route path={StaticRoutes.MessageInboxHelpdesk} element={<MessageInboxHelpdesk />} />
            <Route path={StaticRoutes.MessageInboxUser} element={<MessageInboxUser />} />
            <Route path={StaticRoutes.Profile} element={<Profile />} />

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
        {sendMessageContact &&
          <MessageDialogComponent
            close={() => this.closeSendMessageDialog()}
            contact={sendMessageContact}
            defaultSubject={sendMessageSubject}
            open={true}
          />
        }
      </div>
    );
  }
}

//
// Container component
//

const mapState = (state: RootState) => ({
  sendMessageContact: state.message.sendMessageDialog.contact,
  sendMessageSubject: state.message.sendMessageDialog.subject,
  profile: state.security.profile,
});

const mapDispatch = {
  toggleSendMessageDialog,
};

const connector = connect(
  mapState,
  mapDispatch,
);

type PropsFromRedux = ConnectedProps<typeof connector>


export default connector(ContentRoot)