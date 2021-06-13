export enum EnumContinent {
  AFRICA = 'AFRICA',
  NORTH_AMERICA = 'NORTH_AMERICA',
  OCEANIA = 'OCEANIA',
  ANTARCTICA = 'ANTARCTICA',
  ASIA = 'ASIA',
  EUROPE = 'EUROPE',
  SOUTH_AMERICA = 'SOUTH_AMERICA',
}

export enum EnumAssetType {
  RASTER = 'RASTER',
  SERVICE = 'SERVICE',
  VECTOR = 'VECTOR',
}

export enum EnumSpatialDataServiceType {
  TMS = 'TMS',
  WMS = 'WMS',
  WFS = 'WFS',
  WCS = 'WCS',
  CSW = 'CSW',
  DATA_API = 'DATA_API',
  OGC_API = 'OGC_API',
}

export enum EnumPaymentMethod {
  /**
   * Payment with registered card
   */
  CARD_DIRECT = 'CARD_DIRECT',
  /**
   * Payment using bankwire transfer
   */
  BANKWIRE = 'BANKWIRE',
}

export enum EnumDeliveryMethod {
  NONE = 'NONE',
  DIGITAL_PLATFORM = 'DIGITAL_PLATFORM',
  DIGITAL_PROVIDER = 'DIGITAL_PROVIDER',
  PHYSICAL_PROVIDER = 'PHYSICAL_PROVIDER',
}
