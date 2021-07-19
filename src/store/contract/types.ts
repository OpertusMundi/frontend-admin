import { Moment } from 'moment';

import { LogoutInitAction } from 'store/security/types';
import { PageResult, PageRequest, Sorting, ObjectResponse, SimpleResponse } from 'model/response';
import { MasterContract, MasterContractQuery, EnumMasterContractSortField, MasterContractHistory } from 'model/contract';

// State
export interface ContractManagerState {
  loading: boolean;
  lastUpdated: Moment | null;
  pagination: PageRequest;
  query: MasterContractQuery;
  result: PageResult<MasterContractHistory> | null;
  selected: MasterContractHistory[];
  sorting: Sorting<EnumMasterContractSortField>[];
  response: ObjectResponse<MasterContract> | null;
  contract: MasterContract | null;
  contractId: number | null;
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
export const SEARCH_COMPLETE = 'contract/explorer/SEARCH_COMPLETE';

export const SAVE_INIT = 'contract/explorer/SAVE_INIT';
export const SAVE_COMPLETE = 'contract/explorer/SAVE_COMPLETE';

export const ADD_SELECTED = 'contract/explorer/ADD_SELECTED';
export const REMOVE_SELECTED = 'contract/explorer/REMOVE_SELECTED';
export const RESET_SELECTED = 'contract/explorer/RESET_SELECTED';

export const SET_SELECTED_CONTRACT = 'contract/create/SET_SELECTED_CONTRACT';
export const SET_SELECTED_CONTRACT_STATE = 'contract/create/SET_SELECTED_CONTRACT_STATE';
export const SET_MODIFIED_CONTRACT = 'contract/create/SET_MODIFIED_CONTRACT';

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

export interface SearchCompleteAction {
  type: typeof SEARCH_COMPLETE;
  result: PageResult<MasterContractHistory>;
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

export interface SetSelectedContractAction {
  type: typeof SET_SELECTED_CONTRACT;
  contract: MasterContractHistory | null;
}

export interface SetSelectedContractStateAction {
  type: typeof SET_SELECTED_CONTRACT_STATE;
  state: string | null;
}

export interface SetModifiedContractAction {
  type: typeof SET_MODIFIED_CONTRACT;
  contract: MasterContract;
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
  | SearchCompleteAction
  | SetSelectedAction
  | RemoveFromSelectionAction
  | ResetSelectionAction
  | SaveInitAction
  | SaveCompleteAction
  | SetSelectedContractAction
  | SetSelectedContractStateAction
  | SetModifiedContractAction
  ;
