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
  EnumProcessInstanceSortField,
  ProcessInstance,
  ProcessInstanceDetails,
  ProcessInstanceQuery,
} from 'model/bpm-process-instance';

export default class WorkflowApi extends Api {

  constructor(config: AxiosRequestConfig = {}) {
    super(config);
  }

  public async count(): Promise<AxiosObjectResponse<number>> {
    const url = `/action/workflows/process-instances/count`;

    return this.get<ObjectResponse<number>>(url);
  }

  public async find(
    query: Partial<ProcessInstanceQuery>, pageRequest: PageRequest, sorting: Sorting<EnumProcessInstanceSortField>[]
  ): Promise<AxiosPageResponse<ProcessInstance>> {
    const { page, size } = pageRequest;
    const { id: field, order } = sorting[0];

    const queryString = (Object.keys(query) as Array<keyof ProcessInstanceQuery>)
      .reduce((result: string[], key: keyof ProcessInstanceQuery) => {
        return query[key] !== null ? [...result, `${key}=${query[key]}`] : result;
      }, []);

    const url = `/action/workflows/process-instances?page=${page}&size=${size}&${queryString.join('&')}&orderBy=${field}&order=${order}`;

    return this.get<ObjectResponse<PageResult<ProcessInstance>>>(url);
  }

  public async findOne(processInstanceId: string): Promise<AxiosObjectResponse<ProcessInstanceDetails>> {
    const url = `/action/workflows/process-instances/${processInstanceId}`;

    return this.get<ObjectResponse<ProcessInstanceDetails>>(url);
  }

}
