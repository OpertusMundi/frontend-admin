import { Moment } from 'moment';
import { EnumPaymentMethod, EnumDeliveryMethod, EnumRecurringPaymentType } from 'model/enum';
import {
  Address,
  BankAccount,
  CustomerProfessional,
  CustomerType,
  AccountSubscription,
} from 'model/account-marketplace';
import { EffectivePricingModel, PricingModelCommand } from 'model/pricing-model';

export enum EnumBillingViewMode {
  DEFAULT = 'DEFAULT',
  CONSUMER = 'CONSUMER',
  PROVIDER = 'PROVIDER'
}

export enum EnumCardType {
  CB_VISA_MASTERCARD = 'CB_VISA_MASTERCARD',
}

export enum EnumCardValidity {
  /**
  * UNKNOWN validity.
  */
  UNKNOWN,
  /**
  * VALID validity.
  */
  VALID,
  /**
  * INVALID validity.
  */
  INVALID
}

export enum EnumPayInItemType {
  ORDER = 'ORDER',
  SUBSCRIPTION_BILLING = 'SUBSCRIPTION_BILLING',
}

export enum EnumTransactionStatus {
  /**
   * Not specified.
   */
  NotSpecified = 'NotSpecified',
  /**
   * CREATED transaction status.
   */
  CREATED = 'CREATED',
  /**
   * SUCCEEDED transaction status.
   */
  SUCCEEDED = 'SUCCEEDED',
  /**
   * FAILED transaction status.
   */
  FAILED = 'FAILED',
}

export interface BrowserInfo {
  colorDepth: number;
  javaEnabled: boolean;
  javaScriptEnabled: boolean;
  language: string;
  screenHeight: number;
  screenWidth: number;
  timeZoneOffset: number;
  userAgent: string;
}

export interface PayInAddress extends Address {
  firstName: string;
  lastName: string;
}

export interface Transfer {
  /**
   * Transfer unique key
   */
  key: string;
  /**
   * Funds debited from buyer's wallet and credited to seller's wallet
   */
  creditedFunds: number;
  /**
   * Platform fees
   */
  fees: number;
  /**
   * Transaction status
   */
  status: EnumTransactionStatus;
  /**
   * Date of creation in ISO format
   */
  createdOn: Moment;
  /**
   * Date of execution in ISO format
   */
  executedOn: Moment;
  /**
   * Provider identifier
   */
  providerId: string;
  /**
   * Provider error code
   */
  resultCode: string;
  /**
   * Provider error message
   */
  resultMessage: string;
}

export enum EnumSubscriptionBillingSortField {
  CREATED_ON = 'CREATED_ON',
  DUE_DATE = 'DUE_DATE',
  FROM_DATE = 'FROM_DATE',
  STATUS = 'STATUS',
  TO_DATE = 'TO_DATE',
  TOTAL_PRICE = 'TOTAL_PRICE',
  UPDATED_ON = 'UPDATED_ON',
}

export enum EnumBillableServiceType {
  SUBSCRIPTION = 'SUBSCRIPTION',
  PRIVATE_OGC_SERVICE = 'PRIVATE_OGC_SERVICE',
}

export enum EnumSubscriptionBillingStatus {
  /**
   * A billing record with 0 total price has been created
   */
  NO_CHARGE = 'NO_CHARGE',
  /**
   * A billing record has been generated, but it hasn't been paid yet
   */
  DUE = 'DUE',
  /**
   * Payment method has been declined
   */
  FAILED = 'FAILED',
  /**
   * Billing record has been paid
   */
  PAID = 'PAID',
}

export interface ServiceUseStats {
  /**
   * Number of service calls
   */
  calls: number;
  /**
   * Number of service calls per client
   */
  clientCalls: { [client: string]: number };
  /**
   * Number of rows returned by service calls per client
   */
  clientRows: { [client: string]: number };
  /**
   * Number of rows returned by service calls
   */
  rows: number;
  /**
   * Asset unique PID
   */
  subscriptionKey: string;
  /**
   * Subscriber account unique key
   */
  userKey: string;
}

export interface SubscriptionBilling {
  /**
   * Date of creation
   */
  createdOn: Moment;
  /**
   * Payment due date
   */
  dueDate: Moment;
  /**
   * Billing interval first date in ISO format e.g. 2020-06-10T16:01:04.991+03:00
   */
  fromDate: Moment;
  /**
   * Subscription billing payin
   */
  payIn?: PayInType;
  /**
   * Pricing model used for the quotation
   */
  pricingModel: PricingModelCommand;
  /**
   * Service unique PID
   */
  service: string;
  /**
   * Billing interval last date in ISO format e.g. 2020-07-10T16:01:04.991+03:00
   */
  toDate: Moment;
  /**
   * Total calls charged in this record. This field is exclusive with field `totalRows`
   */
  totalCalls: number;
  /**
   * Total rows charged in this record. This field is exclusive with field `totalCalls`
   */
  totalRows: number;
  /**
   * Total calls used by purchased SKUs. This field is exclusive with field `skuTotalRows`
   */
  skuTotalCalls: number;
  /**
   * Total rows used by purchased SKUs. This field is exclusive with field `skuTotalCalls`
   */
  skuTotalRows: number;
  /**
   * Use statistics
   */
  stats: ServiceUseStats;
  /**
   * Status
   */
  status: EnumSubscriptionBillingStatus;
  /**
   * Account subscription
   */
  subscription?: AccountSubscription;
  /**
   * Service description
   */
  subscriptionDescription: string;
  /**
   * Item total price
   */
  totalPrice: number;
  /**
   * Item price excluding tax
   */
  totalPriceExcludingTax: number;
  /**
   * Item tax
   */
  totalTax: number;
  /**
   * Date of last update
   */
  updatedOn: Moment;
}

export interface SubscriptionBillingQuery {
  ownerKey?: string;
  serviceKey?: string;
  status: EnumSubscriptionBillingStatus[];
  type?: EnumBillableServiceType;
}

export interface PayInItem {
  /**
   * Payment item type
   */
  type: EnumPayInItemType;
  /**
   * Invoice line number
   */
  index: number;
  /**
   * Transfer of funds from the buyer's to the seller's wallet
   */
  transfer?: Transfer;
}

export interface SubscriptionBillingPayInItem extends PayInItem {
  /**
   * Payment item type
   */
  type: EnumPayInItemType.SUBSCRIPTION_BILLING;
  /**
   * PayIn subscription billing record
   */
  subscriptionBilling: SubscriptionBilling;
}

export enum EnumPayInSortField {
  CREATED_ON = 'CREATED_ON',
  EXECUTED_ON = 'EXECUTED_ON',
  MODIFIED_ON = 'MODIFIED_ON',
  REFERENCE_NUMBER = 'REFERENCE_NUMBER',
  STATUS = 'STATUS',
  TOTAL_PRICE = 'TOTAL_PRICE',
  USER_NAME = 'USER_NAME',
}

export interface PayInQuery {
  consumerKey?: string;
  email: string;
  referenceNumber: string;
  status: EnumTransactionStatus[];
}

export interface PayInStatusHistory {
  status: EnumTransactionStatus;
  updatedOn: Moment;
}

export enum EnumRecurringPaymentFrequency {
  ANNUAL = 'ANNUAL',
  MONTHLY = 'MONTHLY',
}

export enum EnumRecurringPaymentStatus {
  /**
   * The registration has been created but not yet used for a recurring pay-in
   */
  CREATED = 'CREATED',
  /**
   * The recurring payment is in progress
   */
  IN_PROGRESS = 'IN_PROGRESS',
  /**
   * An attempted pay-in was unsuccessfully authorized, and the end user must
   * authenticate. If the object has this status, you are obliged to notify
   * the end user and execute a CIT which they authenticate.
   */
  AUTHENTICATION_NEEDED = 'AUTHENTICATION_NEEDED',
  /**
   * The recurrence is ended. The object can no longer be modified or re-used.
   */
  ENDED = 'ENDED',
}

export interface RecurringRegistration {
  createdOn: Moment;
  currency: string;
  endDate: Moment | null;
  firstTransactionDebitedFunds: number;
  fixedNextAmount: boolean;
  fractionedPayment: boolean;
  frequency: EnumRecurringPaymentFrequency;
  key: string;
  nextTransactionDebitedFunds: number;
  providerCard: string;
  status: EnumRecurringPaymentStatus;
  statusUpdatedOn: Moment;
}

export interface PayInStatus {
  /**
   * Transaction status
   */
  status: EnumTransactionStatus;
  /**
   * Date of update in ISO format
   */
  updatedOn: Moment;
}

export interface PayIn {
  /**
   * Payment method
   */
  paymentMethod: EnumPaymentMethod;
  /**
   * PayIn unique key
   */
  key: string;
  /**
   * PayIn payments. A PayIn may include a single order or multiple subscription billing records
   */
  items?: PayInItemType[];
  /**
   * The total price of all PayIn items (the debited funds of the PayIn)
   */
  totalPrice: number;
  /**
   * The total price of all PayIn items excluding tax
   */
  totalPriceExcludingTax: number;
  /**
   * The total tax for all PayIn items
   */
  totalTax: number;
  /**
   * The currency in ISO 4217 format. Only `EUR` is supported
   */
  currency: string;
  /**
   * PayIn creation date in ISO format
   */
  createdOn: Moment
  /**
   * PayIn execution date in ISO format
   */
  executedOn: Moment;
  /**
   * Transaction status
   */
  status: EnumTransactionStatus;
  /**
   * PayIn status history
   */
  statusHistory?: PayInStatusHistory[];
  /**
   * Date of transaction status last update in ISO format
   */
  statusUpdatedOn: Moment;
  /**
   * Platform reference number
   */
  referenceNumber: string;
  /**
   * Customer (consumer)
   */
  consumer?: CustomerType;
  /**
   * Process instance
   */
  processInstance?: string;
  /**
   * Provider PayIn identifier
   */
  providerPayIn?: string;
  /**
   * Provider error code
   */
  providerResultCode?: string;
  /**
   * Provider error message
   */
  providerResultMessage?: string;
}

export interface FreePayIn extends PayIn {
  /**
   * Payment method
   */
  paymentMethod: EnumPaymentMethod.FREE;
}

export interface BankwirePayIn extends PayIn {
  /**
   * Payment method
   */
  paymentMethod: EnumPaymentMethod.BANKWIRE;
  /**
   * The user has to proceed a Bank wire with this reference
   */
  wireReference: string;
  /**
   * The user has to proceed a Bank wire to this bank account
   */
  bankAccount?: BankAccount;
}

export interface CardDirectPayIn extends PayIn {
  /**
   * Payment method
   */
  paymentMethod: EnumPaymentMethod.CARD_DIRECT;
  /**
   * A partially obfuscated version of the credit card number
   */
  alias?: string;
  /**
   * Applied 3DS version
   */
  applied3dsVersion: string;
  /**
   * Billing address
   */
  billing: PayInAddress;
  /**
   * Browser information required by 3DS2 integration
   */
  browserInfo: BrowserInfo;
  /**
   * Recurring payment information
   */
  recurringPayment: RecurringRegistration;
  /**
   * Recurring payment type
   */
  recurringPaymentType: EnumRecurringPaymentType;
  /**
   * Request 3DS version
   */
  requested3dsVersion: string;
  /**
   * Shipping address
   */
  shipping: PayInAddress;
  /**
   * A custom description to appear on the user's bank statement
   */
  statementDescriptor: string;
}

export type PayInType =
  | FreePayIn
  | BankwirePayIn
  | CardDirectPayIn
  ;

export interface Card {
  /**
   * Whether the card is active or not
   */
  active: boolean;
  /**
   * A partially obfuscated version of the credit card number
   */
  alias: string;
  /**
   * The type of card. Currently only a single card type is supported, `CB_VISA_MASTERCARD`
   */
  cardType: EnumCardType;
  /**
   * The currency in ISO 4217 format
   */
  currency: string;
  /**
   * The expiry date of the card in `MMYY` format
   */
  expirationDate: string;
  /**
   * Card unique identifier. This identifier is required for creating a card direct PayIn
   */
  id: string;
  /**
   * Card validity. A successful transaction (PreAuthorization or PayIn) is required to validate a card id
   */
  validity: EnumCardValidity;
  /**
   * The expiry month of the card
   */
  expirationMonth: number;
  /**
   * The expiry year of the card
   */
  expirationYear: number;
}

export enum EnumOrderStatus {
  /**
   * Order created
   */
  CREATED = 'CREATED',
  /**
   * Order created and requires provider approval
   */
  PENDING_PROVIDER_APPROVAL = 'PENDING_PROVIDER_APPROVAL',
  /**
   * Order has been rejected
   */
  PROVIDER_REJECTED = 'PROVIDER_REJECTED',
  /**
   * Order has been accepted
   */
  PROVIDER_ACCEPTED = 'PROVIDER_ACCEPTED',
  /**
   * If the order is related to a custom contract
   * the provider should fill in the contract with the consumer's info
   */
  PENDING_PROVIDER_CONTRACT_UPLOAD = 'PENDING_PROVIDER_CONTRACT_UPLOAD',
  /**
   * If the order is related to a custom contract
   * the consumer should accept the terms of the contract
   */
  PENDING_CONSUMER_CONTRACT_ACCEPTANCE = 'PENDING_CONSUMER_CONTRACT_ACCEPTANCE',
  /**
   * Custom contract is signed on behalf of all parties by the marketplace
   */
  CONTRACT_IS_SIGNED = 'CONTRACT_IS_SIGNED',
  /**
   * PayIn created (order previous status must be either CREATED or
   * PROVIDER_ACCEPTED)
   */
  CHARGED = 'CHARGED',
  /**
   * Waiting for provider send confirmation
   */
  PENDING_PROVIDER_SEND_CONFIRMATION = 'PENDING_PROVIDER_SEND_CONFIRMATION',
  /**
   * Waiting for consumer receive confirmation
   */
  PENDING_CONSUMER_RECEIVE_CONFIRMATION = 'PENDING_CONSUMER_RECEIVE_CONFIRMATION',
  /**
   * Order payment has been received and assets have been delivered asset.
   * Asset/subscription registration is pending
   */
  ASSET_REGISTRATION = 'ASSET_REGISTRATION',
  /**
   * Order has been cancelled, not payment received
   */
  CANCELLED = 'CANCELLED',
  /**
   * Order has been cancelled and PayIn has been refunded
   */
  REFUNDED = 'REFUNDED',
  /**
   * Order has been completed
   */
  SUCCEEDED = 'SUCCEEDED',
}

export enum EnumOrderSortField {
  CREATED_ON = 'CREATED_ON',
  MODIFIED_ON = 'MODIFIED_ON',
  STATUS = 'STATUS',
  REFERENCE_NUMBER = 'REFERENCE_NUMBER',
}

export interface OrderQuery {
  consumerKey?: string;
  email: string;
  referenceNumber: string;
  status: EnumOrderStatus[];
}

export interface OrderStatusHistory {
  status: EnumOrderStatus;
  statusUpdatedOn: Moment;
}

export enum EnumOrderItemType {
  ASSET = 'ASSET',
  SERVICE = 'SERVICE',
  BUNDLE = 'BUNDLE',
  VAS = 'VAS',
}

export interface OrderItem {
  /**
   * Index of the specific item in the order
   */
  index: number;
  /**
   * Item type
   */
  type: EnumOrderItemType;
  /**
   * Catalogue item unique PID
   */
  assetId: string;
  /**
   * Catalogue item version
   */
  assetVersion: string;
  /**
   * Item description at the time of the purchase
   */
  description: string;
  /**
   * Pricing model at the time of the purchase
   */
  pricingModel: EffectivePricingModel,
  /**
   * Item total price
   */
  totalPrice: number;
  /**
   * Item price excluding tax
   */
  totalPriceExcludingTax: number;
  /**
   * Item tax
   */
  totalTax: number;
  /**
   * Optional discount code applied to the item's price
   */
  discountCode: string | null;
  /**
   * Item seller
   */
  provider?: CustomerProfessional;
}

export interface Order {
  createdOn: Moment;
  currency: string;
  consumer?: CustomerType;
  deliveryMethod: EnumDeliveryMethod;
  items?: OrderItem[];
  key: string;
  payIn?: PayIn;
  paymentMethod: EnumPaymentMethod
  referenceNumber: string;
  status: EnumOrderStatus;
  statusHistory?: OrderStatusHistory[];
  statusUpdatedOn: Moment;
  totalPrice: number;
  totalPriceExcludingTax: number;
  totalTax: number;
}

export interface OrderPayInItem extends PayInItem {
  /**
   * Payment item type
   */
  type: EnumPayInItemType.ORDER;
  /**
   * PayIn order
   */
  order: Order;
}

export type PayInItemType =
  | OrderPayInItem
  | SubscriptionBillingPayInItem
  ;

export enum EnumTransferSortField {
  CREATED_ON = 'CREATED_ON',
  EXECUTED_ON = 'EXECUTED_ON',
  REFERENCE_NUMBER = 'REFERENCE_NUMBER',
  STATUS = 'STATUS',
  FUNDS = 'FUNDS',
  FEES = 'FEES',
}

export interface TransferQuery {
  providerKey?: string;
  referenceNumber: string;
  status: EnumTransactionStatus[];
}

export enum EnumPayOutSortField {
  CREATED_ON = 'CREATED_ON',
  EXECUTED_ON = 'EXECUTED_ON',
  MODIFIED_ON = 'MODIFIED_ON',
  BANKWIRE_REF = 'BANKWIRE_REF',
  STATUS = 'STATUS',
  FUNDS = 'FUNDS',
  PROVIDER = 'PROVIDER',
}

export interface PayOutQuery {
  providerKey?: string;
  bankwireRef: string;
  email: string;
  status: EnumTransactionStatus[];
}

export interface PayOutCommand {
  debitedFunds: number;
}

export interface Refund {
  refund: string
  refundCreatedOn: Moment;
  refundExecutedOn: Moment | null;
  refundStatus: EnumTransactionStatus;
  refundReasonType: string;
  refundReasonMessage: string;
}

export interface PayOut {
  /**
   * Payout platform unique key
   */
  key: string;
  /**
   * Payout bank account
   */
  bankAccount: BankAccount;
  /**
   * Identifier of the workflow definition used for processing this PayIn
   * record
   */
  processDefinition?: string;
  /**
   * Identifier of the workflow instance processing this PayIn record
   */
  processInstance?: string;
  /**
   * Information about the funds that are being debited from seller's wallet
   */
  debitedFunds: number;
  /**
   * Information about the fees that were taken by the client for this transaction
   */
  fees: number;
  /**
   * The currency in ISO 4217 format. Only `EUR` is supported
   */
  currency: string;
  /**
   * Transaction status
   */
  status: EnumTransactionStatus;
  /**
   * Date of transaction status last update
   */
  statusUpdatedOn: Moment;
  /**
   * Date of creation
   */
  createdOn: Moment | null;
  /**
   * Date of execution
   */
  executedOn: Moment | null;
  /**
   * A custom reference that will appear on the user’s bank statement
   */
  bankwireRef: string;
  provider?: CustomerProfessional;
  providerPayOut?: string;
  providerResultCode?: string;
  providerResultMessage?: string;
  refund?: Refund;
}
