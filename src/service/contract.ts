import { AxiosRequestConfig } from 'axios';

import { Api } from 'utils/api';
import {
  AxiosObjectResponse, AxiosPageResponse,
  ObjectResponse, PageRequest, Sorting, PageResult, AxiosSimpleResponse,
} from 'model/response';
import {
  MasterContractQuery,
  MasterContractCommand, MasterContract, MasterContractHistory,
  EnumMasterContractSortField
} from 'model/contract';

export default class ContractApi extends Api {

  constructor(config: AxiosRequestConfig = {}) {
    super(config);
  }

  public createNew(): MasterContractCommand {
    return {
      id: null,
      title: 'Document title',
      subtitle: 'Document subtitle',
      sections: [],
    };
  }

  public contractToCommand(contract: MasterContract): MasterContractCommand {
    return {
      id: contract.id,
      title: contract.title,
      subtitle: contract.subtitle || '',
      sections: [...(contract.sections || [])],
    };
  }

  public async findHistory(
    query: Partial<MasterContractQuery>, pageRequest: PageRequest, sorting: Sorting<EnumMasterContractSortField>[]
  ): Promise<AxiosPageResponse<MasterContractHistory>> {
    const { page, size } = pageRequest;
    const { id: field, order } = sorting[0];

    const queryString = (Object.keys(query) as Array<keyof MasterContractQuery>)
      .reduce((result: string[], key: keyof MasterContractQuery) => {
        return query[key] !== null ? [...result, `${key}=${query[key]}`] : result;
      }, []);

    const url = `/action/contract/history?page=${page}&size=${size}&${queryString.join('&')}&orderBy=${field}&order=${order}`;

    const response = this.get<ObjectResponse<PageResult<MasterContractHistory>>>(url);

    return response;
  }

  public async findTemplates(
    pageRequest: PageRequest, sorting: Sorting<EnumMasterContractSortField>[]
  ): Promise<AxiosPageResponse<MasterContract>> {
    const { page, size } = pageRequest;
    const { id: field, order } = sorting[0];

    const url = `/action/contract/templates?page=${page}&size=${size}&orderBy=${field}&order=${order}`;

    var response = this.get<ObjectResponse<PageResult<MasterContract>>>(url);

    return response;
  }

  public async findTemplate(id: number): Promise<AxiosObjectResponse<MasterContract>> {
    const url = `/action/contract/templates/${id}`;

    return this.get<ObjectResponse<MasterContract>>(url);
  }

  public async createDraftFromTemplate(id: number): Promise<AxiosObjectResponse<MasterContract>> {
    const url = `/action/contract/history/${id}`;

    return this.post<unknown, ObjectResponse<MasterContract>>(url, null);
  }

  public async deactivateTemplate(id: number): Promise<AxiosSimpleResponse> {
    const url = `/action/contract/history/${id}`;

    return this.delete(url);
  }

  public async findDrafts(
    pageRequest: PageRequest, sorting: Sorting<EnumMasterContractSortField>[]
  ): Promise<AxiosPageResponse<MasterContract>> {
    const { page, size } = pageRequest;
    const { id: field, order } = sorting[0];

    const url = `/action/contract/drafts?page=${page}&size=${size}&orderBy=${field}&order=${order}`;

    var response = this.get<ObjectResponse<PageResult<MasterContract>>>(url);

    return response;
  }

  public async findDraft(id: number): Promise<AxiosObjectResponse<MasterContract>> {
    const url = `/action/contract/drafts/${id}`;

    return this.get<ObjectResponse<MasterContract>>(url);
  }

  public async createDraft(command: MasterContractCommand): Promise<AxiosObjectResponse<MasterContract>> {
    const url = `/action/contract/drafts`;

    return this.post<MasterContractCommand, ObjectResponse<MasterContract>>(url, command);
  }

  public async updateDraft(id: number, command: MasterContractCommand): Promise<AxiosObjectResponse<MasterContract>> {
    const url = `/action/contract/drafts/${id}`;

    return this.post<MasterContractCommand, ObjectResponse<MasterContract>>(url, command);
  }

  public async deleteDraft(id: number): Promise<AxiosObjectResponse<MasterContract>> {
    const url = `/action/contract/drafts/${id}`;

    return this.delete<ObjectResponse<MasterContract>>(url);
  }

  public async publishDraft(id: number): Promise<AxiosSimpleResponse> {
    const url = `/action/contract/drafts/${id}`;

    return this.put<unknown, ObjectResponse<MasterContract>>(url, null);
  }
}
