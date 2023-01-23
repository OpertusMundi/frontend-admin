import { Moment } from 'moment';
import { EnumTransactionType } from 'model/transaction';
import { PayInType } from 'model/order';

export enum EnumDisputeStatus {
  /**
   * CREATED dispute status.
   */
  CREATED = 'CREATED',
  /**
   * PENDING_CLIENT_ACTION dispute status.
   */
  PENDING_CLIENT_ACTION = 'PENDING_CLIENT_ACTION',
  /**
   * SUBMITTED dispute status.
   */
  SUBMITTED = 'SUBMITTED',
  /**
   * PENDING_BANK_ACTION dispute status.
   */
  PENDING_BANK_ACTION = 'PENDING_BANK_ACTION',
  /**
   * REOPENED_PENDING_CLIENT_ACTION dispute status.
   */
  REOPENED_PENDING_CLIENT_ACTION = 'REOPENED_PENDING_CLIENT_ACTION',
  /**
   * CLOSED dispute status.
   */
  CLOSED = 'CLOSED',
}

export enum EnumDisputeType {
  /**
 * CONTESTABLE dispute type.
 */
  CONTESTABLE = 'CONTESTABLE',
  /**
   * NOT_CONTESTABLE dispute type.
   */
  NOT_CONTESTABLE = 'NOT_CONTESTABLE',
  /**
   * RETRIEVAL dispute type.
   */
  RETRIEVAL = 'RETRIEVAL',
}

export enum EnumDisputeReasonType {
  /**
   * DUPLICATE dispute reason type.
   */
  DUPLICATE = 'DUPLICATE',
  /**
   * FRAUD dispute reason type.
   */
  FRAUD = 'FRAUD',
  /**
   * PRODUCT_UNACCEPTABLE dispute reason type.
   */
  PRODUCT_UNACCEPTABLE = 'PRODUCT_UNACCEPTABLE',
  /**
   * UNKNOWN dispute reason type.
   */
  UNKNOWN = 'UNKNOWN',
  /**
   * OTHER dispute reason type.
   */
  OTHER = 'OTHER',
  /**
   * REFUND_CONVERSION_RATE dispute reason type.
   */
  REFUND_CONVERSION_RATE = 'REFUND_CONVERSION_RATE',
  /**
   * LATE_FAILURE_INSUFFICIENT_FUNDS dispute reason type.
   */
  LATE_FAILURE_INSUFFICIENT_FUNDS = 'LATE_FAILURE_INSUFFICIENT_FUNDS',
  /**
   * LATE_FAILURE_CONTACT_USER dispute reason type.
   */
  LATE_FAILURE_CONTACT_USER = 'LATE_FAILURE_CONTACT_USER',
  /**
   * LATE_FAILURE_BANKACCOUNT_CLOSED dispute reason type.
   */
  LATE_FAILURE_BANKACCOUNT_CLOSED = 'LATE_FAILURE_BANKACCOUNT_CLOSED',
  /**
   * LATE_FAILURE_BANKACCOUNT_INCOMPATIBLE dispute reason type.
   */
  LATE_FAILURE_BANKACCOUNT_INCOMPATIBLE = 'LATE_FAILURE_BANKACCOUNT_INCOMPATIBLE',
  /**
   * LATE_FAILURE_BANKACCOUNT_INCORRECT dispute reason type.
   */
  LATE_FAILURE_BANKACCOUNT_INCORRECT = 'LATE_FAILURE_BANKACCOUNT_INCORRECT',
  /**
   * AUTHORIZATION_DISPUTED dispute reason type.
   */
  AUTHORIZATION_DISPUTED = 'AUTHORIZATION_DISPUTED',
  /**
  * TRANSACTION_NOT_RECOGNIZED dispute reason type
  */
  TRANSACTION_NOT_RECOGNIZED = 'TRANSACTION_NOT_RECOGNIZED',
  /**
  * PRODUCT_NOT_PROVIDED dispute reason type
  */
  PRODUCT_NOT_PROVIDED = 'PRODUCT_NOT_PROVIDED',
  /**
  * CANCELED_REOCCURRING_TRANSACTION dispute reason type
  */
  CANCELED_REOCCURRING_TRANSACTION = 'CANCELED_REOCCURRING_TRANSACTION',
  /**
  * REFUND_NOT_PROCESSED dispute reason type
  */
  REFUND_NOT_PROCESSED = 'REFUND_NOT_PROCESSED',
  /**
  * COUNTERFEIT_PRODUCT dispute reason type
  */
  COUNTERFEIT_PRODUCT = 'COUNTERFEIT_PRODUCT'
}

export interface Dispute {
  contestDeadlineDate: Moment | null;
  contestedFunds: number;
  creationDate: Moment;
  disputedFunds: number;
  id: number;
  initialTransactionId: string;
  initialTransactionKey: string;
  initialTransactionRefNumber: string;
  initialTransactionType: EnumTransactionType;
  key: string;
  payin: PayInType;
  repudiationId: string;
  reasonMessage: string;
  reasonType: EnumDisputeReasonType;
  resultCode: string;
  resultMessage: string;
  status: EnumDisputeStatus;
  statusMessage: string;
  transactionId: string;
  type: EnumDisputeType;
}

export enum EnumDisputeSortField {
  CONTEST_DEADLINE_ON = 'CONTEST_DEADLINE_ON',
  CONTESTED_FUNDS = 'CONTESTED_FUNDS',
  CREATED_ON = 'CREATED_ON',
  DISPUTED_FUNDS = 'DISPUTED_FUNDS',
  REFERENCE_NUMBER = 'REFERENCE_NUMBER',
  STATUS = 'STATUS',
}

export interface DisputeQuery {
  status: EnumDisputeStatus[];
}
