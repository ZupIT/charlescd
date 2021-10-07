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
// @ts-nocheck

import { UserGroup } from 'modules/Groups/interfaces/UserGroups';
import { GitProviders } from 'modules/Settings/Credentials/Sections/DeploymentConfiguration/interfaces';
import { Webhook } from 'modules/Settings/Credentials/Sections/Webhook/interfaces';
export interface Workspace {
  id: string;
  name: string;
  status?: string;
  createdAt?: string;
  circleMatcherUrl?: string;
  gitConfiguration?: Configuration;
  userGroups?: UserGroup[];
  deploymentConfiguration?: DeploymentConfiguration;
  metricConfiguration?: MetricConfiguration;
  registryConfiguration?: Configuration;
  permissions?: string[];
  webhookConfiguration?: Webhook[];
}
export interface Configuration {
  id: string;
  name: string;
}
export interface DeploymentConfiguration extends Configuration {
  gitProvider: GitProviders;
}
export interface MetricConfiguration {
  id: string;
  provider: string;
}