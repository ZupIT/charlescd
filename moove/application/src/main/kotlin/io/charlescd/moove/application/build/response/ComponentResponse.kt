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

package io.charlescd.moove.application.build.response

import com.fasterxml.jackson.annotation.JsonFormat
import io.charlescd.moove.domain.Component
import io.charlescd.moove.domain.ComponentSnapshot
import java.time.LocalDateTime

data class ComponentResponse(
    val id: String,
    val name: String,
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    val createdAt: LocalDateTime,
    val errorThreshold: Int? = null,
    val latencyThreshold: Int? = null
) {
    companion object {
        fun from(component: ComponentSnapshot): ComponentResponse {
            return ComponentResponse(
                id = component.componentId,
                name = component.name,
                createdAt = component.createdAt
            )
        }

        fun from(component: Component): ComponentResponse {
            return ComponentResponse(
                id = component.id,
                name = component.name,
                createdAt = component.createdAt,
                errorThreshold = component.errorThreshold,
                latencyThreshold = component.latencyThreshold
            )
        }
    }
}
