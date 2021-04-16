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

enum STATUS {
  NOT_DEPLOYED = 'notDeployed',
  DEPLOYED = 'deployed',
  DEPLOYING = 'deploying',
  DEPLOY_FAILED = 'error',
  UNDEPLOYING = 'undeploying',
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

export const getReleaseStatus = (statusEnum: string) => {
  if (statusEnum === 'DEPLOYED') return STATUS.DEPLOYED;
  return STATUS.DEPLOY_FAILED;
};

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