import moment from 'utils/moment-localized';

import { Order } from 'model/response';

import {
  LOGOUT_INIT,
} from 'store/security/types';

import {
  SET_PAGER,
  RESET_PAGER,
  SET_FILTER,
  RESET_FILTER,
  SEARCH_INIT,
  SEARCH_COMPLETE,
  SET_SORTING,
  SEARCH_FAILURE,
  COUNT_SUCCESS,
  COMPLETE_FORM_INIT,
  COMPLETE_FORM_FAILURE,
  COMPLETE_FORM_SUCCESS,
  ContactFormActions,
  ContactFormManagerState,
} from './types';
import { ContactForm, EnumContactFormSortField, EnumContactFormStatus } from 'model/contact-form';

const initialState: ContactFormManagerState = {
  count: 0,
  forms: null,
  lastUpdated: null,
  loading: false,
  pagination: {
    page: 0,
    size: 10,
  },
  query: {
    email: '',
    status: EnumContactFormStatus.PENDING,
  },
  selectedForm: null,
  sorting: [{
    id: EnumContactFormSortField.CREATED_AT,
    order: Order.DESC,
  }]
};

export function contactFormReducer(
  state = initialState,
  action: ContactFormActions
): ContactFormManagerState {

  switch (action.type) {
    case LOGOUT_INIT:
      return {
        ...initialState
      };

    case SET_PAGER:
      return {
        ...state,
        pagination: {
          page: action.page,
          size: action.size,
        },
      };

    case RESET_PAGER:
      return {
        ...state,
        pagination: {
          ...initialState.pagination
        },
        selectedForm: null,
      };

    case SET_FILTER: {
      return {
        ...state,
        query: {
          ...state.query,
          ...action.query,
        },
      };
    }

    case RESET_FILTER:
      return {
        ...state,
        query: {
          ...initialState.query
        },
        selectedForm: null,
      };

    case SET_SORTING:
      return {
        ...state,
        sorting: action.sorting,
      };

    case SEARCH_INIT:
      return {
        ...state,
        loading: true,
      };

    case SEARCH_FAILURE:
      return {
        ...state,
        pagination: {
          page: 0,
          size: state.pagination.size,
        },
        lastUpdated: moment(),
        loading: false,
      };

    case SEARCH_COMPLETE: {
      const forms = action.response.result?.items || [];
      const selectedForm: ContactForm | null = forms.find(f => f.key === state.selectedForm?.key) || null;

      return {
        ...state,
        forms: action.response.result!,
        lastUpdated: moment(),
        loading: false,
        pagination: {
          page: action.response.result!.pageRequest.page,
          size: action.response.result!.pageRequest.size,
        },
        selectedForm,
      };
    }

    case COUNT_SUCCESS:
      return {
        ...state,
        count: action.count
      };

    case COMPLETE_FORM_INIT:
      return {
        ...state,
        loading: true,
      };

    case COMPLETE_FORM_FAILURE:
      return {
        ...state,
        loading: false,
      };

    case COMPLETE_FORM_SUCCESS:
      return {
        ...state,
        forms: state.forms ? {
          ...state.forms,
          items: state.forms?.items ? state.forms.items.map((f) => (
            f.key === action.form.key ? action.form : f
          )) : [],
        } : null,
        loading: false,
      };

    default:
      return state;
  }

}
