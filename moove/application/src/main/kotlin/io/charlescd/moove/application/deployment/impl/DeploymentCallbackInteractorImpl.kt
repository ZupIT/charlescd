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

import io.charlescd.moove.application.DeploymentService
import io.charlescd.moove.application.WebhookEventService
import io.charlescd.moove.application.deployment.DeploymentCallbackInteractor
import io.charlescd.moove.application.deployment.request.DeploymentCallbackRequest
import io.charlescd.moove.application.deployment.request.DeploymentRequestStatus
import io.charlescd.moove.domain.*
import java.time.LocalDateTime
import javax.inject.Named
import javax.transaction.Transactional

@Named
open class DeploymentCallbackInteractorImpl(
    private val deploymentService: DeploymentService,
    private val webhookEventService: WebhookEventService
) :
    DeploymentCallbackInteractor {

    @Transactional
    override fun execute(id: String, request: DeploymentCallbackRequest) {
        val deployment = updateDeploymentInfo(id, request)
        if (request.isCallbackStatusSuccessful() && !deployment.circle.isDefaultCircle()) {
            updateStatusOfPreviousDeployment(deployment.circle.id)
        }
        deploymentService.update(deployment)
        notifyEvent(request, deployment)
    }

    private fun updateDeploymentInfo(deploymentId: String, request: DeploymentCallbackRequest): Deployment {
        val deployment = deploymentService.find(deploymentId)

        return when (request.deploymentStatus) {
            DeploymentRequestStatus.SUCCEEDED -> deployment.copy(
                status = DeploymentStatusEnum.DEPLOYED,
                deployedAt = LocalDateTime.now()
            )
            DeploymentRequestStatus.FAILED -> deployment.copy(status = DeploymentStatusEnum.DEPLOY_FAILED)
            DeploymentRequestStatus.UNDEPLOYED -> deployment.copy(
                status = DeploymentStatusEnum.NOT_DEPLOYED,
                undeployedAt = LocalDateTime.now()
            )
            DeploymentRequestStatus.UNDEPLOY_FAILED -> deployment.copy(status = DeploymentStatusEnum.DEPLOYED)
            DeploymentRequestStatus.TIMED_OUT -> deployment.copy(status = DeploymentStatusEnum.DEPLOY_FAILED)
        }
    }

    private fun updateStatusOfPreviousDeployment(circleId: String) {
        this.deploymentService.findByCircleIdAndStatus(circleId, DeploymentStatusEnum.DEPLOYED)
            .map { deployment ->
                this.deploymentService.updateStatus(
                    deployment.id,
                    DeploymentStatusEnum.NOT_DEPLOYED
                )
            }
    }

    private fun notifyEvent(request: DeploymentCallbackRequest, deployment: Deployment) {
        val webhookEventType = getWebhookEventType(request, deployment)
        val webhookEventSubType = getWebhookEventSubType(webhookEventType)
        val webhookEventStatus = getWebhookEventStatus(request)
        val simpleWebhookEvent = SimpleWebhookEvent(deployment.workspaceId, webhookEventType, webhookEventSubType, webhookEventStatus)
        webhookEventService.notifyDeploymentEvent(simpleWebhookEvent, deployment)
    }

    private fun getWebhookEventType(callbackRequest: DeploymentCallbackRequest, deployment: Deployment): WebhookEventTypeEnum {
        if (callbackRequest.isDeployEvent() || deployment.deployedAt != null) {
            return WebhookEventTypeEnum.DEPLOY
        }
        return WebhookEventTypeEnum.UNDEPLOY
    }

    private fun getWebhookEventSubType(eventType: WebhookEventTypeEnum): WebhookEventSubTypeEnum {
        if (eventType == WebhookEventTypeEnum.DEPLOY) {
            return WebhookEventSubTypeEnum.FINISH_DEPLOY
        }
        return WebhookEventSubTypeEnum.FINISH_UNDEPLOY
    }

    private fun getWebhookEventStatus(callbackRequest: DeploymentCallbackRequest): WebhookEventStatusEnum {
        if (callbackRequest.isEventStatusSuccessful()) {
            return WebhookEventStatusEnum.SUCCESS
        }

        if (callbackRequest.isEventStatusFailure()) {
            return WebhookEventStatusEnum.FAIL
        }
        return WebhookEventStatusEnum.TIMEOUT
    }
}
