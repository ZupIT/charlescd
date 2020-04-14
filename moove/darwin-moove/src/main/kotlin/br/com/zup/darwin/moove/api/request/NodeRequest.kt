/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.moove.api.request

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
    val previousReference:String? = null,
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