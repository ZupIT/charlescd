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

export const ConfigurationConstants = {

  NODE_ENV: process.env.NODE_ENV || 'dev',

  DATABASE_HOST: 'localhost',

  DATABASE_PORT: 5432,

  DATABASE_USER: 'darwin',

  DATABASE_DB_NAME: 'darwin',

  DATABASE_DB_PASS: 'darwin',

  MOOVE_URL: 'http://localhost:8883/moove',

  DARWIN_NOTIFICATION_URL: 'http://localhost:8883/deploy/notifications',

  MOOVE_NOTIFICATION_MAXIMUM_RETRY_ATTEMPTS:  3,

  MOOVE_NOTIFICATION_MILLISECONDS_RETRY_DELAY: 1000,

  SPINNAKER_CONNECTION_MAXIMUM_RETRY_ATTEMPTS : 5,

  SPINNAKER_CONNECTION_MILLISECONDS_RETRY_DELAY: 1000,

  DARWIN_UNDEPLOYMENT_CALLBACK: 'http://localhost:8883/deploy/notifications/undeployment',

  DARWIN_DEPLOYMENT_CALLBACK: 'http://localhost:8883/deploy/notifications/deployment',

  DARWIN_ISTIO_DEPLOYMENT_CALLBACK: 'http://localhost:8883/deploy/notifications/istio-deployment',

  SPINNAKER_URL: 'http://localhost:8883/spinnaker',

  SPINNAKER_GITHUB_ACCOUNT: 'github-account',

  HELM_TEMPLATE_URL: 'http://localhost:8883/helm',

  HELM_PREFIX_URL: 'http://localhost:8883/helm',

  HELM_REPO_BRANCH: 'darwin-helm',

  DEFAULT_CIRCLE_ID: 'f5d23a57-5607-4306-9993-477e1598cc2a',

  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,

  OCTOPIPE_URL: 'http://localhost:8883/octopipe'
}

export type DefaultCircleId = 'f5d23a57-5607-4306-9993-477e1598cc2a'
