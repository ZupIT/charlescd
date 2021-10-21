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

import { dateTimeFormatter } from 'core/utils/date';

enum STATUS {
  DEPLOYING = 'deploying',
  DEPLOYED = 'deployed',
  DEPLOY_FAILED = 'deploy_failed',
  UNDEPLOYING = 'undeploying',
  NOT_DEPLOYED = 'undeploy'
}

export const getReleaseStatus = (statusEnum: string) => {
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
    default:
      return STATUS.DEPLOYED;
  }
};

export const getActionDateTime = (
  deployDate: Date | string,
  undeployDate: Date | string
) => {
  if (undeployDate) {
    return dateTimeFormatter(undeployDate);
  } if (deployDate) {
    return dateTimeFormatter(deployDate);
  }

  return '-'
};
