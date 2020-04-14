/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.moove.request.card

import javax.validation.constraints.NotBlank
import javax.validation.constraints.NotNull

data class CreateCardRequest(
    @field:NotBlank
    val name: String,

    val description: String?,

    @field:NotBlank
    val authorId: String,

    @field:NotBlank
    val type: String,

    @field:NotNull
    val labels: List<String>,

    @field:NotBlank
    val hypothesisId: String,

    val branchName: String = "",

    val modules: List<String> = emptyList()
)