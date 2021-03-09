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

package io.charlescd.moove.application.deployment.impl

import io.charlescd.moove.application.ButlerConfigurationService
import io.charlescd.moove.application.DeploymentService
import io.charlescd.moove.application.WorkspaceService
import io.charlescd.moove.application.deployment.CreateUndeploymentInteractor
import io.charlescd.moove.domain.DeploymentStatusEnum
import io.charlescd.moove.domain.MooveErrorCode
import io.charlescd.moove.domain.Workspace
import io.charlescd.moove.domain.exceptions.BusinessException
import io.charlescd.moove.domain.service.DeployService
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime
import javax.inject.Inject
import javax.inject.Named

@Named
open class CreateUndeploymentInteractorImpl @Inject constructor(
    private val deploymentService: DeploymentService,
    private val deployService: DeployService,
    private val workspaceService: WorkspaceService,
    private val butlerConfigurationService: ButlerConfigurationService
) : CreateUndeploymentInteractor {

    @Transactional
    override fun execute(deploymentId: String, workspaceId: String) {
        val deployment = deploymentService.findByIdAndWorkspaceId(deploymentId, workspaceId)
        val workspace = workspaceService.find(workspaceId)
        validateWorkspace(workspace)
        val butlerConfiguration = butlerConfigurationService.find(workspace.butlerConfigurationId!!)

        deployService.undeploy(deploymentId, deployment.author.id, butlerConfiguration)
        deploymentService.update(deployment.copy(status = DeploymentStatusEnum.NOT_DEPLOYED, undeployedAt = LocalDateTime.now()))
    }

    private fun validateWorkspace(workspace: Workspace) {
        workspace.butlerConfigurationId ?: throw BusinessException.of(MooveErrorCode.WORKSPACE_BUTLER_CONFIGURATION_IS_MISSING)
    }
}
