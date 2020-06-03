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

import without from 'lodash/without';
import { History } from 'history';
import map from 'lodash/map';
import routes from 'core/constants/routes';
import getQueryStrings from 'core/utils/query';
import includes from 'lodash/includes';
import reverse from 'lodash/reverse';

const paramName = 'usergroup';

export const getSelectedUserGroups = () => {
  const query = getQueryStrings();

  return reverse(query.getAll(paramName));
};

export const delParamUserGroup = (history: History, usergroupId: string) => {
  const query = getQueryStrings();
  const userGroups = query.getAll(paramName);
  const remaineds = without(userGroups, usergroupId);
  const params = new URLSearchParams();

  map(remaineds, id => params.append(paramName, id));

  history.push({
    pathname: routes.groupsShow,
    search: params.toString()
  });
};

export const addParamUserGroup = (history: History, usergroupId: string) => {
  if (includes(getSelectedUserGroups(), usergroupId)) {
    delParamUserGroup(history, usergroupId);
    return;
  }

  const query = getQueryStrings();
  query.append(paramName, usergroupId);

  history.push({
    pathname: routes.groupsShow,
    search: query.toString()
  });
};
