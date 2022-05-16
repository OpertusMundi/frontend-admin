import { ThunkAction } from 'redux-thunk'

// Redux
import { RootState } from 'store';
import { AccountActions } from './types';
import {
  searchInit, searchComplete, searchFailure, setSorting, setPager,
  saveInit, saveComplete,
  registerToIdpInit, registerToIdpComplete,
} from './actions';

// Services
import HelpdeskAccountApi from 'service/account';

// Model
import { PageRequest, Sorting, PageResult, ObjectResponse } from 'model/response';
import { EnumHelpdeskAccountSortField, HelpdeskAccount, HelpdeskAccountCommand } from 'model/account';

// Helper thunk result type
type ThunkResult<R> = ThunkAction<Promise<R>, RootState, unknown, AccountActions>;

export const find = (
  pageRequest?: PageRequest, sorting?: Sorting<EnumHelpdeskAccountSortField>[]
): ThunkResult<PageResult<HelpdeskAccount> | null> => async (dispatch, getState) => {
  // Get query form state (filters are always set synchronously)
  const query = getState().account.helpdesk.query;

  // Update sorting or use the existing value
  if (sorting) {
    dispatch(setSorting(sorting));
  } else {
    sorting = getState().account.helpdesk.sorting;
  }

  // Update page or user the existing value (i.e. data page refresh)
  if (pageRequest) {
    const { page, size } = pageRequest;

    dispatch(setPager(page, size));
  } else {
    pageRequest = getState().account.helpdesk.pagination
  }

  // Initialize search
  dispatch(searchInit());

  // Get response
  const api = new HelpdeskAccountApi();

  const response = await api.find(query, pageRequest, sorting);

  // Update state
  if (response.data.success) {
    dispatch(searchComplete(response.data.result!));
    return response.data.result!;
  }

  dispatch(searchFailure());
  return null;
}

export const update = (
  id: number | null, command: HelpdeskAccountCommand
): ThunkResult<ObjectResponse<HelpdeskAccount>> => async (dispatch, getState) => {
  dispatch(saveInit());

  // Get response
  const api = new HelpdeskAccountApi();

  const response = id ? await api.update(id, command) : await api.create(command);

  // Update state
  dispatch(saveComplete(response.data));

  return response.data;
}

export const registerToIdp = (id: number): ThunkResult<ObjectResponse<string>> => async (dispatch, getState) => {
  dispatch(registerToIdpInit());

  // Get response
  const api = new HelpdeskAccountApi();

  const response = await api.registerToIdp(id);

  // Update state
  dispatch(registerToIdpComplete());

  return response.data;
}

