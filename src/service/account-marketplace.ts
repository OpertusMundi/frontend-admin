import { AxiosRequestConfig } from 'axios';

import { Api } from 'utils/api';
import { ObjectResponse, PageRequest, Sorting, AxiosObjectResponse, AxiosPageResponse, PageResult } from 'model/response';
import { EnumMarketplaceAccountSortField, MarketplaceAccount, MarketplaceAccountQuery } from 'model/account';

export default class MarketplaceAccountApi extends Api {

  constructor(config: AxiosRequestConfig = {}) {
    super(config);
  }

  public async find(query: Partial<MarketplaceAccountQuery>, pageRequest: PageRequest, sorting: Sorting<EnumMarketplaceAccountSortField>[]): Promise<AxiosPageResponse<MarketplaceAccount>> {
    const { page, size } = pageRequest;
    const { id: field, order } = sorting[0];

    const queryString = (Object.keys(query) as Array<keyof MarketplaceAccountQuery>)
      .reduce((result: string[], key: keyof MarketplaceAccountQuery) => {
        return query[key] !== null ? [...result, `${key}=${query[key]}`] : result;
      }, []);

    const url = `/action/marketplace/accounts?page=${page}&size=${size}&${queryString.join('&')}&orderBy=${field}&order=${order}`;

    return this.get<ObjectResponse<PageResult<MarketplaceAccount>>>(url);
  }

  public async findOne(id: number): Promise<AxiosObjectResponse<MarketplaceAccount>> {
    const url = `/action/marketplace/accounts/${id}`;


    return this.get<ObjectResponse<MarketplaceAccount>>(url);
  }

}
