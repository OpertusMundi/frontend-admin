import { EnumContinent, EnumAssetType } from 'model/enum';

export interface PricingModelSettings {
  /**
   * Resource types to which this pricing model can be applied
   */
  applicableTo: EnumAssetType[];
  /**
   * True if this model exclusive i.e. cannot be listed with other pricing models
   */
  exclusive: boolean;
  /**
   * Pricing models that are allowed to listed with this model.
   * If exclusive is True this property is ignored.
   */
  exclusiveWith: EnumPricingModel[];
  /**
   * The pricing model unique key
   */
  pricingModel: EnumPricingModel;
}

export interface DiscountRate {
  /**
   * Threshold at which the discount is applied. The field may refer to different
   * units e.g. number of rows, thousands of service calls, thousands of people, etc.
   * The unit type is determined by the parent pricing model
   */
  count: number;
  /**
   * Discount percent as an 2 digit integer
   */
  discount: number;
}

export interface PrePaidTier {
  /**
   * Number of purchased units e.g. number of rows, thousands of service calls, etc.
   * The unit type is determined by the parent pricing model
   */
  count: number;
  /**
   * Discount percent
   */
  discount: number;
}

export enum EnumPricingModel {
  /**
   * Invalid pricing model
   */
  UNDEFINED = 'UNDEFINED',
  /*
   * Free
   */
  FREE = 'FREE',
  /**
   * Fixed payment model with or without updates
   */
  FIXED = 'FIXED',
  /**
   * Buy once, pay per row with optional reverse block rate
   */
  FIXED_PER_ROWS = 'FIXED_PER_ROWS',
  /**
   * Buy once, pay based on population selection with optional reverse block rate
   */
  FIXED_FOR_POPULATION = 'FIXED_FOR_POPULATION',
  /**
   * Pay per call, optional buy prepaid SKUs with reverse block rate
   */
  PER_CALL_WITH_PREPAID = 'PER_CALL_WITH_PREPAID',
  /**
   * Pay per call, optional define reverse block rate pricing
   */
  PER_CALL_WITH_BLOCK_RATE = 'PER_CALL_WITH_BLOCK_RATE',
  /**
   * Pay per row, optional buy prepaid SKUs with reverse block rate
   */
  PER_ROW_WITH_PREPAID = 'PER_ROW_WITH_PREPAID',
  /**
   * Pay per row, optional define reverse block rate pricing
   */
  PER_ROW_WITH_BLOCK_RATE = 'PER_ROW_WITH_BLOCK_RATE',
}

export interface BasePricingModelCommand {
  /*
   *
   */
  key?: string,
  /*
   * Discriminator field used for deserializing the model to the appropriate data type
   */
  type: EnumPricingModel;
  /**
   * The domains in which users can apply the asset. Can be empty if no restrictions exist
   */
  domainRestrictions: string[];
  /**
   * Continents that the users are allowed to apply the asset
   */
  coverageRestrictionContinents: EnumContinent[];
  /**
   * Restrict consumers to specific continents
   */
  consumerRestrictionContinents: EnumContinent[];
  /**
   * Countries that the users are allowed to apply the asset. Countries are specified
   * using the 2 letter code as defined in ISO 3166.
   *
   * {@see https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes}
   */
  coverageRestrictionCountries: string[];
  /**
   * Restrict consumers to specific countries. Countries are specified
   * using the 2 letter code as defined in ISO 3166.
   *
   * {@see https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes}
   */
  consumerRestrictionCountries: string[];
}

export interface FreePricingModelCommand extends BasePricingModelCommand {
  /*
   * Discriminator field used for deserializing the model to the appropriate data type
   */
  type: EnumPricingModel.FREE;
}

export interface FixedPricingModelCommand extends BasePricingModelCommand {
  /*
   * Discriminator field used for deserializing the model to the appropriate data type
   */
  type: EnumPricingModel.FIXED;
  /*
   * Number of years for included updates (can be 0 if no updates are supported)
   */
  yearsOfUpdates: number;
  /*
   * Price excluding tax
   */
  totalPriceExcludingTax: number;
}

export interface FixedRowPricingModelCommand extends BasePricingModelCommand {
  /*
   * Discriminator field used for deserializing the model to the appropriate data type
   */
  type: EnumPricingModel.FIXED_PER_ROWS;
  /*
   * The price prospective clients will pay per 1,000 rows
   */
  price: number;
  /*
   * The minimum number of rows a client can purchase per transaction
   */
  minRows: number;
  /**
   * Discount rates based on the number of selected rows. Each element (except for the first one)
   * must have a `count` property with a value greater than the previous one
   */
  discountRates: DiscountRate[];
}

export interface FixedPopulationPricingModelCommand extends BasePricingModelCommand {
  /*
   * Discriminator field used for deserializing the model to the appropriate data type
   */
  type: EnumPricingModel.FIXED_FOR_POPULATION;
  /**
   * The price prospective clients will pay per 10,000 people
   */
  price: number;
  /**
   * The minimum population percentage of the entire asset clients can purchase per transaction
   */
  minPercent: number;
  /**
   * Discount rates based on the the size of population in tens of thousands of people.
   * Each element (except for the first one) must have a `count` property with a value
   * greater than the previous one
   */
  discountRates: DiscountRate[];
}

export interface CallPrePaidPricingModelCommand extends BasePricingModelCommand {
  /*
   * Discriminator field used for deserializing the model to the appropriate data type
   */
  type: EnumPricingModel.PER_CALL_WITH_PREPAID;
  /**
   * The price per call
   */
  price: number;
  /**
   * Prepaid tiers using service calls as units. Each element (except for the first one)
   * must have a `count` property with a value greater than the previous one
   */
  prePaidTiers: PrePaidTier[];
}

export interface CallBlockRatePricingModelCommand extends BasePricingModelCommand {
  /*
   * Discriminator field used for deserializing the model to the appropriate data type
   */
  type: EnumPricingModel.PER_CALL_WITH_BLOCK_RATE;
  /**
   * The price per call
   */
  price: number;
  /**
   * Discount rates based on the number of service calls. Each element (except for the first one)
   * must have a `count` property with a value greater than the previous one"
   */
  discountRates: DiscountRate[];
}

export interface RowPrePaidPricingModelCommand extends BasePricingModelCommand {
  /*
   * Discriminator field used for deserializing the model to the appropriate data type
   */
  type: EnumPricingModel.PER_ROW_WITH_PREPAID;
  /**
   * The price per row
   */
  price: number;
  /**
   * Prepaid tiers using data rows as units. Each element (except for the first one)
   * must have a `count` property with a value greater than the previous one
   */
  prePaidTiers: PrePaidTier[];
}

export interface RowBlockRatePricingModelCommand extends BasePricingModelCommand {
  /*
   * Discriminator field used for deserializing the model to the appropriate data type
   */
  type: EnumPricingModel.PER_ROW_WITH_BLOCK_RATE;
  /**
   * The price per row
   */
  price: number;
  /**
   * Discount rates based on the number of selected rows. Each element (except for the first one)
   * must have a `count` property with a value greater than the previous one
   */
  discountRates: DiscountRate[];
}

export interface SystemParameters {
  /**
   * System-defined parameter of the size of selected population. If the pricing model does not
   * support population size parameter, this property is not set
   */
  population?: number;
  /**
   * System-defined parameter of the selected percent of total population. If the pricing model does not
   * support population size parameter, this property is not set
   */
  populationPercent?: number;
  /**
   * System-defined parameter of the number of rows selected. If the pricing model does not support
   * number of rows parameter, this property is not set
   */
  rows?: number;
}

/**
 * User-defined quotation parameters
 */
export interface QuotationParametersCommand {
  /**
   * User-defined array of NUTS codes. The codes are used for computing asset coverage and population
   */
  nuts?: string[];
  /**
   * Selected prepaid tier index if the feature is supported. If a tier is selected and the pricing
   * model does not support prepaid tiers, the quotation service will return a validation error
   */
  prePaidTier?: number | null;
  /**
   * Dynamic system-defined parameters set during the creation of a quotation such as the
   * selected number of rows or population
   */
  systemParams?: SystemParameters;
}

/**
 * Quotation parameters bag with all user and system defined parameters
 */
export interface QuotationParameters extends QuotationParametersCommand {
  /**
   * Dynamic system-defined parameters set during the creation of a quotation such as the
   * selected number of rows or population
   */
  systemParams?: SystemParameters;
}

export interface QuotationCommand {
  /**
   * Asset unique PID
   */
  assetId: string;
  /**
   * Pricing model unique key (must exist in the pricing models specified in the
   * asset selected by the `assetId`)
   */
  pricingModelKey: string;
  /**
   * Quotation parameters
   */
  parameters: QuotationParametersCommand;
}

export interface Quotation {
  /**
   * Tax percent e.g. 24
   */
  taxPercent: number;
  /**
   * Price excluding tax
   */
  totalPriceExcludingTax: number;
  /**
   * Price tax
   */
  tax: number
  /**
   * Total price including tax
   */
  totalPrice: number
  /**
   * Platform fees. This field is available only to providers when viewing their published assets
   */
  fees?: number;
  /**
   * Currency of monetary value
   */
  currency: string;
}

/**
 * Represents an effective pricing model that consists of
 * a pricing model, the quotation parameters and a quotation
 * result. Depending the pricing model, if not all parameters
 * are set, the quotation result may be null e.g. if the pricing
 * model requires the population size (dynamic system parameter)
 * and the user has not specified any NUTS codes, the quotation
 * result is not set
 */
export interface EffectivePricingModel {
  /**
   * The pricing model
   */
  model: FreePricingModelCommand | FixedPricingModelCommand | FixedRowPricingModelCommand | FixedPopulationPricingModelCommand | CallPrePaidPricingModelCommand | CallBlockRatePricingModelCommand | RowPrePaidPricingModelCommand | RowBlockRatePricingModelCommand;
  /**
   * Parameters applied to the pricing model for computing the effective pricing model
   */
  parameters: QuotationParameters;
  /**
   * Quotation data. May be null if the pricing model is dynamic i.e. `FIXED_FOR_POPULATION`
   * and parameters are missing
   */
  quotation: Quotation;
}