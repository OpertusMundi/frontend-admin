import { ThunkAction } from 'redux-thunk'

// Redux
import { RootState } from 'store';
import { ContactFormActions } from './types';
import {
  searchInit, searchComplete, searchFailure, setSorting, setPager,
  countInit, countFailure, countSuccess,
  completeFormInit, completeFormFailure, completeFormSuccess,
} from './actions';

// Services
import ContactFormApi from 'service/contact-form';

// Model
import { PageRequest, Sorting, PageResult } from 'model/response';
import { ContactForm, EnumContactFormSortField } from 'model/contact-form';

// Helper thunk result type
type ThunkResult<R> = ThunkAction<Promise<R>, RootState, unknown, ContactFormActions>;

export const find = (
  pageRequest?: PageRequest, sorting?: Sorting<EnumContactFormSortField>[]
): ThunkResult<PageResult<ContactForm> | null> => async (dispatch, getState) => {
  // Get query form state (filters are always set synchronously)
  const query = getState().message.contactForms.query;

  // Update sorting or use the existing value
  if (sorting) {
    dispatch(setSorting(sorting));
  } else {
    sorting = getState().message.contactForms.sorting;
  }

  // Update page or user the existing value (i.e. data page refresh)
  if (pageRequest) {
    const { page, size } = pageRequest;

    dispatch(setPager(page, size));
  } else {
    pageRequest = getState().message.contactForms.pagination
  }

  // Initialize search
  dispatch(searchInit());

  // Get response
  const api = new ContactFormApi();

  const response = await api.findForms(query, pageRequest, sorting);

  // Update state
  if (response.success) {
    dispatch(searchComplete(response));
    return response.result!;
  }

  dispatch(searchFailure());
  return null;
}

export const countPendingForms = (): ThunkResult<number | null> => async (dispatch, getState) => {
  dispatch(countInit());
  // Get response
  const api = new ContactFormApi();

  const response = await api.countPendingForms();

  // Update state
  if (response.data.success) {

    dispatch(countSuccess(response.data.result!));
    return response.data.result!;
  }

  dispatch(countFailure());

  return null;
}

export const completeForm = (formKey: string): ThunkResult<ContactForm | null> => async (dispatch, getState) => {
  dispatch(completeFormInit(formKey));
  // Get response
  const api = new ContactFormApi();

  const response = await api.completeForm(formKey);

  // Update state
  if (response.success) {
    dispatch(completeFormSuccess(response.result!));
    return response.result!;
  }

  dispatch(completeFormFailure());

  return null;
}

