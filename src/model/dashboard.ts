import { EnumDisputeStatus } from './dispute'

export interface DisputeStatusGroup {
  count: number;
  status: EnumDisputeStatus;
}

export interface Dashboard {
  disputes: DisputeStatusGroup[];
}