import { CircleState } from 'modules/Circles/interfaces/CircleState';
import { WorkspaceState } from 'modules/Settings/Workspaces/interfaces/WorkspaceState';
import { UserState } from 'modules/Users/interfaces/UserState';

export interface State {
  circles: CircleState;
  workspaces: WorkspaceState;
  users: UserState;
}
