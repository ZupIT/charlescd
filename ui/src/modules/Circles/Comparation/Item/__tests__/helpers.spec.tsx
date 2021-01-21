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

import { isBusy, isDeploying, isUndeploying, circleCannotBeDeleted } from "../helpers"
import { DEPLOYMENT_STATUS } from 'core/enums/DeploymentStatus';
import { Circle } from 'modules/Circles/interfaces/Circle';

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

test("Test circleCannotBeDeleted", () => {
  const circle: Circle = {
    id: '123',
    name: 'Circle',
    author: null,
    createdAt: '2021-01-01',
    rules: null,
    deployment: {
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
  }

  const isCant = circleCannotBeDeleted(circle);
  expect(isCant).toBeTruthy();
});