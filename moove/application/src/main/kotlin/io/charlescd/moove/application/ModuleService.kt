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

import io.charlescd.moove.domain.Component
import io.charlescd.moove.domain.Module
import io.charlescd.moove.domain.Page
import io.charlescd.moove.domain.PageRequest
import io.charlescd.moove.domain.exceptions.NotFoundException
import io.charlescd.moove.domain.repository.ModuleRepository
import javax.inject.Named

@Named
class ModuleService(private val moduleRepository: ModuleRepository) {

    fun create(module: Module): Module {
        return moduleRepository.save(module)
    }

    fun update(module: Module): Module {
        return moduleRepository.update(module)
    }

    fun delete(module: Module) {
        moduleRepository.delete(module.id, module.workspaceId)
    }

    fun addComponents(module: Module) {
        moduleRepository.addComponents(module)
    }

    fun removeComponents(module: Module) {
        moduleRepository.removeComponents(module)
    }

    fun updateComponent(component: Component) {
        moduleRepository.updateComponent(component)
    }

    fun find(id: String): Module {
        return moduleRepository.find(id).orElseThrow {
            NotFoundException("module", id)
        }
    }

    fun find(id: String, workspaceId: String): Module {
        return moduleRepository.find(id, workspaceId).orElseThrow {
            NotFoundException("module", id)
        }
    }

    fun findByWorkspaceId(workspaceId: String, name: String?, pageRequest: PageRequest): Page<Module> {
        return moduleRepository.findByWorkspaceId(workspaceId, name, pageRequest)
    }

    fun findByIds(ids: List<String>): List<Module> {
        return moduleRepository.findByIds(ids)
    }
}
