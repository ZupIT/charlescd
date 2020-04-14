/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.moove.api.request

data class CreateDeployModuleRequest(

    val id: String,

    val cdConfigurationId: String,

    val components: List<CreateDeployComponentRequest>
)

data class CreateDeployComponentRequest(

    val id: String
)