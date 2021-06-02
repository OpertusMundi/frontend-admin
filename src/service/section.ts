import { AxiosRequestConfig } from 'axios';

import { Api } from 'utils/api';
import { ObjectResponse, PageRequest, Sorting, AxiosObjectResponse, AxiosPageResponse, PageResult, AxiosSimpleResponse } from 'model/response';
//import { Section, OrganizationQuery } from 'model/section';\
import { Section, Suboption } from 'model/section';


export interface SectionQuery {
    id: number;
}

export default class SectionApi extends Api {

  constructor(config: AxiosRequestConfig = {}) {
    super(config);
  }

  public createNew(): Section {
    return {
      indent: 0,
      index: '',
      title: '',
      variable: false,
      optional: false,
      dynamic: false,
      options: [],
      styledOptions: [],
      suboptions: {},
      summary: [],
      descriptionOfChange: ''
    };
  }

  /*public async find(query: Partial<OrganizationQuery>, pageRequest: PageRequest, sorting: Sorting[]): Promise<AxiosPageResponse<Section>> {
    const { page, size } = pageRequest;
    const { id: field, order } = sorting[0];

    const queryString = (Object.keys(query) as Array<keyof OrganizationQuery>)
      .reduce((result: string[], key: keyof OrganizationQuery) => {
        return query[key] !== null ? [...result, `${key}=${query[key]}`] : result;
      }, []);

    const url = `/action/admin/sections?page=${page}&size=${size}&${queryString.join('&')}&orderBy=${field}&order=${order}`;

    return this.get<ObjectResponse<PageResult<Section>>>(url);
  }*/
  

  public async findOne(id: number): Promise<AxiosObjectResponse<Section>> {
    const url = `/action/admin/sections/${id}`;

    return this.get<ObjectResponse<Section>>(url);
  }

  public async create(section: Section): Promise<AxiosObjectResponse<Section>> {
    const url = `/action/admin/sections/`;

    return this.post<Section, ObjectResponse<Section>>(url, section);
  }

  public async update(id: number, section: Section): Promise<AxiosObjectResponse<Section>> {
    const url = `/action/admin/sections/${id}`;

    return this.post<Section, ObjectResponse<Section>>(url, section);
  }

  public async remove(id: number): Promise<AxiosSimpleResponse> {
    const url = `/action/admin/sections/${id}`;

    return this.delete(url);
  }


}
