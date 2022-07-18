import { ClientContact } from 'model/chat';

import {
  SendMessageDialogActions,
  MESSAGE_DIALOG_TOGGLE,
} from './types';

// Action Creators
export function toggleSendMessageDialog(contact: ClientContact | null = null, subject = ''): SendMessageDialogActions {
  return {
    type: MESSAGE_DIALOG_TOGGLE,
    contact,
    subject,
  };
}
