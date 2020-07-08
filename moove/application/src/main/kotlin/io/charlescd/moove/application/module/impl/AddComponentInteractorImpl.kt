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
import io.charlescd.moove.application.build.response.ComponentResponse
import io.charlescd.moove.application.module.AddComponentInteractor
import io.charlescd.moove.application.module.request.ComponentRequest
import io.charlescd.moove.domain.Module
import io.charlescd.moove.domain.MooveErrorCode
import io.charlescd.moove.domain.exceptions.BusinessException
import javax.inject.Named
import javax.transaction.Transactional

@Named
open class AddComponentInteractorImpl(private val moduleService: ModuleService) : AddComponentInteractor {

    @Transactional
    override fun execute(id: String, workspaceId: String, request: ComponentRequest): ComponentResponse {
        val module = moduleService.find(id, workspaceId)
        checkIfComponentAlreadyExist(module, request)

        val component = request.toDomain(module.id, workspaceId)

        moduleService.addComponents(module.copy(components = listOf(component)))

        return ComponentResponse.from(component)
    }

    private fun checkIfComponentAlreadyExist(
        module: Module,
        request: ComponentRequest
    ) {
        module.findComponentByName(request.name)
            ?.let { throw BusinessException.of(MooveErrorCode.COMPONENT_ALREADY_REGISTERED) }
    }
}
