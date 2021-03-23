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
    private val workspaceService: WorkspaceService,
    private val deploymentConfigurationService: DeploymentConfigurationService,
    private val webhookEventService: WebhookEventService
) : CreateDeploymentInteractor {

    @Transactional
    override fun execute(
        request: CreateDeploymentRequest,
        workspaceId: String,
        authorization: String
    ): DeploymentResponse {
        val build: Build = getBuild(request.buildId, workspaceId)
        val workspace = workspaceService.find(workspaceId)
        validateWorkspace(workspace)
        val user = userService.findByAuthorizationToken(authorization)
        val deploymentConfiguration = deploymentConfigurationService.find(workspace.deploymentConfigurationId!!)
        val deployment = createDeployment(request, workspaceId, user)

        if (build.canBeDeployed()) {
            checkIfCircleCanBeDeployed(deployment.circle)
            deploymentService.save(deployment)
            deploy(deployment, build, workspace, deploymentConfiguration)
            return DeploymentResponse.from(deployment, build)
        } else {
            notifyEvent(workspaceId, WebhookEventStatusEnum.FAIL, deployment)
            throw BusinessException.of(MooveErrorCode.DEPLOY_INVALID_BUILD).withParameters(build.id)
        }
    }

    private fun getBuild(buildId: String, workspaceId: String): Build {
        try {
            return buildService.find(buildId, workspaceId)
        } catch (ex: Exception) {
            notifyEvent(workspaceId, WebhookEventStatusEnum.FAIL, null, ex.message!!)
            throw ex
        }
    }

    private fun checkIfCircleCanBeDeployed(circle: Circle) {
        if (circle.isPercentage()) {
            this.circleService.checkIfPercentageCircleCanDeploy(circle, workspaceId = circle.workspaceId)
        }
    }

    private fun validateWorkspace(workspace: Workspace) {
        workspace.deploymentConfigurationId ?: throw BusinessException.of(MooveErrorCode.WORKSPACE_DEPLOYMENT_CONFIGURATION_IS_MISSING)
    }

    private fun createDeployment(
        request: CreateDeploymentRequest,
        workspaceId: String,
        user: User
    ): Deployment {
        val user = user
        val circle = circleService.find(request.circleId)
        return request.toDeployment(workspaceId, user, circle)
    }

    private fun notifyEvent(
        workspaceId: String,
        status: WebhookEventStatusEnum,
        deployment: Deployment?,
        error: String? = null
    ) {
            webhookEventService.notifyDeploymentEvent(workspaceId, WebhookEventTypeEnum.DEPLOY, WebhookEventSubTypeEnum.START_DEPLOY, status, deployment, error)
    }

    private fun deploy(deployment: Deployment, build: Build, workspace: Workspace, deploymentConfiguration: DeploymentConfiguration) {
        try {
            deployService.deploy(deployment, build, deployment.circle.isDefaultCircle(), deploymentConfiguration)
            notifyEvent(workspace.id, WebhookEventStatusEnum.SUCCESS, deployment)
        } catch (ex: Exception) {
            notifyEvent(workspace.id, WebhookEventStatusEnum.FAIL, deployment, ex.message)
            throw ex
        }
    }
}
