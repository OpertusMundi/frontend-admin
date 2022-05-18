import { Moment } from 'moment';
import { EnumTopicCategory } from './catalogue';
import { EnumDataProvider } from './configuration';
import { EnumAuthProvider } from './enum';
import { EnumMarketplaceRole as EnumRole } from './role';

export enum EnumActivationStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
}

export enum EnumMangopayUserType {
  INDIVIDUAL = 'INDIVIDUAL',
  PROFESSIONAL = 'PROFESSIONAL',
}

export enum EnumLegalPersonType {
  BUSINESS = 'BUSINESS',
  ORGANIZATION = 'ORGANIZATION',
  SOLETRADER = 'SOLETRADER',
}

export enum EnumCustomerType {
  CONSUMER = 'CONSUMER',
  PROVIDER = 'PROVIDER',
}

export enum EnumCustomerRegistrationStatus {
  DRAFT = 'DRAFT',
  CANCELLED = 'CANCELLED',
  SUBMITTED = 'SUBMITTED',
  COMPLETED = 'COMPLETED',
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
interface AddressBase {
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
 * Address
 */
// eslint-disable-next-line
export interface Address extends AddressBase {

}

/**
 * Bank account base interface
 */
export interface BankAccountBase {
  ownerName: string;
  iban: string;
  bic: string;
}

/**
 * Bank account
 */
export interface BankAccount extends BankAccountBase {
  ownerAddress: Address;
}

/**
 * Professional customer legal representative base interface
 */
export interface CustomerRepresentativeBase {
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
 * Professional customer legal representative
 */
export interface CustomerRepresentative extends CustomerRepresentativeBase {
  address: Address;
}

/**
 * Customer (Consumer/Provider) draft base interface
 */
interface CustomerDraft {
  createdAt: string;
  email: string;
  modifiedAt: string;
  status: EnumCustomerRegistrationStatus;
  type: EnumMangopayUserType;
}

/**
 * Individual customer (Consumer) draft
 */
export interface CustomerDraftIndividual extends CustomerDraft {
  address: Address;
  birthdate: string;
  countryOfResidence: string;
  firstName: string;
  lastName: string;
  nationality: string;
  occupation: string;
}

/**
 * Professional customer (Consumer/Professional) draft
 */
export interface CustomerDraftProfessional extends CustomerDraft {
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
  representative: CustomerRepresentative;
  siteUrl: string;
}

/**
 * Customer (Consumer/Processional) base interface
 */
export interface Customer {
  contract: string;
  createdAt: string;
  email: string;
  emailVerified: boolean;
  emailVerifiedAt: string;
  key: string;
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
  type: EnumMangopayUserType.INDIVIDUAL;
  walletFunds: number;
  walletFundsUpdatedOn: Moment | null;
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
  type: EnumMangopayUserType.PROFESSIONAL;
  walletFunds: number;
  walletFundsUpdatedOn: Moment | null;
}

export type CustomerType = CustomerIndividual | CustomerProfessional;

/**
 * Profile consumer related data
 */
interface ConsumerData {
  /**
   * Current consumer data. If a consumer is not registered, null is returned.
   */
  current: CustomerIndividual | CustomerProfessional | null;
  /**
   * Consumer draft data. If no update is active, null is returned.
   */
  draft: CustomerDraftIndividual | CustomerDraftProfessional | null;
  /**
   * True if the account is a registered consumer
   */
  registered: boolean;
}

/**
 * Profile provider related data
 */
interface ProviderData {
  /**
   * Current provider data. If provider is not registered, null is returned.
   */
  current: CustomerProfessional | null;
  /**
   * Provider draft data. If no update is active, null is returned.
   */
  draft: CustomerDraftProfessional | null;
  /**
   * True if the account is a registered provider.
   */
  registered: boolean;
}

/**
 * Profile base interface
 */
interface ProfileBase {
  /**
   * Base64 encoded user image
   */
  image?: string;
  /**
   * User image mime type (used with image property to create a data URL)
   */
  imageMimeType?: string;
  /**
   * Locale ISO 3166-1 alpha-2 code e.g. el. Default is en.
   */
  locale: string;
  /**
   * User phone
   */
  phone: string;
}

/**
 * Profile
 */
export interface Profile extends ProfileBase {
  /**
   * Consumer related data
   */
  consumer: ConsumerData;
  /**
   * Profile creation date
   */
  createdOn: string;
  /**
   * First name
   */
  firstName: string;
  /**
   * Last name
   */
  lastName: string;
  /**
   * User mobile
   */
  mobile: string;
  /**
   * Profile most recent update date
   */
  modifiedOn: string;
  /**
   * Provider related data
   */
  provider: ProviderData;
}

/**
 * Marketplace account details
 */
export interface MarketplaceAccountDetails {
  /**
   * Date of account activation. Activation occurs when the user verifies his email address.
   * The date is in ISO format.
   */
  activatedAt: string;
  /**
   * Activation status
   */
  activationStatus: EnumActivationStatus;
  /**
   * User email. Must be unique
   */
  email: string;
  /**
   * True if the email address is verified
   */
  emailVerified: boolean;
  /**
   * Date of email verification
   */
  emailVerifiedAt: string;
  /**
   * IDP name used for account registration. A value from enum  {@link EnumAuthProvider}
   */
  idpName: EnumAuthProvider;
  /**
   * User name as retrieved by the IDP user info endpoint
   */
  idpUserName: string;
  /**
   * User image URL as retrieved by the IDP user info endpoint
   */
  idpUserImage: string;
  /**
   * User unique key
   */
  key: string;
  /**
   * User profile
   */
  profile: Profile;
  /**
   * Date of registration in ISO format
   */
  registeredAt: Moment;
  /**
   * User roles. Every authenticated user has at least role ROLE_USER
   */
  roles: EnumRole[];
  /**
   * User name (always equal to user email)
   */
  username: string;
}

export enum EnumMarketplaceAccountSortField {
  EMAIL = 'EMAIL',
  CONSUMER_FUNDS = 'CONSUMER_FUNDS',
  PROVIDER_FUNDS = 'PROVIDER_FUNDS',
}

export interface MarketplaceAccountQuery {
  name: string;
}

export enum EnumAccountType {
  OPERTUSMUNDI = 'OPERTUSMUNDI',
  VENDOR = 'VENDOR',
}

export interface MarketplaceAccount {
  accountStatus: EnumActivationStatus;
  activatedAt: Moment;
  consumer: boolean
  consumerFunds: number;
  consumerKycLevel: EnumKycLevel;
  consumerName: string;
  consumerUpdatePending: boolean;
  email: string;
  emailVerified: boolean;
  image: string;
  imageMimeType: string;
  key: string;
  locale: string;
  provider: boolean;
  providerFunds: number;
  providerKycLevel: EnumKycLevel;
  providerName: string;
  providerUpdatePending: boolean;
  registeredOn: Moment;
  roles: EnumRole[];
  type: EnumAccountType;
  userName: string;
}

export enum EnumAssetPurchaseSource {
  PURCHASE = 'PURCHASE',
  UPDATE = 'UPDATE',
}

export interface MarketplaceAccountSubscription {
  /**
   * Service PID
   */
  service: string;
  /**
   * When the subscription was registered to the user account
   */
  addedOn: Moment;
  /**
   * Date of last update
   */
  updatedOn: Moment;
  /**
   * Operation that registered the subscription
   */
  source: EnumAssetPurchaseSource;
  /**
   * First asset topic category if any exist
   */
  segment: EnumTopicCategory;
  /**
   * Subscription owner
   */
  consumer?: Customer;
  /**
   * Subscription seller
   */
  provider?: Customer;
}

export interface ExternalProviderCommand {
  provider: EnumDataProvider;
}