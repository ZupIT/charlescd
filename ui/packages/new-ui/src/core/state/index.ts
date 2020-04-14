import { combineReducer } from './helpers';
import { State } from './interfaces/State';
import {
  circlesReducer,
  circlesInitialState
} from 'modules/Circles/state/reducer';
import {
  workspaceReducer,
  workspaceInitialState
} from 'modules/Settings/Workspaces/state/reducer';
import { userReducer, userInitialState } from 'modules/Users/state/reducer';
import { CirclesActionTypes } from 'modules/Circles/state/actions';
import { WorkspacesActionTypes } from 'modules/Settings/Workspaces/state/actions';
import { UsersActionTypes } from 'modules/Users/state/actions';
import { Reducer } from './interfaces/Reducer';

export type RootActionTypes =
  | CirclesActionTypes
  | WorkspacesActionTypes
  | UsersActionTypes;

export const rootState: State = {
  circles: circlesInitialState,
  workspaces: workspaceInitialState,
  users: userInitialState
};

export const reducers: Reducer = {
  circles: circlesReducer,
  workspaces: workspaceReducer,
  users: userReducer
};

export const rootReducer = combineReducer(reducers);
