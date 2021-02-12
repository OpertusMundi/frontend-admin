import { AxiosRequestConfig } from 'axios';

import { Api } from 'utils/api';
// eslint-disable-next-line
import { ObjectResponse, PageRequest, Sorting, AxiosObjectResponse, AxiosPageResponse, PageResult, AxiosSimpleResponse } from 'model/response';
//import { Contract, OrganizationQuery } from 'model/contract';\
import { Contract, EnumSortField } from 'model/contract';

export interface ContractQuery {
    id: number;
}

export default class ContractApi extends Api {

  constructor(config: AxiosRequestConfig = {}) {
    super(config);
  }

  public createNew(): Contract {
    return {
    account: 1,
    title: 'Document title',
    subtitle: 'Document subtitle',
    state: 'DRAFT',
    version: '1',
    sections: [],
    createdAt: null,
    modifiedAt: null,
    };
  }

  public async find(query: Partial<ContractQuery>, pageRequest: PageRequest,  sorting: Sorting<EnumSortField>[]): Promise<AxiosPageResponse<Contract>> {
    const { page, size } = pageRequest;
    const { id: field, order } = sorting[0];

    const queryString = (Object.keys(query) as Array<keyof ContractQuery>)
      .reduce((result: string[], key: keyof ContractQuery) => {
        return query[key] !== null ? [...result, `${key}=${query[key]}`] : result;
      }, []);

    const url = `/action/user/contracts?page=${page}&size=${size}&${queryString.join('&')}&orderBy=${field}&order=${order}`;

    var contract = this.get<ObjectResponse<PageResult<Contract>>>(url);

    return contract;

  }
  

  public async findOne(id: number): Promise<AxiosObjectResponse<Contract>> {
    const url = `/action/user/contracts/${id}`;

    return this.get<ObjectResponse<Contract>>(url);
  }

  public async create(contract: Contract): Promise<AxiosObjectResponse<Contract>> {
    const url = `/action/user/contracts/`;
    return this.post<Contract, ObjectResponse<Contract>>(url, contract);
  }

  public async update(id: number, contract: Contract): Promise<AxiosObjectResponse<Contract>> {
    const url = `/action/user/contracts/${id}`;

    return this.post<Contract, ObjectResponse<Contract>>(url, contract);
  }

  public async remove(id: number): Promise<AxiosSimpleResponse> {
    const url = `/action/user/contracts/${id}`;

    return this.delete(url);
  }

  public async test(id: number): Promise<AxiosSimpleResponse> {
    const url = `/action/user/test/${id}`;

    return this.post(url, id);
  }

  public async findContracts(): Promise<AxiosObjectResponse<Contract[]>> {
    const url = `/action/user/getContracts/`;

    return this.get<ObjectResponse<Contract[]>>(url);
  }

  public async updateState(id: number, state: String): Promise<AxiosSimpleResponse> {

    console.log('in api update state', id, state);
    const url = `/action/user/contracts/updateState/${id}`;

    return this.post(url,state);
  }
}
