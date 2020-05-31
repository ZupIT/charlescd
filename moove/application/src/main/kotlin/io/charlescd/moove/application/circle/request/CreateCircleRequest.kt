/*
 *
 *  * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *  *
 *  * Licensed under the Apache License, Version 2.0 (the "License");
 *  * you may not use this file except in compliance with the License.
 *  * You may obtain a copy of the License at
 *  *
 *  *     http://www.apache.org/licenses/LICENSE-2.0
 *  *
 *  * Unless required by applicable law or agreed to in writing, software
 *  * distributed under the License is distributed on an "AS IS" BASIS,
 *  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  * See the License for the specific language governing permissions and
 *  * limitations under the License.
 *
 */

package io.charlescd.moove.application.circle.request

import io.charlescd.moove.commons.extension.toJsonNode
import io.charlescd.moove.domain.Circle
import io.charlescd.moove.domain.MatcherTypeEnum
import io.charlescd.moove.domain.User
import org.jetbrains.annotations.NotNull
import java.time.LocalDateTime
import java.util.*
import javax.validation.Valid
import javax.validation.constraints.NotBlank
import javax.validation.constraints.Size

class CreateCircleRequest(

    @field:NotBlank
    val name: String,

    @field:NotBlank
    val authorId: String,

    val rules: NodePart
) {
    fun toDomain(user: User, workspaceId: String) = Circle(
        id = UUID.randomUUID().toString(),
        name = name,
        createdAt = LocalDateTime.now(),
        reference = UUID.randomUUID().toString(),
        author = user,
        matcherType = MatcherTypeEnum.REGULAR,
        rules = rules.toJsonNode(),
        defaultCircle = false,
        workspaceId = workspaceId
    )
}

data class NodePart(
    @field:[Valid] val type: NodeTypeRequest?,
    @field:[Valid] val logicalOperator: LogicalOperatorRequest?,
    @field:[Valid] val clauses: List<NodePart>? = null,
    @field:[Valid] val content: RulePart? = null
) {

    enum class NodeTypeRequest {
        CLAUSE,
        RULE
    }

    enum class LogicalOperatorRequest {
        AND,
        OR
    }

    data class RulePart(
        @field:[NotNull Size(min = 0)] val key: String?,
        @field:[NotNull Size(min = 0)] val condition: String?,
        @field:[NotNull Size(min = 0)] val value: List<String>?
    )
}
