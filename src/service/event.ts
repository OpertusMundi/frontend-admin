import { Moment } from 'moment';

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

    const payload: Partial<EventQuery> = {
      ...query,
      fromDate: query.fromDate ? (query.fromDate as Moment).format('YYYY-MM-DD') : '',
      toDate: query.toDate ? (query.toDate as Moment).format('YYYY-MM-DD') : '',
      page,
      size,
      orderBy: field,
      order,
    };

    const url = '/action/events';

    return this.post<Partial<EventQuery>, ObjectResponse<PageResult<Event>>>(url, payload);
  }

}