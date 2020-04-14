/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.moove.api.request

import br.com.zup.darwin.moove.request.configuration.CdTypeEnum

data class CreateDeployOctopipeCdConfigurationRequest(
    val type: CdTypeEnum,
    val configurationData: CreateDeployOctopipeCdConfigurationData,
    val name: String,
    val authorId: String
): CreateDeployCdConfigurationRequest()

data class CreateDeployOctopipeCdConfigurationData(
    val gitUsername: String,
    val gitPassword: String,
    val namespace: String
)