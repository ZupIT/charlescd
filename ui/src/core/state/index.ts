/*
 * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { combineReducer } from './helpers';
import { State } from './interfaces/State';
import {
  circlesReducer,
  circlesInitialState
} from 'modules/Circles/state/reducer';
import {
  workspaceReducer,
  workspaceInitialState
} from 'modules/Settings/state/reducer';
import { userReducer, userInitialState } from 'modules/Users/state/reducer';
import {
  notificationReducer,
  notificationInitialState
} from 'core/components/Notification/state/reducer';
import {
  userGroupReducer,
  userGroupInitialState
} from 'modules/Groups/state/reducer';
import {
  modulesReducer,
  modulesInitialState
} from 'modules/Modules/state/reducer';
import {
  hypothesesReducer,
  hypothesisInitialState
} from 'modules/Hypotheses/state/reducer';
import { CirclesActionTypes } from 'modules/Circles/state/actions';
import { WorkspacesActionTypes } from 'modules/Settings/state/actions';
import { UsersActionTypes } from 'modules/Users/state/actions';
import { NotificationActionTypes } from 'core/components/Notification/state/actions';
import { Reducer } from './interfaces/Reducer';
import { UserGroupsActionTypes } from 'modules/Groups/state/actions';
import { ModulesActionTypes } from 'modules/Modules/state/actions';
import { HypothesesActionTypes } from 'modules/Hypotheses/state/actions';

export type RootActionTypes =
  | CirclesActionTypes
  | WorkspacesActionTypes
  | UsersActionTypes
  | NotificationActionTypes
  | UserGroupsActionTypes
  | ModulesActionTypes
  | HypothesesActionTypes;

export const rootState: State = {
  circles: circlesInitialState,
  workspaces: workspaceInitialState,
  users: userInitialState,
  notification: notificationInitialState,
  userGroups: userGroupInitialState,
  modules: modulesInitialState,
  hypothesis: hypothesisInitialState
};

export const reducers: Reducer = {
  circles: circlesReducer,
  workspaces: workspaceReducer,
  users: userReducer,
  notification: notificationReducer,
  userGroups: userGroupReducer,
  modules: modulesReducer,
  hypothesis: hypothesesReducer
};

export const rootReducer = combineReducer(reducers);
