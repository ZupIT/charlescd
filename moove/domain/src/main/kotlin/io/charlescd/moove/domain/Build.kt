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

data class Build(
    val id: String,
    val author: User,
    val createdAt: LocalDateTime,
    val features: List<FeatureSnapshot>,
    val tag: String,
    val columnId: String? = null,
    val hypothesisId: String? = null,
    val status: BuildStatusEnum,
    val workspaceId: String,
    val deployments: List<Deployment> = emptyList()
) {

    fun canBeUpdated(): Boolean {
        return this.status == BuildStatusEnum.BUILDING
    }

    fun canBeDeployed(): Boolean {
        return this.status == BuildStatusEnum.BUILT || this.status == BuildStatusEnum.VALIDATED
    }

    fun canBeArchived(): Boolean {
        return this.deployments.none {
            it.status == DeploymentStatusEnum.DEPLOYING || it.status == DeploymentStatusEnum.DEPLOYED
        }
    }

    fun modules(): List<ModuleSnapshot> {
        return this.features.flatMap { feature ->
            feature.modules
        }
    }

    fun components(): List<ComponentSnapshot> {
        return this.features.flatMap { feature -> feature.modules }.flatMap { module -> module.components }
    }

    fun artifacts(): List<ArtifactSnapshot> {
        return this.features.flatMap { feature -> feature.modules }.flatMap { module -> module.components }
            .mapNotNull { component -> component.artifact }
    }

    fun findComponentByModuleIdAndArtifactName(moduleId: String, artifactName: String): ComponentSnapshot {
        return this.modules().first { module ->
            module.moduleId == moduleId
        }.components.first { component ->
            artifactName.contains(component.name)
        }
    }

    fun modulesDistincted(): List<ModuleSnapshot> {
        return this.features.flatMap { feature ->
            feature.modules
        }.distinct()
    }
}
