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

package io.charlescd.moove.legacy.moove.request.configuration

import io.charlescd.moove.legacy.moove.api.request.CreateDeployOctopipeCdConfigurationData
import io.charlescd.moove.legacy.moove.api.request.CreateDeployOctopipeCdConfigurationRequest
import io.charlescd.moove.legacy.moove.api.request.GitProvidersEnum
import io.charlescd.moove.legacy.moove.api.request.K8sClusterProvidersEnum

data class CreateOctopipeCdConfigurationRequest(
    val configurationData: CreateOctopipeCdConfigurationData,
    val name: String,
    override val authorId: String
) : CreateCdConfigurationRequest(CdTypeEnum.OCTOPIPE, authorId) {

    fun toDeployRequest(): CreateDeployOctopipeCdConfigurationRequest {
        return CreateDeployOctopipeCdConfigurationRequest(
            this.type,
            this.getDeployConfigurationData(),
            this.name,
            this.authorId
        )
    }

    fun getDeployConfigurationData(): CreateDeployOctopipeCdConfigurationData {
        return CreateDeployOctopipeCdConfigurationData(
            this.configurationData.gitProvider,
            this.configurationData.provider,
            this.configurationData.gitToken,
            this.configurationData.namespace,
            this.configurationData.caData,
            this.configurationData.awsSID,
            this.configurationData.awsSecret,
            this.configurationData.awsRegion,
            this.configurationData.awsClusterName,
            this.configurationData.host,
            this.configurationData.clientCertificate,
            this.configurationData.clientKey
        )
    }
}

data class CreateOctopipeCdConfigurationData(
    val gitProvider: GitProvidersEnum,
    val provider: K8sClusterProvidersEnum,
    val gitToken: String? = null,
    val namespace: String? = null,
    val caData: String? = null,
    val awsSID: String? = null,
    val awsSecret: String? = null,
    val awsRegion: String? = null,
    val awsClusterName: String? = null,
    val host: String? = null,
    val clientCertificate: String? = null,
    val clientKey: String? = null
)
