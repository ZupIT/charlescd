/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.moove.request.module

import javax.validation.constraints.NotBlank
import javax.validation.constraints.NotEmpty
import javax.validation.constraints.NotNull

data class CreateModuleRequest(
    @field:NotBlank
    val name: String,

    @field:NotBlank
    val gitRepositoryAddress: String,

    @field:NotBlank
    val authorId: String,

    @field:NotNull
    val labels: List<String>,

    @field:NotBlank
    val gitConfigurationId: String,

    @field:NotBlank
    val registryConfigurationId: String,

    @field:NotBlank
    val cdConfigurationId: String,

    @field:NotBlank
    val helmRepository: String,

    @field:NotEmpty
    val components: List<CreateComponentRequest>
)
