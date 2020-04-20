/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charles.application.deployment.response

import br.com.zup.charles.domain.Deployment
import com.fasterxml.jackson.annotation.JsonFormat
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
    val status: String
) {
    companion object {
        fun from(deployment: Deployment, tag: String): DeploymentResponse {
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
                tag = tag,
                status = deployment.status.name
            )
        }
    }
}