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

export const addParamWorkspace = (history: History, WorkspaceId: string) => {
  const query = getQueryStrings();
  query.append('workspace', WorkspaceId);

  history.push({
    pathname: routes.workspacesComparation,
    search: query.toString()
  });
};

export const delParamWorkspace = (history: History, workspaceId: string) => {
  const query = getQueryStrings();
  const workspaces = query.getAll('workspace');
  const remaineds = without(workspaces, workspaceId);
  const params = new URLSearchParams();
  map(remaineds, id => params.append('workspace', id));

  history.push({
    pathname: routes.workspacesComparation,
    search: params.toString()
  });
};
