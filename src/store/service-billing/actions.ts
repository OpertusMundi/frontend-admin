import { ObjectResponse, PageResult, Sorting } from 'model/response';

import {
  ServiceBillingBatchActions,
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
  EnumServiceBillingBatchSortField,
  ServiceBillingBatch,
  ServiceBillingBatchQuery,
} from 'model/service-billing';


// Action Creators
export function setPager(page: number, size: number): ServiceBillingBatchActions {
  return {
    type: SET_PAGER,
    page,
    size,
  };
}

export function resetPager(): ServiceBillingBatchActions {
  return {
    type: RESET_PAGER,
  };
}

export function setFilter(query: Partial<ServiceBillingBatchQuery>): ServiceBillingBatchActions {
  return {
    type: SET_FILTER,
    query,
  };
}

export function resetFilter(): ServiceBillingBatchActions {
  return {
    type: RESET_FILTER,
  };
}

export function setSorting(sorting: Sorting<EnumServiceBillingBatchSortField>[]): ServiceBillingBatchActions {
  return {
    type: SET_SORTING,
    sorting,
  };
}

export function searchInit(): ServiceBillingBatchActions {
  return {
    type: SEARCH_INIT,
  };
}

export function searchFailure(): ServiceBillingBatchActions {
  return {
    type: SEARCH_FAILURE,
  };
}

export function searchComplete(result: PageResult<ServiceBillingBatch>): ServiceBillingBatchActions {
  return {
    type: SEARCH_COMPLETE,
    result,
  };
}

export function loadRecordInit(key: string): ServiceBillingBatchActions {
  return {
    type: LOAD_RECORD_INIT,
    key,
  };
}

export function loadRecordSuccess(record: ServiceBillingBatch): ServiceBillingBatchActions {
  return {
    type: LOAD_RECORD_SUCCESS,
    record,
  };
}

export function loadRecordFailure(): ServiceBillingBatchActions {
  return {
    type: LOAD_RECORD_FAILURE,
  };
}

export function toggleBillingTaskForm(show: boolean): ServiceBillingBatchActions {
  return {
    type: TOGGLE_BILLING_TASK_FORM,
    show,
  };
}

export function setBillingTaskParams(year: number, month: number): ServiceBillingBatchActions {
  return {
    type: SET_BILLING_TASK_PARAMS,
    year,
    month,
  };
}

export function createBillingTaskInit(year: number, month: number): ServiceBillingBatchActions {
  return {
    type: CREATE_BILLING_TASK_INIT,
    year,
    month,
  };
}

export function createBillingTaskSuccess(
  year: number, month: number, response: ObjectResponse<ServiceBillingBatch>
): ServiceBillingBatchActions {
  return {
    type: CREATE_BILLING_TASK_SUCCESS,
    year,
    month,
    response,
  };
}

export function createBillingTaskFailure(
  year: number, month: number, response: ObjectResponse<ServiceBillingBatch | null> | null
): ServiceBillingBatchActions {
  return {
    type: CREATE_BILLING_TASK_FAILURE,
    year,
    month,
    response,
  };
}
