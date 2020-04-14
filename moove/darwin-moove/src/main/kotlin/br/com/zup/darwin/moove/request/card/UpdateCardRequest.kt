/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.moove.request.card

import javax.validation.constraints.NotBlank
import javax.validation.constraints.NotNull

data class UpdateCardRequest(
    @field:NotBlank
    val name: String,

    val description: String?,

    @field:NotNull
    val labels: List<String>,

    @field:NotBlank
    val type: String,

    val branchName: String = "",

    val modules: List<String> = emptyList()

)