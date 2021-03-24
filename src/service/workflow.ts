import { AxiosRequestConfig } from 'axios';

import { Api } from 'utils/api';

import {
  AxiosObjectResponse,
  ObjectResponse,
} from 'model/response';

import {
  Incident,
} from 'model/workflow';

export default class WorkflowApi extends Api {

  constructor(config: AxiosRequestConfig = {}) {
    super(config);
  }

  public async countIncidents(): Promise<AxiosObjectResponse<number>> {
    const url = `/action/workflows/incidents/count`;

    return this.get<ObjectResponse<number>>(url);
  }

  public async getIncidents(): Promise<AxiosObjectResponse<Incident[]>> {
    const url = `/action/workflows/incidents`;

    return this.get<ObjectResponse<Incident[]>>(url);
  }

}
