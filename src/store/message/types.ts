import { LogoutInitAction } from 'store/security/types';
import { ClientContact } from 'model/chat';

// State
export interface SendMessageDialogState {
  contact: ClientContact | null;
  subject: string;
}

// Actions
export const MESSAGE_DIALOG_TOGGLE = 'message/send-message/SEND_MESSAGE_DIALOG_TOGGLE';

export interface ToggleDialog {
  type: typeof MESSAGE_DIALOG_TOGGLE;
  contact: ClientContact | null;
  subject: string | '',
}

export type SendMessageDialogActions =
  | LogoutInitAction
  | ToggleDialog
  ;
