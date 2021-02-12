import { Section } from 'model/section';
import { Moment } from 'moment';

export const ContractItemTypes = {
  Section: 'Section',
};

export enum EnumSortField {
  CREATED_ON = 'CREATED_ON',
  MODIFIED_ON = 'MODIFIED_ON',
  STATUS = 'STATUS',
  TITLE = 'TITLE',
  VERSION = 'VERSION',
}

export interface Contract  {
  id?: number | undefined;
  account?: number | undefined;
  title: string;
  subtitle?: string;
  state: string;
  version: string;
  sections: Section[],
  createdAt: Moment | null;
  modifiedAt: Moment | null;
};


export interface ContractQuery {
  id: number;
}