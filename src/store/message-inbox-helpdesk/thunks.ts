import { ThunkAction } from 'redux-thunk'

// Redux
import { RootState } from 'store';
import { MessageActions } from './types';
import {
  searchInit, searchComplete, searchFailure, setSorting, setPager,
  assignMessageInit, assignMessageSuccess, assignMessageFailure,
  countInit, countFailure, countSuccess,
} from './actions';

// Services
import MessageApi from 'service/chat';

// Model
import { PageRequest, Sorting, PageResult } from 'model/response';
import { ClientMessage, EnumMessageSortField } from 'model/chat';

// Helper thunk result type
type ThunkResult<R> = ThunkAction<Promise<R>, RootState, unknown, MessageActions>;

export const find = (
  pageRequest?: PageRequest, sorting?: Sorting<EnumMessageSortField>[]
): ThunkResult<PageResult<ClientMessage> | null> => async (dispatch, getState) => {
  // Get query form state (filters are always set synchronously)
  const query = getState().message.helpdeskInbox.query;

  // Update sorting or use the existing value
  if (sorting) {
    dispatch(setSorting(sorting));
  } else {
    sorting = getState().message.helpdeskInbox.sorting;
  }

  // Update page or user the existing value (i.e. data page refresh)
  if (pageRequest) {
    const { page, size } = pageRequest;

    dispatch(setPager(page, size));
  } else {
    pageRequest = getState().message.helpdeskInbox.pagination
  }

  // Initialize search
  dispatch(searchInit());

  // Get response
  const api = new MessageApi();

  const response = await api.findUnassignedMessages(query, pageRequest, sorting);

  // Update state
  if (response.data.success) {
    dispatch(searchComplete(response.data));
    return response.data.result!;
  }

  dispatch(searchFailure());
  return null;
}

export const assignMessageToUser = (messageKey: string): ThunkResult<ClientMessage | null> => async (dispatch, getState) => {
  // Initialize request
  dispatch(assignMessageInit(messageKey));

  // Get response
  const api = new MessageApi();

  const response = await api.assignUserToMessage(messageKey);

  // Update state
  if (response.data.success) {
    dispatch(assignMessageSuccess(response.data.result!));
    return response.data.result!;
  }

  dispatch(assignMessageFailure());
  return null;
}

export const countUnassignedMessages = (): ThunkResult<number | null> => async (dispatch, getState) => {
  dispatch(countInit());
  // Get response
  const api = new MessageApi();

  const response = await api.countUnassignedMessages();

  // Update state
  if (response.data.success) {

    dispatch(countSuccess(response.data.result!));
    return response.data.result!;
  }

  dispatch(countFailure());

  return null;
}