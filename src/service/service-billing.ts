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
  EnumServiceBillingBatchSortField,
  ServiceBillingBatch,
  ServiceBillingBatchCommand,
  ServiceBillingBatchQuery,
} from 'model/service-billing';
import {
  PerCallPricingModelCommand,
} from 'model/pricing-model';

const baseUri = '/action/service-billing';

export default class ServiceBillingApi extends Api {

  constructor(config: AxiosRequestConfig = {}) {
    super(config);
  }

  public async find(
    query: Partial<ServiceBillingBatchQuery>, pageRequest: PageRequest, sorting: Sorting<EnumServiceBillingBatchSortField>[]
  ): Promise<AxiosPageResponse<ServiceBillingBatch>> {
    const { page, size } = pageRequest;
    const { id: field, order } = sorting[0];

    const queryString = (Object.keys(query) as Array<keyof ServiceBillingBatchQuery>)
      .reduce((result: string[], key: keyof ServiceBillingBatchQuery) => {
        return query[key] !== null ? [...result, `${key}=${query[key]}`] : result;
      }, []);

    const url = `${baseUri}/quotations?page=${page}&size=${size}&${queryString.join('&')}&orderBy=${field}&order=${order}`;

    return this.get<ObjectResponse<PageResult<ServiceBillingBatch>>>(url);
  }

  public async findOne(key: string): Promise<AxiosObjectResponse<ServiceBillingBatch>> {
    const url = `${baseUri}/quotations/${key}`;

    return this.get<ObjectResponse<ServiceBillingBatch>>(url);
  }

  public async create(year: number, month: number, quotationOnly = false): Promise<AxiosObjectResponse<ServiceBillingBatch>> {
    const url = `${baseUri}/quotations`;

    const command: ServiceBillingBatchCommand = {
      year,
      month,
      quotationOnly,
    };

    return this.post<ServiceBillingBatchCommand, ObjectResponse<ServiceBillingBatch>>(url, command);
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
