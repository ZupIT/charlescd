/*
 * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package io.charlescd.moove.application.build.request

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


