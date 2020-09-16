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

import { CircleState } from 'modules/Circles/interfaces/CircleState';
import { CirclesActionTypes } from 'modules/Circles/state/actions';
import { WorkspaceState } from 'modules/Workspaces/interfaces/WorkspaceState';
import { WorkspacesActionTypes } from 'modules/Workspaces/state/actions';
import { UserState } from 'modules/Users/interfaces/UserState';
import { UsersActionTypes } from 'modules/Users/state/actions';
import { NotificationState } from 'core/components/Notification/interfaces/NotificationState';
import { NotificationActionTypes } from 'core/components/Notification/state/actions';
import { UserGroupState } from 'modules/Groups/interfaces/UserGroupState';
import { UserGroupsActionTypes } from 'modules/Groups/state/actions';
import { ModuleState } from 'modules/Modules/interfaces/ModuleState';
import { ModulesActionTypes } from 'modules/Modules/state/actions';
import { HypothesesState } from 'modules/Hypotheses/interfaces';
import { HypothesesActionTypes } from 'modules/Hypotheses/state/actions';

export interface Reducer {
  circles: (state: CircleState, action: CirclesActionTypes) => CircleState;
  workspaces: (
    state: WorkspaceState,
    action: WorkspacesActionTypes
  ) => WorkspaceState;
  users: (state: UserState, action: UsersActionTypes) => UserState;
  notification: (
    state: NotificationState,
    action: NotificationActionTypes
  ) => NotificationState;
  userGroups: (
    state: UserGroupState,
    action: UserGroupsActionTypes
  ) => UserGroupState;
  modules: (state: ModuleState, action: ModulesActionTypes) => ModuleState;
  hypothesis: (
    state: HypothesesState,
    action: HypothesesActionTypes
  ) => HypothesesState;
}
