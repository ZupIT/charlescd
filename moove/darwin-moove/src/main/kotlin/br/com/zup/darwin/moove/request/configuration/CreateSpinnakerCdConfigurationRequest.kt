/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.moove.request.configuration

import br.com.zup.darwin.moove.api.request.CreateDeploySpinnakerCdConfigurationData
import br.com.zup.darwin.moove.api.request.CreateDeploySpinnakerCdConfigurationRequest

data class CreateSpinnakerCdConfigurationRequest(
    val configurationData: CreateSpinnakerCdConfigurationData,
    val name: String,
    override val authorId: String
): CreateCdConfigurationRequest(CdTypeEnum.SPINNAKER, authorId) {

    fun toDeployRequest(): CreateDeploySpinnakerCdConfigurationRequest {
        return CreateDeploySpinnakerCdConfigurationRequest(
            this.type,
            this.getDeployConfigurationData(),
            this.name,
            this.authorId
        )
    }

    private fun getDeployConfigurationData(): CreateDeploySpinnakerCdConfigurationData {
        return CreateDeploySpinnakerCdConfigurationData(
            this.configurationData.account,
            this.configurationData.namespace
        )
    }
}

data class CreateSpinnakerCdConfigurationData(
    val account: String,
    val namespace: String
)