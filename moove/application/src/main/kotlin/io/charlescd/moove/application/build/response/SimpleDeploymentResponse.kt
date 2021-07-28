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

package io.charlescd.moove.application.build.response

import com.fasterxml.jackson.annotation.JsonFormat
import io.charlescd.moove.application.deployment.response.SimpleCircleResponse
import io.charlescd.moove.domain.Deployment
import java.time.LocalDateTime

data class SimpleDeploymentResponse(
    val id: String,
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    val createdAt: LocalDateTime,
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    val deployedAt: LocalDateTime?,
    val buildId: String,
    val status: String,
    val circle: SimpleCircleResponse? = null
) {

    companion object {

        fun from(deployment: Deployment): SimpleDeploymentResponse {
            return SimpleDeploymentResponse(
                id = deployment.id,
                createdAt = deployment.createdAt,
                deployedAt = deployment.deployedAt,
                buildId = deployment.buildId,
                status = deployment.status.name,
                circle = SimpleCircleResponse.from(deployment.circle)
            )
        }
    }
}
