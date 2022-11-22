import { ObjectResponse, PageResult, Sorting } from 'model/response';
import {
  ContactForm,
  ContactFormQuery,
  EnumContactFormSortField,
} from 'model/contact-form';

import {
  ContactFormActions,
  SET_PAGER,
  RESET_PAGER,
  SET_FILTER,
  RESET_FILTER,
  SEARCH_INIT,
  SEARCH_FAILURE,
  SEARCH_COMPLETE,
  SET_SORTING,
  COUNT_INIT,
  COUNT_FAILURE,
  COUNT_SUCCESS,
  COMPLETE_FORM_INIT,
  COMPLETE_FORM_FAILURE,
  COMPLETE_FORM_SUCCESS,
} from './types';

// Action Creators
export function setPager(page: number, size: number): ContactFormActions {
  return {
    type: SET_PAGER,
    page,
    size,
  };
}

export function resetPager(): ContactFormActions {
  return {
    type: RESET_PAGER,
  };
}

export function setFilter(query: Partial<ContactFormQuery>): ContactFormActions {
  return {
    type: SET_FILTER,
    query,
  };
}

export function resetFilter(): ContactFormActions {
  return {
    type: RESET_FILTER,
  };
}

export function setSorting(sorting: Sorting<EnumContactFormSortField>[]): ContactFormActions {
  return {
    type: SET_SORTING,
    sorting,
  };
}

export function searchInit(): ContactFormActions {
  return {
    type: SEARCH_INIT,
  };
}

export function searchFailure(): ContactFormActions {
  return {
    type: SEARCH_FAILURE,
  };
}

export function searchComplete(response: ObjectResponse<PageResult<ContactForm>>): ContactFormActions {
  return {
    type: SEARCH_COMPLETE,
    response,
  };
}

export function countInit(): ContactFormActions {
  return {
    type: COUNT_INIT,
  };
}

export function countFailure(): ContactFormActions {
  return {
    type: COUNT_FAILURE,
  };
}

export function countSuccess(count: number): ContactFormActions {
  return {
    type: COUNT_SUCCESS,
    count,
  };
}

export function completeFormInit(formKey: string): ContactFormActions {
  return {
    type: COMPLETE_FORM_INIT,
    formKey,
  };
}

export function completeFormFailure(): ContactFormActions {
  return {
    type: COMPLETE_FORM_FAILURE,
  };
}

export function completeFormSuccess(form: ContactForm): ContactFormActions {
  return {
    type: COMPLETE_FORM_SUCCESS,
    form,
  };
}
