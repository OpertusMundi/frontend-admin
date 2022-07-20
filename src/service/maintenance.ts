import { AxiosRequestConfig } from 'axios';
import { Api } from 'utils/api';
import { ApplicationConfiguration } from 'model/configuration';
import { AxiosObjectResponse, SimpleResponse } from 'model/response';
import { Tasks } from 'model/maintenance';

const requestConfig: AxiosRequestConfig = {
  withCredentials: true,
};

export class MaintenanceApi extends Api {

  constructor(config: AxiosRequestConfig = {}) {
    super(config);
  }

  public async cleanData(tasks: Tasks): Promise<AxiosObjectResponse<ApplicationConfiguration>> {
    const url = `/action/maintenance/tasks`;

    return this.post<Tasks, SimpleResponse>(url, tasks, requestConfig);
  }
}
