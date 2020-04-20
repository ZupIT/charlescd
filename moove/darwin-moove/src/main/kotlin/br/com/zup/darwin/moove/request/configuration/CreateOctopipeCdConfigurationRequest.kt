/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.moove.request.configuration

import br.com.zup.darwin.moove.api.request.CreateDeployOctopipeCdConfigurationData
import br.com.zup.darwin.moove.api.request.CreateDeployOctopipeCdConfigurationRequest

data class CreateOctopipeCdConfigurationRequest(
    val configurationData: CreateOctopipeCdConfigurationData,
    val name: String,
    override val authorId: String
): CreateCdConfigurationRequest(CdTypeEnum.OCTOPIPE, authorId) {

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
            this.configurationData.gitUsername,
            this.configurationData.gitPassword,
            this.configurationData.namespace
        )
    }
}

data class CreateOctopipeCdConfigurationData(
    val gitUsername: String,
    val gitPassword: String,
    val namespace: String
)