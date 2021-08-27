import { ContractIcon } from './contract';
import { ProcessDefinition } from './bpm-process-instance';

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

export interface ApplicationConfiguration {
  bingMaps?: BingMapsConfiguration;
  map?: MapConfiguration;
  marketplaceUrl: string;
  osm?: OsmConfiguration;
  processDefinitions: ProcessDefinition[];
  contractIcons: ContractIcon[];
}
