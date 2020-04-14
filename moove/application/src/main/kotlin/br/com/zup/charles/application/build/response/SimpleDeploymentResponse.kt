/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charles.application.build.response

import br.com.zup.charles.application.deployment.response.SimpleCircleResponse
import br.com.zup.charles.domain.Deployment
import com.fasterxml.jackson.annotation.JsonFormat
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