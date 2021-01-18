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

import io.charlescd.moove.legacy.moove.api.request.CreateDeploySpinnakerCdConfigurationData
import io.charlescd.moove.legacy.moove.api.request.CreateDeploySpinnakerCdConfigurationRequest
import io.charlescd.moove.legacy.repository.entity.User
import javax.validation.constraints.Size

data class CreateSpinnakerCdConfigurationRequest(
    val configurationData: CreateSpinnakerCdConfigurationData,
    @field:Size(max = 64)
    val name: String
) : CreateCdConfigurationRequest(CdTypeEnum.SPINNAKER) {

    fun toDeployRequest(user: User): CreateDeploySpinnakerCdConfigurationRequest {
        return CreateDeploySpinnakerCdConfigurationRequest(
            this.type,
            this.getDeployConfigurationData(),
            user.id,
            this.name
        )
    }

    private fun getDeployConfigurationData(): CreateDeploySpinnakerCdConfigurationData {
        return CreateDeploySpinnakerCdConfigurationData(
            this.configurationData.account,
            this.configurationData.gitAccount,
            this.configurationData.namespace,
            this.configurationData.url
        )
    }
}

data class CreateSpinnakerCdConfigurationData(
    @field:Size(max = 256)
    val account: String,
    @field:Size(max = 256)
    val gitAccount: String,
    @field:Size(max = 64)
    val namespace: String,
    @field:Size(max = 2048)
    val url: String
)
