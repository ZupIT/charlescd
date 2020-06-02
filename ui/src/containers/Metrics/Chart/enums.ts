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

export enum METRICS_TYPE {
  REQUESTS_BY_CIRCLE = 'REQUESTS_BY_CIRCLE',
  REQUESTS_ERRORS_BY_CIRCLE = 'REQUESTS_ERRORS_BY_CIRCLE',
  REQUESTS_LATENCY_BY_CIRCLE = 'REQUESTS_LATENCY_BY_CIRCLE'
}

export enum METRICS_SPEED {
  SLOW_TIME = 300000,
  FAST_TIME = 10000
}

export enum CHART_TYPE {
  COMPARISON = 'COMPARISON',
  NORMAL = 'NORMAL'
}

export enum PROJECTION_TYPE {
  FIVE_MINUTES = 'FIVE_MINUTES',
  THIRTY_MINUTES = 'THIRTY_MINUTES',
  ONE_HOUR = 'ONE_HOUR',
  THREE_HOUR = 'THREE_HOUR',
  EIGHT_HOUR = 'EIGHT_HOUR'
}
