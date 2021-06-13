import React from 'react';

/**
 * Libraries
 */
import * as pathToRegexp from 'path-to-regexp';

/**
 * Components
 */
import OrderTimelineToolbar from 'components/order/toolbar/order-timeline';

/**
 * Icons
 */

import Icon from '@mdi/react';

import {
  mdiAccountMultiple,
  mdiBadgeAccountOutline,
  mdiBellAlertOutline,
  mdiCogOutline,
  mdiCogSyncOutline,
  mdiFaceAgent,
  mdiForumOutline,
  mdiHandshakeOutline,
  mdiMapOutline,
  mdiPackageVariantClosed,
  mdiSignatureFreehand,
  mdiTextBoxCheckOutline,
  mdiViewDashboardOutline,
} from '@mdi/js';

/**
 * Model
 */
import { RootState } from 'store';

import { EnumRole } from './role';
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

const Dashboard = '/dashboard';
const ConsumerManager = '/consumers';
//const ContractMaster = '/contract/master';
const ContractManager = '/contract/list';
const Map = '/map';
const MessageManager = '/messages';
const OrderManager = '/billing/orders';
const PayInManager = '/billing/payins';
const PayOutManager = '/billing/payouts';
const Profile = '/profile';
const ProviderManager = '/providers'
const Settings = '/settings';
const HelpdeskAccountManager = '/helpdesk/users';
const MarketplaceAccountManager = '/marketplace/users'
const DraftManager = '/drafts';
const ProcessInstanceManager = '/workflows/process-instances';
const IncidentManager = '/workflow/incidents'

export const StaticRoutes = {
  Dashboard,
  ConsumerManager,
  //ContractMaster,
  ContractManager,
  Map,
  MessageManager,
  OrderManager,
  PayInManager,
  PayOutManager,
  Profile,
  ProviderManager,
  Settings,
  HelpdeskAccountManager,
  MarketplaceAccountManager,
  DraftManager,
  ProcessInstanceManager,
  IncidentManager,
};

/**
 * Dynamic routes
 */

const AccountCreate = '/admin/users/record/create';
const AccountUpdate = '/admin/users/record/update/:id';
const ContractCreate = '/contract/create';
const ContractReview = '/contract/review';
const OrderTimeline = '/billing/order/:key/timeline';
const OrderView = '/billing/order/:key';
const PayInView = '/billing/payin/:key';

export const DynamicRoutes = {
  AccountCreate,
  AccountUpdate,
  ContractCreate,
  ContractReview,
  OrderTimeline,
  OrderView,
  PayInView,
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

interface Route {
  breadcrumb?: boolean;
  progressBar?: boolean
  description: string;
  icon?: iconFunc;
  title?: string;
  defaultTitle?: string;
  links?: string[];
  roles?: ((roles: EnumRole[], state: RootState) => boolean) | EnumRole[];
  toolbarComponent?: () => React.ReactNode;
  params?: string[];
}

interface RouteRegistry {
  [route: string]: Route;
}

const routes: RouteRegistry = {
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

  [Map]: {
    icon: (className?: string) => (<Icon path={mdiMapOutline} size="1.5rem" className={className} />),
    description: 'Map',
    title: 'links.map',
    defaultTitle: 'Map',
    links: [Dashboard]
  },
  [MessageManager]: {
    icon: (className?: string) => (<Icon path={mdiForumOutline} size="1.5rem" className={className} />),
    description: 'Messages',
    title: 'links.message-manager',
    defaultTitle: 'Messages',
    links: [Dashboard]
  },
  [OrderManager]: {
    icon: (className?: string) => (<Icon path={mdiPackageVariantClosed} size="1.5rem" className={className} />),
    description: 'Orders',
    title: 'links.order-manager',
    defaultTitle: 'Orders',
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
    title: 'links.account.helpdesk',
    defaultTitle: 'Helpdesk Account Management',
    roles: [EnumRole.ADMIN],
    links: [Dashboard],
  },
  [MarketplaceAccountManager]: {
    icon: (className?: string) => (<Icon path={mdiAccountMultiple} size="1.5rem" className={className} />),
    description: 'Manage marketplace accounts',
    title: 'links.account.marketplace',
    defaultTitle: 'Marketplace Account Management',
    roles: [EnumRole.ADMIN],
    links: [Dashboard],
  },
  [ProcessInstanceManager]: {
    icon: (className?: string) => (<Icon path={mdiCogSyncOutline} size="1.5rem" className={className} />),
    description: 'Manage BPM Server workflows',
    title: 'links.workflow.process-instance.manager',
    defaultTitle: 'Process Instance Management',
    roles: [EnumRole.ADMIN],
    links: [Dashboard, IncidentManager],
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
    title: 'links.draft.explorer',
    defaultTitle: 'Draft Management',
    links: [Dashboard],
  },
  // Dynamic
  [AccountCreate]: {
    description: 'Create new account record',
    title: 'links.account.create',
    defaultTitle: 'Create Account',
    roles: [EnumRole.ADMIN],
    links: defaultLinks,
  },
  [AccountUpdate]: {
    description: 'Update account record',
    title: 'links.account.update',
    defaultTitle: 'Update Account',
    roles: [EnumRole.ADMIN],
    links: defaultLinks,
  },
  [ContractCreate]: {
    description: 'Create or update a contract',
    title: 'links.contract.create',
    defaultTitle: 'Create master contract',
    roles: [EnumRole.ADMIN],
    links: defaultLinks,
    progressBar: true,
  },
  [ContractReview]: {
    description: 'Review a contract',
    title: 'links.contract.review',
    defaultTitle: 'Review master contract',
    roles: [EnumRole.ADMIN],
    links: defaultLinks,
    progressBar: true,
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
  [PayInView]: {
    description: 'PayIn',
    title: 'links.billing.payin.record',
    defaultTitle: 'PayIn',
    links: defaultLinks
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
export function buildPath(path: string, params: string[] | { [key: string]: string }) {
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
  return result;
}
