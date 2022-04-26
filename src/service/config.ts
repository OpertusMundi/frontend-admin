import { AxiosRequestConfig } from 'axios';
import { Api } from 'utils/api';
import { ApplicationConfiguration, Setting, SettingUpdateCommand } from 'model/configuration';
import { AxiosObjectResponse, AxiosSimpleResponse, ObjectResponse, SimpleResponse } from 'model/response';

const requestConfig: AxiosRequestConfig = {
  withCredentials: true,
};

export class ConfigurationApi extends Api {

  constructor(config: AxiosRequestConfig = {}) {
    super(config);
  }

  public async getConfiguration(): Promise<AxiosObjectResponse<ApplicationConfiguration>> {
    const url = `/action/configuration`;

    return this.get<ObjectResponse<ApplicationConfiguration>>(url, requestConfig);
  }

  public async getSettings(): Promise<AxiosObjectResponse<Setting[]>> {
    const url = `/action/settings`;

    return this.get<ObjectResponse<Setting[]>>(url, requestConfig);
  }

  public async updateSetting(command: SettingUpdateCommand): Promise<AxiosSimpleResponse> {
    const url = `/action/settings`;

    return this.put<SettingUpdateCommand, SimpleResponse>(url, command, requestConfig);
  }

}
