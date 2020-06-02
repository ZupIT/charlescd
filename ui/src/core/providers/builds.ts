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

import { ModuleForm } from 'modules/Circles/Release/interfaces/Module';
import { FilterBuild } from 'modules/Circles/Release/interfaces/Build';
import { postRequest, baseRequest } from './base';

const endpoint = '/moove/v2/builds';

export const composeBuild = (data: ModuleForm) =>
  postRequest(`${endpoint}/compose`, data);

export const findBuilds = (data: FilterBuild) => {
  const params = data ? `?tagName=${data?.tagName}` : '';
  return baseRequest(`${endpoint}${params}`);
};
