import { Moment } from 'moment';

import { SimpleHelpdeskAccount } from 'model/account';
import { PageResult } from './response';

export const ContractItemTypes = {
  Section: 'Section',
};

export enum EnumContract {
  MASTER_TEMPLATE_CONTRACT = 'MASTER_TEMPLATE_CONTRACT',
  PROVIDER_TEMPLATE_CONTRACT = 'PROVIDER_TEMPLATE_CONTRACT',
  USER_CONTRACT = 'USER_CONTRACT',
}

export enum EnumContractIcon {
  AlterationNotPermitted = 'AlterationNotPermitted',
  AlterationPermitted = 'AlterationPermitted',
  CommercialUseNotPermitted = 'CommercialUseNotPermitted',
  CommercialUsePermitted = 'CommercialUsePermitted',
  DeliveredByTopio = 'DeliveredByTopio',
  DeliveredByVendor = 'DeliveredByVendor',
  DigitalDelivery = 'DigitalDelivery',
  PhysicalDelivery = 'PhysicalDelivery',
  ThirdPartyNotPermitted = 'ThirdPartyNotPermitted',
  ThirdPartyPermitted = 'ThirdPartyPermitted',
  UpdatesNotIncluded = 'UpdatesNotIncluded',
  UpdatesIncluded = 'UpdatesIncluded',
  WarrantyNotProvided = 'WarrantyNotProvided',
  WarrantyProvided = 'WarrantyProvided',
  NoRestrictionsWorldwide = 'NoRestrictionsWorldwide',
  AdvertisingMarketing = 'AdvertisingMarketing',
  Geomarketing = 'Geomarketing ',
  IntranetApplications = 'IntranetApplications',
  MobileApplications = 'MobileApplications',
  NavigationMobility = 'NavigationMobility',
  WebApplications = 'WebApplications'
}

export enum EnumContractIconCategory {
  Terms = 'Terms',
  Countries = 'Countries',
  Restrictions = 'Restrictions',
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

export interface ContractIcon {
  category: EnumContractIconCategory;
  icon: EnumContractIcon;
  image: string;
}

export interface Section {
  id: number | null;
  indent: number;
  index: string;
  title: string;
  variable: boolean;
  optional: boolean;
  dynamic: boolean;
  options: Option[];
  descriptionOfChange: string;
}

export interface Option {
  body: string;
  bodyHtml?: string;
  subOptions?: SubOption[];
  mutexSuboptions?: boolean;
  summary?: string;
  icon?: EnumContractIcon | null;
  shortDescription?: string;

}

export interface SubOption {
  body: string;
  bodyHtml: string;
}

export interface MasterContractCommand {
  id: number | null;
  title: string;
  subtitle: string;
  sections: Section[];
}

export interface MasterContract {
  createdAt: Moment | null;
  defaultContract: boolean;
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

export interface MasterContractHistoryResult extends PageResult<MasterContractHistory> {
  defaultContract: boolean;
}