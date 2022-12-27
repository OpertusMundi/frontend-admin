import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

import { Api } from 'utils/api';
import { blobToJson } from 'utils/file';
import { ObjectResponse, PageRequest, Sorting, AxiosPageResponse, PageResult, AxiosObjectResponse } from 'model/response';
import { EnumPayInSortField, PayInQuery, PayInType } from 'model/order';

export default class PayInApi extends Api {

  constructor(config: AxiosRequestConfig = {}) {
    super(config);
  }

  public async find(query: Partial<PayInQuery>, pageRequest: PageRequest, sorting: Sorting<EnumPayInSortField>[]): Promise<AxiosPageResponse<PayInType>> {
    const { page, size } = pageRequest;
    const { id: field, order } = sorting[0];

    const queryString = (Object.keys(query) as Array<keyof PayInQuery>)
      .reduce((result: string[], key: keyof PayInQuery) => {
        return query[key] !== null ? [...result, `${key}=${query[key]}`] : result;
      }, []);

    const url = `/action/billing/payins?page=${page}&size=${size}&${queryString.join('&')}&orderBy=${field}&order=${order}`;

    return this.get<ObjectResponse<PageResult<PayInType>>>(url);
  }

  public async findOne(key: string): Promise<AxiosObjectResponse<PayInType>> {
    const url = `/action/billing/payins/${key}`;

    return this.get<ObjectResponse<PayInType>>(url);
  }

  public async downloadInvoice(key: string): Promise<AxiosResponse<Blob>> {
    const url = `/action/billing/payins/${key}/invoice`;

    return this.get<Blob>(url, {
      responseType: 'blob',
    })
      .then((response: AxiosResponse<Blob>) => {

        return Promise.resolve(response);
      })
      .catch((err: AxiosError) => blobToJson(err.response?.data as Blob));
  }
}
