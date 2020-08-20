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

import { baseRequest } from './base';
// import { groupMetric } from 'modules/Circles/Comparation/Item/GroupMetrics/interface';

const endpoint = '/compass/api/v1';

// export const create = (payload: groupMetric) =>
//   postRequest(`${endpoint}/?`, payload);

export const getAllMetricsGroupsById = (circleId: string) =>
  baseRequest(`${endpoint}/circles/${circleId}/metrics-groups`);
