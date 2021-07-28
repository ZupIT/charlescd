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
import io.charlescd.moove.application.user.response.SimpleUserResponse
import io.charlescd.moove.domain.Build
import io.charlescd.moove.domain.Deployment
import io.charlescd.moove.domain.ModuleSnapshot
import java.time.LocalDateTime

data class DeploymentResponse(
    val id: String,
    val author: SimpleUserResponse?,
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    val createdAt: LocalDateTime,
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    val deployedAt: LocalDateTime?,
    val circle: SimpleCircleResponse,
    val buildId: String,
    val tag: String,
    val status: String,
    val artifacts: List<ArtifactResponse> = emptyList()
) {
    companion object {
        fun from(deployment: Deployment, build: Build): DeploymentResponse {
            return DeploymentResponse(
                id = deployment.id,
                author = SimpleUserResponse.from(
                    deployment.author
                ),
                createdAt = deployment.createdAt,
                deployedAt = deployment.deployedAt,
                circle = SimpleCircleResponse.from(
                    deployment.circle
                ),
                buildId = deployment.buildId,
                tag = build.tag,
                status = deployment.status.name,
                artifacts = createResponse(build)
            )
        }

        private fun createResponse(build: Build): List<ArtifactResponse> {
            return build.features.flatMap { feature ->
                feature.modules.flatMap { module ->
                    createArtifactResponse(module)
                }
            }
        }

        private fun createArtifactResponse(module: ModuleSnapshot): List<ArtifactResponse> {
            return module.components.map { component ->
                ArtifactResponse(
                    component.id,
                    component.artifact?.artifact,
                    component.artifact?.version,
                    component.artifact?.createdAt,
                    component.name,
                    module.name
                )
            }
        }
    }
}
