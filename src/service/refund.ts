import { AxiosRequestConfig } from 'axios';

import { Api } from 'utils/api';
import { ObjectResponse, PageRequest, Sorting, AxiosPageResponse, PageResult } from 'model/response';
import { EnumRefundSortField, Refund, RefundQuery } from 'model/refund';

export default class RefundApi extends Api {

  constructor(config: AxiosRequestConfig = {}) {
    super(config);
  }

  public async find(query: Partial<RefundQuery>, pageRequest: PageRequest, sorting: Sorting<EnumRefundSortField>[]): Promise<AxiosPageResponse<Refund>> {
    const { page, size } = pageRequest;
    const { id: field, order } = sorting[0];

    const queryString = (Object.keys(query) as Array<keyof RefundQuery>)
      .reduce((result: string[], key: keyof RefundQuery) => {
        return query[key] !== null ? [...result, `${key}=${query[key]}`] : result;
      }, []);

    const url = `/action/billing/refunds?page=${page}&size=${size}&${queryString.join('&')}&orderBy=${field}&order=${order}`;

    return this.get<ObjectResponse<PageResult<Refund>>>(url);
  }

}
