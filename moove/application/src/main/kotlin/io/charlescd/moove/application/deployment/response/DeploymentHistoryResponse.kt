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
import io.charlescd.moove.domain.ComponentHistory
import io.charlescd.moove.domain.DeploymentHistory
import java.time.LocalDateTime

class DeploymentHistoryResponse(
    val id: String,
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    val deployedAt: LocalDateTime?,
    val authorName: String,
    val tag: String,
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    val undeployedAt: LocalDateTime?,
    val components: List<ComponentHistoryResponse>
) {
    companion object {
        fun from(deploymentHistory: DeploymentHistory, componentsHistory: List<ComponentHistory>): DeploymentHistoryResponse {
            return DeploymentHistoryResponse(
                id = deploymentHistory.id,
                deployedAt = deploymentHistory.deployedAt,
                undeployedAt = deploymentHistory.undeployedAt,
                authorName = deploymentHistory.authorName,
                tag = deploymentHistory.tag,
                components = componentsHistory.map { ComponentHistoryResponse.from(it) }
            )
        }
    }
}
