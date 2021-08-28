import { Moment } from 'moment';
import { ObjectResponse, PageResult } from 'model/response';

export enum EnumMessageType {
  UNDEFINED = 'UNDEFINED',
  MESSAGE = 'MESSAGE',
  NOTIFICATION = 'NOTIFICATION',
}

export enum EnumMessageSortField {
  DATE_RECEIVED = 'DATE_RECEIVED',
  RECIPIENT = 'RECIPIENT',
  SENDER = 'RECIPIENT',
}

export interface MessageQuery {
  dateFrom: Moment;
  dateTo: Moment;
  read: boolean;
}

export interface ClientContact {
  id: string;
  logoImage: string;
  logoImageMimeType: string;
  name: string;
}

export interface ClientMessageCommand {
  text: string;
}

interface ClientBaseMessage {
  createdAt: Moment;
  id: string;
  read: boolean;
  readAt: Moment | null;
  text: string;
  type: EnumMessageType;
}

export interface ClientMessage extends ClientBaseMessage {
  recipientId: string | null;
  recipient?: ClientContact | null;
  reply: string | null;
  senderId: string;
  sender?: ClientContact | null;
  thread: string;
}

export enum EnumNotificationType {
  CATALOGUE_ASSET_UNPUBLISHED = 'CATALOGUE_ASSET_UNPUBLISHED',
  CATALOGUE_HARVEST_COMPLETED = 'CATALOGUE_HARVEST_COMPLETED',
}

export interface ClientNotification extends ClientBaseMessage {
  eventType: EnumNotificationType;
  data: { [key: string]: string };
  recipientId: string | null;
  recipient?: ClientContact | null;
  senderId: string | null;
  sender?: ClientContact | null;
}

export interface ClientMessageThreadResponse extends ObjectResponse<ClientMessage[]> {
  contacts: { [key: string]: ClientContact };
}

export interface ClientMessageCollectionResponse extends ObjectResponse<PageResult<ClientMessage>> {
  contacts: { [key: string]: ClientContact };
}
