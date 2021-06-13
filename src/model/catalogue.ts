import { EnumAssetType, EnumSpatialDataServiceType } from 'model/enum';
import { EffectivePricingModel } from 'model/pricing-model';

export enum EnumResourceType {
  FILE = 'FILE',
  SERVICE = 'SERVICE',
}

export enum EnumAssetAdditionalResource {
  FILE = 'FILE',
  URI = 'URI'
}

export enum EnumAssetSourceType {
  NETCDF = 'NETCDF',
  RASTER = 'RASTER',
  VECTOR = 'VECTOR',
}

export interface AssetFileAdditionalResource {
  /**
   * The description of the file
   */
  description: string;
  /**
   * The file name
   */
  fileName: string;
  /**
   * Additional resource file unique identifier
   */
  id: string;
  /**
   * Date of last update in in ISO format
   */
  modifiedOn: string;
  /**
   * The file size
   */
  size: number;
  /**
   * Resource type
   */
  type: EnumAssetAdditionalResource.FILE;
}

interface AssetUriAdditionalResource {
  /**
   * The URI value
   */
  uri: string;
  /**
   * The text displayed for the URI
   */
  text: string;
  /**
   * Resource type
   */
  type: EnumAssetAdditionalResource.URI;
}

export interface Resource {
  /**
   * Resource unique identifier
   */
  id: string;
  /**
   * Resource parent unique identifier
   */
  parentId: string;
}

export interface FileResource extends Resource {
  /**
   * Discriminator field used for deserializing the model to the appropriate data type
   */
  type: EnumResourceType.FILE;
  /**
   * File size in bytes
   */
  size: number;
  /**
   * Asset category computed from the file format
   */
  category: EnumAssetSourceType;
  /**
   * File name
   */
  fileName: string;
  /**
   * Date of last update in ISO format
   */
  modifiedOn: string;
  /**
   * File format
   */
  format: string;
}

interface Attributes {
  cascaded: boolean | null;
  fixedHeight: number | null;
  fixedWidth: number | null;
  noSubsets: boolean | null;
  opaque: boolean | null;
  queryable: boolean | null;
}

interface Dimension {
  defaultValue: string;
  name: string;
  unit: string;
  values: string[];
}

export interface ServiceResource extends Resource {
  /**
   * Discriminator field used for deserializing the model to the appropriate data type
   */
  type: EnumResourceType.SERVICE;
  /**
   * Service type
   */
  serviceType: EnumSpatialDataServiceType;
  /**
   * Service endpoint
   */
  endpoint: string;
  /**
   * Resource Attribute
   */
  attributes: Attributes;
  /**
   * The supported CRS of the resource
   */
  crs: string[];
  /**
   * A list of URLs pointing to the available styles of the resource
   */
  styles: string[];
  /**
   * The bounding box of the resource
   */
  bbox: unknown;
  /**
   * The dimensions of the resource (derived from WMS)
   */
  dimensions: Dimension[];
  /**
   * The output formats of the resource (derived from WMS/WFS/WCS)
   */
  outputFormats: string[];
  /**
   * The filter capabilities of the resource
   */
  filterCapabilities: string[];
  /**
   * The attribution of the resource
   */
  attribution: string;
  /**
   * Resource minimum scale denominator
   */
  minScale:number;
  /**
   * Resource maximum scale denominator
   */
  maxScale:number;
  /**
   * Resource tile sets
   */
  tileSets:unknown[];
}

export enum EnumConformity {
  CONFORMANT = 'CONFORMANT',
  NOT_CONFORMANT = 'NOT_CONFORMANT',
  NOT_EVALUATED = 'NOT_EVALUATED',
}

export enum EnumTopicCategory {
  BIOTA = 'BIOTA',
  BOUNDARIES = 'BOUNDARIES',
  CLIMA = 'CLIMA',
  ECONOMY = 'ECONOMY',
  ELEVATION = 'ELEVATION',
  ENVIRONMENT = 'ENVIRONMENT',
  FARMING = 'FARMING',
  GEO_SCIENTIFIC = 'GEO_SCIENTIFIC',
  HEALTH = 'HEALTH',
  IMAGERY = 'IMAGERY',
  INLAND_WATERS = 'INLAND_WATERS',
  INTELLIGENCE_MILITARY = 'INTELLIGENCE_MILITARY',
  LOCATION = 'LOCATION',
  OCEANS = 'OCEANS',
  PLANNING_CADASTRE = 'PLANNING_CADASTRE',
  SOCIETY = 'SOCIETY',
  STRUCTURE = 'STRUCTURE',
  TRANSPORTATION = 'TRANSPORTATION',
  UTILITIES_COMMUNICATION = 'UTILITIES_COMMUNICATION',
}

export enum EnumElasticSearchSortField {
  TITLE = 'TITLE',
  REVISION_DATE = 'REVISION_DATE',
  SCORE = 'SCORE',
}

interface Keyword {
  /**
   * Keyword value
   */
  keyword: string;
  /**
   * A related theme
   */
  theme: string;
}

interface Scale {
  /**
   * Scale value
   */
  scale: number;
  /**
   * A short description
   */
  description: string;
}

enum EnumResponsiblePartyRole {
  PUBLISHER = 'PUBLISHER',
  OWNER = 'OWNER',
  CUSTODIAN = 'CUSTODIAN',
  USER = 'USER',
  DISTRIBUTOR = 'DISTRIBUTOR',
  ORIGINATOR = 'ORIGINATOR',
  POINT_OF_CONTACT = 'POINT_OF_CONTACT',
  PROCESSOR = 'PROCESSOR',
  AUTHOR = 'AUTHOR',
}

interface ResponsibleParty {
  /**
   * Address of entity responsible for making the resource available
   */
  address: string;
  /**
   * Email of entity responsible for making the resource available
   */
  email: string;
  /**
   * Name of person responsible for making the resource available
   */
  name: string;
  /**
   * Name of entity responsible for making the resource available
   */
  organizationName: string;
  /**
   * Phone of entity responsible for making the resource available
   */
  phone: string;
  /**
   * Role of entity responsible for making the resource available
   */
  role: EnumResponsiblePartyRole
  /**
   * Contact hours of entity responsible for making the resource available
   */
  serviceHours: string;
}

interface BaseCatalogueItem {
  /*
   * An abstract of the resource
   */
  abstract: string;
  /*
   * Degree of conformity with the implementing rules/standard of the metadata followed
   */
  conformity: EnumConformity;
  /**
   * A point or period of time associated with the creation event in the lifecycle of the resource
   */
  creationDate: string;
  /*
   * The temporal extent of the resource (end date)
   */
  dateEnd: string;
  /*
   * The temporal extent of the resource (start date)
   */
  dateStart: string;
  /*
   * The file format, physical medium, or dimensions of the resource
   */
  format: string;
  /*
   * Geometry as GeoJSON
   */
  geometry: GeoJSON.Polygon;
  /*
   * The topic of the resource
   */
  keywords: Keyword[];
  /*
   * A language of the resource as an ISO 639-1 two-letter code
   *
   * See: https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
   */
  language: string;
  /*
   * Information about resource licensing
   */
  license: string;
  /*
   * General explanation of the data producer's knowledge about the lineage of a dataset
   */
  lineage: string;
  /*
   * The date which specifies when the metadata record was created or updated
   */
  metadataDate: string;
  /*
   * The language in which the metadata elements are expressed as a ISO 639-1 two-letter code
   *
   * See: https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
   */
  metadataLanguage: string;
  /*
   * The email of the organization responsible for the creation and maintenance of the metadata
   */
  metadataPointOfContactEmail: string;
  /*
   * The name of the organization responsible for the creation and maintenance of the metadata
   */
  metadataPointOfContactName: string;
  /**
   * Used for declaring open datasets
   */
  openDataset: boolean;
  /*
   * Provides the ID of a parent dataset
   */
  parentId: string;
  /*
   * Information on the limitations and the reasons for them
   */
  publicAccessLimitations: string;
  /*
   * A point or period of time associated with the publication even in the
   * lifecycle of the resource
   */
  publicationDate: string;
  /*
   * Email of an entity responsible for making the resource available
   */
  publisherEmail: string;
  /*
   * Name of an entity responsible for making the resource available
   */
  publisherName: string;
  /*
   * Information about the reference system
   */
  referenceSystem: string;
  /*
   * The 'navigation section' of a metadata record which point users to the location (URL)
   * where the data can be downloaded, or to where additional information about the resource
   * may be provided
   */
  resourceLocator: string;
  /**
   * The responsible party (including contact information) of the resource
   */
  responsibleParty: ResponsibleParty[] | null;
  /*
   * A point or period of time associated with the revision event in the lifecycle of the resource",
   */
  revisionDate: string;
  /*
   * Denominator of the scale of the data set
   */
  scales: Scale[];
  /**
   * The operations supported by the service
   */
  spatialDataServiceOperations: string[] | null;
  /**
   * The queryables supported by the service
   */
  spatialDataServiceQueryables: string[] | null;
  /*
   * The nature or genre of the service
   */
  spatialDataServiceType: EnumSpatialDataServiceType | null;
  /**
   * The version of the implemented service specification
   */
  spatialDataServiceVersion: string | null;
  /*
   * Spatial resolution refers to the level of detail of the data set
   */
  spatialResolution: number | null;
  /**
   * A description of geospatial analysis or processing that the dataset is suitable for
   */
  suitableFor: string[];
  /*
   * A name given to the resource
   */
  title: string;
  /*
   * A high-level classification scheme to assist in the grouping and topic-based
   * search of available spatial data resources
   */
  topicCategory: EnumTopicCategory[];
  /*
   * The nature or genre of the resource
   */
  type: EnumAssetType | null;
  /**
   * True if the asset must be only used for Value-Added-Services (VAS)
   */
  userOnlyForVas: boolean;
  /*
   * Version of the resource
   */
  version: string;
}

export interface Publisher {
  /*
   * Company location (city)
   */
  city: string;
  /*
   * Company country
   */
  country: string;
  /**
   * Company contact email. This is the email address from the
   * provider's profile. The email is returned only if it has been
   * verified.
   */
  email: string | null;
  /*
   * Provider registration date in ISO format e.g. 2020-06-10T16:01:04.991+03:00
   */
  joinedAt: string;
  /*
   * Publisher unique id
   */
  id: string;
  /*
   * Base64 encoded company logo image
   */
  logoImage: string;
  /*
   * Company logo image mime type (used with image property to create a data URL)
   */
  logoImageMimeType: string;
  /*
   * Company name
   */
  name: string;
  /*
   * Average rating. If no user ratings exist, null is returned
   */
  rating: number | null;
}

export interface CatalogueItemStatistics {
  /*
   * Total number of downloads
   */
  downloads: number;
  /*
   * Total number of orders
   */
  sales: number;
  /*
   * Average rating. If no user ratings exist, null is returned
   */
  rating: number | null;
}

export interface Metadata {
  /**
   * resource unique identifier
   */
  key: string;
  assetType: 'NetCDF' | 'vector' | 'raster';
}

export interface VectorMetadata extends Metadata {
  /**
   * A list with the names of all attributes of the dataset.
   */
  attributes: string[];
  /**
   * A GeoJSON containing the clustered geometries.
   */
  clusters: GeoJSON.FeatureCollection;
  /**
   * A link to a PNG static map with the clustered geometries.
   */
  clustersStatic: string;
  /**
   * The Well-Known-Text representation of the Convex Hull for all geometries.
   */
  convexHull: string;
  /**
   * A link to a PNG static map showing the convex hull.
   */
  convexHullStatic: string;
  /**
   * Count not null values for each attribute in the dataset. The key is the attribute name.
   */
  count: { [attribute: string]: number };
  /**
   * The short name of the dataset's native Coordinate Reference System (CRS).
   */
  crs: string;
  /**
   * The data types for each of the dataset's attributes. The key is the attribute name.
   */
  datatypes: { [attribute: string]: string };
  /**
   * The distinct values for each of the categorical attributes in the dataset. The key is the attribute name.
   */
  distinct: { [attribute: string]: string[] };
  /**
   * The distribution of the values for each categorical attribute in the dataset.
   * The first key is the attribute name.
   * The inner object is the frequency of each value for the specific attribute.
   * The second key is the value.
   */
  distribution: { [attribute: string]: { [value: string]: number } }
  /**
   * The number of features in the dataset.
   */
  featureCount: number;
  /**
   * A link to a GeoJSON with a heatmap of the geometries.
   */
  heatmap: string;
  /**
   * A link to a PNG static map with a heatmap of the geometries.
   */
  heatmapStatic: string;
  /**
   * The Well-Known-Text representation of the Minimum Bounding Rectangle (MBR).
   */
  mbr: string;
  /**
   * A link to a PNG static map with the MBR.
   */
  mbrStatic: string;
  /**
   * The 5, 25, 50, 75, 95 quantiles for each of the numeric attributes in the dataset.
   */
  quantiles: { [q: string]: { [attribute: string]: number } };
  /**
   * The most frequent values for each of the attributes in the dataset.
   */
  recurring: { [attribute: string]: (string | number)[] };
  /**
   * Descriptive statistics (min, max, mean, median, std, sum) for the numerical attributes in the dataset.
   */
  statistics: {
    /**
     * The maximum value for each of the numeric attributes. The key is the attribute name.
     */
    max: { [attribute: string]: number };
    /**
     * The mean value for each of the numeric attributes. The key is the attribute name.
     */
    mean: { [attribute: string]: number };
    /**
     * The median value for each of the numeric attributes. The key is the attribute name.
     */
    median: { [attribute: string]: number };
    /**
     * The min value for each of the numeric attributes. The key is the attribute name.
     */
    min: { [attribute: string]: number };
    /**
     * The standard deviation for each of the numeric attributes. The key is the attribute name.
     */
    std: { [attribute: string]: number };
    /**
     * The sum of of all values for each of the numeric attributes. The key is the attribute name.
     */
    sum: { [attribute: string]: number };
  };
  /**
   * A link to a PNG thumbnail of the dataset.
   */
  thumbnail: string;
}

export interface RasterMetadata extends Metadata {
  /**
   * In case the raster is GeoTiff, whether it is Cloud-Optimized or not.
   */
  cog: boolean;
  /**
   * The Color Interpretation for each band.
   */
  colorInterpretation: string[];
  /**
   * The short name of the dataset's native Coordinate Reference System (CRS).
   */
  crs: string;
  /**
   * The data type of each band.
   */
  datatypes: string[];
  /**
   * The default histogram of the raster for each band.
   * Each array contains the following values:
   * - The minimum Pixel Value.
   * - The maximum Pixel Value.
   * - The total number of pixel values.
   * - An array with the frequencies for each Pixel Value (has length equal to the total number of Pixel Values).
   */
  histogram: [number, number, number, number[]][];
  /**
   * General information about the raster file.
   */
  info: {
    /**
     * A list with the bands included in the raster.
     */
    bands: string[];
    /**
     * The driver used to open the raster.
     */
    driver: string;
    /**
     * A list of the files associated with the raster.
     */
    files: string[];
    /**
     * The height in pixels.
     */
    height: number;
    /**
     * Various values describing the image structure. The keys depend on the raster.
     */
    imageStructure: { [key: string]: string | number };
    /**
     * Metadata of the the raster as written in the file. The keys are free-text.
     */
    metadata: { [key: string]: string };
    /**
     * The width in pixels.
     */
    width: number;
  };
  /**
   * The Well-Known-Text representation of the Minimum Bounding Rectangle (MBR).
   */
  mbr: string;
  /**
   * A link to a PNG static map with the MBR.
   */
  mbrStatic: string;
  /**
   * The no-data value of each band.
   */
  noDataValue: { [band: string]: number };
  /**
   * The number of bands in the raster.
   */
  numberOfBands: number;
  /**
   * The resolution for each axis, and the unit of measurement.
   */
  resolution: {
    /**
     * The unit of resolution.
     */
    unit: string;
    /**
     * Resolution in x-axis.
     */
    x: number;
    /**
     * Resolution in y-axis.
     */
    y: number;
  };
  /**
   * A list with descriptive statistics for each band of the raster file.
   */
  statistics: {
    [band: string]: {
      /**
       * The maximum value in the band.
       */
      max: number;
      /**
       * The mean value in the band.
       */
      mean: number;
      /**
       * The minimum value in the band.
       */
      min: number;
      /**
       * The standard deviation in the band.
       */
      std: number;
    }
  };
}

export interface NetCdfMetadata extends Metadata {
  /**
   * A list with the dimensions.
   */
  dimensionsList: string[];
  /**
   * The properties of each dimension. The key is the dimension.
   */
  dimensionsProperties: { [d: string]: { [property: string]: string | number } };
  /**
   * The number of the dimensions.
   */
  dimensionsSize: number;
  /**
   * The Well-Known-Text representation of the Minimum Bounding Rectangle (MBR).
   */
  mbr: string;
  /**
   * A link to a PNG static map with the MBR.
   */
  mbrStatic: string;
  /**
   * The metadata object as written in the file. The key is a free field for the
   * data provider, usually describing the given information.
   */
  metadata: { [m: string]: string };
  /**
   * The no-data value for each the variables. The key is the variable.
   */
  noDataValues: { [v: string]: number };
  /**
   * Descriptive statistics for each of the variables. The key is the variable.
   */
  statistics: {
    [v: string]: {
      /**
       * Whether the data are contiguous or not.
       */
      contiguous: boolean;
      /**
       * The number of values for the specific variable.
       */
      count: number;
      /**
       * The maximum value of the specific variable.
       */
      max: number;
      /**
       * The mean value of the specific variable.
       */
      mean: number;
      /**
       * The minimum value of the specific variable.
       */
      min: number;
      /**
       * The number of missing values for the specific variable.
       */
      missing: number;
      /**
       * The standard deviation for the specific variable.
       */
      std: number;
      /**
       * The variance of the specific variable.
       */
      variance: number;
      /**
       * A free-text string representing the temporal extend of the dataset.
       */
      temporalExtent: string;
      /**
       * A list with the variables.
       */
      variablesList: string[];
      /**
       * The properties for each variable. The key is the variable.
       */
      variablesProperties: { [v: string]: { [property: string]: string | number } };
      /**
       * Number of variables.
       */
      variablesSize: number;
    }
  };

}

export interface ResourceIngestionData {
  /**
   * The resource unique identifier
   */
  key: string;
  /**
   * The number of features stored in the table
   */
  features: number;
  /**
   * The database schema of the created table
   */
  schema: string;
  /**
   * The name of the created table. The table name is equal to the resource unique identifier
   */
  tableName: string;
  /**
   * Service endpoints. Only visible to asset owners
   */
  endpoints?: {
    /**
     * Service type
     */
    type: EnumSpatialDataServiceType,
    /**
     * Service endpoint URI
     */
    uri: string;
  }[]
}

export interface CatalogueItem extends BaseCatalogueItem {
  /*
   * Catalogue item identifier (UUID)
   */
  id: string;
  /*
   * Pricing model available for the asset
   */
  pricingModels: EffectivePricingModel[];
  /*
   * Publisher details
   */
  publisher?: Publisher;
  /*
   * Id of an entity responsible for making the resource available
   */
  publisherId: string;
}

export interface CatalogueItemDetails extends CatalogueItem {
  /**
   * Auxiliary files or additional resources to the dataset
   */
  additionalResources: (AssetFileAdditionalResource | AssetUriAdditionalResource)[];
  /**
   * Automated metadata. The property is present only for authenticated users.
   * The array contains an element for each resource. The resource can be found
   * using the key property.
   */
  automatedMetadata?: Metadata[];
  /**
   * Ingestion information. Only visible to the owners (publishers) of the asset.
   * The array contains an element for each ingested resource. The resource can
   * be found using the key property.
   */
  ingestionInfo?: ResourceIngestionData[];
  /**
   * A list of resources of the dataset
   */
  resources: Resource[];
  /*
   * Asset statistics
   */
  statistics: CatalogueItemStatistics;
  /**
   * A list of all item versions
   */
  versions: string[];
}
