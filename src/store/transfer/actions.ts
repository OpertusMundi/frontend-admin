import { PageResult, Sorting } from 'model/response';
import { EnumTransferSortField, PayInItemType, TransferQuery, Transfer } from 'model/order';

import {
  TransferActions,
  SET_PAGER,
  RESET_PAGER,
  SET_FILTER,
  RESET_FILTER,
  SEARCH_INIT,
  SEARCH_FAILURE,
  SEARCH_COMPLETE,
  SET_SORTING,
  CREATE_TRANSFER_INIT,
  CREATE_TRANSFER_SUCCESS,
  CREATE_TRANSFER_FAILURE,
} from './types';


// Action Creators
export function setPager(page: number, size: number): TransferActions {
  return {
    type: SET_PAGER,
    page,
    size,
  };
}

export function resetPager(): TransferActions {
  return {
    type: RESET_PAGER,
  };
}

export function setFilter(query: Partial<TransferQuery>): TransferActions {
  return {
    type: SET_FILTER,
    query,
  };
}

export function resetFilter(): TransferActions {
  return {
    type: RESET_FILTER,
  };
}

export function setSorting(sorting: Sorting<EnumTransferSortField>[]): TransferActions {
  return {
    type: SET_SORTING,
    sorting,
  };
}

export function searchInit(): TransferActions {
  return {
    type: SEARCH_INIT,
  };
}

export function searchFailure(): TransferActions {
  return {
    type: SEARCH_FAILURE,
  };
}

export function searchComplete(result: PageResult<PayInItemType>): TransferActions {
  return {
    type: SEARCH_COMPLETE,
    result,
  };
}

export function createTransferInit(key: string): TransferActions {
  return {
    type: CREATE_TRANSFER_INIT,
    key,
  };
}

export function createTransferSuccess(transfers: Transfer[]): TransferActions {
  return {
    type: CREATE_TRANSFER_SUCCESS,
    transfers,
  };
}

export function createTransferFailure(): TransferActions {
  return {
    type: CREATE_TRANSFER_FAILURE,
  };
}
