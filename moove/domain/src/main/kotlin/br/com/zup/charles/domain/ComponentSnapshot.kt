/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charles.domain

import java.time.LocalDateTime

data class ComponentSnapshot(
    val id: String,
    val componentId: String,
    val name: String,
    val contextPath: String?,
    val port: Int?,
    val healthCheck: String?,
    val createdAt: LocalDateTime = LocalDateTime.now(),
    val artifact: ArtifactSnapshot? = null,
    val applicationId: String,
    val moduleSnapshotId: String
) {
    companion object {
        fun from(id: String, moduleSnapshotId: String, component: Component) = ComponentSnapshot(
            id = id,
            componentId = component.id,
            name = component.name,
            contextPath = component.contextPath,
            port = component.port,
            healthCheck = component.healthCheck,
            createdAt = component.createdAt,
            applicationId = component.applicationId,
            moduleSnapshotId = moduleSnapshotId
        )
    }
}