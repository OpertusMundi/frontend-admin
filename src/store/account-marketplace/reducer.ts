import _ from 'lodash';

import moment from 'utils/moment-localized';

import { Order, PageResult, Sorting } from 'model/response';
import { AccountSubscription, EnumMarketplaceAccountSortField, EnumSubscriptionSortField, EnumUserServiceSortField, UserService } from 'model/account-marketplace';

import {
  LOGOUT_INIT,
} from 'store/security/types';

import {
  SET_PAGER,
  RESET_PAGER,
  SET_FILTER,
  RESET_FILTER,
  SEARCH_INIT,
  SEARCH_COMPLETE,
  ADD_SELECTED,
  REMOVE_SELECTED,
  RESET_SELECTED,
  SET_SORTING,
  SEARCH_FAILURE,
  LOAD_ACCOUNT_INIT,
  LOAD_ACCOUNT_FAILURE,
  LOAD_ACCOUNT_SUCCESS,
  SET_EXTERNAL_PROVIDER_INIT,
  SET_EXTERNAL_PROVIDER_COMPLETE,
  AccountActions,
  MarketplaceAccountManagerState,
  ORDER_SET_PAGER,
  ORDER_RESET_PAGER,
  ORDER_SET_SORTING,
  ORDER_SEARCH_INIT,
  ORDER_SEARCH_FAILURE,
  ORDER_SEARCH_COMPLETE,
  PAYIN_SET_PAGER,
  PAYIN_RESET_PAGER,
  PAYIN_SET_SORTING,
  PAYIN_SEARCH_INIT,
  PAYIN_SEARCH_FAILURE,
  PAYIN_SEARCH_COMPLETE,
  TRANSFER_SET_PAGER,
  TRANSFER_RESET_PAGER,
  TRANSFER_SET_SORTING,
  TRANSFER_SEARCH_INIT,
  TRANSFER_SEARCH_FAILURE,
  TRANSFER_SEARCH_COMPLETE,
  PAYOUT_SET_PAGER,
  PAYOUT_RESET_PAGER,
  PAYOUT_SET_SORTING,
  PAYOUT_SEARCH_INIT,
  PAYOUT_SEARCH_FAILURE,
  PAYOUT_SEARCH_COMPLETE,
  BILLABLE_SERVICE_SET_PAGER,
  BILLABLE_SERVICE_RESET_PAGER,
  BILLABLE_SERVICE_SET_SORTING,
  BILLABLE_SERVICE_SEARCH_INIT,
  BILLABLE_SERVICE_SEARCH_FAILURE,
  BILLABLE_SERVICE_SEARCH_COMPLETE,
  SERVICE_BILLING_SET_PAGER,
  SERVICE_BILLING_RESET_PAGER,
  SERVICE_BILLING_SET_SORTING,
  SERVICE_BILLING_SEARCH_INIT,
  SERVICE_BILLING_SEARCH_FAILURE,
  SERVICE_BILLING_SEARCH_COMPLETE,
  SET_TAB_INDEX,
  SET_SERVICE_TYPE,
} from 'store/account-marketplace/types';
import { EnumBillableServiceType, EnumOrderSortField, EnumPayInSortField, EnumPayOutSortField, EnumServiceBillingSortField, EnumTransferSortField } from 'model/order';

const initialState: MarketplaceAccountManagerState = {
  account: null,
  billing: {
    type: EnumBillableServiceType.SUBSCRIPTION,
    subscriptions: {
      items: null,
      loaded: false,
      pagination: {
        page: 0,
        size: 10,
      },
      query: {
        status: [],
      },
      sorting: [{
        id: EnumServiceBillingSortField.CREATED_ON,
        order: Order.DESC,
      }],
    },
  },
  lastUpdated: null,
  loading: false,
  orders: {
    items: null,
    loaded: false,
    pagination: {
      page: 0,
      size: 10,
    },
    query: {
      email: '',
      referenceNumber: '',
      status: [],
    },
    sorting: [{
      id: EnumOrderSortField.MODIFIED_ON,
      order: Order.DESC,
    }],
  },
  pagination: {
    page: 0,
    size: 10,
  },
  payins: {
    items: null,
    loaded: false,
    pagination: {
      page: 0,
      size: 10,
    },
    query: {
      email: '',
      referenceNumber: '',
      status: [],
    },
    sorting: [{
      id: EnumPayInSortField.MODIFIED_ON,
      order: Order.DESC,
    }],
  },
  payouts: {
    items: null,
    loaded: false,
    pagination: {
      page: 0,
      size: 10,
    },
    query: {
      bankwireRef: '',
      email: '',
      status: [],
    },
    sorting: [{
      id: EnumPayOutSortField.MODIFIED_ON,
      order: Order.DESC,
    }],
  },
  query: {
    name: '',
  },
  selected: [],
  response: null,
  result: null,
  sorting: [{
    id: EnumMarketplaceAccountSortField.EMAIL,
    order: Order.ASC,
  }],
  subscriptions: {
    items: null,
    loaded: false,
    pagination: {
      page: 0,
      size: 10,
    },
    query: {
      status: [],
    },
    sorting: [{
      id: EnumSubscriptionSortField.MODIFIED_ON,
      order: Order.DESC,
    }],
  },
  tabIndex: 0,
  transfers: {
    items: null,
    loaded: false,
    pagination: {
      page: 0,
      size: 10,
    },
    query: {
      referenceNumber: '',
      status: [],
    },
    sorting: [{
      id: EnumTransferSortField.EXECUTED_ON,
      order: Order.DESC,
    }],
  },
  userServices: {
    items: null,
    loaded: false,
    pagination: {
      page: 0,
      size: 10,
    },
    query: {
      status: [],
    },
    sorting: [{
      id: EnumUserServiceSortField.UPDATED_ON,
      order: Order.DESC,
    }],
  },
};

export function marketplaceAccountReducer(
  state = initialState,
  action: AccountActions
): MarketplaceAccountManagerState {

  switch (action.type) {
    case LOGOUT_INIT:
      return {
        ...initialState
      };

    case SET_TAB_INDEX:
      return {
        ...state,
        tabIndex: action.tabIndex,
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
          ...initialState.query
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
        response: null,
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
        selected: state.selected.filter(s => !action.removed.some(r => r.key === s.key)),
      };

    case RESET_SELECTED:
      return {
        ...state,
        selected: [],
      };

    case LOAD_ACCOUNT_INIT:
      return {
        ...state,
        loading: true,
        account: null,
      };

    case LOAD_ACCOUNT_FAILURE:
      return {
        ...state,
        loading: false,
      };

    case LOAD_ACCOUNT_SUCCESS:
      return {
        ...state,
        loading: false,
        account: action.account,
        orders: {
          ...initialState.orders,
        },
        payins: {
          ...initialState.payins,
        },
        payouts: {
          ...initialState.payouts,
        },
        transfers: {
          ...initialState.transfers,
        },
        subscriptions: {
          ...initialState.subscriptions,
        },
        tabIndex: action.tabIndex === null ? state.tabIndex : action.tabIndex,
      };

    case SET_EXTERNAL_PROVIDER_INIT:
      return {
        ...state,
        loading: true,
      };

    case SET_EXTERNAL_PROVIDER_COMPLETE:
      return {
        ...state,
        loading: false,
        account: action.response.success ? action.response.result! : state.account,
      };

    case ORDER_SET_PAGER:
      return {
        ...state,
        orders: {
          ...state.orders,
          pagination: {
            page: action.page,
            size: action.size,
          },
        },
      };

    case ORDER_RESET_PAGER:
      return {
        ...state,
        orders: {
          ...state.orders,
          pagination: {
            ...initialState.pagination
          },
        },
      };

    case ORDER_SET_SORTING:
      return {
        ...state,
        orders: {
          ...state.orders,
          sorting: action.sorting,
        },
      };

    case ORDER_SEARCH_INIT:
      return {
        ...state,
        loading: true,
      };

    case ORDER_SEARCH_FAILURE:
      return {
        ...state,
        orders: {
          ...state.orders,
          items: null,
          pagination: {
            page: 0,
            size: state.pagination.size,
          },
        },
        loading: false,
      };

    case ORDER_SEARCH_COMPLETE:
      return {
        ...state,
        orders: {
          ...state.orders,
          loaded: true,
          pagination: {
            page: action.result.pageRequest.page,
            size: action.result.pageRequest.size,
          },
          items: action.result,
        },
        loading: false,
      };

    case PAYIN_SET_PAGER:
      return {
        ...state,
        payins: {
          ...state.payins,
          pagination: {
            page: action.page,
            size: action.size,
          },
        },
      };

    case PAYIN_RESET_PAGER:
      return {
        ...state,
        payins: {
          ...state.payins,
          pagination: {
            ...initialState.pagination
          },
        },
      };

    case PAYIN_SET_SORTING:
      return {
        ...state,
        payins: {
          ...state.payins,
          sorting: action.sorting,
        },
      };

    case PAYIN_SEARCH_INIT:
      return {
        ...state,
        loading: true,
      };

    case PAYIN_SEARCH_FAILURE:
      return {
        ...state,
        payins: {
          ...state.payins,
          items: null,
          pagination: {
            page: 0,
            size: state.pagination.size,
          },
        },
        loading: false,
      };

    case PAYIN_SEARCH_COMPLETE:
      return {
        ...state,
        payins: {
          ...state.payins,
          loaded: true,
          pagination: {
            page: action.result.pageRequest.page,
            size: action.result.pageRequest.size,
          },
          items: action.result,
        },
        loading: false,
      };

    case TRANSFER_SET_PAGER:
      return {
        ...state,
        transfers: {
          ...state.transfers,
          pagination: {
            page: action.page,
            size: action.size,
          },
        },
      };

    case TRANSFER_RESET_PAGER:
      return {
        ...state,
        transfers: {
          ...state.transfers,
          pagination: {
            ...initialState.pagination
          },
        },
      };

    case TRANSFER_SET_SORTING:
      return {
        ...state,
        transfers: {
          ...state.transfers,
          sorting: action.sorting,
        },
      };

    case TRANSFER_SEARCH_INIT:
      return {
        ...state,
        loading: true,
      };

    case TRANSFER_SEARCH_FAILURE:
      return {
        ...state,
        transfers: {
          ...state.transfers,
          items: null,
          pagination: {
            page: 0,
            size: state.pagination.size,
          },
        },
        loading: false,
      };

    case TRANSFER_SEARCH_COMPLETE:
      return {
        ...state,
        transfers: {
          ...state.transfers,
          loaded: true,
          pagination: {
            page: action.result.pageRequest.page,
            size: action.result.pageRequest.size,
          },
          items: action.result,
        },
        loading: false,
      };

    case PAYOUT_SET_PAGER:
      return {
        ...state,
        payouts: {
          ...state.payouts,
          pagination: {
            page: action.page,
            size: action.size,
          },
        },
      };

    case PAYOUT_RESET_PAGER:
      return {
        ...state,
        payouts: {
          ...state.payouts,
          pagination: {
            ...initialState.pagination
          },
        },
      };

    case PAYOUT_SET_SORTING:
      return {
        ...state,
        payouts: {
          ...state.payouts,
          sorting: action.sorting,
        },
      };

    case PAYOUT_SEARCH_INIT:
      return {
        ...state,
        loading: true,
      };

    case PAYOUT_SEARCH_FAILURE:
      return {
        ...state,
        payouts: {
          ...state.payouts,
          items: null,
          pagination: {
            page: 0,
            size: state.pagination.size,
          },
        },
        loading: false,
      };

    case PAYOUT_SEARCH_COMPLETE:
      return {
        ...state,
        payouts: {
          ...state.payouts,
          loaded: true,
          pagination: {
            page: action.result.pageRequest.page,
            size: action.result.pageRequest.size,
          },
          items: action.result,
        },
        loading: false,
      };

    case BILLABLE_SERVICE_SET_PAGER:
      return {
        ...state,
        subscriptions: state.billing.type === EnumBillableServiceType.SUBSCRIPTION ? {
          ...state.subscriptions,
          pagination: {
            page: action.page,
            size: action.size,
          },
        } : state.subscriptions,
        userServices: state.billing.type === EnumBillableServiceType.PRIVATE_OGC_SERVICE ? {
          ...state.userServices,
          pagination: {
            page: action.page,
            size: action.size,
          },
        } : state.userServices,
      };

    case BILLABLE_SERVICE_RESET_PAGER:
      return {
        ...state,
        subscriptions: state.billing.type === EnumBillableServiceType.SUBSCRIPTION ? {
          ...state.subscriptions,
          pagination: {
            ...initialState.pagination
          },
        } : state.subscriptions,
        userServices: state.billing.type === EnumBillableServiceType.PRIVATE_OGC_SERVICE ? {
          ...state.userServices,
          pagination: {
            ...initialState.pagination
          },
        } : state.userServices,
      };

    case BILLABLE_SERVICE_SET_SORTING:
      return {
        ...state,
        subscriptions: state.billing.type === EnumBillableServiceType.SUBSCRIPTION ? {
          ...state.subscriptions,
          sorting: action.sorting as Sorting<EnumSubscriptionSortField>[],
        } : state.subscriptions,
        userServices: state.billing.type === EnumBillableServiceType.PRIVATE_OGC_SERVICE ? {
          ...state.userServices,
          sorting: action.sorting as Sorting<EnumUserServiceSortField>[],
        } : state.userServices,
      };

    case BILLABLE_SERVICE_SEARCH_INIT:
      return {
        ...state,
        loading: true,
      };

    case BILLABLE_SERVICE_SEARCH_FAILURE:
      return {
        ...state,
        subscriptions: state.billing.type === EnumBillableServiceType.SUBSCRIPTION ? {
          ...state.subscriptions,
          items: null,
          pagination: {
            page: 0,
            size: state.pagination.size,
          },
        } : state.subscriptions,
        userServices: state.billing.type === EnumBillableServiceType.PRIVATE_OGC_SERVICE ? {
          ...state.userServices,
          items: null,
          pagination: {
            page: 0,
            size: state.pagination.size,
          },
        } : state.userServices,
        loading: false,
      };

    case BILLABLE_SERVICE_SEARCH_COMPLETE:
      return {
        ...state,
        subscriptions: state.billing.type === EnumBillableServiceType.SUBSCRIPTION ? {
          ...state.subscriptions,
          loaded: true,
          pagination: {
            page: action.result.pageRequest.page,
            size: action.result.pageRequest.size,
          },
          items: action.result as PageResult<AccountSubscription>
        } : state.subscriptions,
        userServices: state.billing.type === EnumBillableServiceType.PRIVATE_OGC_SERVICE ? {
          ...state.userServices,
          loaded: true,
          pagination: {
            page: action.result.pageRequest.page,
            size: action.result.pageRequest.size,
          },
          items: action.result as PageResult<UserService>,
        } : state.userServices,
        loading: false,
      };

    case SERVICE_BILLING_SET_PAGER:
      return {
        ...state,
        billing: {
          ...state.billing,
          subscriptions: {
            ...state.billing.subscriptions,
            pagination: {
              page: action.page,
              size: action.size,
            },
          },
        },
      };

    case SERVICE_BILLING_RESET_PAGER:
      return {
        ...state,
        billing: {
          ...state.billing,
          subscriptions: {
            ...state.billing.subscriptions,
            pagination: {
              ...initialState.pagination
            },
          },
        },
      };

    case SERVICE_BILLING_SET_SORTING:
      return {
        ...state,
        billing: {
          ...state.billing,
          subscriptions: {
            ...state.billing.subscriptions,
            sorting: action.sorting,
          },
        },
      };

    case SERVICE_BILLING_SEARCH_INIT:
      return {
        ...state,
        loading: true,
      };

    case SERVICE_BILLING_SEARCH_FAILURE:
      return {
        ...state,
        billing: {
          ...state.billing,
          subscriptions: {
            ...state.billing.subscriptions,
            items: null,
            pagination: {
              page: 0,
              size: state.pagination.size,
            },
          },
        },
        loading: false,
      };

    case SERVICE_BILLING_SEARCH_COMPLETE:
      return {
        ...state,
        billing: {
          ...state.billing,
          subscriptions: {
            ...state.billing.subscriptions,
            loaded: true,
            pagination: {
              page: action.result.pageRequest.page,
              size: action.result.pageRequest.size,
            },
            items: action.result,
          },
        },
        loading: false,
      };

    case SET_SERVICE_TYPE:
      return {
        ...state,
        billing: {
          ...state.billing,
          type: action.serviceType,
        },
      };

    default:
      return state;
  }

}
