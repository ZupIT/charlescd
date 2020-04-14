/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charles.application.build.request

import javax.validation.constraints.NotBlank
import javax.validation.constraints.NotEmpty
import javax.validation.constraints.NotNull

data class BuildCallbackRequest(
    @field:NotNull
    val status: Status,
    val modules: List<ModulePart>?
) {
    data class ModulePart(
        @field:NotBlank
        val moduleId: String,
        @field:NotNull
        val status: Status,
        @field:NotEmpty
        val components: List<ComponentPart>
    )

    data class ComponentPart(
        @field:NotBlank
        val name: String,
        @field:NotBlank
        val tagName: String
    )

    enum class Status {
        SUCCESS, TIME_OUT
    }
}


