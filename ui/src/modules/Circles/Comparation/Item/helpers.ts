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

import isEmpty from 'lodash/isEmpty';
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

export const getTooltipMessage = (circle: Circle): string => {
  const cannotDeleteActiveCircleMessage =
    'Active circle cannot be deleted,<br />you can undeploy first and then<br /> delete this circle.';
  const cannotDeleteDefaultCircleMessage =
    'Default circle is deployed to all<br /> users, so it cannot be deleted.';
  const cannotDeleteInactiveDefaultCircleMessage =
    'Default circle cannot be deleted.';
  let tooltipMessage = '';

  if (isDefaultCircle(circle?.name) && !hasDeploy(circle)) {
    tooltipMessage = cannotDeleteInactiveDefaultCircleMessage;
  } else if (isDefaultCircle(circle?.name) && hasDeploy(circle)) {
    tooltipMessage = cannotDeleteDefaultCircleMessage;
  } else {
    tooltipMessage = cannotDeleteActiveCircleMessage;
  }
  return tooltipMessage;
};

export const circleCannotBeDeleted = (circle: Circle): boolean => {
  return isUndeployable(circle) || isDefaultCircle(circle?.name);
};
