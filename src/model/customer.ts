export enum EnumMangopayUserType {
  INDIVIDUAL = 'INDIVIDUAL',
  PROFESSIONAL = 'PROFESSIONAL',
}

export enum EnumLegalPersonType {
  BUSINESS = 'BUSINESS',
  ORGANIZATION = 'ORGANIZATION',
  SOLETRADER = 'SOLETRADER',
}

export enum EnumKycLevel {
  /**
   * KYC documents have not been submitted or not validated
   */
  LIGHT = 'LIGHT',
  /**
   * Customer KYC documents have been submitted and validated
   */
  REGULAR = 'REGULAR',
}

/**
 * Address base interface
 */
export interface Address {
  city: string;
  /**
   * Country 2-letter code e.g. GR
   *
   * https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2
   */
  country: string;
  line1: string;
  line2: string;
  postalCode: string;
  region: string;
}

/**
 * Bank account base interface
 */
export interface BankAccount {
  ownerName: string;
  iban: string;
  bic: string;
  ownerAddress: Address;
}

/**
 * Professional customer legal representative base interface
 */
export interface CustomerRepresentative {
  address: Address;
  /**
   * The person's birth date with YYYY-MM-DD format
   */
  birthdate: string;
  /**
   * The representative country of residence. ISO 3166-1 alpha-2 format is expected
   *
   * https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2
   */
  countryOfResidence: string;
  email: string;
  firstName: string;
  lastName: string;
  /**
   * The representative nationality. ISO 3166-1 alpha-2 format is expected
   *
   * https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2
   */
  nationality: string;
}

/**
 * Customer (Consumer/Processional) base interface
 */
interface Customer {
  /**
   * Contract reference
   */
  contract: string;
  createdAt: string;
  email: string;
  emailVerified: boolean;
  emailVerifiedAt: string;
  kycLevel: EnumKycLevel;
  modifiedAt: string;
  /**
   * Payment provider unique user id
   */
  paymentProviderUser: string;
  /**
   * Payment provider unique waller id
   */
  paymentProviderWallet: string;
  type: EnumMangopayUserType;
}

/**
 * Individual customer (Consumer)
 */
export interface CustomerIndividual extends Customer {
  address: Address;
  birthdate: string;
  countryOfResidence: string;
  firstName: string;
  lastName: string;
  nationality: string;
  occupation: string;
}

/**
 * Professional customer (Consumer/Provider)
 */
export interface CustomerProfessional extends Customer {
  additionalInfo: string;
  bankAccount: BankAccount;
  companyNumber: string;
  companyType: string;
  headquartersAddress: Address;
  legalPersonType: EnumLegalPersonType;
  /**
   * Base64 encoded company logo image
   */
  logoImage: string;
  /**
   * Company logo image mime type (used with image property to create a data URL)
   */
  logoImageMimeType: string;
  name: string;
  phone: string;
  rating: number | null;
  representative: CustomerRepresentative;
  siteUrl: string;
}
