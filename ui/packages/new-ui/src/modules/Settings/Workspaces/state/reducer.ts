import { WorkspacesActionTypes, ACTION_TYPES } from './actions';
import { WorkspacePagination } from '../interfaces/WorkspacePagination';
import { WorkspaceState } from '../interfaces/WorkspaceState';

const initialListState: WorkspacePagination = {
  content: [],
  page: 0,
  size: 0,
  totalPages: 0,
  last: false
};

export const workspaceInitialState: WorkspaceState = {
  list: initialListState,
  item: null
};

export const workspaceReducer = (
  state = workspaceInitialState,
  action: WorkspacesActionTypes
): WorkspaceState => {
  switch (action.type) {
    case ACTION_TYPES.loadedWorkspaces: {
      return {
        ...state,
        list: action.payload
      };
    }
    case ACTION_TYPES.loadedWorkspace: {
      return {
        ...state,
        item: action.payload
      };
    }
    default: {
      return state;
    }
  }
};
