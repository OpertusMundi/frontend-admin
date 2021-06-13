import { Moment } from 'moment';
import { EnumPaymentMethod, EnumDeliveryMethod } from 'model/enum';
import { BankAccount, CustomerIndividual, CustomerProfessional } from 'model/customer';
import { EffectivePricingModel } from 'model/pricing-model';

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
   * New payment, no PayIn has been created yet
   */
  CREATED = 'CREATED',
  /**
   * PayIn failed
   */
  FAILED = 'FAILED',
  /**
   * PayIn succeeded
   */
  SUCCEEDED = 'SUCCEEDED',
}

export interface Transfer {
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
}

export interface SubscriptionBilling {
  /**
   * Service unique PID
   */
  service: string;
  /**
   * Service description
   */
  subscriptionDescription: string;
  /**
   * Billing interval first date in ISO format e.g. 2020-06-10T16:01:04.991+03:00
   */
  fromDate: string;
  /**
   * Billing interval last date in ISO format e.g. 2020-07-10T16:01:04.991+03:00
   */
  toDate: string;
  /**
   * Total rows charged in this record. This field is exclusive with field `totalCalls`
   */
  totalRows: number;
  /**
   * Total calls charged in this record. This field is exclusive with field `totalRows`
   */
  totalCalls: number;
  /**
   * Total rows used by purchased SKUs. This field is exclusive with field `skuTotalCalls`
   */
  skuTotalRows: number;
  /**
   * Total calls used by purchased SKUs. This field is exclusive with field `skuTotalRows`
   */
  skuTotalCalls: number;
}

export interface PayInItem {
  /**
   * Invoice line number
   */
  index: number;
  /**
   * Payment item type
   */
  type: EnumPayInItemType;
  /**
   * Transfer of funds from the buyer's to the seller's wallet
   */
  transfer?: Transfer;
}

export interface SubscriptionBillingPayInItem extends PayInItem {
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
  email: string;
  referenceNumber: string;
  status: EnumTransactionStatus[];
}

export interface PayIn {
  /**
   * PayIn unique key
   */
  key: string;
  /**
   * PayIn payments. A PayIn may include a single order or multiple subscription billing records
   */
  items?: PayInItem[];
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
   * Date of transaction status last update in ISO format
   */
  statusUpdatedOn: Moment;
  /**
   * Payment method
   */
  paymentMethod: EnumPaymentMethod;
  /**
   * Platform reference number
   */
  referenceNumber: string;
  /**
   * Customer (consumer)
   */
  customer?: CustomerIndividual | CustomerProfessional;
  /**
   * Provider PayIn identifier
   */
  providerPayIn: string;
  /**
   * Provider error code
   */
  providerResultCode: string;
  /**
   * Provider error message
   */
  providerResultMessage: string;
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

export interface BankwirePayIn extends PayIn {
  /**
   * The user has to proceed a Bank wire with this reference
   */
  wireReference: string;
  /**
   * The user has to proceed a Bank wire to this bank account
   */
  bankAccount: BankAccount;
}

export interface CardDirectPayIn extends PayIn {
  /**
   * A partially obfuscated version of the credit card number
   */
  alias?: string;
  /**
   * A custom description to appear on the user's bank statement
   */
  statementDescriptor: string;
  /**
   * Redirect URL if 3-D Secure validation is required. If not empty, the client
   * must initiate the 3-D Secure validation process.
   */
  secureModeRedirectURL: string;
}

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
   * PayIn created
   */
  CHARGED = 'CHARGED',
  /**
   * Order payment has been received, asset delivery/subscription registration is pending
   */
  PENDING = 'PENDING',
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
  index: number;
  type: EnumOrderItemType;
  item: string;
  description: string;
  pricingModel: EffectivePricingModel,
  totalPrice: number;
  totalPriceExcludingTax: number;
}

export interface Order {
  createdOn: Moment;
  currency: string;
  customer?: CustomerIndividual | CustomerProfessional;
  deliveryMethod: EnumDeliveryMethod;
  items: OrderItem[];
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
   * PayIn order
   */
  order: Order;
}