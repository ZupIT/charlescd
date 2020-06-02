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

import { CirclePagination } from '../interfaces/CirclesPagination';
import { Circle } from '../interfaces/Circle';

export enum ACTION_TYPES {
  loadedCircles = 'CIRCLES/LOADED_CIRCLES',
  loadedCircle = 'CIRLCES/LOADED_CIRCLE',
  loadedCirclesMetrics = 'CIRCLE/LOADED_CIRCLES_METRICS',
  updateCircles = 'CIRCLES/UPDATE'
}

interface LoadedCirclesActionType {
  type: typeof ACTION_TYPES.loadedCircles;
  payload: CirclePagination;
}

interface LoadedCircleActionType {
  type: typeof ACTION_TYPES.loadedCircle;
  payload: Circle;
}

interface LoadedCirclesMetricsActionType {
  type: typeof ACTION_TYPES.loadedCirclesMetrics;
  payload: CirclePagination;
}

interface UpdateCirclesActionType {
  type: typeof ACTION_TYPES.updateCircles;
  payload: Circle[];
}

export const loadedCirclesAction = (
  payload: CirclePagination
): CirclesActionTypes => ({
  type: ACTION_TYPES.loadedCircles,
  payload
});

export const loadedCircleAction = (payload: Circle): CirclesActionTypes => ({
  type: ACTION_TYPES.loadedCircle,
  payload
});

export const loadedCirclesMetricsAction = (
  payload: CirclePagination
): CirclesActionTypes => ({
  type: ACTION_TYPES.loadedCirclesMetrics,
  payload
});

export const updateCirclesAction = (
  payload: Circle[]
): UpdateCirclesActionType => ({
  type: ACTION_TYPES.updateCircles,
  payload
});

export type CirclesActionTypes =
  | LoadedCirclesActionType
  | LoadedCircleActionType
  | LoadedCirclesMetricsActionType
  | UpdateCirclesActionType;
