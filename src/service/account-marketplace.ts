import { AxiosRequestConfig } from 'axios';

import { Api } from 'utils/api';
import { ObjectResponse, PageRequest, Sorting, AxiosObjectResponse, AxiosPageResponse, PageResult, AxiosSimpleResponse } from 'model/response';
import {
  EnumMarketplaceAccountSortField,
  ExternalProviderCommand,
  MarketplaceAccount,
  MarketplaceAccountQuery,
  MarketplaceAccountSummary,
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
  ): Promise<AxiosPageResponse<MarketplaceAccountSummary>> {
    return this.findByType(EnumAccountType.All, query, pageRequest, sorting);
  }

  public async findConsumers(
    query: Partial<MarketplaceAccountQuery>, pageRequest: PageRequest, sorting: Sorting<EnumMarketplaceAccountSortField>[]
  ): Promise<AxiosPageResponse<MarketplaceAccountSummary>> {
    return this.findByType(EnumAccountType.Consumer, query, pageRequest, sorting);
  }

  public async findProviders(
    query: Partial<MarketplaceAccountQuery>, pageRequest: PageRequest, sorting: Sorting<EnumMarketplaceAccountSortField>[]
  ): Promise<AxiosPageResponse<MarketplaceAccountSummary>> {
    return this.findByType(EnumAccountType.Provider, query, pageRequest, sorting);
  }

  public async findByType(
    type: EnumAccountType, query: Partial<MarketplaceAccountQuery>,
    pageRequest: PageRequest, sorting: Sorting<EnumMarketplaceAccountSortField>[]
  ): Promise<AxiosPageResponse<MarketplaceAccountSummary>> {
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

    return this.get<ObjectResponse<PageResult<MarketplaceAccountSummary>>>(url);
  }

  public async findOne(key: string): Promise<AxiosObjectResponse<MarketplaceAccount>> {
    const url = `/action/marketplace/accounts/${key}`;


    return this.get<ObjectResponse<MarketplaceAccount>>(url);
  }

  public async refreshWallets(key: string): Promise<AxiosObjectResponse<MarketplaceAccount>> {
    const url = `/action/billing/wallets/${key}`;

    return this.put<unknown, ObjectResponse<MarketplaceAccount>>(url, null);
  }

  public async setExternalProvider(
    key: string, command: ExternalProviderCommand,
  ): Promise<AxiosObjectResponse<MarketplaceAccount>> {
    const url = `/action/marketplace/accounts/${key}/external-provider`;

    return this.post<ExternalProviderCommand, ObjectResponse<MarketplaceAccount>>(url, command);
  }

  public async grantOpenDatasetProvider(key: string): Promise<AxiosObjectResponse<MarketplaceAccount>> {
    const url = `/action/marketplace/accounts/${key}/open-dataset-provider`;

    return this.put<unknown, ObjectResponse<MarketplaceAccount>>(url, null);
  }

  public async revokeOpenDatasetProvider(key: string): Promise<AxiosObjectResponse<MarketplaceAccount>> {
    const url = `/action/marketplace/accounts/${key}/open-dataset-provider`;

    return this.delete<ObjectResponse<MarketplaceAccount>>(url);
  }

  public async refreshKycStatus(key: string): Promise<AxiosObjectResponse<MarketplaceAccount>> {
    const url = `/action/marketplace/accounts/${key}/kyc`;

    return this.put<unknown, ObjectResponse<MarketplaceAccount>>(url, null);
  }

  public async refreshWalletFunds(key: string): Promise<AxiosObjectResponse<MarketplaceAccount>> {
    const url = `/action/marketplace/accounts/${key}/wallet-funds`;

    return this.put<unknown, ObjectResponse<MarketplaceAccount>>(url, null);
  }

  public async toggleTester(key: string): Promise<AxiosObjectResponse<MarketplaceAccount>> {
    const url = `/action/marketplace/accounts/${key}/tester`;

    return this.put<unknown, ObjectResponse<MarketplaceAccount>>(url, null);
  }


  public async deleteAllUserData(
    key: string, accountDeleted = false, fileSystemDeleted = false, contractsDeleted = false
  ): Promise<AxiosSimpleResponse> {
    const params = `accountDeleted=${accountDeleted}&fileSystemDeleted=${fileSystemDeleted}&contractsDeleted=${contractsDeleted}`;
    const url = `/action/marketplace/accounts/${key}?${params}`;

    return this.delete<ObjectResponse<MarketplaceAccount>>(url);
  }
}
