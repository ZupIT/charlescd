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

package io.charlescd.moove.legacy.moove.api.request

import com.fasterxml.jackson.annotation.JsonInclude
import org.jetbrains.annotations.NotNull
import javax.validation.Valid
import javax.validation.constraints.Size

@JsonInclude(JsonInclude.Include.NON_NULL)
data class NodeRequest(
    @field:[NotNull Size(min = 0)] val name: String?,
    @field:[Valid] val node: Node?,
    val reference: String? = null,
    val circleId: String,
    val previousReference: String? = null,
    val type: String
) {

    data class Node(
        @field:[Valid] val type: NodeTypeRequest?,
        @field:[Valid] val logicalOperator: LogicalOperatorRequest?,
        @field:[Valid] val clauses: List<Node>?,
        @field:[Valid] val content: RuleRequest?
    ) {

        enum class NodeTypeRequest {
            CLAUSE,
            RULE
        }

        enum class LogicalOperatorRequest {
            AND,
            OR
        }

        data class RuleRequest(
            @field:[NotNull Size(min = 0)] val key: String?,
            @field:[NotNull Size(min = 0)] val condition: String?,
            @field:[NotNull Size(min = 0)] val value: List<String>?
        )
    }
}
