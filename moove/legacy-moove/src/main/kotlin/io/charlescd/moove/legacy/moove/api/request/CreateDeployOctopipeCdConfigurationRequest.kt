/*
 *
 *  * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *  *
 *  * Licensed under the Apache License, Version 2.0 (the "License");
 *  * you may not use this file except in compliance with the License.
 *  * You may obtain a copy of the License at
 *  *
 *  *     http://www.apache.org/licenses/LICENSE-2.0
 *  *
 *  * Unless required by applicable law or agreed to in writing, software
 *  * distributed under the License is distributed on an "AS IS" BASIS,
 *  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  * See the License for the specific language governing permissions and
 *  * limitations under the License.
 *
 */

package io.charlescd.moove.legacy.moove.api.request

import io.charlescd.moove.legacy.moove.request.configuration.CdTypeEnum

data class CreateDeployOctopipeCdConfigurationRequest(
    val type: CdTypeEnum,
    val configurationData: CreateDeployOctopipeCdConfigurationData,
    val name: String,
    val authorId: String
) : CreateDeployCdConfigurationRequest()


enum class GitProvidersEnum {
    GITHUB,
    GITLAB
}

enum class K8sClusterProvidersEnum {
    EKS,
    GENERIC,
    DEFAULT
}

data class CreateDeployOctopipeCdConfigurationData(
    val gitProvider: GitProvidersEnum,
    val provider: K8sClusterProvidersEnum,
    val gitToken: String?,
    val namespace: String?,
    val caData: String?,
    val awsSID: String?,
    val awsSecret: String?,
    val awsRegion: String?,
    val awsClusterName: String?,
    val host: String?,
    val clientCertificate: String?,
    val clientKey: String?
)
