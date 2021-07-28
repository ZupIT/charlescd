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
import io.charlescd.moove.legacy.repository.entity.User
import javax.validation.constraints.Size

data class CreateOctopipeCdConfigurationRequest(
    val configurationData: CreateOctopipeCdConfigurationData,
    @field:Size(max = 64)
    val name: String
) : CreateCdConfigurationRequest(CdTypeEnum.OCTOPIPE) {

    fun toDeployRequest(user: User): CreateDeployOctopipeCdConfigurationRequest {
        return CreateDeployOctopipeCdConfigurationRequest(
            this.type,
            this.getDeployConfigurationData(),
            user.id,
            this.name
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
    @field:Size(max = 2048)
    val gitProvider: GitProvidersEnum,
    val provider: K8sClusterProvidersEnum,
    @field:Size(max = 256)
    val gitToken: String? = null,
    @field:Size(max = 64)
    val namespace: String? = null,
    @field:Size(max = 100)
    val caData: String? = null,
    @field:Size(max = 100)
    val awsSID: String? = null,
    @field:Size(max = 256)
    val awsSecret: String? = null,
    @field:Size(max = 64)
    val awsRegion: String? = null,
    @field:Size(max = 64)
    val awsClusterName: String? = null,
    @field:Size(max = 2048)
    val host: String? = null,
    @field:Size(max = 2048)
    val clientCertificate: String? = null,
    @field:Size(max = 256)
    val clientKey: String? = null
)
