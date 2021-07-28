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

package io.charlescd.moove.application.deployment.impl

import io.charlescd.moove.application.DeploymentConfigurationService
import io.charlescd.moove.application.UserService
import io.charlescd.moove.application.WorkspaceService
import io.charlescd.moove.application.deployment.FindDeploymentLogsInteractor
import io.charlescd.moove.domain.MooveErrorCode
import io.charlescd.moove.domain.Workspace
import io.charlescd.moove.domain.exceptions.BusinessException
import io.charlescd.moove.infrastructure.service.client.DeployClient
import io.charlescd.moove.infrastructure.service.client.response.LogResponse
import java.net.URI
import javax.inject.Named

@Named
class FindDeploymentLogsInteractorImpl(
    private val userService: UserService,
    private val workspaceService: WorkspaceService,
    private val deploymentConfigurationService: DeploymentConfigurationService,
    private val deployClient: DeployClient
) : FindDeploymentLogsInteractor {
    override fun execute(workspaceId: String, authorization: String?, token: String?, deploymentId: String): LogResponse {
        val workspace = workspaceService.find(workspaceId)
        validateWorkspace(workspace)
        val deploymentConfiguration = deploymentConfigurationService.find(workspace.deploymentConfigurationId!!)
        this.userService.findFromAuthMethods(authorization, token)
        return this.deployClient.getDeploymentLogs(URI.create(deploymentConfiguration.butlerUrl), workspaceId, deploymentId)
    }

    private fun validateWorkspace(workspace: Workspace) {
        workspace.deploymentConfigurationId ?: throw BusinessException.of(MooveErrorCode.WORKSPACE_DEPLOYMENT_CONFIGURATION_IS_MISSING)
    }
}
