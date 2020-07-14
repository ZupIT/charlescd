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

import indexOf from 'lodash/indexOf';
import isEmpty from 'lodash/isEmpty';
import { METRICS_TYPE } from 'containers/Metrics/Chart/enums';
import routes from 'core/constants/routes';
import { generatePathV1 } from 'core/utils/path';
import { DEPLOYMENT_STATUS } from 'core/enums/DeploymentStatus';
import { Circle } from 'modules/Circles/interfaces/Circle';
import { URL_PATH_POSITION, DEFAULT_CIRCLE } from './constants';

export type ChangeType = 'INCREASE' | 'DECREASE';

export const pathCircleEditById = (id: string) =>
  generatePathV1(routes.circlesEdit, { circleId: id });

export const pathCircleById = (id: string) => {
  const path = window.location.href.split('?')[URL_PATH_POSITION];
  return `${path}?circle=${id}`;
};

export const isDefaultCircle = (name: string) => name === DEFAULT_CIRCLE;

export const isDeploying = (status: DEPLOYMENT_STATUS) =>
  DEPLOYMENT_STATUS.deploying === status;

export const isUndeploying = (status: DEPLOYMENT_STATUS) =>
  DEPLOYMENT_STATUS.undeploying === status;

export const isBusy = (status: DEPLOYMENT_STATUS) =>
  isDeploying(status) || isUndeploying(status);

export const hasDeploy = (circle: Circle) => !isEmpty(circle?.deployment);

export const isUndeployable = (circle: Circle) =>
  hasDeploy(circle) &&
  !isDefaultCircle(circle?.name) &&
  !isBusy(circle?.deployment?.status);

export const validateChangeMetricTypes = (index: number) => {
  const BASE_INDEX = 0;
  const LAST_INDEX_ELEMENT = 1;
  const LAST_INDEX = Object.keys(METRICS_TYPE).length - LAST_INDEX_ELEMENT;

  if (index > LAST_INDEX) {
    return BASE_INDEX;
  }
  if (index < BASE_INDEX) {
    return LAST_INDEX;
  }

  return index;
};

export const getActiveMetric = (
  changeType: ChangeType,
  activeMetricType: METRICS_TYPE
) => {
  const COUNT = 1;
  const currentItemIndex = indexOf(Object.keys(METRICS_TYPE), activeMetricType);
  const computedIndex =
    changeType === 'INCREASE'
      ? currentItemIndex + COUNT
      : currentItemIndex - COUNT;
  const currentIndex = validateChangeMetricTypes(computedIndex);

  return Object.keys(METRICS_TYPE)[currentIndex] as METRICS_TYPE;
};

export const getActiveMetricDescription = (activeMetricType: METRICS_TYPE) => {
  return {
    [METRICS_TYPE.REQUESTS_BY_CIRCLE]: 'Request',
    [METRICS_TYPE.REQUESTS_ERRORS_BY_CIRCLE]: 'Errors',
    [METRICS_TYPE.REQUESTS_LATENCY_BY_CIRCLE]: 'Latency'
  }[activeMetricType];
};
