import { AxiosRequestConfig } from 'axios';

import { Api } from 'utils/api';
import { ObjectResponse, PageRequest, Sorting, AxiosObjectResponse, AxiosPageResponse, PageResult } from 'model/response';
import {
  EnumMarketplaceAccountSortField,
  MarketplaceAccount,
  MarketplaceAccountDetails,
  MarketplaceAccountQuery,
  MarketplaceAccountReviewCommand,
} from 'model/account-marketplace';

enum EnumAccountType {
  All = 0,
  Consumer = 1,
  Provider = 2,
}

export default class MarketplaceAccountApi extends Api {

  constructor(config: AxiosRequestConfig = {}) {
    super(config);
  }

  public async find(
    query: Partial<MarketplaceAccountQuery>, pageRequest: PageRequest, sorting: Sorting<EnumMarketplaceAccountSortField>[]
  ): Promise<AxiosPageResponse<MarketplaceAccount>> {
    return this.findByType(EnumAccountType.All, query, pageRequest, sorting);
  }

  public async findConsumers(
    query: Partial<MarketplaceAccountQuery>, pageRequest: PageRequest, sorting: Sorting<EnumMarketplaceAccountSortField>[]
  ): Promise<AxiosPageResponse<MarketplaceAccount>> {
    return this.findByType(EnumAccountType.Consumer, query, pageRequest, sorting);
  }

  public async findProviders(
    query: Partial<MarketplaceAccountQuery>, pageRequest: PageRequest, sorting: Sorting<EnumMarketplaceAccountSortField>[]
  ): Promise<AxiosPageResponse<MarketplaceAccount>> {
    return this.findByType(EnumAccountType.Provider, query, pageRequest, sorting);
  }

  public async findByType(
    type: EnumAccountType, query: Partial<MarketplaceAccountQuery>,
    pageRequest: PageRequest, sorting: Sorting<EnumMarketplaceAccountSortField>[]
  ): Promise<AxiosPageResponse<MarketplaceAccount>> {
    const { page, size } = pageRequest;
    const { id: field, order } = sorting[0];

    const queryString = (Object.keys(query) as Array<keyof MarketplaceAccountQuery>)
      .reduce((result: string[], key: keyof MarketplaceAccountQuery) => {
        return query[key] !== null ? [...result, `${key}=${query[key]}`] : result;
      }, []);

    let endpoint = '/action/marketplace/accounts';

    switch (type) {
      case EnumAccountType.Consumer:
        endpoint += '/consumers';
        break;
      case EnumAccountType.Provider:
        endpoint += '/providers';
        break;
    }

    const url = `${endpoint}?page=${page}&size=${size}&${queryString.join('&')}&orderBy=${field}&order=${order}`;

    return this.get<ObjectResponse<PageResult<MarketplaceAccount>>>(url);
  }

  public async findOne(key: string): Promise<AxiosObjectResponse<MarketplaceAccountDetails>> {
    const url = `/action/marketplace/accounts/${key}`;


    return this.get<ObjectResponse<MarketplaceAccountDetails>>(url);
  }

  public async review(
    key: string, acceptChanges: boolean, rejectReason?: string
  ): Promise<AxiosObjectResponse<MarketplaceAccountDetails>> {
    const url = `/action/marketplace/accounts/${key}/review`;

    const command: MarketplaceAccountReviewCommand = {
      acceptChanges,
      rejectReason,
    };

    return this.put<MarketplaceAccountReviewCommand, ObjectResponse<MarketplaceAccountDetails>>(url, command);
  }

  public async refreshWallets(key: string): Promise<AxiosObjectResponse<MarketplaceAccountDetails>> {
    const url = `/action/billing/wallets/${key}`;

    return this.put<unknown, ObjectResponse<MarketplaceAccountDetails>>(url, null);
  }

}
