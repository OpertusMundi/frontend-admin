import { Moment } from 'moment';
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
 * Address command
 */
// eslint-disable-next-line
export interface AddressCommand extends AddressBase {

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
 * Bank account command
 */
export interface BankAccountCommand extends BankAccountBase {
  ownerAddress: AddressCommand;
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
 * Professional customer legal representative command
 */
export interface CustomerRepresentativeCommand extends CustomerRepresentativeBase {
  address: AddressCommand;
}

/**
 * Professional customer legal representative
 */
export interface CustomerRepresentative extends CustomerRepresentativeBase {
  address: Address;
}

/**
 * Customer (Consumer/Provider) command base interface
 */
interface CustomerCommand {
  email: string;
  /**
   * Customer type
   */
  type: EnumMangopayUserType;
}

/**
 * Individual consumer customer command
 *
 * Property type value expected to be INDIVIDUAL
 */
export interface ConsumerIndividualCommand extends CustomerCommand {
  address: AddressCommand,
  /**
   * The customer's birth date with YYYY-MM-DD format
   */
  birthdate: string;
  /**
   * The customer country of residence. ISO 3166-1 alpha-2 format is expected
   *
   * https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2
   */
  countryOfResidence: string;
  firstName: string;
  lastName: string;
  /**
   * The customer nationality. ISO 3166-1 alpha-2 format is expected
   *
   * https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2
   */
  nationality: string;
  occupation: string;
}

/**
 * Professional consumer customer command
 *
 * Property type value expected to be PROFESSIONAL
 */
export interface ConsumerProfessionalCommand extends CustomerCommand {
  additionalInfo: string;
  /**
   * VAT number
   */
  companyNumber: string;
  companyType: string;
  headquartersAddress: AddressCommand;
  legalPersonType: EnumLegalPersonType;
  representative: CustomerRepresentativeCommand;
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
  siteUrl: string;
}

/**
 * Professional provider customer command
 *
 * Property type value expected to be PROFESSIONAL
 */
export interface ProviderProfessionalCommand extends ConsumerProfessionalCommand {
  bankAccount: BankAccountCommand;
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
 * Profile update command
 */
export interface MarketplaceAccountProfileCommand extends ProfileBase {
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
 * Account command
 */
export interface MarketplaceAccountCommandDto {
  /**
   * User email. Must be unique
   */
  email: string;
  /**
   * Account password
   */
  password: string;
  /**
   * Account profile
   */
  profile: MarketplaceAccountProfileCommand;
  /**
   * Account password verification. Must match property password
   */
  verifyPassword: string;
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
  registeredAt: string;
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
}

export interface MarketplaceAccountQuery {
  name: string;
}

export interface MarketplaceAccount {
  accountStatus: EnumActivationStatus;
  activatedAt: Moment;
  consumer: boolean
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
  providerKycLevel: EnumKycLevel;
  providerName: string;
  providerUpdatePending: boolean;
  registeredOn: Moment;
  userName: string;
}

export interface MarketplaceAccountReviewCommand {
  acceptChanges: boolean;
  rejectReason?: string;
}