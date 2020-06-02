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

import io.charlescd.moove.application.*
import io.charlescd.moove.application.deployment.CreateDeploymentInteractor
import io.charlescd.moove.application.deployment.request.CreateDeploymentRequest
import io.charlescd.moove.application.deployment.response.DeploymentResponse
import io.charlescd.moove.domain.*
import io.charlescd.moove.domain.exceptions.BusinessException
import io.charlescd.moove.domain.service.DeployService
import javax.inject.Inject
import javax.inject.Named
import org.springframework.transaction.annotation.Transactional

@Named
open class CreateDeploymentInteractorImpl @Inject constructor(
    private val deploymentService: DeploymentService,
    private val buildService: BuildService,
    private val userService: UserService,
    private val circleService: CircleService,
    private val deployService: DeployService,
    private val workspaceService: WorkspaceService
) : CreateDeploymentInteractor {

    @Transactional
    override fun execute(request: CreateDeploymentRequest, workspaceId: String): DeploymentResponse {
        val build: Build = buildService.find(request.buildId, workspaceId)
        val workspace = workspaceService.find(workspaceId)
        validateWorkspace(workspace)

        if (build.canBeDeployed()) {
            val deployment = createDeployment(request, workspaceId)
            undeployActiveDeploymentFromCircleIfExists(deployment, workspaceId)
            deploymentService.save(deployment)
            deployService.deploy(deployment, build, deployment.circle.isDefaultCircle(), workspace.cdConfigurationId!!)
            return DeploymentResponse.from(deployment, build)
        } else {
            throw BusinessException.of(MooveErrorCode.DEPLOY_INVALID_BUILD).withParameters(build.id)
        }
    }

    private fun validateWorkspace(workspace: Workspace) {
        workspace.cdConfigurationId ?: throw BusinessException.of(MooveErrorCode.WORKSPACE_CD_CONFIGURATION_IS_MISSING)
    }

    private fun createDeployment(
        request: CreateDeploymentRequest,
        workspaceId: String
    ): Deployment {
        val user = userService.find(request.authorId)
        val circle = circleService.find(request.circleId)
        return request.toDeployment(workspaceId, user, circle)
    }

    private fun undeployActiveDeploymentFromCircleIfExists(
        deployment: Deployment,
        workspaceId: String
    ) {
        findActiveDeployment(deployment.circle.id, workspaceId)
            ?.also { deployService.undeploy(it.id, it.author.id) }
            ?.let { deploymentService.updateStatus(it.id, DeploymentStatusEnum.UNDEPLOYING) }
    }

    private fun findActiveDeployment(circleId: String, workspaceId: String): Deployment? {
        return deploymentService.findByCircleIdAndWorkspaceId(circleId, workspaceId).filter { deployment ->
            deployment.isActive()
        }.maxBy { it.createdAt }
    }
}
