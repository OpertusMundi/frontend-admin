import { AxiosRequestConfig } from 'axios';

import { Api } from 'utils/api';
import { AxiosObjectResponse, ObjectResponse } from 'model/response';
import { Dashboard } from 'model/dashboard';

export default class DashboardApi extends Api {

  constructor(config: AxiosRequestConfig = {}) {
    super(config);
  }

  public async getSystemStatus(): Promise<AxiosObjectResponse<Dashboard>> {
    const url = `/action/dashboard`;

    return this.get<ObjectResponse<Dashboard>>(url);
  }

}
