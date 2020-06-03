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

package io.charlescd.moove.application.module.impl

import io.charlescd.moove.application.ModuleService
import io.charlescd.moove.application.build.response.ComponentResponse
import io.charlescd.moove.application.module.UpdateComponentInteractor
import io.charlescd.moove.application.module.request.ComponentRequest
import io.charlescd.moove.domain.Component
import io.charlescd.moove.domain.Module
import io.charlescd.moove.domain.exceptions.NotFoundException
import javax.inject.Inject
import javax.inject.Named

@Named
class UpdateComponentInteractorImpl @Inject constructor(private val moduleService: ModuleService) :
    UpdateComponentInteractor {

    override fun execute(
        moduleId: String,
        componentId: String,
        workspaceId: String,
        request: ComponentRequest
    ): ComponentResponse {
        val module = moduleService.find(moduleId, workspaceId)
        checkIfComponentExists(module, componentId)
        val updatedComponent = buildUpdatedComponent(module, componentId, request)
        moduleService.updateComponent(updatedComponent)
        return ComponentResponse.from(updatedComponent)
    }

    private fun buildUpdatedComponent(
        module: Module,
        componentId: String,
        request: ComponentRequest
    ): Component {
        val component = module.components.first { it.id == componentId }
        return component.copy(
            name = request.name,
            errorThreshold = request.errorThreshold,
            latencyThreshold = request.latencyThreshold
        )
    }

    private fun checkIfComponentExists(module: Module, componentId: String) {
        if (module.components.none { it.id == componentId }) {
            throw NotFoundException("component", componentId)
        }
    }
}
