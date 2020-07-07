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

export interface CirclesMetricData {
  circleStats: Stats;
  averageCircleLifeTime: number;
  history: History[];
}

export interface Stats {
  active: number;
  inactive: number;
}

export interface History {
  id: string;
  circleStatus: string;
  name: string;
  lifeTime: number;
  lastUpdate: string;
}

export interface CircleRelease {
  id: string;
  name: string;
  deployed: string;
  undeployed: string;
  lastEditor: string;
  components: ReleaseComponent[];
}

export interface ReleaseComponent {
  id: string;
  moduleName: string;
  componentName: string;
  version: string;
}
