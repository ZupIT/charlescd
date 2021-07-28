/*
 * Copyright 2020, 2021 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
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

package io.charlescd.moove.application.circle.response

import com.fasterxml.jackson.annotation.JsonInclude
import io.charlescd.moove.domain.*

@JsonInclude(JsonInclude.Include.NON_NULL)
class SimpleCircleResponse(
    val id: String,
    val name: String
) {
    companion object {
        fun from(circle: SimpleCircle) = SimpleCircleResponse(
            id = circle.id,
            name = circle.name
        )
    }
}
