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

package io.charlescd.moove.domain

import java.time.LocalDateTime

data class ArtifactSnapshot(
    val id: String,
    val artifact: String,
    val version: String,
    val componentSnapshotId: String,
    val createdAt: LocalDateTime
) {
    companion object {
        fun from(id: String, componentSnapshotId: String, artifact: String, version: String) = ArtifactSnapshot(
            id = id,
            artifact = artifact,
            version = version,
            createdAt = LocalDateTime.now(),
            componentSnapshotId = componentSnapshotId
        )
    }
}

data class SimpleArtifact(
    val name: String,
    val artifact: String
)
