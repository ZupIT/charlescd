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

package io.charlescd.moove.domain

import com.fasterxml.jackson.databind.JsonNode
import java.time.LocalDateTime

data class Circle(
    val id: String,
    val name: String,
    val reference: String,
    val author: User?,
    val createdAt: LocalDateTime,
    val matcherType: MatcherTypeEnum,
    val rules: JsonNode? = null,
    val importedKvRecords: Int? = null,
    val importedAt: LocalDateTime? = null,
    val defaultCircle: Boolean,
    val workspaceId: String
) {
    companion object {
        const val DEFAULT_CIRCLE_NAME = "Default"
    }

    fun isDefaultCircle(): Boolean = this.defaultCircle

    fun canBeUpdated(): Boolean = !this.isDefaultCircle()
}

data class SimpleCircle(
    val id: String,
    val name: String
)

