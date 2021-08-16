import { ThunkAction } from 'redux-thunk'

// Redux
import { RootState } from 'store';
import { ContractActions } from './types';
import { searchInit, searchComplete, searchFailure, setSorting, setPager } from './actions';

// Services
import ContractApi from 'service/contract';

// Model
import { PageRequest, Sorting, PageResult, ObjectResponse } from 'model/response';
import { EnumMasterContractSortField, MasterContractHistory } from 'model/contract';

// Helper thunk result type
type ThunkResult<R> = ThunkAction<Promise<R>, RootState, unknown, ContractActions>;

export const find = (
  pageRequest?: PageRequest, sorting?: Sorting<EnumMasterContractSortField>[]
): ThunkResult<ObjectResponse<PageResult<MasterContractHistory>> | null> => async (dispatch, getState) => {
  // Get query from state (filters are always set synchronously)
  const query = getState().contract.query;

  // Update sorting or use the existing value
  if (sorting) {
    dispatch(setSorting(sorting));
  } else {
    sorting = getState().contract.sorting;
  }

  // Update page or use the existing value (i.e. data page refresh)
  if (pageRequest) {
    const { page, size } = pageRequest;

    dispatch(setPager(page, size));
  } else {
    pageRequest = getState().contract.pagination
  }

  // Initialize search
  dispatch(searchInit());

  // Get response
  const api = new ContractApi();

  const response = await api.findHistory(query, pageRequest, sorting);

  // Update state
  if (response.data.success) {
    dispatch(searchComplete(response.data.result!));
    return response.data;
  }

  dispatch(searchFailure(response.data));
  return null;
}
