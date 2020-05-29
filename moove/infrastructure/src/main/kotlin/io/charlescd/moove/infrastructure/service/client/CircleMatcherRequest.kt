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

package io.charlescd.moove.infrastructure.service.client

import com.fasterxml.jackson.annotation.JsonProperty

class CircleMatcherRequest(
    val name: String,
    val reference: String,
    val node: Node?,
    val circleId: String,
    val type: String,
    val previousReference: String? = null,
    val workspaceId: String,
    @get:JsonProperty("isDefault")
    val isDefault: Boolean
)

data class Node(
    val type: NodeTypeRequest?,
    val logicalOperator: LogicalOperatorRequest?,
    val clauses: List<Node>?,
    val content: Rule?
) {
    enum class NodeTypeRequest {
        CLAUSE,
        RULE
    }

    enum class LogicalOperatorRequest {
        AND,
        OR
    }

    data class Rule(
        val key: String?,
        val condition: String?,
        val value: List<String>?
    )
}

data class IdentifyRequest(
    val workspaceId: String,
    val requestData: Map<String, Any>
)

