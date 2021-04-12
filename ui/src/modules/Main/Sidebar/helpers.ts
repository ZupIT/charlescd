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

import {
  rootMainMenu,
  mainMenu,
  workspaceMenu,
  MenuType
} from '../constants';
import find from 'lodash/find';
import forEach from 'lodash/forEach';
import { isRoot } from 'core/utils/auth';

export const getExpandIcon = (expand: boolean) =>
  expand ? 'menu-expanded' : 'menu';

export const getItems = () => {
  const [,path] = window.location.pathname.split('/');
  let currentMenu: MenuType[] = [];
  const menus = isRoot() ? [workspaceMenu, rootMainMenu] : [workspaceMenu, mainMenu];

  forEach(menus, (menu) => {
    find(menu, ({to}) => {
      if(to.includes(`/${path}`)) {
        currentMenu = menu;
      }
    })
  });

  return currentMenu;
};
