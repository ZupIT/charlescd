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

package io.charlescd.moove.application.deployment.response

import com.fasterxml.jackson.annotation.JsonFormat
import com.fasterxml.jackson.databind.JsonNode
import io.charlescd.moove.application.user.response.SimpleUserResponse
import io.charlescd.moove.domain.Circle
import java.time.LocalDateTime

data class SimpleCircleResponse(
    val id: String,
    val name: String,
    val author: SimpleUserResponse?,
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    val createdAt: LocalDateTime,
    val matcherType: String,
    val rules: JsonNode?,
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    val importedAt: LocalDateTime?,
    val importedKvRecords: Int?
) {

    companion object {
        fun from(circle: Circle): SimpleCircleResponse {
            return SimpleCircleResponse(
                id = circle.id,
                name = circle.name,
                author = if (circle.author != null) SimpleUserResponse.from(circle.author!!) else null,
                createdAt = circle.createdAt,
                matcherType = circle.matcherType.name,
                rules = circle.rules,
                importedAt = circle.importedAt,
                importedKvRecords = circle.importedKvRecords
            )
        }
    }
}
