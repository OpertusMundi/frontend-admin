import { AxiosRequestConfig } from 'axios';

import { Api } from 'utils/api';

import {
  Sorting,
  PageRequest,
  PageResult,
  ObjectResponse,
  AxiosObjectResponse,
  AxiosPageResponse,
} from 'model/response';

import {
  EnumIncidentSortField,
  EnumProcessInstanceSortField,
  ProcessInstance,
  ProcessInstanceQuery,
  Incident,
  IncidentQuery
} from 'model/workflow';

export default class WorkflowApi extends Api {

  constructor(config: AxiosRequestConfig = {}) {
    super(config);
  }

  public async getInstances(
    query: Partial<ProcessInstanceQuery>, pageRequest: PageRequest, sorting: Sorting<EnumProcessInstanceSortField>[]
  ): Promise<AxiosPageResponse<ProcessInstance>> {
    const { page, size } = pageRequest;
    const { id: field, order } = sorting[0];

    const queryString = (Object.keys(query) as Array<keyof ProcessInstanceQuery>)
      .reduce((result: string[], key: keyof ProcessInstanceQuery) => {
        return query[key] !== null ? [...result, `${key}=${query[key]}`] : result;
      }, []);

    const url = `/action/workflows/instances?page=${page}&size=${size}&${queryString.join('&')}&orderBy=${field}&order=${order}`;

    return this.get<ObjectResponse<PageResult<ProcessInstance>>>(url);
  }

  public async countIncidents(): Promise<AxiosObjectResponse<number>> {
    const url = `/action/workflows/incidents/count`;

    return this.get<ObjectResponse<number>>(url);
  }

  public async getIncidents(
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

}
