/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.moove.request.feature

import javax.validation.constraints.NotBlank
import javax.validation.constraints.NotEmpty
import javax.validation.constraints.NotNull

data class UpdateFeatureRequest(
    @field:NotBlank
    val name: String,

    @field:NotNull
    @field:NotEmpty
    val modules: List<String>,

    @field:NotNull
    @field:NotEmpty
    val members: List<String>
)