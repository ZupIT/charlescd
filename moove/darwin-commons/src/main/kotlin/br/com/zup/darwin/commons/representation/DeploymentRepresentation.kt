/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.commons.representation

import br.com.zup.darwin.entity.Artifact
import com.fasterxml.jackson.annotation.JsonFormat
import java.time.LocalDateTime

data class DeploymentRepresentation(
    val id: String,
    val author: SimpleUserRepresentation,
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    val createdAt: LocalDateTime,
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    val deployedAt: LocalDateTime?,
    val circle: CircleRepresentation,
    val build: SimpleBuildRepresentation,
    val status: String,
    val artifacts: List<DeploymentArtifactRepresentation>
)
