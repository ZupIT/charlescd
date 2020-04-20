import { WorkspacePagination } from '../interfaces/WorkspacePagination';
import { Workspace } from '../interfaces/Workspace';

export enum ACTION_TYPES {
  loadedWorkspaces = 'WORKSPACES/LOADED_WORKSPACES',
  loadedWorkspace = 'WORKSPACES/LOADED_WORKSPACE'
}

interface LoadedWorkspacesActionType {
  type: typeof ACTION_TYPES.loadedWorkspaces;
  payload: WorkspacePagination;
}

interface LoadedWorkspaceActionType {
  type: typeof ACTION_TYPES.loadedWorkspace;
  payload: Workspace;
}

export const loadedWorkspacesAction = (
  payload: WorkspacePagination
): WorkspacesActionTypes => ({
  type: ACTION_TYPES.loadedWorkspaces,
  payload
});

export const loadedWorkspaceAction = (
  payload: Workspace
): WorkspacesActionTypes => ({
  type: ACTION_TYPES.loadedWorkspace,
  payload
});

export type WorkspacesActionTypes =
  | LoadedWorkspacesActionType
  | LoadedWorkspaceActionType;
