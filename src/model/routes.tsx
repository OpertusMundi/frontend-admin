import React from 'react';

/**
 * Libraries
 */
import * as pathToRegexp from 'path-to-regexp';

/**
 * Components
 */
import AccountManagerToolbar from 'components/account/toolbar';
import AnalyticsToolbar from 'components/analytics/toolbar';
import MarketplaceAccountToolbar from 'components/account-marketplace/form/toolbar';
import MessageInboxHelpdeskToolbar from 'components/message-inbox-helpdesk/toolbar';
import MessageInboxUserToolbar from 'components/message-inbox-user/toolbar';
import OrderTimelineToolbar from 'components/order/toolbar/order-timeline';
import ProcessInstanceToolbar from 'components/workflow/toolbar/process-instance';
import ProcessInstanceHistoryToolbar from 'components/workflow/toolbar/process-instance-history';
/**
 * Icons
 */

import Icon from '@mdi/react';

import {
  mdiAccountMultiple,
  mdiBadgeAccountOutline,
  mdiBankTransferIn,
  mdiBankTransferOut,
  mdiBugOutline,
  mdiChartBarStacked,
  mdiBellAlertOutline,
  mdiCogOutline,
  mdiCogSyncOutline,
  mdiFaceAgent,
  mdiHandshakeOutline,
  mdiMapOutline,
  mdiPackageVariantClosed,
  mdiSignatureFreehand,
  mdiTextBoxCheckOutline,
  mdiTray,
  mdiTrayFull,
  mdiViewDashboardOutline,
  mdiWalletOutline,
  mdiProgressWrench,
  mdiFileSign,
} from '@mdi/js';

/**
 * Model
 */
import { RootState } from 'store';

import { EnumHelpdeskRole as EnumRole } from './role';
import { iconFunc } from './types';


/**
 * Routes for utility pages
 */
const Login = '/sign-in';
const ResetPassword = '/reset-password';

export const Pages = {
  Login,
  ResetPassword,
};

/**
 * Static routes
 */

const Analytics = '/analytics/query-editor';
const ConsumerManager = '/consumers';
const ContractManager = '/contract/list';
const Dashboard = '/dashboard';
const DraftManager = '/drafts';
const EventManager = '/events';
const HelpdeskAccountManager = '/helpdesk/users';
const IncidentManager = '/workflow/incidents'
const MaintenanceManager = '/maintenance';
const Map = '/map';
const MarketplaceAccountManager = '/marketplace/users'
const MessageInboxHelpdesk = '/messages/inbox/helpdesk';
const MessageInboxUser = '/messages/inbox/user';
const OrderManager = '/billing/orders';
const PayInManager = '/billing/payins';
const PayOutManager = '/billing/payouts';
const ProcessInstanceManager = '/workflows/process-instances';
const ProcessInstanceHistoryManager = '/workflows/process-instances-history';
const Profile = '/profile';
const ProviderManager = '/providers'
const Settings = '/settings';
const TransferManager = '/billing/transfers';

export const StaticRoutes = {
  Analytics,
  ConsumerManager,
  ContractManager,
  Dashboard,
  IncidentManager,
  Map,
  MessageInboxHelpdesk,
  MessageInboxUser,
  OrderManager,
  PayInManager,
  PayOutManager,
  Profile,
  ProviderManager,
  Settings,
  HelpdeskAccountManager,
  MarketplaceAccountManager,
  DraftManager,
  EventManager,
  ProcessInstanceManager,
  ProcessInstanceHistoryManager,
  TransferManager,
  MaintenanceManager,
};

/**
 * Dynamic routes
 */

const AccountCreate = '/helpdesk/users/record/create';
const AccountUpdate = '/helpdesk/users/record/update/:id';
const ContractCreate = '/contract/create';
const ContractUpdate = '/contract/update/:id';
const DraftContractViewer = '/drafts/provider/:providerKey/draft/:draftKey/contract';
const OrderTimeline = '/billing/order/:key/timeline';
const OrderView = '/billing/order/:key';
const MarketplaceAccountView = '/marketplace/users/record/:key';
const PayInView = '/billing/payin/:key';
const PayOutView = '/billing/payout/:key';
const ProcessInstanceView = '/workflows/process-instances/record';
const ProcessInstanceHistoryView = '/workflows/process-instances-history/record';
const TransferView = '/billing/transfer/:key';

export const DynamicRoutes = {
  AccountCreate,
  AccountUpdate,
  ContractCreate,
  ContractUpdate,
  DraftContractViewer,
  MarketplaceAccountView,
  OrderTimeline,
  OrderView,
  PayInView,
  PayOutView,
  ProcessInstanceView,
  ProcessInstanceHistoryView,
  TransferView,
};

/**
 * Routes for error pages
 */

const Unauthorized = '/error/401';
const Forbidden = '/error/403';
const NotFound = '/error/404';
const InternalServerError = '/error/500';

export const ErrorPages = {
  Unauthorized,
  Forbidden,
  NotFound,
  InternalServerError,
};

/**
 * Default links
 */
const defaultLinks = [Dashboard];

export interface Route {
  breadcrumb?: boolean;
  progressBar?: boolean
  description: string;
  icon?: iconFunc;
  title?: string;
  defaultTitle?: string;
  links?: string[];
  roles?: ((roles: EnumRole[], state: RootState) => boolean) | EnumRole[];
  toolbarComponent?: (route: Route) => React.ReactNode;
  params?: string[];
}

interface RouteRegistry {
  [route: string]: Route;
}

export const routes: RouteRegistry = {
  // Pages
  [Login]: {
    description: 'Login to workbench application',
  },
  [ResetPassword]: {
    description: 'Reset user password',
  },
  // Static
  [Dashboard]: {
    icon: (className?: string) => (<Icon path={mdiViewDashboardOutline} size="1.5rem" className={className} />),
    description: 'Initial page',
    title: 'links.dashboard',
    defaultTitle: 'Dashboard',
    links: []
  },
  [ConsumerManager]: {
    icon: (className?: string) => (<Icon path={mdiFaceAgent} size="1.5rem" className={className} />),
    description: 'Consumers',
    title: 'links.consumer-manager',
    defaultTitle: 'Consumers',
    links: defaultLinks
  },
  [ContractManager]: {
    icon: (className?: string) => (<Icon path={mdiSignatureFreehand} size="1.5rem" className={className} />),
    description: 'Master contract list',
    title: 'links.contract.list.title',
    defaultTitle: 'Master Contract List',
    links: defaultLinks
  },
  [Analytics]: {
    icon: (className?: string) => (<Icon path={mdiChartBarStacked} size="1.5rem" className={className} />),
    description: 'Analytics',
    title: 'links.analytics',
    defaultTitle: 'Analytics',
    links: [Dashboard],
    toolbarComponent: (route: Route): React.ReactNode => {
      return (
        <AnalyticsToolbar route={route} />
      );
    },
  },
  [Map]: {
    icon: (className?: string) => (<Icon path={mdiMapOutline} size="1.5rem" className={className} />),
    description: 'Map',
    title: 'links.map',
    defaultTitle: 'Map',
    links: [Dashboard]
  },
  [MessageInboxHelpdesk]: {
    icon: (className?: string) => (<Icon path={mdiTrayFull} size="1.5rem" className={className} />),
    description: 'Helpdesk Inbox',
    title: 'links.message-inbox-helpdesk',
    defaultTitle: 'Helpdesk Inbox',
    links: [Dashboard],
    toolbarComponent: (route: Route): React.ReactNode => {
      return (
        <MessageInboxHelpdeskToolbar route={route} />
      );
    }
  },
  [MessageInboxUser]: {
    icon: (className?: string) => (<Icon path={mdiTray} size="1.5rem" className={className} />),
    description: 'User Inbox',
    title: 'links.message-inbox-user',
    defaultTitle: 'User Inbox',
    links: [Dashboard],
    toolbarComponent: (route: Route): React.ReactNode => {
      return (
        <MessageInboxUserToolbar route={route} />
      );
    }
  },
  [OrderManager]: {
    icon: (className?: string) => (<Icon path={mdiPackageVariantClosed} size="1.5rem" className={className} />),
    description: 'Orders',
    title: 'links.order-manager',
    defaultTitle: 'Orders',
    links: defaultLinks
  },
  [PayInManager]: {
    icon: (className?: string) => (<Icon path={mdiBankTransferIn} size="1.5rem" className={className} />),
    description: 'Billing',
    title: 'links.payin-manager',
    defaultTitle: 'Billing',
    links: defaultLinks
  },
  [PayOutManager]: {
    icon: (className?: string) => (<Icon path={mdiBankTransferOut} size="1.5rem" className={className} />),
    description: 'Billing',
    title: 'links.payout-manager',
    defaultTitle: 'Billing',
    links: defaultLinks
  },
  [TransferManager]: {
    icon: (className?: string) => (<Icon path={mdiWalletOutline} size="1.5rem" className={className} />),
    description: 'Billing',
    title: 'links.transfer-manager',
    defaultTitle: 'Billing',
    links: defaultLinks
  },
  [Profile]: {
    icon: (className?: string) => (<Icon path={mdiBadgeAccountOutline} size="1.5rem" className={className} />),
    description: 'Profile',
    title: 'links.profile',
    defaultTitle: 'Profile',
    links: defaultLinks
  },
  [ProviderManager]: {
    icon: (className?: string) => (<Icon path={mdiHandshakeOutline} size="1.5rem" className={className} />),
    description: 'Providers',
    title: 'links.provider-manager',
    defaultTitle: 'Providers',
    links: defaultLinks
  },
  [Settings]: {
    icon: (className?: string) => (<Icon path={mdiCogOutline} size="1.5rem" className={className} />),
    description: 'Settings',
    title: 'links.settings',
    defaultTitle: 'Settings',
    links: defaultLinks
  },
  [HelpdeskAccountManager]: {
    icon: (className?: string) => (<Icon path={mdiFaceAgent} size="1.5rem" className={className} />),
    description: 'Manage helpdesk accounts',
    title: 'links.account.helpdesk.manager',
    defaultTitle: 'Helpdesk Account Management',
    roles: [EnumRole.ADMIN],
    links: [Dashboard],
    toolbarComponent: (route: Route): React.ReactNode => {
      return (
        <AccountManagerToolbar route={route} />
      )
    },
  },
  [MarketplaceAccountManager]: {
    icon: (className?: string) => (<Icon path={mdiAccountMultiple} size="1.5rem" className={className} />),
    description: 'Manage marketplace accounts',
    title: 'links.account.marketplace.manager',
    defaultTitle: 'Marketplace Account Management',
    roles: [EnumRole.ADMIN],
    links: [Dashboard],
  },
  [ProcessInstanceManager]: {
    icon: (className?: string) => (<Icon path={mdiCogSyncOutline} size="1.5rem" className={className} />),
    description: 'Manage BPM Server workflows',
    title: 'links.workflow.process-instance.manager.runtime',
    defaultTitle: 'Process Instance Management',
    roles: [EnumRole.ADMIN],
    links: [Dashboard, ProcessInstanceHistoryManager, IncidentManager],
  },
  [ProcessInstanceHistoryManager]: {
    icon: (className?: string) => (<Icon path={mdiCogSyncOutline} size="1.5rem" className={className} />),
    description: 'Manage BPM Server workflow history',
    title: 'links.workflow.process-instance.manager.history',
    defaultTitle: 'Process Instance Management',
    roles: [EnumRole.ADMIN],
    links: [Dashboard, ProcessInstanceManager, IncidentManager],
  },
  [IncidentManager]: {
    icon: (className?: string) => (<Icon path={mdiBellAlertOutline} size="1.5rem" className={className} />),
    description: 'View BPM Server incidents',
    title: 'links.workflow.incident.manager',
    defaultTitle: 'Incident Management',
    roles: [EnumRole.ADMIN],
    links: [Dashboard, ProcessInstanceManager],
  },
  [DraftManager]: {
    icon: (className?: string) => (<Icon path={mdiTextBoxCheckOutline} size="1.5rem" className={className} />),
    description: 'Manage provider draft assets',
    title: 'links.draft-manager',
    defaultTitle: 'Draft Management',
    links: [Dashboard],
  },
  [EventManager]: {
    icon: (className?: string) => (<Icon path={mdiBugOutline} size="1.5rem" className={className} />),
    description: 'System Events',
    title: 'links.event-manager',
    defaultTitle: 'System Events',
    links: [Dashboard],
  },
  [MaintenanceManager]: {
    icon: (className?: string) => (<Icon path={mdiProgressWrench} size="1.5rem" className={className} />),
    description: 'Maintenance Tasks',
    title: 'links.maintenance-manager',
    defaultTitle: 'Maintenance Tasks',
    links: [Dashboard],
  },
  // Dynamic
  [AccountCreate]: {
    description: 'Create new account record',
    title: 'links.account.helpdesk.create',
    defaultTitle: 'Create Account',
    roles: [EnumRole.ADMIN],
    links: defaultLinks,
  },
  [AccountUpdate]: {
    description: 'Update account record',
    title: 'links.account.helpdesk.update',
    defaultTitle: 'Update Account',
    roles: [EnumRole.ADMIN],
    links: defaultLinks,
  },
  [ContractCreate]: {
    description: 'Create a new draft',
    title: 'links.contract.create',
    defaultTitle: 'Create master contract',
    roles: [EnumRole.ADMIN],
    links: defaultLinks,
    progressBar: true,
  },
  [ContractUpdate]: {
    description: 'Update a draft',
    title: 'links.contract.update',
    defaultTitle: 'Update master contract',
    roles: [EnumRole.ADMIN],
    links: defaultLinks,
    progressBar: true,
  },
  [DraftContractViewer]: {
    icon: (className?: string) => (<Icon path={mdiFileSign} size="1.5rem" className={className} />),
    description: 'Draft contract viewer',
    title: 'links.draft.contract-viewer',
    defaultTitle: 'Draft contract viewer',
    roles: [EnumRole.ADMIN],
    links: [Dashboard, DraftManager],
    progressBar: true,
  },
  [MarketplaceAccountView]: {
    description: 'View Marketplace Account',
    title: 'links.account.marketplace.view',
    defaultTitle: 'Create Account',
    roles: [EnumRole.ADMIN],
    links: defaultLinks,
    toolbarComponent: (route: Route): React.ReactNode => {
      return (
        <MarketplaceAccountToolbar route={route} />
      );
    }
  },
  [OrderTimeline]: {
    description: 'Order Timeline',
    title: 'links.billing.order.timeline',
    defaultTitle: 'Order Timeline',
    links: defaultLinks,
    toolbarComponent: (): React.ReactNode => {
      return (
        <OrderTimelineToolbar />
      );
    }
  },
  [OrderView]: {
    description: 'Order',
    title: 'links.billing.order.record',
    defaultTitle: 'Order',
    links: defaultLinks
  },
  [PayInView]: {
    description: 'PayIn',
    title: 'links.billing.payin.record',
    defaultTitle: 'PayIn',
    links: defaultLinks
  },
  [PayOutView]: {
    description: 'PayOut',
    title: 'links.billing.payout.record',
    defaultTitle: 'PayOut',
    links: defaultLinks
  },
  [ProcessInstanceView]: {
    description: 'Process Instance',
    title: 'links.workflow.process-instance.instance',
    defaultTitle: 'Process Instance',
    links: defaultLinks,
    toolbarComponent: (): React.ReactNode => {
      return (
        <ProcessInstanceToolbar />
      );
    }
  },
  [ProcessInstanceHistoryView]: {
    description: 'Process Instance',
    title: 'links.workflow.process-instance.instance',
    defaultTitle: 'Process Instance',
    links: defaultLinks,
    toolbarComponent: (): React.ReactNode => {
      return (
        <ProcessInstanceHistoryToolbar />
      );
    }
  },
  // Error Pages
  [Unauthorized]: {
    description: 'Unauthorized',
  },
  [Forbidden]: {
    description: 'Forbidden',
  },
  [NotFound]: {
    description: 'Not Found',
  },
  [InternalServerError]: {
    description: 'Internal Server Error',
  },
};

export interface RouteMatch {
  path: string,
  route: string,
  properties: Route,
  params: string[],
}
/**
 * Matches the given path to an existing route and returns the route or null
 * if no match is found
 *
 * @export
 * @param {any} path - the route path to match
 * @returns an object with the initial path, the route that matched the given path, the route properties
 * and an array of the parameters. If no match if found, null is returned
 */
export function matchRoute(path: string): RouteMatch | null {
  for (let route in routes) {
    let re = pathToRegexp.pathToRegexp(route);
    const result = re.exec(path);
    if (result) {
      return {
        path,
        route,
        properties: routes[route],
        params: result.splice(1, result.length),
      };
    }
  }

  return null;
}

/**
 * Find a route by its path e.g. /Dashboard
 *
 * @export
 * @param {string} path - the route path
 * @returns the route properties
 */
export function getRoute(path: string): Route | null {
  const match = matchRoute(path);

  if (match) {
    return {
      ...routes[match.route],
      params: match.params,
    };
  }
  return null;
}

/**
 * Build a path given a route and optional parameters
 *
 * @export
 * @param {string} path - The route name
 * @param {string[]|object} params - Optional parameters to bind
 */
export function buildPath(path: string, params: string[] | { [key: string]: string } | null, query?: { [key: string]: string | null }) {
  let result = path || '/';

  if (params) {
    if (Array.isArray(params)) {
      let re = /:\w+/i;
      for (const value of params) {
        result = result.replace(re, value);
      }
    } else {
      let toPath = pathToRegexp.compile(path);
      result = toPath(params);
    }
  }
  if (query) {
    result += '?' + Object.keys(query)
      .filter(key => query[key] !== null)
      .map(key => `${key}=${query[key]}`)
      .join('&');
  }
  return result;
}
