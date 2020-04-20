/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.moove.request.hypothesis

import javax.validation.constraints.NotBlank
import javax.validation.constraints.NotNull

data class CreateHypothesisRequest(
    @field:NotBlank
    val name: String,

    @field:NotNull
    val description: String,

    @field:NotBlank
    val authorId: String,

    @field:NotBlank
    val problemId: String,

    @field:NotNull
    val labels: List<String> = emptyList()
)