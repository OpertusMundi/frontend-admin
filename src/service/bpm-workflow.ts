import { AxiosRequestConfig } from 'axios';

import { Api } from 'utils/api';

import {
  Sorting,
  PageRequest,
  PageResult,
  ObjectResponse,
  SimpleResponse,
  AxiosObjectResponse,
  AxiosPageResponse,
  AxiosSimpleResponse,
} from 'model/response';

import {
  ActiveProcessInstanceDetails,
  EnumProcessInstanceSortField,
  EnumProcessInstanceHistorySortField,
  EnumProcessInstanceTaskSortField,
  HistoryProcessInstanceDetails,
  ProcessDefinition,
  ProcessInstance,
  ProcessInstanceQuery,
  ProcessInstanceTask,
  ProcessInstanceTaskQuery,
  CompleteTaskTaskCommand,
  ModificationCommand,
} from 'model/bpm-process-instance';

export default class WorkflowApi extends Api {

  constructor(config: AxiosRequestConfig = {}) {
    super(config);
  }

  public async getProcessDefinitions(): Promise<AxiosObjectResponse<ProcessDefinition[]>> {
    const url = `/action/workflows/process-definitions`;

    return this.get<ObjectResponse<ProcessDefinition[]>>(url);
  }

  public async getProcessBpmn2Xml(id: string): Promise<AxiosObjectResponse<string>> {
    const url = `/action/workflows/process-definition/${id}/xml`;

    return this.get<ObjectResponse<string>>(url);
  }

  public async countProcessInstances(): Promise<AxiosObjectResponse<number>> {
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

  public async deleteProcessInstance(processInstanceId: string): Promise<AxiosSimpleResponse> {
    const url = `/action/workflows/process-instances/${processInstanceId}`;

    return this.delete<SimpleResponse>(url);
  }

  public async countTasks(): Promise<AxiosObjectResponse<number>> {
    const url = `/action/workflows/tasks/count`;

    return this.get<ObjectResponse<number>>(url);
  }

  public async findTasks(
    query: Partial<ProcessInstanceQuery>, pageRequest: PageRequest, sorting: Sorting<EnumProcessInstanceTaskSortField>[]
  ): Promise<AxiosPageResponse<ProcessInstanceTask>> {
    const { page, size } = pageRequest;
    const { id: field, order } = sorting[0];

    const queryString = (Object.keys(query) as Array<keyof ProcessInstanceTaskQuery>)
      .reduce((result: string[], key: keyof ProcessInstanceTaskQuery) => {
        return query[key] !== null ? [...result, `${key}=${query[key]}`] : result;
      }, []);

    const url = `/action/workflows/tasks?page=${page}&size=${size}&${queryString.join('&')}&orderBy=${field}&order=${order}`;

    return this.get<ObjectResponse<PageResult<ProcessInstanceTask>>>(url);
  }

  public async completeTask<C extends CompleteTaskTaskCommand>(processInstanceId: string, command: C): Promise<SimpleResponse> {
    const url = `/action/workflows/process-instances/${processInstanceId}/tasks`;

    return this.post<CompleteTaskTaskCommand, SimpleResponse>(url, command).then((response) => response.data);
  }

  public async modifyProcessInstance(processInstanceId: string, command: ModificationCommand): Promise<SimpleResponse> {
    const url = `/action/workflows/process-instances/${processInstanceId}/modification`;

    return this.post<ModificationCommand, SimpleResponse>(url, command).then((response) => response.data);
  }

}
