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

import routes from 'core/constants/routes';
import { genMenuId } from 'core/utils/menu';

export const workspaceMenu = [
  {
    id: genMenuId(routes.circles),
    icon: 'circles',
    text: 'Circles',
    to: routes.circles,
    action: 'read',
    subject: 'circles'
  },
  {
    id: genMenuId(routes.hypotheses),
    icon: 'hypotheses',
    text: 'Hypotheses',
    to: routes.hypotheses,
    action: 'read',
    subject: 'hypothesis'
  },
  {
    id: genMenuId(routes.modules),
    icon: 'modules',
    text: 'Modules',
    to: routes.modules,
    action: 'read',
    subject: 'modules'
  },
  {
    id: genMenuId(routes.metrics),
    icon: 'metrics',
    text: 'Metrics',
    to: routes.metrics,
    action: 'read',
    subject: 'metrics'
  },
  {
    id: genMenuId(routes.settings),
    icon: 'settings',
    text: 'Settings',
    to: routes.settings,
    action: 'write',
    subject: 'maintenance'
  }
];

export const mainMenu = [
  {
    id: genMenuId(routes.workspaces),
    icon: 'workspaces',
    text: 'Workspaces',
    to: routes.workspaces
  },
  {
    id: genMenuId(routes.account),
    icon: 'account',
    text: 'Account',
    to: routes.account
  }
];

export const rootWorkspaceMenu = [
  {
    id: genMenuId(routes.circles),
    icon: 'circles',
    text: 'Circles',
    to: routes.circles,
    action: 'read',
    subject: 'circles'
  },
  {
    id: genMenuId(routes.hypotheses),
    icon: 'hypotheses',
    text: 'Hypotheses',
    to: routes.hypotheses,
    action: 'read',
    subject: 'hypothesis'
  },
  {
    id: genMenuId(routes.modules),
    icon: 'modules',
    text: 'Modules',
    to: routes.modules,
    action: 'read',
    subject: 'modules'
  },
  {
    id: genMenuId(routes.metrics),
    icon: 'metrics',
    text: 'Metrics',
    to: routes.metrics,
    action: 'write',
    subject: 'maintenance'
  },
  {
    id: genMenuId(routes.settings),
    icon: 'settings',
    text: 'Settings',
    to: routes.settings,
    action: 'write',
    subject: 'maintenance'
  }
];

export const rootMainMenu = [
  {
    id: genMenuId(routes.workspaces),
    icon: 'workspace',
    text: 'Workspaces',
    to: routes.workspaces
  },
  {
    id: genMenuId(routes.users),
    icon: 'user',
    text: 'Users',
    to: routes.users
  },
  {
    id: genMenuId(routes.groups),
    icon: 'users',
    text: 'User Group',
    to: routes.groups
  },
  {
    id: genMenuId(routes.account),
    icon: 'account',
    text: 'Account',
    to: routes.account
  }
];
