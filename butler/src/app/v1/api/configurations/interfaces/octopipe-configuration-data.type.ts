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

import { GitProvidersEnum } from '../../../core/integrations/configuration/interfaces/git-providers.type'
import { ClusterProviderEnum } from '../../../core/integrations/octopipe/interfaces/octopipe-payload.interface'

export interface IEKSConfig {
    provider: ClusterProviderEnum.EKS
    awsSID: string
    awsSecret: string
    awsRegion: string
    awsClusterName: string
    gitProvider: GitProvidersEnum
    gitToken: string
    namespace: string
}

export interface IGenericConfig {
    provider: ClusterProviderEnum.GENERIC
    host: string
    clientCertificate: string
    caData: string
    clientKey: string
    gitProvider: GitProvidersEnum
    gitToken: string
    namespace: string
}

export interface IDefaultConfig {
    provider: ClusterProviderEnum.DEFAULT
    gitProvider: GitProvidersEnum
    gitToken: string
    namespace: string
}

export type OctopipeConfigurationData = IEKSConfig | IGenericConfig | IDefaultConfig
