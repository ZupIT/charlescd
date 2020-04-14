/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.moove.api.request

import br.com.zup.darwin.moove.request.configuration.CdTypeEnum

data class CreateDeploySpinnakerCdConfigurationRequest(
    val type: CdTypeEnum,
    val configurationData: CreateDeploySpinnakerCdConfigurationData,
    val name: String,
    val authorId: String
): CreateDeployCdConfigurationRequest()

data class CreateDeploySpinnakerCdConfigurationData(
    val account: String,
    val namespace: String
)