import { Moment } from 'moment';

import { EnumHelpdeskRole as EnumRole } from 'model/role';

export enum EnumHelpdeskAccountSortField {
  EMAIL = 'EMAIL',
  FIRST_NAME = 'FIRST_NAME',
  LAST_NAME = 'LAST_NAME',
}

interface HelpdeskAccountBase {
  active: boolean;
  blocked: boolean;
  email: string;
  firstName: string;
  image: string | null;
  imageMimeType: string | null;
  lastName: string;
  locale: string;
  mobile: string;
  phone: string;
  roles: EnumRole[];
}

export interface HelpdeskAccountCommand extends HelpdeskAccountBase {
  id?: number;
  password: string | null;
  passwordMatch: string | null;
}

export interface HelpdeskAccount extends HelpdeskAccountBase {
  createdOn: Moment | null;
  emailVerified: boolean;
  emailVerifiedOn: Moment | null;
  id: number;
  key: string;
  modifiedOn: Moment | null;
}

export interface HelpdeskAccountFormData {
  account: HelpdeskAccount;
}

export interface HelpdeskAccountQuery {
  name: string;
}

export interface ProfileCommand {
  firstName: string;
  image: string | null;
  imageMimeType: string | null;
  lastName: string;
  locale: string;
  mobile: string;
  phone: string;
}

export interface SetPasswordCommand {
  password: string | null;
  passwordMatch: string | null;
}
