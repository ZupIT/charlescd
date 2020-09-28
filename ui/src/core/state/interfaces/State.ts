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
import { WorkspaceState } from 'modules/Workspaces/interfaces/WorkspaceState';
import { UserState } from 'modules/Users/interfaces/UserState';
import { NotificationState } from 'core/components/Notification/interfaces/NotificationState';
import { UserGroupState } from 'modules/Groups/interfaces/UserGroupState';
import { ModuleState } from 'modules/Modules/interfaces/ModuleState';
import { HypothesesState } from 'modules/Hypotheses/interfaces';

export interface State {
  circles: CircleState;
  workspaces: WorkspaceState;
  users: UserState;
  notification: NotificationState;
  userGroups: UserGroupState;
  modules: ModuleState;
  hypothesis: HypothesesState;
}
