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

  public async findOne(key: string): Promise<AxiosObjectResponse<MarketplaceAccountDetails>> {
    const url = `/action/marketplace/accounts/${key}`;


    return this.get<ObjectResponse<MarketplaceAccountDetails>>(url);
  }

  public async review(key: string, acceptChanges: boolean, rejectReason?: string): Promise<AxiosObjectResponse<MarketplaceAccountDetails>> {
    const url = `/action/marketplace/accounts/${key}/review`;

    const command: MarketplaceAccountReviewCommand = {
      acceptChanges,
      rejectReason,
    };

    return this.put<MarketplaceAccountReviewCommand, ObjectResponse<MarketplaceAccountDetails>>(url, command);
  }

}
