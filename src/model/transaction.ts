export enum EnumTransactionType {
  /**
   * Not specified.
   */
  NotSpecified = 'NotSpecified',
  /**
   * PAYIN transaction type.
   */
  PAYIN = 'PAYIN',
  /**
   * PAYOUT transaction type.
   */
  PAYOUT = 'PAYOUT',
  /**
   * TRANSFER transaction type.
   */
  TRANSFER = 'TRANSFER',
}

export enum EnumTransactionNature {
  /**
   * Not specified.
   */
  NotSpecified = 'NotSpecified',
  /**
   * REGULAR transaction nature.
   */
  REGULAR = 'REGULAR',
  /**
   * REFUND transaction nature.
   */
  REFUND = 'REFUND',
  /**
   * REPUDIATION transaction nature.
   */
  REPUDIATION = 'REPUDIATION',
  /**
   * SETTLEMENT transaction nature.
   */
  SETTLEMENT = 'SETTLEMENT'
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

export interface Transaction {
  transactionId?: string;
  transactionType: EnumTransactionType;
}