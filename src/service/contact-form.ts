import moment, { Moment } from 'moment';

import { AxiosRequestConfig, AxiosResponse } from 'axios';

import { Api } from 'utils/api';
import { ObjectResponse, PageRequest, Sorting, AxiosObjectResponse, PageResult } from 'model/response';
import { ContactForm, ContactFormQuery, EnumContactFormSortField } from 'model/contact-form';

const baseUri = '/action/contact-forms';

export default class ContactFormApi extends Api {

  constructor(config: AxiosRequestConfig = {}) {
    super(config);
  }

  public async findForms(
    query: Partial<ContactFormQuery>, pageRequest: PageRequest, sorting: Sorting<EnumContactFormSortField>[]
  ): Promise<ObjectResponse<PageResult<ContactForm>>> {
    const { page, size } = pageRequest;
    const { id: field, order } = sorting[0];

    const queryString = (Object.keys(query) as Array<keyof ContactFormQuery>)
      .reduce((result: string[], key: keyof ContactFormQuery) => {
        const value = query[key] ? moment.isMoment(query[key]) ? (query[key] as Moment).format('YYYY-MM-DD') : query[key] : null;
        return value ? [...result, `${key}=${value}`] : result;
      }, []);

    const url = `${baseUri}/?pageIndex=${page}&pageSize=${size}&${queryString.join('&')}&sortBy=${field}&sortOrder=${order}`;

    return this.get<ObjectResponse<PageResult<ContactForm>>>(url)
      .then((response: AxiosResponse<ObjectResponse<PageResult<ContactForm>>>) => {
        return response.data;
      });
  }

  public async countPendingForms(): Promise<AxiosObjectResponse<number>> {
    const url = `${baseUri}/count`;

    return this.get<ObjectResponse<number>>(url);
  }

  public async completeForm(formKey: string): Promise<ObjectResponse<ContactForm>> {
    const url = `${baseUri}/${formKey}`;

    return this.put<unknown, ObjectResponse<ContactForm>>(url, null)
      .then((response: AxiosResponse<ObjectResponse<ContactForm>>) => {
        return response.data;
      });
  }
}
