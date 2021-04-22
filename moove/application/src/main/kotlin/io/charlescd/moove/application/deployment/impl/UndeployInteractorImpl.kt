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

import io.charlescd.moove.application.DeploymentService
import io.charlescd.moove.application.UserService
import io.charlescd.moove.application.WebhookEventService
import io.charlescd.moove.application.deployment.UndeployInteractor
import io.charlescd.moove.domain.*
import io.charlescd.moove.domain.service.DeployService
import javax.inject.Inject
import javax.inject.Named
import org.springframework.transaction.annotation.Transactional

@Named
open class UndeployInteractorImpl @Inject constructor(
    private val deploymentService: DeploymentService,
    private val userService: UserService,
    private val deployService: DeployService,
    private val webhookEventService: WebhookEventService
) : UndeployInteractor {

    @Transactional
    override fun execute(workspaceId: String, authorization: String?, token: String?, id: String) {
        val deployment: Deployment = getDeployment(id, workspaceId)
        updateDeploymentStatus(deployment)
        undeploy(authorization, token, deployment)
    }

    private fun updateDeploymentStatus(deployment: Deployment): Deployment {
        return deploymentService.update(deployment.copy(status = DeploymentStatusEnum.UNDEPLOYING))
    }

    private fun getAuthorId(authorization: String?, token: String?): String {
        return userService.findFromAuthMethods(authorization, token).id
    }

    private fun undeploy(authorization: String?, token: String?, deployment: Deployment) {
        try {
            deployService.undeploy(deployment.id, getAuthorId(authorization, token))
            notifyEvent(deployment.workspaceId, WebhookEventStatusEnum.SUCCESS, deployment)
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

    private fun getDeployment(deploymentId: String, workspaceId: String): Deployment {
        try {
            return deploymentService.findByIdAndWorkspace(deploymentId, workspaceId)
        } catch (ex: Exception) {
            notifyEvent(workspaceId, WebhookEventStatusEnum.FAIL, null, ex.message!!)
            throw ex
        }
    }
}
