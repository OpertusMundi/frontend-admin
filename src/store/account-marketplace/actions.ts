import { ObjectResponse, PageResult, Sorting } from 'model/response';
import {
  AccountSubscription,
  EnumMarketplaceAccountSortField,
  EnumSubscriptionSortField,
  EnumUserServiceSortField,
  MarketplaceAccount,
  MarketplaceAccountQuery,
  MarketplaceAccountSummary,
  UserService,
} from 'model/account-marketplace';

import {
  AccountActions,
  SET_PAGER,
  RESET_PAGER,
  SET_FILTER,
  RESET_FILTER,
  SEARCH_INIT,
  SEARCH_FAILURE,
  SEARCH_COMPLETE,
  ADD_SELECTED,
  REMOVE_SELECTED,
  SET_SORTING,
  RESET_SELECTED,
  LOAD_ACCOUNT_INIT,
  LOAD_ACCOUNT_FAILURE,
  LOAD_ACCOUNT_SUCCESS,
  SET_EXTERNAL_PROVIDER_INIT,
  SET_EXTERNAL_PROVIDER_COMPLETE,
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
  SET_SERVICE_TYPE,
  SET_TAB_INDEX,
} from './types';
import {
  EnumBillableServiceType,
  EnumOrderSortField,
  EnumPayInSortField,
  EnumPayOutSortField,
  EnumServiceBillingSortField,
  EnumTransferSortField,
  Order,
  PayInItemType,
  PayInType,
  PayOut,
  ServiceBilling,
} from 'model/order';


// Action Creators
export function setPager(page: number, size: number): AccountActions {
  return {
    type: SET_PAGER,
    page,
    size,
  };
}

export function resetPager(): AccountActions {
  return {
    type: RESET_PAGER,
  };
}

export function setFilter(query: Partial<MarketplaceAccountQuery>): AccountActions {
  return {
    type: SET_FILTER,
    query,
  };
}

export function resetFilter(): AccountActions {
  return {
    type: RESET_FILTER,
  };
}

export function setSorting(sorting: Sorting<EnumMarketplaceAccountSortField>[]): AccountActions {
  return {
    type: SET_SORTING,
    sorting,
  };
}

export function searchInit(): AccountActions {
  return {
    type: SEARCH_INIT,
  };
}

export function searchFailure(): AccountActions {
  return {
    type: SEARCH_FAILURE,
  };
}

export function searchComplete(result: PageResult<MarketplaceAccountSummary>): AccountActions {
  return {
    type: SEARCH_COMPLETE,
    result,
  };
}

export function addToSelection(selected: MarketplaceAccountSummary[]): AccountActions {
  return {
    type: ADD_SELECTED,
    selected,
  };
}

export function removeFromSelection(removed: MarketplaceAccountSummary[]): AccountActions {
  return {
    type: REMOVE_SELECTED,
    removed,
  };
}

export function resetSelection(): AccountActions {
  return {
    type: RESET_SELECTED,
  };
}

export function loadAccountInit(key: string): AccountActions {
  return {
    type: LOAD_ACCOUNT_INIT,
    key,
  };
}

export function loadAccountFailure(): AccountActions {
  return {
    type: LOAD_ACCOUNT_FAILURE,
  };
}

export function loadAccountSuccess(account: MarketplaceAccount, tabIndex: number | null = null): AccountActions {
  return {
    type: LOAD_ACCOUNT_SUCCESS,
    account,
    tabIndex,
  };
}

export function setExternalProviderInit(): AccountActions {
  return {
    type: SET_EXTERNAL_PROVIDER_INIT,
  };
}

export function setExternalProviderComplete(response: ObjectResponse<MarketplaceAccount>): AccountActions {
  return {
    type: SET_EXTERNAL_PROVIDER_COMPLETE,
    response,
  };
}

export function setOrderPager(page: number, size: number): AccountActions {
  return {
    type: ORDER_SET_PAGER,
    page,
    size,
  };
}

export function resetOrderPager(): AccountActions {
  return {
    type: ORDER_RESET_PAGER,
  };
}

export function setOrderSorting(sorting: Sorting<EnumOrderSortField>[]): AccountActions {
  return {
    type: ORDER_SET_SORTING,
    sorting,
  };
}

export function searchOrderInit(): AccountActions {
  return {
    type: ORDER_SEARCH_INIT,
  };
}

export function searchOrderFailure(): AccountActions {
  return {
    type: ORDER_SEARCH_FAILURE,
  };
}

export function searchOrderComplete(result: PageResult<Order>): AccountActions {
  return {
    type: ORDER_SEARCH_COMPLETE,
    result,
  };
}

export function setPayInPager(page: number, size: number): AccountActions {
  return {
    type: PAYIN_SET_PAGER,
    page,
    size,
  };
}

export function resetPayInPager(): AccountActions {
  return {
    type: PAYIN_RESET_PAGER,
  };
}

export function setPayInSorting(sorting: Sorting<EnumPayInSortField>[]): AccountActions {
  return {
    type: PAYIN_SET_SORTING,
    sorting,
  };
}

export function searchPayInInit(): AccountActions {
  return {
    type: PAYIN_SEARCH_INIT,
  };
}

export function searchPayInFailure(): AccountActions {
  return {
    type: PAYIN_SEARCH_FAILURE,
  };
}

export function searchPayInComplete(result: PageResult<PayInType>): AccountActions {
  return {
    type: PAYIN_SEARCH_COMPLETE,
    result,
  };
}

export function setTransferPager(page: number, size: number): AccountActions {
  return {
    type: TRANSFER_SET_PAGER,
    page,
    size,
  };
}

export function resetTransferPager(): AccountActions {
  return {
    type: TRANSFER_RESET_PAGER,
  };
}

export function setTransferSorting(sorting: Sorting<EnumTransferSortField>[]): AccountActions {
  return {
    type: TRANSFER_SET_SORTING,
    sorting,
  };
}

export function searchTransferInit(): AccountActions {
  return {
    type: TRANSFER_SEARCH_INIT,
  };
}

export function searchTransferFailure(): AccountActions {
  return {
    type: TRANSFER_SEARCH_FAILURE,
  };
}

export function searchTransferComplete(result: PageResult<PayInItemType>): AccountActions {
  return {
    type: TRANSFER_SEARCH_COMPLETE,
    result,
  };
}

export function setPayOutPager(page: number, size: number): AccountActions {
  return {
    type: PAYOUT_SET_PAGER,
    page,
    size,
  };
}

export function resetPayOutPager(): AccountActions {
  return {
    type: PAYOUT_RESET_PAGER,
  };
}

export function setPayOutSorting(sorting: Sorting<EnumPayOutSortField>[]): AccountActions {
  return {
    type: PAYOUT_SET_SORTING,
    sorting,
  };
}

export function searchPayOutInit(): AccountActions {
  return {
    type: PAYOUT_SEARCH_INIT,
  };
}

export function searchPayOutFailure(): AccountActions {
  return {
    type: PAYOUT_SEARCH_FAILURE,
  };
}

export function searchPayOutComplete(result: PageResult<PayOut>): AccountActions {
  return {
    type: PAYOUT_SEARCH_COMPLETE,
    result,
  };
}

export function setServicePager(page: number, size: number): AccountActions {
  return {
    type: BILLABLE_SERVICE_SET_PAGER,
    page,
    size,
  };
}

export function resetServicePager(): AccountActions {
  return {
    type: BILLABLE_SERVICE_RESET_PAGER,
  };
}

export function setServiceSorting(sorting: Sorting<EnumSubscriptionSortField | EnumUserServiceSortField>[]): AccountActions {
  return {
    type: BILLABLE_SERVICE_SET_SORTING,
    sorting,
  };
}

export function searchServiceInit(): AccountActions {
  return {
    type: BILLABLE_SERVICE_SEARCH_INIT,
  };
}

export function searchServiceFailure(): AccountActions {
  return {
    type: BILLABLE_SERVICE_SEARCH_FAILURE,
  };
}

export function searchServiceComplete(result: PageResult<AccountSubscription | UserService>): AccountActions {
  return {
    type: BILLABLE_SERVICE_SEARCH_COMPLETE,
    result,
  };
}

export function setSubBillingPager(page: number, size: number): AccountActions {
  return {
    type: SERVICE_BILLING_SET_PAGER,
    page,
    size,
  };
}

export function resetSubBillingPager(): AccountActions {
  return {
    type: SERVICE_BILLING_RESET_PAGER,
  };
}

export function setSubBillingSorting(sorting: Sorting<EnumServiceBillingSortField>[]): AccountActions {
  return {
    type: SERVICE_BILLING_SET_SORTING,
    sorting,
  };
}

export function searchSubBillingInit(): AccountActions {
  return {
    type: SERVICE_BILLING_SEARCH_INIT,
  };
}

export function searchSubBillingFailure(): AccountActions {
  return {
    type: SERVICE_BILLING_SEARCH_FAILURE,
  };
}

export function searchSubBillingComplete(result: PageResult<ServiceBilling>): AccountActions {
  return {
    type: SERVICE_BILLING_SEARCH_COMPLETE,
    result,
  };
}

export function setTabIndex(tabIndex: number): AccountActions {
  return {
    type: SET_TAB_INDEX,
    tabIndex,
  };
}

export function setServiceType(serviceType: EnumBillableServiceType): AccountActions {
  return {
    type: SET_SERVICE_TYPE,
    serviceType,
  };
}
