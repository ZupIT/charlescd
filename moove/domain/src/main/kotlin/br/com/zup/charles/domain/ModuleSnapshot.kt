/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charles.domain

import java.time.LocalDateTime
import java.util.*

data class ModuleSnapshot(
    val id: String,
    val moduleId: String,
    val name: String,
    val gitRepositoryAddress: String,
    val createdAt: LocalDateTime,
    val helmRepository: String,
    val components: List<ComponentSnapshot> = listOf(),
    val gitConfigurationId: String,
    val registryConfigurationId: String,
    val cdConfigurationId: String,
    val applicationId: String,
    val featureSnapshotId: String
) {

    companion object {
        fun from(id: String, featureSnapshotId: String, module: Module) = ModuleSnapshot(
            id = id,
            moduleId = module.id,
            name = module.name,
            gitRepositoryAddress = module.gitRepositoryAddress,
            createdAt = module.createdAt,
            helmRepository = module.helmRepository,
            applicationId = module.applicationId,
            featureSnapshotId = featureSnapshotId,
            gitConfigurationId = module.gitConfiguration.id,
            registryConfigurationId = module.registryConfigurationId,
            cdConfigurationId = module.cdConfigurationId,
            components = module.components.map {
                ComponentSnapshot.from(UUID.randomUUID().toString(), id, it)
            }
        )
    }
}