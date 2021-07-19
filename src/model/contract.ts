import { Moment } from 'moment';

import { SimpleHelpdeskAccount } from 'model/account';

export const ContractItemTypes = {
  Section: 'Section',
};

export enum EnumContract {
  MASTER_TEMPLATE_CONTRACT = 'MASTER_TEMPLATE_CONTRACT',
  PROVIDER_TEMPLATE_CONTRACT = 'PROVIDER_TEMPLATE_CONTRACT',
  USER_CONTRACT = 'USER_CONTRACT',
}

export enum EnumContractStatus {
  DRAFT = 'DRAFT',
  HISTORY = 'HISTORY',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PUBLISHED = 'PUBLISHED',
}

export enum EnumMasterContractSortField {
  CREATED_ON = 'CREATED_ON',
  MODIFIED_ON = 'MODIFIED_ON',
  STATUS = 'STATUS',
  TITLE = 'TITLE',
  VERSION = 'VERSION',
}

export interface Section {
  id: number | null;
  indent: number;
  index: string;
  title: string;
  variable: boolean;
  optional: boolean;
  dynamic: boolean;
  options: string[];
  styledOptions: string[];
  subOptions: { [key: number]: SubOption[] }
  summary?: string[];
  icons?: string[];
  descriptionOfChange: string;
}

export interface SubOption {
  id: number;
  body: string;
}

export interface MasterContractCommand {
  id: number | null;
  title: string;
  subtitle: string;
  sections: Section[];
}

export interface MasterContract {
  createdAt: Moment | null;
  id: number;
  key: string;
  modifiedAt: Moment | null;
  owner: SimpleHelpdeskAccount;
  parentId?: number;
  sections: Section[],
  subtitle?: string;
  title: string;
  version: string;
};

export interface MasterContractHistory extends MasterContract {
  status: EnumContractStatus;
}

export interface MasterContractQuery {
  status: EnumContractStatus[];
  title: string;
}