import { AxiosRequestConfig } from 'axios';

import { Api } from 'utils/api';

import {
  Sorting,
  PageRequest,
  PageResult,
  ObjectResponse,
  AxiosObjectResponse,
  AxiosPageResponse,
  SimpleResponse,
  AxiosSimpleResponse,
} from 'model/response';

import {
  EnumIncidentSortField,
  Incident,
  IncidentQuery
} from 'model/bpm-incident';
import { RetryExternalTaskCommand } from 'model/bpm-process-instance';

export default class IncidentApi extends Api {

  constructor(config: AxiosRequestConfig = {}) {
    super(config);
  }

  public async count(): Promise<AxiosObjectResponse<number>> {
    const url = `/action/workflows/incidents/count`;

    return this.get<ObjectResponse<number>>(url);
  }

  public async find(
    query: Partial<IncidentQuery>, pageRequest: PageRequest, sorting: Sorting<EnumIncidentSortField>[]
  ): Promise<AxiosPageResponse<Incident>> {
    const { page, size } = pageRequest;
    const { id: field, order } = sorting[0];

    const queryString = (Object.keys(query) as Array<keyof IncidentQuery>)
      .reduce((result: string[], key: keyof IncidentQuery) => {
        return query[key] !== null ? [...result, `${key}=${query[key]}`] : result;
      }, []);

    const url = `/action/workflows/incidents?page=${page}&size=${size}&${queryString.join('&')}&orderBy=${field}&order=${order}`;

    return this.get<ObjectResponse<PageResult<Incident>>>(url);
  }

  public async retryExternalTask(processInstanceId: string, externalTaskId: string): Promise<AxiosSimpleResponse> {
    const url = `/action/workflows/process-instances/${processInstanceId}/retry`;

    const command: RetryExternalTaskCommand = {
      processInstanceId,
      externalTaskId,
    };

    return this.post<RetryExternalTaskCommand, SimpleResponse>(url, command);
  }

}
