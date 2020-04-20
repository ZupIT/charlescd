/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charles.application.build.response

import br.com.zup.charles.application.deployment.response.SimpleUserResponse
import br.com.zup.charles.domain.Build
import com.fasterxml.jackson.annotation.JsonFormat
import java.time.LocalDateTime

data class BuildResponse(
    val id: String,
    val author: SimpleUserResponse,
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    val createdAt: LocalDateTime,
    val features: List<FeatureResponse>,
    val tag: String,
    val status: String,
    val deployments: List<SimpleDeploymentResponse>
) {

    companion object {

        fun from(build: Build): BuildResponse {
            return BuildResponse(
                id = build.id,
                author = SimpleUserResponse.from(build.author),
                createdAt = build.createdAt,
                features = build.features.map { FeatureResponse.from(it) },
                tag = build.tag,
                status = build.status.name,
                deployments = build.deployments.map { SimpleDeploymentResponse.from(it) }
            )
        }
    }

}