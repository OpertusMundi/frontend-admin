import { ContractIcon } from './contract';
import { ProcessDefinition } from './bpm-process-instance';
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
