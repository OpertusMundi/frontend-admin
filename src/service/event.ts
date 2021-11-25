import { AxiosRequestConfig } from 'axios';

import { Api } from 'utils/api';
import { ObjectResponse, PageRequest, Sorting, AxiosPageResponse, PageResult } from 'model/response';
import { EnumEventSortField, EventQuery, Event } from 'model/event';

export default class EventApi extends Api {

  constructor(config: AxiosRequestConfig = {}) {
    super(config);
  }

  public async find(query: Partial<EventQuery>, pageRequest: PageRequest, sorting: Sorting<EnumEventSortField>[]): Promise<AxiosPageResponse<Event>> {
    const { page, size } = pageRequest;
    const { id: field, order } = sorting[0];

    const queryString = (Object.keys(query) as Array<keyof EventQuery>)
      .reduce((result: string[], key: keyof EventQuery) => {
        if (!query[key]) {
          return result;
        }
        return [...result, `${key}=${Array.isArray(query[key]) ? (query[key] as any).join(',') : query[key]}`];
      }, []);

    const url = `/action/events?page=${page}&size=${size}&${queryString.join('&')}&orderBy=${field}&order=${order}`;

    return this.get<ObjectResponse<PageResult<Event>>>(url);
  }

}