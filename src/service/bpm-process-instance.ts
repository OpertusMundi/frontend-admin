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
  ActiveProcessInstanceDetails,
  EnumProcessInstanceSortField,
  EnumProcessInstanceHistorySortField,
  HistoryProcessInstanceDetails,
  ProcessInstance,
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

  public async findOne(businessKey: string | null, processInstanceId: string | null): Promise<AxiosObjectResponse<ActiveProcessInstanceDetails>> {
    const url = processInstanceId ?
      `/action/workflows/process-instances/${processInstanceId}`
      :
      `/action/workflows/process-instances/business-key/${businessKey}`;;


    return this.get<ObjectResponse<ActiveProcessInstanceDetails>>(url);
  }

  public async findOneByBusinessKey(businessKey: string): Promise<AxiosObjectResponse<ActiveProcessInstanceDetails>> {
    const url = `/action/workflows/process-instances/business-key/${businessKey}`;

    return this.get<ObjectResponse<ActiveProcessInstanceDetails>>(url);
  }

  public async findHistory(
    query: Partial<ProcessInstanceQuery>, pageRequest: PageRequest, sorting: Sorting<EnumProcessInstanceHistorySortField>[]
  ): Promise<AxiosPageResponse<ProcessInstance>> {
    const { page, size } = pageRequest;
    const { id: field, order } = sorting[0];

    const queryString = (Object.keys(query) as Array<keyof ProcessInstanceQuery>)
      .reduce((result: string[], key: keyof ProcessInstanceQuery) => {
        return query[key] !== null ? [...result, `${key}=${query[key]}`] : result;
      }, []);

    const url = `/action/workflows/history/process-instances?page=${page}&size=${size}&${queryString.join('&')}&orderBy=${field}&order=${order}`;

    return this.get<ObjectResponse<PageResult<ProcessInstance>>>(url);
  }

  public async findOneHistory(
    businessKey: string | null, processInstanceId: string | null
  ): Promise<AxiosObjectResponse<HistoryProcessInstanceDetails>> {
    const url = processInstanceId ?
      `/action/workflows/history/process-instances/${processInstanceId}`
      :
      `/action/workflows/history/process-instances/business-key/${businessKey}`;

    return this.get<ObjectResponse<HistoryProcessInstanceDetails>>(url);
  }


}
