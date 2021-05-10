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

package io.charlescd.moove.application.workspace.impl

import io.charlescd.moove.application.DeploymentConfigurationService
import io.charlescd.moove.application.ResourcePageResponse
import io.charlescd.moove.application.WorkspaceService
import io.charlescd.moove.application.workspace.FindAllWorkspaceInteractor
import io.charlescd.moove.application.workspace.response.SimpleWorkspaceResponse
import io.charlescd.moove.domain.DeploymentConfiguration
import io.charlescd.moove.domain.Page
import io.charlescd.moove.domain.PageRequest
import io.charlescd.moove.domain.SimpleWorkspace
import javax.inject.Inject
import javax.inject.Named

@Named
class FindAllWorkspaceInteractorImpl @Inject constructor(
    private val workspaceService: WorkspaceService,
    private val deploymentConfigurationService: DeploymentConfigurationService
) : FindAllWorkspaceInteractor {

    override fun execute(pageRequest: PageRequest, name: String?): ResourcePageResponse<SimpleWorkspaceResponse> {
        val workspaces = workspaceService.findAll(pageRequest, name)
        val deploymentConfigurations = workspaces.content.map { workspace ->
            workspace.deploymentConfigurationId?.let {
                deploymentConfigurationService.find(it)
            }
        }
        return convert(workspaces, deploymentConfigurations)
    }

    private fun convert(page: Page<SimpleWorkspace>, deploymentConfigurations: List<DeploymentConfiguration?>): ResourcePageResponse<SimpleWorkspaceResponse> {
        return ResourcePageResponse(
            content = page.content.map { workspace ->
                SimpleWorkspaceResponse.from(
                    workspace, deploymentConfigurations.find { workspace.id == it?.workspaceId }
                )
           },
            page = page.pageNumber,
            size = page.size(),
            isLast = page.isLast(),
            totalPages = page.totalPages()
        )
    }
}
