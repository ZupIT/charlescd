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

import { getWorkspaceId } from 'core/utils/workspace';
import { isRoot } from 'core/utils/auth';
import {
  rootMainMenu,
  rootWorkspaceMenu,
  mainMenu,
  workspaceMenu
} from '../constants';

export const getExpandIcon = (expand: boolean) =>
  expand ? 'menu-expanded' : 'menu';

export const getItems = () => {
  if (getWorkspaceId()) {
    return isRoot() ? rootWorkspaceMenu : workspaceMenu;
  } else {
    return isRoot() ? rootMainMenu : mainMenu;
  }
};
