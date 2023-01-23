import { AxiosRequestConfig } from 'axios';

import { Api } from 'utils/api';
import { ObjectResponse, PageRequest, Sorting, AxiosPageResponse, PageResult } from 'model/response';
import { EnumDisputeSortField, Dispute, DisputeQuery } from 'model/dispute';

export default class DisputeApi extends Api {

  constructor(config: AxiosRequestConfig = {}) {
    super(config);
  }

  public async find(query: Partial<DisputeQuery>, pageRequest: PageRequest, sorting: Sorting<EnumDisputeSortField>[]): Promise<AxiosPageResponse<Dispute>> {
    const { page, size } = pageRequest;
    const { id: field, order } = sorting[0];

    const queryString = (Object.keys(query) as Array<keyof DisputeQuery>)
      .reduce((result: string[], key: keyof DisputeQuery) => {
        return query[key] !== null ? [...result, `${key}=${query[key]}`] : result;
      }, []);

    const url = `/action/billing/disputes?page=${page}&size=${size}&${queryString.join('&')}&orderBy=${field}&order=${order}`;

    return this.get<ObjectResponse<PageResult<Dispute>>>(url);
  }

}
