/*
 *
 *  * Copyright 2020, 2021 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
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
import io.charlescd.moove.application.deployment.UndeployInteractor
import io.charlescd.moove.domain.*
import io.charlescd.moove.domain.exceptions.BusinessException
import io.charlescd.moove.domain.service.CircleMatcherService
import io.charlescd.moove.domain.service.DeployService
import java.time.LocalDateTime
import java.util.*
import javax.inject.Inject
import javax.inject.Named
import org.springframework.transaction.annotation.Transactional

@Named
open class UndeployInteractorImpl @Inject constructor(
    private val deploymentService: DeploymentService,
    private val userService: UserService,
    private val deployService: DeployService,
    private val webhookEventService: WebhookEventService,
    private val workspaceService: WorkspaceService,
    private val deploymentConfigurationService: DeploymentConfigurationService,
    private val circleMatcherService: CircleMatcherService,
    private val circleService: CircleService,
    private val keyValueRuleService: KeyValueRuleService
) : UndeployInteractor {

    @Transactional
    override fun execute(workspaceId: String, authorization: String?, token: String?, id: String) {
        val deployment: Deployment = getDeployment(id, workspaceId)
        val workspace = workspaceService.find(workspaceId)
        validateWorkspace(workspace)

        notifyEvent(deployment.workspaceId, WebhookEventStatusEnum.SUCCESS, deployment)
        val deploymentConfiguration = deploymentConfigurationService.find(workspace.deploymentConfigurationId!!)
        undeploy(authorization, token, deployment, deploymentConfiguration)
        setNotDeployedStatus(deployment)
    }

    private fun getAuthorId(authorization: String?, token: String?): String {
        return userService.findFromAuthMethods(authorization, token).id
    }

    private fun undeploy(authorization: String?, token: String?, deployment: Deployment, deploymentConfiguration: DeploymentConfiguration) {
        try {
            deployService.undeploy(deployment.id, getAuthorId(authorization, token), deploymentConfiguration)
        } catch (ex: Exception) {
            notifyEvent(deployment.workspaceId, WebhookEventStatusEnum.FAIL, deployment, ex.message!!)
            throw ex
        }
    }

    private fun notifyEvent(
        workspaceId: String,
        status: WebhookEventStatusEnum,
        deployment: Deployment? = null,
        error: String? = null
    ) {
            webhookEventService.notifyDeploymentEvent(
                workspaceId,
                WebhookEventTypeEnum.UNDEPLOY,
                WebhookEventSubTypeEnum.START_UNDEPLOY,
                status, deployment, error
            )
    }

    private fun setNotDeployedStatus(deployment: Deployment) {
        try {
            deploymentService.update(deployment.copy(status = DeploymentStatusEnum.NOT_DEPLOYED, undeployedAt = LocalDateTime.now()))
        } catch (ex: Exception) {
            throw ex
        }
    }

    private fun updateStatusInCircleMatcher(circle: Circle, workspace: Workspace) {
        if (circle.matcherType == MatcherTypeEnum.SIMPLE_KV) {
            this.updateImportOnMatcherAndSave(circle, workspace.circleMatcherUrl!!, active = false)
        } else {
            this.circleMatcherService.update(circle, circle.reference, workspace.circleMatcherUrl!!, active = false)
        }
    }

    private fun updateImportOnMatcherAndSave(circle: Circle, matcherUrl: String, active: Boolean) {
        val updatedCircle = updateCircleMetadata(circle)
        val rules = keyValueRuleService.findByCircle(circle.id)
        rules.map {
            it.rule }.chunked(100).forEach {
            this.circleMatcherService.updateImport(updatedCircle, circle.reference, it, matcherUrl, active)
        }
    }

    private fun updateCircleMetadata(circle: Circle) = circleService.update(circle.copy(
        reference = UUID.randomUUID().toString()
    ))

    private fun getDeployment(deploymentId: String, workspaceId: String): Deployment {
        try {
            return deploymentService.findByIdAndWorkspaceId(deploymentId, workspaceId)
        } catch (ex: Exception) {
            notifyEvent(workspaceId, WebhookEventStatusEnum.FAIL, null, ex.message!!)
            throw ex
        }
    }

    private fun validateWorkspace(workspace: Workspace) {
        workspace.deploymentConfigurationId ?: throw BusinessException.of(MooveErrorCode.WORKSPACE_DEPLOYMENT_CONFIGURATION_IS_MISSING)
    }
}
