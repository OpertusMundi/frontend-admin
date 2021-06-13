import { AxiosRequestConfig } from 'axios';

import { Api } from 'utils/api';
import { ObjectResponse, PageRequest, Sorting, AxiosPageResponse, PageResult, AxiosObjectResponse } from 'model/response';
import { EnumPayInSortField, PayIn, PayInQuery } from 'model/order';

export default class PayInApi extends Api {

  constructor(config: AxiosRequestConfig = {}) {
    super(config);
  }

  public async find(query: Partial<PayInQuery>, pageRequest: PageRequest, sorting: Sorting<EnumPayInSortField>[]): Promise<AxiosPageResponse<PayIn>> {
    const { page, size } = pageRequest;
    const { id: field, order } = sorting[0];

    const queryString = (Object.keys(query) as Array<keyof PayInQuery>)
      .reduce((result: string[], key: keyof PayInQuery) => {
        return query[key] !== null ? [...result, `${key}=${query[key]}`] : result;
      }, []);

    const url = `/action/billing/payins?page=${page}&size=${size}&${queryString.join('&')}&orderBy=${field}&order=${order}`;

    return this.get<ObjectResponse<PageResult<PayIn>>>(url);
  }

  public async findOne(key: string): Promise<AxiosObjectResponse<PayIn>> {
    const url = `/action/billing/payins/${key}`;

    return this.get<ObjectResponse<PayIn>>(url);
  }
}
