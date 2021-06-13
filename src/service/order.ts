import { AxiosRequestConfig } from 'axios';

import { Api } from 'utils/api';
import { ObjectResponse, PageRequest, Sorting, AxiosPageResponse, PageResult, AxiosObjectResponse } from 'model/response';
import { EnumOrderSortField, Order, OrderQuery } from 'model/order';

export default class OrderApi extends Api {

  constructor(config: AxiosRequestConfig = {}) {
    super(config);
  }

  public async find(query: Partial<OrderQuery>, pageRequest: PageRequest, sorting: Sorting<EnumOrderSortField>[]): Promise<AxiosPageResponse<Order>> {
    const { page, size } = pageRequest;
    const { id: field, order } = sorting[0];

    const queryString = (Object.keys(query) as Array<keyof OrderQuery>)
      .reduce((result: string[], key: keyof OrderQuery) => {
        return query[key] !== null ? [...result, `${key}=${query[key]}`] : result;
      }, []);

    const url = `/action/billing/orders?page=${page}&size=${size}&${queryString.join('&')}&orderBy=${field}&order=${order}`;

    return this.get<ObjectResponse<PageResult<Order>>>(url);
  }

  public async findOne(key: string): Promise<AxiosObjectResponse<Order>> {
    const url = `/action/billing/orders/${key}`;

    return this.get<ObjectResponse<Order>>(url);
  }
}
