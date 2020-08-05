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

import { Option } from 'core/components/Form/Select/interfaces';
import map from 'lodash/map';
import includes from 'lodash/includes';
import { allOption } from 'core/components/Form/Select/MultiCheck/constants';

export const normalizeCircleParams = (circles: Option[]) => {
  const filteredCircles = includes(circles, allOption) ? [] : circles;

  return map(filteredCircles, 'value');
};

export enum STATUS {
  NOT_DEPLOYED = 'notDeployed',
  DEPLOYED = 'deployed',
  DEPLOYING = 'deploying',
  DEPLOY_FAILED = 'error',
  UNDEPLOYING = 'undeploying',
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

export const getStatus = (statusEnum: string) => {
  switch (statusEnum) {
    case 'NOT_DEPLOYED':
      return STATUS.NOT_DEPLOYED;
    case 'DEPLOYED':
      return STATUS.DEPLOYED;
    case 'DEPLOYING':
      return STATUS.DEPLOYING;
    case 'DEPLOY_FAILED':
      return STATUS.DEPLOY_FAILED;
    case 'UNDEPLOYING':
      return STATUS.UNDEPLOYING;
    case 'ACTIVE':
      return STATUS.ACTIVE;
    case 'INACTIVE':
      return STATUS.INACTIVE;
    default:
      return STATUS.DEPLOYED;
  }
};
