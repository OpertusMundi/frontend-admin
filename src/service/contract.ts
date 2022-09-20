import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { saveAs } from 'file-saver';

import {
  AxiosObjectResponse,
  AxiosSimpleResponse,
  ObjectResponse,
  PageRequest,
  SimpleResponse,
  Sorting
} from 'model/response';

import {
  EnumMasterContractSortField,
  MasterContract,
  MasterContractCommand,
  MasterContractHistoryResult,
  MasterContractQuery
} from 'model/contract';

import { Api } from 'utils/api';
import { blobToJson } from 'utils/file';

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
  ): Promise<AxiosObjectResponse<MasterContractHistoryResult>> {
    const { page, size } = pageRequest;
    const { id: field, order } = sorting[0];

    const queryString = (Object.keys(query) as Array<keyof MasterContractQuery>)
      .reduce((result: string[], key: keyof MasterContractQuery) => {
        return query[key] !== null ? [...result, `${key}=${query[key]}`] : result;
      }, []);

    const url = `/action/contract/history?page=${page}&size=${size}&${queryString.join('&')}&orderBy=${field}&order=${order}`;

    const response = this.get<ObjectResponse<MasterContractHistoryResult>> (url);

    return response;
  }

  public async createDraftForTemplate(id: number): Promise<AxiosObjectResponse<MasterContract>> {
    const url = `/action/contract/history/${id}`;

    return this.post<unknown, ObjectResponse<MasterContract>>(url, null);
  }

  public async cloneDraftFromTemplate(id: number): Promise<AxiosObjectResponse<MasterContract>> {
    const url = `/action/contract/history/${id}/clone`;

    return this.post<unknown, ObjectResponse<MasterContract>>(url, null);
  }

  public async deactivateTemplate(id: number): Promise<AxiosSimpleResponse> {
    const url = `/action/contract/history/${id}`;

    return this.delete(url);
  }

  public async setDefaultContract(id: number): Promise<AxiosObjectResponse<MasterContract>> {
    const url = `/action/contract/history/${id}/set-default`;

    return this.post<unknown, ObjectResponse<MasterContract>>(url, null);
  }

  public async findDraft(id: number): Promise<AxiosObjectResponse<MasterContract>> {
    const url = `/action/contract/drafts/${id}`;

    return this.get<ObjectResponse<MasterContract>>(url);
  }

  public async downloadPublished(id: number, title: string): Promise<SimpleResponse> {
    const url = `/action/contract/history/${id}/print`;

    return this.get<Blob>(url, {
      responseType: 'blob',
    })
      .then((response: AxiosResponse<Blob>) => {

        saveAs(response.data, title + '.pdf');

        return Promise.resolve({
          success: true,
          messages: [],
        });
      })
      .catch((err: AxiosError) => blobToJson(err.response?.data as Blob));
  }

  public async createDraft(command: MasterContractCommand): Promise<AxiosObjectResponse<MasterContract>> {
    const url = `/action/contract/drafts`;

    // Add html content to sections
    return this.post<MasterContractCommand, ObjectResponse<MasterContract>>(url, command);
  }

  public async updateDraft(id: number, command: MasterContractCommand): Promise<AxiosObjectResponse<MasterContract>> {
    const url = `/action/contract/drafts/${id}`;

    /*for (var i = 0; i < sections.length; i++) {

      let options = sections[i].options;
      if (sections[i].subOptions[0]){
        let suboptions = sections[i].subOptions[0];
        console.log('suboption ' + suboptions[0].id + typeof suboptions[0].id)
      }
      //for (var j = 0; i < options.length; i++) {
        //let raw = options[j].body;
        //let contentState = convertFromRaw(JSON.parse(raw));
        //sections[i].options[j].bodyHtml = stateToHTML(contentState);
     // }

    }*/
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
