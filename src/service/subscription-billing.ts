import { AxiosRequestConfig } from 'axios';

import { Api } from 'utils/api';
import { ObjectResponse, PageRequest, Sorting, AxiosPageResponse, PageResult, AxiosObjectResponse } from 'model/response';
import {
  EnumSubscriptionBillingBatchSortField,
  SubscriptionBillingBatch,
  SubscriptionBillingBatchCommand,
  SubscriptionBillingBatchQuery,
} from 'model/subscription-billing';

export default class SubscriptionBillingApi extends Api {

  constructor(config: AxiosRequestConfig = {}) {
    super(config);
  }

  public async find(
    query: Partial<SubscriptionBillingBatchQuery>, pageRequest: PageRequest, sorting: Sorting<EnumSubscriptionBillingBatchSortField>[]
  ): Promise<AxiosPageResponse<SubscriptionBillingBatch>> {
    const { page, size } = pageRequest;
    const { id: field, order } = sorting[0];

    const queryString = (Object.keys(query) as Array<keyof SubscriptionBillingBatchQuery>)
      .reduce((result: string[], key: keyof SubscriptionBillingBatchQuery) => {
        return query[key] !== null ? [...result, `${key}=${query[key]}`] : result;
      }, []);

    const url = `/action/subscription-billing/quotations?page=${page}&size=${size}&${queryString.join('&')}&orderBy=${field}&order=${order}`;

    return this.get<ObjectResponse<PageResult<SubscriptionBillingBatch>>>(url);
  }

  public async findOne(key: string): Promise<AxiosObjectResponse<SubscriptionBillingBatch>> {
    const url = `/action/subscription-billing/quotations/${key}`;

    return this.get<ObjectResponse<SubscriptionBillingBatch>>(url);
  }

  public async createPayOut(year: number, month: number, quotationOnly = false): Promise<AxiosObjectResponse<SubscriptionBillingBatch>> {
    const url = `/action/subscription-billing/quotations/providers`;

    const command: SubscriptionBillingBatchCommand = {
      year,
      month,
      quotationOnly,
    };

    return this.post<SubscriptionBillingBatchCommand, ObjectResponse<SubscriptionBillingBatch>>(url, command);
  }
}
