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

import {
  isBusy, isDeploying, isUndeploying,
  circleCannotBeDeleted, hasDeploy, pathCircleById,
  isUndeployable, isDefaultCircle, getTooltipMessage
} from "../helpers"
import { DEPLOYMENT_STATUS } from 'core/enums/DeploymentStatus';
import { Circle, Deployment } from 'modules/Circles/interfaces/Circle';

const circle: Circle = {
  id: '123',
  name: 'Circle',
  author: null,
  createdAt: '2021-01-01',
  rules: null,
  deployment: null
}

const deployment: Deployment = {
  id: '456',
  status: DEPLOYMENT_STATUS.deployed,
  tag: '',
  deployedAt: '2021-01-01',
  artifacts: [{
    id: '789',
    artifact: 'artifact',
    version: '1',
    componentName: 'component',
    moduleName: 'module'
  }]
}

test("Test isBusy deploying", () => {
  const busy = isBusy(DEPLOYMENT_STATUS.deploying);

  expect(busy).toBeTruthy();
});

test("Test isBusy undeploying", () => {
  const busy = isBusy(DEPLOYMENT_STATUS.undeploying);

  expect(busy).toBeTruthy();
});

test("Test isDeploying deploying", () => {
  const deploying = isDeploying(DEPLOYMENT_STATUS.deploying);

  expect(deploying).toBeTruthy();
});

test("Test isDeploying undeploying", () => {
  const deploying = isDeploying(DEPLOYMENT_STATUS.undeploying);

  expect(deploying).toBeFalsy();
});

test("Test isDeploying deploying", () => {
  const deploying = isUndeploying(DEPLOYMENT_STATUS.deploying);

  expect(deploying).toBeFalsy();
});

test("Test isDeploying undeploying", () => {
  const deploying = isUndeploying(DEPLOYMENT_STATUS.undeploying);

  expect(deploying).toBeTruthy();
});

test("Test if circleCannotBeDeleted could be truthy", () => {
  const isCant = circleCannotBeDeleted({ ...circle, deployment });

  expect(isCant).toBeTruthy();
});

test("Test if circleCannotBeDeleted could be falsy", () => {
  const isCant = circleCannotBeDeleted({ ...circle, name: 'Default'});

  expect(isCant).toBeTruthy();
});

test("Test if circleCannotBeDeleted could be falsy", () => {
  const isCant = circleCannotBeDeleted(circle);

  expect(isCant).toBeFalsy();
});

test("Test hasDeploy", () => {
  const has = hasDeploy({ ...circle, deployment });

  expect(has).toBeTruthy();
});

test("Test isUndeployable could not be undeploy", () => {
  const is = isUndeployable(circle);

  expect(is).toBeFalsy();
});

test("Test isUndeployable could be undeploy", () => {
  const is = isUndeployable({ ...circle, deployment });

  expect(is).toBeTruthy();
});

test("Test pathCircleById is true", () => {
  const circlePath = pathCircleById(circle.id);

  expect(circlePath).toBe(`http://localhost/?circle=${circle.id}`);
});

test("Test isDefaultCircle is true", () => {
  const is = isDefaultCircle('Default');

  expect(is).toBeTruthy();
});

test("Test isDefaultCircle is false", () => {
  const is = isDefaultCircle('Circle');

  expect(is).toBeFalsy();
});

test("Test getTooltipMessage to cannotDeleteActiveCircleMessage", () => {
  const tooltipMessage = getTooltipMessage(circle);

  expect(tooltipMessage).toBe('Active circle cannot be deleted,<br />you can undeploy first and then<br /> delete this circle.');
});

test("Test getTooltipMessage to cannotDeleteDefaultCircleMessage", () => {
  const tooltipMessage = getTooltipMessage({ ...circle, name: 'Default', deployment });

  expect(tooltipMessage).toBe('Default circle is deployed to all<br /> users, so it cannot be deleted.');
});

test("Test getTooltipMessage to cannotDeleteInactiveDefaultCircleMessage", () => {
  const tooltipMessage = getTooltipMessage({ ...circle, name: 'Default' });

  expect(tooltipMessage).toBe('Default circle cannot be deleted.');
});
