/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.moove.api.request

data class BuildRequest(
    val tagName: String,
    val callbackUrl: String,
    val modules: List<BuildModulesRequest>
)

data class BuildModulesRequest(
    val id: String,
    val name: String,
    val registryConfigurationId: String,
    val components: List<BuildModuleComponentsRequest>
)

data class BuildModuleComponentsRequest(
    val name: String,
    val tagName: String
)