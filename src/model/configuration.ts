import { Moment } from 'moment';

import { SimpleHelpdeskAccount } from './account';
import { ProcessDefinition } from './bpm-process-instance';
import { ContractIcon } from './contract';
import { EnumMarketplaceRole } from './role';

interface OsmConfiguration {
  url: string;
}

interface BingMapsConfiguration {
  applicationKey: string;
  imagerySet: string;
}

interface MapConfiguration {
  center: [number, number];
}
export enum EnumDataProvider {
  UNDEFINED = 'UNDEFINED',
  SENTINEL_HUB = 'SENTINEL_HUB',
}

export interface ExternalDataProvider {
  id: EnumDataProvider;
  name: string;
  requiredRole: EnumMarketplaceRole | null;
}

export interface ApplicationConfiguration {
  bingMaps?: BingMapsConfiguration;
  externalProviders: ExternalDataProvider[];
  map?: MapConfiguration;
  marketplaceUrl: string;
  osm?: OsmConfiguration;
  processDefinitions: ProcessDefinition[];
  contractIcons: ContractIcon[];
}

export enum EnumService {
  API_GATEWAY = 'API_GATEWAY',
  ADMIN_GATEWAY = 'ADMIN_GATEWAY',
  BPM_ENGINE = 'BPM_ENGINE',
  BPM_WORKER = 'BPM_WORKER',
}

export enum EnumSettingType {
  TEXT = 'TEXT',
  NUMERIC = 'NUMERIC',
  BOOLEAN = 'BOOLEAN',
  DATE = 'DATE',
  DATE_TIME = 'DATE_TIME',
  JSON = 'JSON',
  HTML = 'HTML',
}

export interface Setting {
  key: string;
  service: EnumService;
  type: EnumSettingType;
  updatedBy: SimpleHelpdeskAccount;
  updatedOn: Moment;
  value: string | number | boolean | Moment;

}

export interface SettingUpdate {
  key: string;
  service: EnumService;
  value: string;
}

export interface SettingUpdateCommand {
  updates: SettingUpdate[];
}