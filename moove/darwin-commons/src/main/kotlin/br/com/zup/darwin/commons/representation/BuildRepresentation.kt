/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.commons.representation

import com.fasterxml.jackson.annotation.JsonFormat
import java.time.LocalDateTime

data class BuildRepresentation(
    val id: String,
    val author: SimpleUserRepresentation,
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    val createdAt: LocalDateTime,
    val features: List<FeatureRepresentation>,
    val tag: String,
    val status: String,
    val deployments: List<SimpleDeploymentRepresentation>,
    val artifacts: List<ArtifactRepresentation>
)
