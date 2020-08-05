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

import { Pagination } from 'core/interfaces/Pagination';

export interface CirclesMetricData {
  circleStats: Stats;
  averageLifeTime: number;
  history: CircleHistory[];
}

export interface Stats {
  active: number;
  inactive: number;
}

export type CirclesHistoryResponse = Pagination<CircleHistory>;

export interface CircleHistory {
  id: string;
  status: 'ACTIVE' | 'INACTIVE';
  name: string;
  lifeTime: number;
  lastUpdatedAt: string;
}

export type CircleReleasesResponse = Pagination<CircleRelease>;

export interface CircleRelease {
  id: string;
  tag: string;
  deployedAt: string;
  undeployedAt: string;
  authorName: string;
  createdAt: string;
  components: ReleaseComponent[];
  status: string;
}

export interface ReleaseComponent {
  name: string;
  moduleName: string;
  version: string;
}
