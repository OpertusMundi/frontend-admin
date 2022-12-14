import { AxiosRequestConfig } from 'axios';

import { Api } from 'utils/api';
import { ObjectResponse, PageRequest, Sorting, AxiosPageResponse, PageResult } from 'model/response';
import { EnumOrderSortField, EnumPayInSortField, EnumSubscriptionBillingSortField, Order, OrderQuery, PayInQuery, PayInType, SubscriptionBilling, SubscriptionBillingQuery } from 'model/order';
import { EnumSubscriptionSortField, AccountSubscription, SubscriptionQuery } from 'model/account-marketplace';

export default class ConsumerBillingApi extends Api {

  constructor(config: AxiosRequestConfig = {}) {
    super(config);
  }

  public async findOrders(query: Partial<OrderQuery>, pageRequest: PageRequest, sorting: Sorting<EnumOrderSortField>[]): Promise<AxiosPageResponse<Order>> {
    const { page, size } = pageRequest;
    const { id: field, order } = sorting[0];

    const queryString = (Object.keys(query) as Array<keyof OrderQuery>)
      .reduce((result: string[], key: keyof OrderQuery) => {
        return query[key] !== null ? [...result, `${key}=${query[key]}`] : result;
      }, []);

    const url = `/action/consumer/orders?page=${page}&size=${size}&${queryString.join('&')}&orderBy=${field}&order=${order}`;

    return this.get<ObjectResponse<PageResult<Order>>>(url);
  }

  public async findPayIns(
    query: Partial<PayInQuery>, pageRequest: PageRequest, sorting: Sorting<EnumPayInSortField>[]
  ): Promise<AxiosPageResponse<PayInType>> {
    const { page, size } = pageRequest;
    const { id: field, order } = sorting[0];

    const queryString = (Object.keys(query) as Array<keyof PayInQuery>)
      .reduce((result: string[], key: keyof PayInQuery) => {
        return query[key] !== null ? [...result, `${key}=${query[key]}`] : result;
      }, []);

    const url = `/action/consumer/payins?page=${page}&size=${size}&${queryString.join('&')}&orderBy=${field}&order=${order}`;

    return this.get<ObjectResponse<PageResult<PayInType>>>(url);
  }

  public async findSubscriptions(
    query: Partial<SubscriptionQuery>, pageRequest: PageRequest, sorting: Sorting<EnumSubscriptionSortField>[]
  ): Promise<AxiosPageResponse<AccountSubscription>> {
    const { page, size } = pageRequest;
    const { id: field, order } = sorting[0];

    const queryString = (Object.keys(query) as Array<keyof SubscriptionQuery>)
      .reduce((result: string[], key: keyof SubscriptionQuery) => {
        return query[key] !== null ? [...result, `${key}=${query[key]}`] : result;
      }, []);

    const url = `/action/consumer/subscriptions?page=${page}&size=${size}&${queryString.join('&')}&orderBy=${field}&order=${order}`;

    return this.get<ObjectResponse<PageResult<AccountSubscription>>>(url);
  }

  public async findServiceBillingRecords(
    query: Partial<SubscriptionBillingQuery>, pageRequest: PageRequest, sorting: Sorting<EnumSubscriptionBillingSortField>[]
  ): Promise<AxiosPageResponse<SubscriptionBilling>> {
    const { page, size } = pageRequest;
    const { id: field, order } = sorting[0];

    const queryString = (Object.keys(query) as Array<keyof SubscriptionBillingQuery>)
      .reduce((result: string[], key: keyof SubscriptionBillingQuery) => {
        return query[key] !== null ? [...result, `${key}=${query[key]}`] : result;
      }, []);

    const url = `/action/consumer/service-billing?page=${page}&size=${size}&${queryString.join('&')}&orderBy=${field}&order=${order}`;

    return this.get<ObjectResponse<PageResult<SubscriptionBilling>>>(url);
  }
}
