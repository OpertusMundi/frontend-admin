import { Moment } from 'moment';
import {
  Customer,
  CustomerProfessional,
} from './account-marketplace';
import {
  EnumTransactionNature,
  EnumTransactionStatus,
  EnumTransactionType,
  Transaction,
} from './transaction';

export enum EnumRefundReasonType {
  /**
   * Not specified.
   */
  NotSpecified = 'NotSpecified',
  /**
   * Incorrect bank account.
   */
  BANKACCOUNT_INCORRECT = 'BANKACCOUNT_INCORRECT',
  /**
   * Closed bank account.
   */
  BANKACCOUNT_HAS_BEEN_CLOSED = 'BANKACCOUNT_HAS_BEEN_CLOSED',
  /**
   * Owner-bank account mismatch.
   */
  OWNER_DOT_NOT_MATCH_BANKACCOUNT = 'OWNER_DOT_NOT_MATCH_BANKACCOUNT',
  /**
   * Withdrawal impossible on savings accounts.
   */
  WITHDRAWAL_IMPOSSIBLE_ON_SAVINGS_ACCOUNTS = 'WITHDRAWAL_IMPOSSIBLE_ON_SAVINGS_ACCOUNTS',
  /**
   * Initialized by client.
   */
  INITIALIZED_BY_CLIENT = 'INITIALIZED_BY_CLIENT',
  /**
   * Other.
   */
  OTHER = 'OTHER'
}

export interface Refund extends Transaction {
  authorId?: string;
  consumer?: Customer;
  creationDate: Moment;
  creditedFunds: number;
  creditedUserId?: string;
  creditedWalletId?: string;
  currency: string;
  debitedFunds: number;
  debitedWalletId?: string;
  executionDate: Moment;
  fees: number;
  initialTransactionId?: string;
  initialTransactionKey: string;
  initialTransactionType: EnumTransactionType
  key: string;
  provider?: CustomerProfessional;
  referenceNumber: string;
  resultCode: string;
  resultMessage: string;
  transactionId?: string;
  transactionNature: EnumTransactionNature;
  transactionStatus: EnumTransactionStatus;
  transactionType: EnumTransactionType;
  refundReasonType: EnumRefundReasonType;
  refundReasonMessage: string;
}

export enum EnumRefundSortField {
  CREATED_ON = 'CREATED_ON',
  CREDITED_FUNDS = 'CREDITED_FUNDS',
  DEBITED_FUNDS = 'DEBITED_FUNDS',
  EXECUTED_ON = 'EXECUTED_ON',
  REASON_TYPE = 'REASON_TYPE',
  REFERENCE_NUMBER = 'REFERENCE_NUMBER',
  STATUS = 'STATUS',
}

export interface RefundQuery {
  reason: EnumRefundReasonType[];
}
