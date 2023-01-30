import { Moment } from 'moment';

export enum EnumContactFormStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
}

export enum EnumContactFormSortField {
  CREATED_AT = 'CREATED_AT',
  EMAIL = 'EMAIL',
  STATUS = 'STATUS',
}

export enum EnumContactFormType {
  NONE = 'NONE',
  DATA_MATCH = 'DATA_MATCH',
}

export interface ContactForm {
  companyName: string;
  createdAt: Moment;
  email: string;
  firstName: string;
  key: string;
  lastName: string;
  message: string;
  phoneCountryCode: string;
  phoneNumber: string;
  privacyTermsAccepted: boolean;
  processDefinition: string;
  processInstance: string;
  status: EnumContactFormStatus;
  type: EnumContactFormType;
  updatedAt: Moment;
}

export interface ContactFormQuery {
  dateFrom: Moment | null;
  dateTo: Moment | null;
  email: string;
  status: EnumContactFormStatus | null;
}