/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charles.application.build.response

import br.com.zup.charles.domain.ComponentSnapshot
import com.fasterxml.jackson.annotation.JsonFormat
import java.time.LocalDateTime

data class ComponentResponse(
    val id: String,
    val name: String,
    val contextPath: String?,
    val port: Int?,
    val healthCheck: String?,
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    val createdAt: LocalDateTime,
    val artifact: ArtifactResponse?
) {

    companion object {

        fun from(component: ComponentSnapshot): ComponentResponse {
            return ComponentResponse(
                id = component.id,
                name = component.name,
                contextPath = component.contextPath,
                port = component.port,
                healthCheck = component.healthCheck,
                createdAt = component.createdAt,
                artifact = component.artifact?.let { ArtifactResponse.from(it) }
            )
        }

    }

}