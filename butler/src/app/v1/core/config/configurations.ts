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

import { ConfigurationConstants } from '../constants/application/configuration.constants'
import IEnvConfiguration from '../integrations/configuration/interfaces/env-configuration.interface'

export const Configuration: IEnvConfiguration = {

  postgresHost: process.env.DATABASE_HOST || ConfigurationConstants.DATABASE_HOST,

  postgresPort: Number(process.env.DATABASE_PORT) || ConfigurationConstants.DATABASE_PORT,

  postgresUser: process.env.DATABASE_USER || ConfigurationConstants.DATABASE_USER,

  postgresPass: process.env.DATABASE_PASS || ConfigurationConstants.DATABASE_DB_PASS,

  postgresDbName: 'butlerv2' || ConfigurationConstants.DATABASE_DB_NAME, // TODO change this

  postgresSSL: (process.env.DATABASE_SSL === 'true') || ConfigurationConstants.DATABASE_SSL,

  mooveUrl: process.env.MOOVE_URL || ConfigurationConstants.MOOVE_URL,

  darwinNotificationUrl: process.env.DARWIN_NOTIFICATION_URL || ConfigurationConstants.DARWIN_NOTIFICATION_URL,

  darwinUndeploymentCallbackUrl: process.env.DARWIN_CALLBACK || ConfigurationConstants.DARWIN_CALLBACK,

  darwinDeploymentCallbackUrl: process.env.DARWIN_CALLBACK || ConfigurationConstants.DARWIN_CALLBACK,

  darwinIstioDeploymentCallbackUrl: process.env.DARWIN_CALLBACK || ConfigurationConstants.DARWIN_CALLBACK,

  spinnakerUrl: process.env.SPINNAKER_URL || ConfigurationConstants.SPINNAKER_URL,

  spinnakerGithubAccount: process.env.SPINNAKER_GITHUB_ACCOUNT || ConfigurationConstants.SPINNAKER_GITHUB_ACCOUNT,

  helmTemplateUrl: process.env.HELM_TEMPLATE_URL || ConfigurationConstants.HELM_TEMPLATE_URL,

  helmPrefixUrl: process.env.HELM_PREFIX_URL || ConfigurationConstants.HELM_PREFIX_URL,

  helmRepoBranch: process.env.HELM_REPO_BRANCH || ConfigurationConstants.HELM_REPO_BRANCH,

  octopipeUrl: process.env.OCTOPIPE_URL || ConfigurationConstants.OCTOPIPE_URL,

  deploymentExpireTime: Number(process.env.DEPLOYMENT_EXPIRE_TIME) || ConfigurationConstants.DEPLOYMENT_EXPIRE_TIME,

  pgBossConfig: {
    host: process.env.DATABASE_HOST || ConfigurationConstants.DATABASE_HOST,
    database: 'butlerv2' || ConfigurationConstants.DATABASE_DB_NAME, // TODO change this
    user: process.env.DATABASE_USER || ConfigurationConstants.DATABASE_USER,
    password: process.env.DATABASE_PASS || ConfigurationConstants.DATABASE_DB_PASS,
    max: 5,
    retentionDays: 7
  },

  butlerUrl: process.env.BUTLER_URL || ConfigurationConstants.BUTLER_URL

}
