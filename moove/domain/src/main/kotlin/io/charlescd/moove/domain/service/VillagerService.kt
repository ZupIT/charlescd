/*
 *
 *  * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *  *
 *  * Licensed under the Apache License, Version 2.0 (the "License");
 *  * you may not use this file except in compliance with the License.
 *  * You may obtain a copy of the License at
 *  *
 *  *     http://www.apache.org/licenses/LICENSE-2.0
 *  *
 *  * Unless required by applicable law or agreed to in writing, software
 *  * distributed under the License is distributed on an "AS IS" BASIS,
 *  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  * See the License for the specific language governing permissions and
 *  * limitations under the License.
 *
 */

package io.charlescd.moove.domain.service

import io.charlescd.moove.domain.Build
import io.charlescd.moove.domain.RegistryConfiguration
import io.charlescd.moove.domain.SimpleArtifact

interface VillagerService {

    fun build(build: Build, registryConfigurationId: String)

    fun createRegistryConfiguration(registryConfiguration: RegistryConfiguration): String

    fun checkIfRegistryConfigurationExists(id: String, workspaceId: String): Boolean

    fun delete(id: String, workspaceId: String)

    fun findRegistryConfigurationNameById(id: String, workspaceId: String): String?

    fun findComponentTags(
        componentName: String,
        registryConfigurationId: String,
        workspaceId: String
    ): List<SimpleArtifact>
}
