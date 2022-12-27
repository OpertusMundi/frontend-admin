import { AxiosRequestConfig } from 'axios';

import { Api } from 'utils/api';
import { ObjectResponse, PageRequest, Sorting, AxiosPageResponse, PageResult, AxiosObjectResponse } from 'model/response';
import { EnumTransferSortField, PayInItemType, Transfer, TransferQuery } from 'model/order';

export default class PayInApi extends Api {

  constructor(config: AxiosRequestConfig = {}) {
    super(config);
  }

  public async find(
    query: Partial<TransferQuery>, pageRequest: PageRequest, sorting: Sorting<EnumTransferSortField>[]
  ): Promise<AxiosPageResponse<PayInItemType>> {
    const { page, size } = pageRequest;
    const { id: field, order } = sorting[0];

    const queryString = (Object.keys(query) as Array<keyof TransferQuery>)
      .reduce((result: string[], key: keyof TransferQuery) => {
        return query[key] !== null ? [...result, `${key}=${query[key]}`] : result;
      }, []);

    const url = `/action/billing/transfers?page=${page}&size=${size}&${queryString.join('&')}&orderBy=${field}&order=${order}`;

    return this.get<ObjectResponse<PageResult<PayInItemType>>>(url);
  }

  public async createTransfer(key: string): Promise<AxiosObjectResponse<Transfer[]>> {
    const url = `/action/billing/transfers/${key}`;

    return this.post<unknown, ObjectResponse<Transfer[]>>(url, null);
  }
}
