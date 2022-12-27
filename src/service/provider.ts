import { AxiosRequestConfig } from 'axios';

import { Api } from 'utils/api';
import { ObjectResponse, PageRequest, Sorting, AxiosPageResponse, PageResult } from 'model/response';
import { EnumPayOutSortField, EnumTransferSortField, PayInItemType, PayOut, PayOutQuery, TransferQuery } from 'model/order';

export default class ProviderBillingApi extends Api {

  constructor(config: AxiosRequestConfig = {}) {
    super(config);
  }

  public async findTransfers(
    query: Partial<TransferQuery>, pageRequest: PageRequest, sorting: Sorting<EnumTransferSortField>[]
  ): Promise<AxiosPageResponse<PayInItemType>> {
    const { page, size } = pageRequest;
    const { id: field, order } = sorting[0];

    const queryString = (Object.keys(query) as Array<keyof TransferQuery>)
      .reduce((result: string[], key: keyof TransferQuery) => {
        return query[key] !== null ? [...result, `${key}=${query[key]}`] : result;
      }, []);

    const url = `/action/provider/transfers?page=${page}&size=${size}&${queryString.join('&')}&orderBy=${field}&order=${order}`;

    return this.get<ObjectResponse<PageResult<PayInItemType>>>(url);
  }

  public async findPayOuts(
    query: Partial<PayOutQuery>, pageRequest: PageRequest, sorting: Sorting<EnumPayOutSortField>[]
  ): Promise<AxiosPageResponse<PayOut>> {
    const { page, size } = pageRequest;
    const { id: field, order } = sorting[0];

    const queryString = (Object.keys(query) as Array<keyof PayOutQuery>)
      .reduce((result: string[], key: keyof PayOutQuery) => {
        return query[key] !== null ? [...result, `${key}=${query[key]}`] : result;
      }, []);

    const url = `/action/provider/payouts?page=${page}&size=${size}&${queryString.join('&')}&orderBy=${field}&order=${order}`;

    return this.get<ObjectResponse<PageResult<PayOut>>>(url);
  }

}
