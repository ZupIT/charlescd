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

data class Deployment(
    val id: String,
    val author: User,
    val createdAt: LocalDateTime,
    val deployedAt: LocalDateTime?,
    val status: DeploymentStatusEnum,
    val circle: Circle,
    val buildId: String,
    val workspaceId: String,
    val undeployedAt: LocalDateTime?
) {
    fun isActive(): Boolean =
        (this.status == DeploymentStatusEnum.DEPLOYED || this.status == DeploymentStatusEnum.DEPLOYING) && !this.circle.isDefaultCircle()
}
