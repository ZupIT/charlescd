/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charles.infrastructure.service.client

data class VillagerBuildRequest(
    val tagName: String,
    val callbackUrl: String,
    val modules: List<BuildModulePart>
)

data class BuildModulePart(
    val id: String,
    val name: String,
    val registryConfigurationId: String,
    val components: List<BuildModuleComponentPart>
)

data class BuildModuleComponentPart(
    val name: String,
    val tagName: String
)