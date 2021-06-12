import { AxiosRequestConfig } from 'axios';

import { Api } from 'utils/api';
import { ObjectResponse, PageRequest, Sorting, AxiosObjectResponse, AxiosPageResponse, PageResult, AxiosSimpleResponse } from 'model/response';
import { EnumHelpdeskAccountSortField, HelpdeskAccount, HelpdeskAccountQuery, HelpdeskAccountFormData, HelpdeskAccountCommand, SetPasswordCommand, ProfileCommand } from 'model/account';

export default class HelpdeskAccountApi extends Api {

  constructor(config: AxiosRequestConfig = {}) {
    super(config);
  }

  public createNew(): HelpdeskAccountCommand {
    return {
      active: true,
      blocked: false,
      email: '',
      firstName: '',
      image: null,
      imageMimeType: null,
      lastName: '',
      locale: 'en',
      mobile: '',
      phone: '',
      roles: [],
      password: '',
      passwordMatch: '',
    };
  }

  public async find(query: Partial<HelpdeskAccountQuery>, pageRequest: PageRequest, sorting: Sorting<EnumHelpdeskAccountSortField>[]): Promise<AxiosPageResponse<HelpdeskAccount>> {
    const { page, size } = pageRequest;
    const { id: field, order } = sorting[0];

    const queryString = (Object.keys(query) as Array<keyof HelpdeskAccountQuery>)
      .reduce((result: string[], key: keyof HelpdeskAccountQuery) => {
        return query[key] !== null ? [...result, `${key}=${query[key]}`] : result;
      }, []);

    const url = `/action/helpdesk/accounts?page=${page}&size=${size}&${queryString.join('&')}&orderBy=${field}&order=${order}`;

    return this.get<ObjectResponse<PageResult<HelpdeskAccount>>>(url);
  }

  public async findOne(id: number): Promise<AxiosObjectResponse<HelpdeskAccountFormData>> {
    const url = `/action/helpdesk/accounts/${id}`;


    return this.get<ObjectResponse<HelpdeskAccountFormData>>(url);
  }

  public async create(command: HelpdeskAccountCommand): Promise<AxiosObjectResponse<HelpdeskAccount>> {
    const url = `/action/helpdesk/accounts/`;

    return this.post<HelpdeskAccountCommand, ObjectResponse<HelpdeskAccount>>(url, command);
  }

  public async update(id: number, command: HelpdeskAccountCommand): Promise<AxiosObjectResponse<HelpdeskAccount>> {
    const url = `/action/helpdesk/accounts/${id}`;

    return this.post<HelpdeskAccountCommand, ObjectResponse<HelpdeskAccount>>(url, command);
  }

  public async remove(id: number): Promise<AxiosSimpleResponse> {
    const url = `/action/helpdesk/accounts/${id}`;

    return this.delete(url);
  }

  public async setPassword(command: SetPasswordCommand): Promise<AxiosObjectResponse<HelpdeskAccount>> {
    const url = `/action/user/password`;

    return this.post<SetPasswordCommand, ObjectResponse<HelpdeskAccount>>(url, command);
  }

  public async getProfile(): Promise<AxiosObjectResponse<HelpdeskAccount>> {
    const url = `/action/user/profile`;

    return this.get<ObjectResponse<HelpdeskAccount>>(url);
  }

  public async setProfile(command: ProfileCommand): Promise<AxiosObjectResponse<HelpdeskAccount>> {
    const url = `/action/user/profile`;

    return this.post<ProfileCommand, ObjectResponse<HelpdeskAccount>>(url, command);
  }

  public accountToCommand(account: HelpdeskAccount): HelpdeskAccountCommand {
    const {
      createdOn,
      emailVerified,
      emailVerifiedOn,
      key,
      modifiedOn,
      ...rest
    } = account;

    const command: HelpdeskAccountCommand = {
      ...rest,
      password: '',
      passwordMatch: '',
    };

    return command;
  }
}
