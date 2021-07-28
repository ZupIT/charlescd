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
import io.charlescd.moove.application.WorkspaceService
import io.charlescd.moove.application.module.FindComponentTagsInteractor
import io.charlescd.moove.application.module.response.ComponentTagResponse
import io.charlescd.moove.domain.Component
import io.charlescd.moove.domain.Module
import io.charlescd.moove.domain.MooveErrorCode
import io.charlescd.moove.domain.Workspace
import io.charlescd.moove.domain.exceptions.BusinessException
import io.charlescd.moove.domain.exceptions.NotFoundException
import io.charlescd.moove.domain.service.VillagerService
import javax.inject.Named

@Named
class FindComponentTagsInteractorImpl(
    private val moduleService: ModuleService,
    private val workspaceService: WorkspaceService,
    private val villagerService: VillagerService
) : FindComponentTagsInteractor {

    override fun execute(moduleId: String, componentId: String, name: String, workspaceId: String): List<ComponentTagResponse> {
        val workspace = workspaceService.find(workspaceId)
        validateWorkspace(workspace)
        val component = findComponent(moduleService.find(moduleId, workspaceId), componentId)
        return askVillagerForComponentTags(component, workspace, name, workspaceId)
    }

    private fun askVillagerForComponentTags(
        component: Component,
        workspace: Workspace,
        name: String,
        workspaceId: String
    ): List<ComponentTagResponse> {
        return villagerService.findComponentTags(
            component.name,
            workspace.registryConfigurationId!!,
            name,
            workspaceId
        ).map { ComponentTagResponse(it.name, it.artifact) }
    }

    private fun validateWorkspace(workspace: Workspace) {
        workspace.registryConfigurationId
            ?: throw BusinessException.of(MooveErrorCode.WORKSPACE_DOCKER_REGISTRY_CONFIGURATION_IS_MISSING)
    }

    private fun findComponent(module: Module, componentId: String): Component {
        return module.findComponentById(componentId)
            ?: throw NotFoundException("component", componentId)
    }
}
