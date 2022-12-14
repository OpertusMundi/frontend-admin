import { AxiosRequestConfig } from 'axios';

import { Api } from 'utils/api';
import {
  AxiosObjectResponse,
  AxiosPageResponse,
  ObjectResponse,
  PageRequest,
  PageResult,
  SimpleResponse,
  Sorting,
} from 'model/response';
import {
  EnumSubscriptionBillingBatchSortField,
  SubscriptionBillingBatch,
  SubscriptionBillingBatchCommand,
  SubscriptionBillingBatchQuery,
} from 'model/subscription-billing';
import {
  PerCallPricingModelCommand,
} from 'model/pricing-model';

const baseUri = '/action/service-billing';

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

    const url = `${baseUri}/quotations?page=${page}&size=${size}&${queryString.join('&')}&orderBy=${field}&order=${order}`;

    return this.get<ObjectResponse<PageResult<SubscriptionBillingBatch>>>(url);
  }

  public async findOne(key: string): Promise<AxiosObjectResponse<SubscriptionBillingBatch>> {
    const url = `${baseUri}/quotations/${key}`;

    return this.get<ObjectResponse<SubscriptionBillingBatch>>(url);
  }

  public async create(year: number, month: number, quotationOnly = false): Promise<AxiosObjectResponse<SubscriptionBillingBatch>> {
    const url = `${baseUri}/quotations`;

    const command: SubscriptionBillingBatchCommand = {
      year,
      month,
      quotationOnly,
    };

    return this.post<SubscriptionBillingBatchCommand, ObjectResponse<SubscriptionBillingBatch>>(url, command);
  }

  public async getDefaultPricingModel(): Promise<ObjectResponse<PerCallPricingModelCommand>> {
    const url = `${baseUri}/default-pricing-model`;

    return this.get<ObjectResponse<PerCallPricingModelCommand>>(url)
      .then((response) => response.data);
  }

  public async setDefaultPricingModel(command: PerCallPricingModelCommand): Promise<SimpleResponse> {
    const url = `${baseUri}/default-pricing-model`;

    return this.put<PerCallPricingModelCommand, SimpleResponse>(url, command)
      .then((response) => response.data);
  }
}
