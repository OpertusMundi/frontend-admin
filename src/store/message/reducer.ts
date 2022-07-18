import {
  LOGOUT_INIT,
} from 'store/security/types';

import {
  SendMessageDialogActions,
  SendMessageDialogState,
  MESSAGE_DIALOG_TOGGLE,
} from './types';

const initialState: SendMessageDialogState = {
  contact: null,
  subject: '',
};

export function sendMessageDialogReducer(
  state = initialState,
  action: SendMessageDialogActions
): SendMessageDialogState {

  switch (action.type) {
    case LOGOUT_INIT:
      return {
        ...initialState
      };

    case MESSAGE_DIALOG_TOGGLE:
      return {
        ...state,
        contact: action.contact,
        subject: action.subject,
      };

    default:
      return state;
  }
}
