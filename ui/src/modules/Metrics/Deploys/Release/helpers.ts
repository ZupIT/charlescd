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

enum DEPLOY_STATUS {
  NOT_DEPLOYED = 'notDeployed',
  DEPLOYED = 'deployed',
  DEPLOYING = 'deploying',
  DEPLOY_FAILED = 'error',
  UNDEPLOYING = 'undeploying'
}

export const getReleseStatus = (statusEnum: string) => {
  switch (statusEnum) {
    case 'NOT_DEPLOYED':
      return DEPLOY_STATUS.NOT_DEPLOYED;
    case 'DEPLOYED':
      return DEPLOY_STATUS.DEPLOYED;
    case 'DEPLOYING':
      return DEPLOY_STATUS.DEPLOYING;
    case 'DEPLOY_FAILED':
      return DEPLOY_STATUS.DEPLOY_FAILED;
    case 'UNDEPLOYING':
      return DEPLOY_STATUS.UNDEPLOYING;
    default:
      return DEPLOY_STATUS.DEPLOYED;
  }
};
