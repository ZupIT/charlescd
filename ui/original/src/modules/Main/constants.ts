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

export type MenuType = {
  id: string,
  icon: string,
  text: string,
  to: string,
  action?: string,
  subject?: string
};

export const workspaceMenu: MenuType[] = [
  {
    id: genMenuId(routes.circles),
    icon: 'circles',
    text: 'Circles',
    to: routes.circles,
    action: 'read',
    subject: 'circles'
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
    subject: 'circles'
  },
  {
    id: genMenuId(routes.settings),
    icon: 'settings',
    text: 'Settings',
    to: routes.credentials,
    action: 'write',
    subject: 'maintenance'
  }
];

export const mainMenu: MenuType[] = [
  {
    id: genMenuId(routes.workspaces),
    icon: 'workspaces',
    text: 'Workspaces',
    to: routes.workspaces
  },
  {
    id: genMenuId(routes.accountProfile),
    icon: 'account',
    text: 'Account',
    to: routes.accountProfile
  }
];

export const rootMainMenu: MenuType[] = [
  {
    id: genMenuId(routes.workspaces),
    icon: 'workspace',
    text: 'Workspaces',
    to: routes.workspaces
  },
  {
    id: genMenuId(routes.tokens),
    icon: 'token',
    text: 'Access tokens',
    to: routes.tokens
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
    id: genMenuId(routes.accountProfile),
    icon: 'account',
    text: 'Account',
    to: routes.accountProfile
  }
];
