import { ThunkAction } from 'redux-thunk'

// Redux
import { RootState } from 'store';
import { TransferActions } from './types';
import {
  searchInit, searchComplete, searchFailure, setSorting, setPager,
  createTransferInit, createTransferSuccess, createTransferFailure,
} from './actions';

// Services
import TransferApi from 'service/transfer';

// Model
import { PageRequest, Sorting, PageResult, ObjectResponse } from 'model/response';
import { EnumTransferSortField, PayInItem, Transfer } from 'model/order';

// Helper thunk result type
type ThunkResult<R> = ThunkAction<Promise<R>, RootState, unknown, TransferActions>;

export const find = (
  pageRequest?: PageRequest, sorting?: Sorting<EnumTransferSortField>[]
): ThunkResult<PageResult<PayInItem> | null> => async (dispatch, getState) => {
  // Get query form state (filters are always set synchronously)
  const query = getState().billing.transfer.query;

  // Update sorting or use the existing value
  if (sorting) {
    dispatch(setSorting(sorting));
  } else {
    sorting = getState().billing.transfer.sorting;
  }

  // Update page or user the existing value (i.e. data page refresh)
  if (pageRequest) {
    const { page, size } = pageRequest;

    dispatch(setPager(page, size));
  } else {
    pageRequest = getState().billing.transfer.pagination
  }

  // Initialize search
  dispatch(searchInit());

  // Get response
  const api = new TransferApi();

  const response = await api.find(query, pageRequest, sorting);

  // Update state
  if (response.data.success) {
    dispatch(searchComplete(response.data.result!));
    return response.data.result!;
  }

  dispatch(searchFailure());
  return null;
}

export const createTransfer = (key: string): ThunkResult<ObjectResponse<Transfer[]> | null> => async (dispatch, getState) => {
  dispatch(createTransferInit(key));

  // Get response
  const api = new TransferApi();

  const response = await api.createTransfer(key);

  // Update state
  if (response.data.success) {
    dispatch(createTransferSuccess(response.data.result!));
    return response.data;
  }

  dispatch(createTransferFailure());
  return null;
}
