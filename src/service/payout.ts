import { AxiosRequestConfig } from 'axios';

import { Api } from 'utils/api';
import { ObjectResponse, PageRequest, Sorting, AxiosPageResponse, PageResult, AxiosObjectResponse } from 'model/response';
import { EnumPayOutSortField, PayOut, PayOutCommand, PayOutQuery } from 'model/order';

export default class PayOutApi extends Api {

  constructor(config: AxiosRequestConfig = {}) {
    super(config);
  }

  public async find(query: Partial<PayOutQuery>, pageRequest: PageRequest, sorting: Sorting<EnumPayOutSortField>[]): Promise<AxiosPageResponse<PayOut>> {
    const { page, size } = pageRequest;
    const { id: field, order } = sorting[0];

    const queryString = (Object.keys(query) as Array<keyof PayOutQuery>)
      .reduce((result: string[], key: keyof PayOutQuery) => {
        return query[key] !== null ? [...result, `${key}=${query[key]}`] : result;
      }, []);

    const url = `/action/billing/payouts?page=${page}&size=${size}&${queryString.join('&')}&orderBy=${field}&order=${order}`;

    return this.get<ObjectResponse<PageResult<PayOut>>>(url);
  }

  public async findOne(key: string): Promise<AxiosObjectResponse<PayOut>> {
    const url = `/action/billing/payouts/${key}`;

    return this.get<ObjectResponse<PayOut>>(url);
  }

  public async createPayOut(key: string, debitedFunds: number): Promise<AxiosObjectResponse<PayOut>> {
    const url = `/action/billing/payouts/providers/${key}`;

    const command :PayOutCommand ={
      debitedFunds,
    };

    return this.post<PayOutCommand, ObjectResponse<PayOut>>(url, command);
  }
}
