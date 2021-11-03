import { ThunkAction } from 'redux-thunk'

// Redux
import { RootState } from 'store';
import { EventActions } from './types';
import { searchInit, searchComplete, searchFailure, setSorting, setPager } from './actions';

// Services
import EventApi from 'service/event';

// Model
import { PageRequest, Sorting, PageResult } from 'model/response';
import { EnumEventSortField, Event } from 'model/event';

// Helper thunk result type
type ThunkResult<R> = ThunkAction<Promise<R>, RootState, unknown, EventActions>;

export const find = (
  pageRequest?: PageRequest, sorting?: Sorting<EnumEventSortField>[]
): ThunkResult<PageResult<Event> | null> => async (dispatch, getState) => {
  // Get query form state (filters are always set synchronously)
  const query = getState().event.query;

  // Update sorting or use the existing value
  if (sorting) {
    dispatch(setSorting(sorting));
  } else {
    sorting = getState().event.sorting;
  }

  // Update page or user the existing value (i.e. data page refresh)
  if (pageRequest) {
    const { page, size } = pageRequest;

    dispatch(setPager(page, size));
  } else {
    pageRequest = getState().event.pagination
  }

  // Initialize search
  dispatch(searchInit());

  // Get response
  const api = new EventApi();

  const response = await api.find(query, pageRequest, sorting);

  // Update state
  if (response.data.success) {
    dispatch(searchComplete(response.data.result!));
    return response.data.result!;
  }

  dispatch(searchFailure());
  return null;
}
