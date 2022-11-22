import { Moment } from 'moment';

import { LogoutInitAction } from 'store/security/types';
import { ObjectResponse, PageRequest, PageResult, Sorting } from 'model/response';
import {
  EnumContactFormSortField,
  ContactForm,
  ContactFormQuery
} from 'model/contact-form';

// State
export interface ContactFormManagerState {
  count: number;
  forms: PageResult<ContactForm> | null;
  lastUpdated: Moment | null;
  loading: boolean;
  pagination: PageRequest;
  query: Partial<ContactFormQuery>;
  selectedForm: ContactForm | null;
  sorting: Sorting<EnumContactFormSortField>[];
}

// Actions
export const SET_PAGER = 'message/contact-form/SET_PAGER';
export const RESET_PAGER = 'message/contact-form/RESET_PAGER';

export const SET_SORTING = 'message/contact-form/SET_SORTING';

export const SET_FILTER = 'message/contact-form/SET_FILTER';
export const RESET_FILTER = 'message/contact-form/RESET_FILTER';

export const SEARCH_INIT = 'message/contact-form/SEARCH_INIT';
export const SEARCH_FAILURE = 'message/contact-form/SEARCH_FAILURE';
export const SEARCH_COMPLETE = 'message/contact-form/SEARCH_COMPLETE';

export const COUNT_INIT = 'message/contact-form/COUNT_INIT';
export const COUNT_FAILURE = 'message/contact-form/COUNT_FAILURE';
export const COUNT_SUCCESS = 'message/contact-form/COUNT_SUCCESS';

export const COMPLETE_FORM_INIT = 'message/contact-form/COMPLETE_FORM_INIT';
export const COMPLETE_FORM_FAILURE = 'message/contact-form/COMPLETE_FORM_FAILURE';
export const COMPLETE_FORM_SUCCESS = 'message/contact-form/COMPLETE_FORM_SUCCESS';

export interface SetPagerAction {
  type: typeof SET_PAGER;
  page: number;
  size: number;
}

export interface ResetPagerAction {
  type: typeof RESET_PAGER
}

export interface SetSortingAction {
  type: typeof SET_SORTING;
  sorting: Sorting<EnumContactFormSortField>[];
}

export interface SetFilterAction {
  type: typeof SET_FILTER;
  query: Partial<ContactFormQuery>;
}

export interface ResetFilterAction {
  type: typeof RESET_FILTER;
}

export interface SearchInitAction {
  type: typeof SEARCH_INIT;
}

export interface SearchFailureAction {
  type: typeof SEARCH_FAILURE;
}

export interface SearchCompleteAction {
  type: typeof SEARCH_COMPLETE;
  response: ObjectResponse<PageResult<ContactForm>>;
}

export interface CountInitAction {
  type: typeof COUNT_INIT;
}

export interface CountCompleteAction {
  type: typeof COUNT_SUCCESS;
  count: number;
}

export interface CountFailureAction {
  type: typeof COUNT_FAILURE;
}

export interface CompleteFormInitAction {
  type: typeof COMPLETE_FORM_INIT;
  formKey: string;
}

export interface CompleteFormCompleteAction {
  type: typeof COMPLETE_FORM_SUCCESS
  form: ContactForm;
}

export interface CompleteFormFailureAction {
  type: typeof COMPLETE_FORM_FAILURE;
}

export type ContactFormActions =
  | LogoutInitAction
  | SetPagerAction
  | ResetPagerAction
  | SetSortingAction
  | SetFilterAction
  | ResetFilterAction
  | SearchInitAction
  | SearchFailureAction
  | SearchCompleteAction
  | CountInitAction
  | CountCompleteAction
  | CountFailureAction
  | CompleteFormInitAction
  | CompleteFormCompleteAction
  | CompleteFormFailureAction
  ;
