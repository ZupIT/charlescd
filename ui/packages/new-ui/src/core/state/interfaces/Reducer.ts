import { CircleState } from 'modules/Circles/interfaces/CircleState';
import { CirclesActionTypes } from 'modules/Circles/state/actions';
import { WorkspaceState } from 'modules/Settings/Workspaces/interfaces/WorkspaceState';
import { WorkspacesActionTypes } from 'modules/Settings/Workspaces/state/actions';
import { UserState } from 'modules/Users/interfaces/UserState';
import { UsersActionTypes } from 'modules/Users/state/actions';

export interface Reducer {
  circles: (state: CircleState, action: CirclesActionTypes) => CircleState;
  workspaces: (
    state: WorkspaceState,
    action: WorkspacesActionTypes
  ) => WorkspaceState;
  users: (state: UserState, action: UsersActionTypes) => UserState;
}
