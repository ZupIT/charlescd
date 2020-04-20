/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charles.domain

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