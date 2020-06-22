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

import IEnvConfiguration from '../../../app/core/integrations/configuration/interfaces/env-configuration.interface'

export const EnvConfigurationStub: IEnvConfiguration = {

    postgresHost: 'postgreshost.com',

    postgresPort: 8000,

    postgresUser: 'postgresuser',

    postgresPass: 'postgrespass',

    postgresDbName: 'postgresdbname',

    postgresSSL: false,

    mooveUrl: 'mooveurl.com',

    darwinDeploymentCallbackUrl: 'darwin-deployment-callback.url.com',

    darwinUndeploymentCallbackUrl: 'darwin-undeployment-callback.url.com',

    darwinIstioDeploymentCallbackUrl: 'darwin-istio-deployment-callback.url.com',

    spinnakerUrl: 'spinnakerurl.com',

    octopipeUrl: 'octopipe.com',

    darwinNotificationUrl: 'darwin-notification.url.com',

    helmPrefixUrl: 'helm-prefix',

    helmRepoBranch: 'helm-branch',

    helmTemplateUrl: 'helm-template',

    spinnakerGithubAccount: 'spinnaker-github-account'
}
