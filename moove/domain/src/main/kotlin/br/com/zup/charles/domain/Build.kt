/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charles.domain

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
    val applicationId: String,
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
            module.id == moduleId
        }.components.first { component ->
            artifactName.contains(component.name)
        }
    }
}
