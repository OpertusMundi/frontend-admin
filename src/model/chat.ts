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

export enum EnumMessageView {
  ALL = 'ALL',
  UNREAD = 'UNREAD',
  THREAD_ONLY = 'THREAD_ONLY',
  THREAD_ONLY_UNREAD = 'THREAD_ONLY_UNREAD',
}

export interface MessageQuery {
  contact: string | null;
  dateFrom: Moment;
  dateTo: Moment;
  view: EnumMessageView;
}

export interface ClientContact {
  id: string;
  logoImage: string | null;
  logoImageMimeType: string | null;
  name: string;
  email: string;
}

export interface ClientMessageCommand {
  subject: string;
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
  subject: string | null;
  thread: string;
  threadCount?: number;
  threadCountUnread?: number;
}

export interface ClientMessageThread {
  count: number;
  key: string;
  messages: ClientMessage[];
  modifiedAt: Moment;
  owner: string;
  subject: string;
  text: string;
  unread: number;
}

export interface ClientMessageThreadResponse extends ObjectResponse<ClientMessageThread> {
  contacts: { [key: string]: ClientContact };
}

export interface ClientMessageCollectionResponse extends ObjectResponse<PageResult<ClientMessage>> {
  contacts: { [key: string]: ClientContact };
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
