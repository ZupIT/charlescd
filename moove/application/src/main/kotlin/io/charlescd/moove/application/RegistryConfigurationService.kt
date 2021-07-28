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

package io.charlescd.moove.application

import io.charlescd.moove.domain.exceptions.NotFoundException
import io.charlescd.moove.domain.service.VillagerService
import javax.inject.Named

@Named
class RegistryConfigurationService(private val villagerService: VillagerService) {

    fun checkIfRegistryConfigurationExists(workspaceId: String, registryConfigurationId: String) {
        if (!this.villagerService.checkIfRegistryConfigurationExists(registryConfigurationId, workspaceId)) {
            throw NotFoundException("registryConfigurationId", registryConfigurationId)
        }
    }

    fun findByName(registryConfigurationId: String, workspaceId: String): String {
        return this.villagerService.findRegistryConfigurationNameById(registryConfigurationId, workspaceId)
            ?: throw NotFoundException("registryConfigurationId", registryConfigurationId)
    }
}
