import { Moment } from 'moment';

import { ObjectResponse, PageRequest, SimpleResponse, Sorting } from 'model/response';
import { ClientContact } from 'model/chat';
import {
  EnumMasterContractSortField,
  MasterContract,
  MasterContractHistory,
  MasterContractHistoryResult,
  MasterContractQuery,
  MasterContractViewModel,
} from 'model/contract';

import { LogoutInitAction } from 'store/security/types';

// State
export interface ContractManagerState {
  contract: MasterContract | null;
  contractViewModel: MasterContractViewModel | null;
  contractId: number | null;
  contractProvider: ClientContact | null;
  contractProviderDialog: boolean,
  lastUpdated: Moment | null;
  loading: boolean;
  pagination: PageRequest;
  providers: {
    query: string;
    selected: ClientContact | null;
    result: ClientContact[];
  },
  query: MasterContractQuery;
  response: ObjectResponse<MasterContract> | null;
  result: MasterContractHistoryResult | null;
  selected: MasterContractHistory[];
  sorting: Sorting<EnumMasterContractSortField>[];
  state: string | null;
}

// Actions
export const SET_PAGER = 'contract/explorer/SET_PAGER';
export const RESET_PAGER = 'contract/explorer/RESET_PAGER';

export const SET_SORTING = 'contract/explorer/SET_SORTING';

export const SET_FILTER = 'contract/explorer/SET_FILTER';
export const RESET_FILTER = 'contract/explorer/RESET_FILTER';

export const SEARCH_INIT = 'contract/explorer/SEARCH_INIT';
export const SEARCH_FAILURE = 'contract/explorer/SEARCH_FAILURE';
export const SEARCH_SUCCESS = 'contract/explorer/SEARCH_COMPLETE';

export const CREATE_DRAFT = 'contract/explorer/CREATE_DRAFT';

export const LOAD_INIT = 'contract/explorer/LOAD_INIT';
export const LOAD_FAILURE = 'contract/explorer/LOAD_FAILURE';
export const LOAD_SUCCESS = 'contract/explorer/LOAD_SUCCESS';

export const MODIFY_CONTRACT = 'contract/explorer/MODIFY_CONTRACT';

export const SAVE_INIT = 'contract/explorer/SAVE_INIT';
export const SAVE_COMPLETE = 'contract/explorer/SAVE_COMPLETE';

export const ADD_SELECTED = 'contract/explorer/ADD_SELECTED';
export const REMOVE_SELECTED = 'contract/explorer/REMOVE_SELECTED';
export const RESET_SELECTED = 'contract/explorer/RESET_SELECTED';

export const TOGGLE_PROVIDER_DIALOG = 'contract/create/TOGGLE_PROVIDER_DIALOG';
export const GET_PROVIDERS_INIT = 'contract/create/GET_PROVIDERS_INIT';
export const GET_PROVIDERS_COMPLETE = 'contract/create/GET_PROVIDERS_COMPLETE';
export const SET_PROVIDER = 'contract/create/SET_PROVIDER';

export interface SetPagerAction {
  type: typeof SET_PAGER;
  page: number;
  size: number;
}

export interface ResetPagerAction {
  type: typeof RESET_PAGER
}

export interface SetSortingAction {
  type: typeof SET_SORTING;
  sorting: Sorting<EnumMasterContractSortField>[];
}

export interface SetFilterAction {
  type: typeof SET_FILTER;
  query: Partial<MasterContractQuery>;
}

export interface ResetFilterAction {
  type: typeof RESET_FILTER;
}

export interface SearchInitAction {
  type: typeof SEARCH_INIT;
}

export interface SearchFailureAction {
  type: typeof SEARCH_FAILURE;
  response: SimpleResponse;
}

export interface SearchSuccessAction {
  type: typeof SEARCH_SUCCESS;
  result: MasterContractHistoryResult;
}

export interface CreateDraftAction {
  type: typeof CREATE_DRAFT;
}

export interface LoadInitAction {
  type: typeof LOAD_INIT;
}

export interface LoadFailureAction {
  type: typeof LOAD_FAILURE;
  response: SimpleResponse;
}

export interface LoadSuccessAction {
  type: typeof LOAD_SUCCESS;
  contract: MasterContract;
}

export interface ModifyContractAction {
  type: typeof MODIFY_CONTRACT;
  contractViewModel: Partial<MasterContractViewModel>;
}

export interface SaveInitAction {
  type: typeof SAVE_INIT;
}

export interface SaveCompleteAction {
  type: typeof SAVE_COMPLETE;
  response: ObjectResponse<MasterContract>;
}

export interface SetSelectedAction {
  type: typeof ADD_SELECTED;
  selected: MasterContractHistory[];
}

export interface RemoveFromSelectionAction {
  type: typeof REMOVE_SELECTED;
  removed: MasterContractHistory[];
}

export interface ResetSelectionAction {
  type: typeof RESET_SELECTED;
}

export interface ToggleProviderDialog {
  type: typeof TOGGLE_PROVIDER_DIALOG;
}

export interface GetProvidersInitAction {
  type: typeof GET_PROVIDERS_INIT;
}

export interface GetProvidersCompleteAction {
  type: typeof GET_PROVIDERS_COMPLETE;
  providers: ClientContact[];
}

export interface SetProviderAction {
  type: typeof SET_PROVIDER;
  provider: ClientContact | null;
}

export type ContractActions =
  | LogoutInitAction
  | SetPagerAction
  | ResetPagerAction
  | SetSortingAction
  | SetFilterAction
  | ResetFilterAction
  | SearchInitAction
  | SearchFailureAction
  | SearchSuccessAction
  | CreateDraftAction
  | LoadInitAction
  | LoadFailureAction
  | LoadSuccessAction
  | ModifyContractAction
  | SetSelectedAction
  | RemoveFromSelectionAction
  | ResetSelectionAction
  | SaveInitAction
  | SaveCompleteAction
  | ToggleProviderDialog
  | GetProvidersInitAction
  | GetProvidersCompleteAction
  | SetProviderAction
  ;
