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

package io.charlescd.moove.application.module.impl

import io.charlescd.moove.application.ModuleService
import io.charlescd.moove.application.module.RemoveComponentInteractor
import io.charlescd.moove.domain.Module
import io.charlescd.moove.domain.MooveErrorCode
import io.charlescd.moove.domain.exceptions.BusinessException
import io.charlescd.moove.domain.exceptions.NotFoundException
import javax.inject.Named
import javax.transaction.Transactional

@Named
open class RemoveComponentInteractorImpl(private val moduleService: ModuleService) : RemoveComponentInteractor {

    @Transactional
    override fun execute(moduleId: String, componentId: String, workspaceId: String) {
        val module = moduleService.find(moduleId, workspaceId)
        checkIfComponentExists(module, componentId)
        checkIfCanBeRemoved(module)
        moduleService.removeComponents(
            module.copy(components = module.findComponentsByIds(listOf(componentId)))
        )
    }

    private fun checkIfComponentExists(module: Module, componentId: String) {
        if (module.components.none { it.id == componentId }) {
            throw NotFoundException("component", componentId)
        }
    }

    private fun checkIfCanBeRemoved(module: Module) {
        if (module.components.size == 1) {
            throw BusinessException.of(MooveErrorCode.MODULE_MUST_HAVE_AT_LEAST_ONE_COMPONENT)
        }
    }
}
