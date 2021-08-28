import { AxiosRequestConfig, AxiosResponse } from 'axios';

import { Api } from 'utils/api';
import { ObjectResponse, PageRequest, Sorting, AxiosObjectResponse } from 'model/response';
import { EnumMessageSortField, MessageQuery, ClientMessageCollectionResponse, ClientMessage, ClientMessageCommand, ClientMessageThreadResponse } from 'model/chat';

const baseUri = '/action/messages';

export default class MessageApi extends Api {

  constructor(config: AxiosRequestConfig = {}) {
    super(config);
  }

  public async findUnassignedMessages(
    query: Partial<MessageQuery>, pageRequest: PageRequest, sorting: Sorting<EnumMessageSortField>[]
  ): Promise<AxiosResponse<ClientMessageCollectionResponse>> {
    const { page, size } = pageRequest;
    const { id: field, order } = sorting[0];

    const queryString = (Object.keys(query) as Array<keyof MessageQuery>)
      .reduce((result: string[], key: keyof MessageQuery) => {
        return query[key] !== null ? [...result, `${key}=${query[key]}`] : result;
      }, []);

    const url = `${baseUri}/helpdesk/inbox?page=${page}&size=${size}&${queryString.join('&')}&orderBy=${field}&order=${order}`;

    return this.get<ClientMessageCollectionResponse>(url)
      .then((response: AxiosResponse<ClientMessageCollectionResponse>) => {
        const { data: serverResponse } = response;

        // Inject contacts
        if (serverResponse.success) {
          serverResponse.result!.items = serverResponse.result!.items.map((item) => ({
            ...item,
            recipient: item.recipientId ? serverResponse.contacts[item.recipientId] : null || null,
            sender: item.senderId ? serverResponse.contacts[item.senderId] : null || null,
          }));
        }

        return response;
      });
  }

  public async findMessages(
    query: Partial<MessageQuery>, pageRequest: PageRequest, sorting: Sorting<EnumMessageSortField>[]
  ): Promise<AxiosResponse<ClientMessageCollectionResponse>> {
    const { page, size } = pageRequest;
    const { id: field, order } = sorting[0];

    const queryString = (Object.keys(query) as Array<keyof MessageQuery>)
      .reduce((result: string[], key: keyof MessageQuery) => {
        return query[key] !== null ? [...result, `${key}=${query[key]}`] : result;
      }, []);

    const url = `${baseUri}/user/inbox?page=${page}&size=${size}&${queryString.join('&')}&orderBy=${field}&order=${order}`;

    return this.get<ClientMessageCollectionResponse>(url)
      .then((response: AxiosResponse<ClientMessageCollectionResponse>) => {
        const { data: serverResponse } = response;

        // Inject contacts
        if (serverResponse.success) {
          serverResponse.result!.items = serverResponse.result!.items.map((item) => ({
            ...item,
            recipient: item.recipientId ? serverResponse.contacts[item.recipientId] : null || null,
            sender: serverResponse.contacts[item.senderId] || null,
          }));
        }

        return response;
      });
  }

  public async getThreadMessages(threadKey: string): Promise<AxiosResponse<ClientMessageThreadResponse>> {
    const url = `${baseUri}/thread/${threadKey}`;

    return this.get<ClientMessageThreadResponse>(url)
      .then((response: AxiosResponse<ClientMessageThreadResponse>) => {
        const { data: serverResponse } = response;

        // Inject contacts
        if (serverResponse.success) {
          serverResponse.result = serverResponse.result!.map((item) => ({
            ...item,
            recipient: item.recipientId ? serverResponse.contacts[item.recipientId] : null || null,
            sender: serverResponse.contacts[item.senderId] || null,
          }));
        }

        return response;
      });
  }

  public async assignUserToMessage(messageKey: string): Promise<AxiosObjectResponse<ClientMessage>> {
    const url = `${baseUri}/${messageKey}`;

    return this.post<unknown, ObjectResponse<ClientMessage>>(url, null);
  }

  public async readMessage(messageKey: string): Promise<AxiosObjectResponse<ClientMessage>> {
    const url = `${baseUri}/${messageKey}`;

    return this.put<unknown, ObjectResponse<ClientMessage>>(url, null);
  }

  public async sendMessageToUser(userKey: string, command: ClientMessageCommand): Promise<AxiosObjectResponse<ClientMessage>> {
    const url = `${baseUri}/user/${userKey}`;

    return this.post<ClientMessageCommand, ObjectResponse<ClientMessage>>(url, command);
  }

  public async replyToMessage(threadKey: string, command: ClientMessageCommand): Promise<AxiosObjectResponse<ClientMessage>> {
    const url = `${baseUri}/thread/${threadKey}`;

    return this.post<ClientMessageCommand, ObjectResponse<ClientMessage>>(url, command);
  }

  public async countUnassignedMessages(): Promise<AxiosObjectResponse<number>> {
    const url = `${baseUri}/helpdesk/inbox/count`;

    return this.get<ObjectResponse<number>>(url);
  }

  public async countNewMessages(): Promise<AxiosObjectResponse<number>> {
    const url = `${baseUri}/user/inbox/count`;

    return this.get<ObjectResponse<number>>(url);
  }

}
