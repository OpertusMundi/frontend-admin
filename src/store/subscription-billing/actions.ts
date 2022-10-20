import { ObjectResponse, PageResult, Sorting } from 'model/response';

import {
  SubscriptionBillingBatchActions,
  SET_PAGER,
  RESET_PAGER,
  SET_FILTER,
  RESET_FILTER,
  SEARCH_INIT,
  SEARCH_FAILURE,
  SEARCH_COMPLETE,
  SET_SORTING,
  LOAD_RECORD_INIT,
  LOAD_RECORD_SUCCESS,
  LOAD_RECORD_FAILURE,
  TOGGLE_BILLING_TASK_FORM,
  SET_BILLING_TASK_PARAMS,
  CREATE_BILLING_TASK_INIT,
  CREATE_BILLING_TASK_SUCCESS,
  CREATE_BILLING_TASK_FAILURE
} from './types';
import {
  EnumSubscriptionBillingBatchSortField,
  SubscriptionBillingBatch,
  SubscriptionBillingBatchQuery,
} from 'model/subscription-billing';


// Action Creators
export function setPager(page: number, size: number): SubscriptionBillingBatchActions {
  return {
    type: SET_PAGER,
    page,
    size,
  };
}

export function resetPager(): SubscriptionBillingBatchActions {
  return {
    type: RESET_PAGER,
  };
}

export function setFilter(query: Partial<SubscriptionBillingBatchQuery>): SubscriptionBillingBatchActions {
  return {
    type: SET_FILTER,
    query,
  };
}

export function resetFilter(): SubscriptionBillingBatchActions {
  return {
    type: RESET_FILTER,
  };
}

export function setSorting(sorting: Sorting<EnumSubscriptionBillingBatchSortField>[]): SubscriptionBillingBatchActions {
  return {
    type: SET_SORTING,
    sorting,
  };
}

export function searchInit(): SubscriptionBillingBatchActions {
  return {
    type: SEARCH_INIT,
  };
}

export function searchFailure(): SubscriptionBillingBatchActions {
  return {
    type: SEARCH_FAILURE,
  };
}

export function searchComplete(result: PageResult<SubscriptionBillingBatch>): SubscriptionBillingBatchActions {
  return {
    type: SEARCH_COMPLETE,
    result,
  };
}

export function loadRecordInit(key: string): SubscriptionBillingBatchActions {
  return {
    type: LOAD_RECORD_INIT,
    key,
  };
}

export function loadRecordSuccess(record: SubscriptionBillingBatch): SubscriptionBillingBatchActions {
  return {
    type: LOAD_RECORD_SUCCESS,
    record,
  };
}

export function loadRecordFailure(): SubscriptionBillingBatchActions {
  return {
    type: LOAD_RECORD_FAILURE,
  };
}

export function toggleBillingTaskForm(show: boolean): SubscriptionBillingBatchActions {
  return {
    type: TOGGLE_BILLING_TASK_FORM,
    show,
  };
}

export function setBillingTaskParams(year: number, month: number): SubscriptionBillingBatchActions {
  return {
    type: SET_BILLING_TASK_PARAMS,
    year,
    month,
  };
}

export function createBillingTaskInit(year: number, month: number): SubscriptionBillingBatchActions {
  return {
    type: CREATE_BILLING_TASK_INIT,
    year,
    month,
  };
}

export function createBillingTaskSuccess(
  year: number, month: number, response: ObjectResponse<SubscriptionBillingBatch>
): SubscriptionBillingBatchActions {
  return {
    type: CREATE_BILLING_TASK_SUCCESS,
    year,
    month,
    response,
  };
}

export function createBillingTaskFailure(
  year: number, month: number, response: ObjectResponse<SubscriptionBillingBatch | null> | null
): SubscriptionBillingBatchActions {
  return {
    type: CREATE_BILLING_TASK_FAILURE,
    year,
    month,
    response,
  };
}
