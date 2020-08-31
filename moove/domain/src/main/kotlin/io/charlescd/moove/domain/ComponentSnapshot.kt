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

data class ComponentSnapshot(
    val id: String,
    val componentId: String,
    val name: String,
    val createdAt: LocalDateTime = LocalDateTime.now(),
    val artifact: ArtifactSnapshot? = null,
    val workspaceId: String,
    val moduleSnapshotId: String,
    val hostValue: String?,
    val gatewayName: String?,
    val namespace: String?
) {
    companion object {
        fun from(id: String, moduleSnapshotId: String, component: Component) = ComponentSnapshot(
            id = id,
            componentId = component.id,
            name = component.name,
            createdAt = component.createdAt,
            workspaceId = component.workspaceId,
            moduleSnapshotId = moduleSnapshotId,
            hostValue = component.hostValue,
            gatewayName = component.gatewayName,
            namespace = component.namespace
        )
    }
}
