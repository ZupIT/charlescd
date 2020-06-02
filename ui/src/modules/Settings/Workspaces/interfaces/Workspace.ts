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

import { MetricConfiguration } from 'modules/Workspaces/interfaces/Workspace';
import { UserGroup } from 'modules/Groups/interfaces/UserGroups';

export interface Workspace {
  id: string;
  name: string;
  status?: string;
  authorId: string;
  createdAt: string;
  circleMatcherUrl?: string;
  gitConfiguration?: Configuration;
  userGroups?: UserGroup[];
  cdConfiguration?: Configuration;
  metricConfiguration?: MetricConfiguration;
  registryConfiguration?: Configuration;
}

export interface Configuration {
  id: string;
  name: string;
}
