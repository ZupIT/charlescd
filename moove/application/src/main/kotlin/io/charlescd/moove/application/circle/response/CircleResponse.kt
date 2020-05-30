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

package io.charlescd.moove.application.circle.response

import com.fasterxml.jackson.annotation.JsonFormat
import com.fasterxml.jackson.annotation.JsonInclude
import com.fasterxml.jackson.databind.JsonNode
import io.charlescd.moove.application.deployment.response.DeploymentResponse
import io.charlescd.moove.application.user.response.SimpleUserResponse
import io.charlescd.moove.domain.Build
import io.charlescd.moove.domain.Circle
import io.charlescd.moove.domain.Deployment
import io.charlescd.moove.domain.MatcherTypeEnum
import java.time.LocalDateTime

@JsonInclude(JsonInclude.Include.NON_NULL)
class CircleResponse(
    val id: String,
    val name: String,
    val reference: String?,
    val author: SimpleUserResponse?,
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    val createdAt: LocalDateTime,
    val matcherType: MatcherTypeEnum,
    val rules: JsonNode? = null,
    val importedKvRecords: Int? = null,
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    val importedAt: LocalDateTime? = null,
    val default: Boolean,
    val deployment: DeploymentResponse? = null,
    val workspaceId: String
) {
    companion object {
        fun from(circle: Circle) = CircleResponse(
            id = circle.id,
            name = circle.name,
            rules = circle.rules,
            createdAt = circle.createdAt,
            importedAt = circle.createdAt,
            reference = circle.reference,
            importedKvRecords = circle.importedKvRecords,
            author = circle.author?.let { SimpleUserResponse.from(it) },
            matcherType = circle.matcherType,
            default = circle.defaultCircle,
            workspaceId = circle.workspaceId
        )

        fun from(circle: Circle, deployment: Deployment?, build: Build?) = CircleResponse(
            id = circle.id,
            name = circle.name,
            rules = circle.rules,
            createdAt = circle.createdAt,
            importedAt = circle.importedAt,
            reference = circle.reference,
            importedKvRecords = circle.importedKvRecords,
            author = circle.author?.let { SimpleUserResponse.from(it) },
            matcherType = circle.matcherType,
            default = circle.defaultCircle,
            workspaceId = circle.workspaceId,
            deployment = deployment?.let { d -> build?.let { b -> DeploymentResponse.from(d, b) } }
        )
    }
}
