import { ThunkAction } from 'redux-thunk'

// Redux
import { RootState } from 'store';
import { MessageActions } from './types';
import {
  searchInit, searchComplete, searchFailure, setSorting, setPager,
  loadThreadInit, loadThreadSuccess, loadThreadFailure,
  countInit, countFailure, countSuccess,
  readInit, readFailure, readSuccess,
  sendInit, sendFailure, sendSuccess, getContactsInit, getContactsComplete,
} from './actions';

// Services
import MessageApi from 'service/chat';

// Model
import { PageRequest, Sorting, PageResult } from 'model/response';
import { ClientContact, ClientMessage, ClientMessageCommand, ClientMessageThreadResponse, EnumMessageSortField } from 'model/chat';

// Helper thunk result type
type ThunkResult<R> = ThunkAction<Promise<R>, RootState, unknown, MessageActions>;

export const find = (
  pageRequest?: PageRequest, sorting?: Sorting<EnumMessageSortField>[]
): ThunkResult<PageResult<ClientMessage> | null> => async (dispatch, getState) => {
  // Get query form state (filters are always set synchronously)
  const query = getState().message.userInbox.query;

  // Update sorting or use the existing value
  if (sorting) {
    dispatch(setSorting(sorting));
  } else {
    sorting = getState().message.userInbox.sorting;
  }

  // Update page or user the existing value (i.e. data page refresh)
  if (pageRequest) {
    const { page, size } = pageRequest;

    dispatch(setPager(page, size));
  } else {
    pageRequest = getState().message.userInbox.pagination
  }

  // Initialize search
  dispatch(searchInit());

  // Get response
  const api = new MessageApi();

  const response = await api.findMessages(query, pageRequest, sorting);

  // Update state
  if (response.data.success) {
    dispatch(searchComplete(response.data));
    return response.data.result!;
  }

  dispatch(searchFailure());
  return null;
}

export const getThreadMessages = (messageKey: string, threadKey: string): ThunkResult<ClientMessageThreadResponse | null> => async (dispatch, getState) => {
  dispatch(loadThreadInit(messageKey, threadKey));

  // Get response
  const api = new MessageApi();

  const response = await api.getThreadMessages(threadKey);

  // Update state
  if (response.data.success) {
    dispatch(loadThreadSuccess(response.data));
    return response.data;
  }

  dispatch(loadThreadFailure());
  return null;
}

export const countNewMessages = (): ThunkResult<number | null> => async (dispatch, getState) => {
  dispatch(countInit());
  // Get response
  const api = new MessageApi();

  const response = await api.countNewMessages();

  // Update state
  if (response.data.success) {

    dispatch(countSuccess(response.data.result!));
    return response.data.result!;
  }

  dispatch(countFailure());

  return null;
}

export const readMessage = (messageKey: string): ThunkResult<ClientMessage | null> => async (dispatch, getState) => {
  dispatch(readInit(messageKey));
  // Get response
  const api = new MessageApi();

  const response = await api.readMessage(messageKey);

  // Update state
  if (response.data.success) {
    dispatch(readSuccess(response.data.result!));
    return response.data.result!;
  }

  dispatch(readFailure());

  return null;
}

export const sendMessage = (userKey: string, command: ClientMessageCommand): ThunkResult<ClientMessage | null> => async (dispatch, getState) => {
  dispatch(sendInit(command));
  // Get response
  const api = new MessageApi();

  const response = await api.sendMessageToUser(userKey, command);

  // Update state
  if (response.data.success) {

    dispatch(sendSuccess(response.data.result!));
    return response.data.result!;
  }

  dispatch(sendFailure());

  return null;
}

export const replyToMessage = (threadKey: string, command: ClientMessageCommand): ThunkResult<ClientMessage | null> => async (dispatch, getState) => {
  dispatch(sendInit(command));
  // Get response
  const api = new MessageApi();

  const response = await api.replyToMessage(threadKey, command);

  // Update state
  if (response.data.success) {

    dispatch(sendSuccess(response.data.result!));
    return response.data.result!;
  }

  dispatch(sendFailure());

  return null;
}

export const findContacts = (email: string): ThunkResult<ClientContact[]> => async (dispatch, getState) => {
  dispatch(getContactsInit());

  const api = new MessageApi();
  const contacts = await api.findContacts(email);

  dispatch(getContactsComplete(contacts))
  return contacts;
}