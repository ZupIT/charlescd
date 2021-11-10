/*
 * Copyright 2020, 2021 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
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

import io.charlescd.moove.application.CircleService
import io.charlescd.moove.application.DeploymentService
import io.charlescd.moove.application.KeyValueRuleService
import io.charlescd.moove.application.WebhookEventService
import io.charlescd.moove.application.WorkspaceService
import io.charlescd.moove.application.deployment.DeploymentCallbackInteractor
import io.charlescd.moove.application.deployment.request.DeploymentCallbackRequest
import io.charlescd.moove.application.deployment.request.DeploymentRequestStatus
import io.charlescd.moove.domain.*
import io.charlescd.moove.domain.service.CircleMatcherService
import java.time.LocalDateTime
import java.util.*
import javax.inject.Named
import javax.transaction.Transactional

@Named
open class DeploymentCallbackInteractorImpl(
    private val deploymentService: DeploymentService,
    private val webhookEventService: WebhookEventService,
    private val circleMatcherService: CircleMatcherService,
    private val workspaceService: WorkspaceService,
    private val circleService: CircleService,
    private val keyValueRuleService: KeyValueRuleService
) : DeploymentCallbackInteractor {

    @Transactional
    override fun execute(id: String, request: DeploymentCallbackRequest) {
        val deployment = updateDeploymentInfo(id, request)
        if (request.isCallbackStatusSuccessful() && !deployment.circle.isDefaultCircle()) {
            updateStatusOfPreviousDeployment(deployment.circle.id)
        }
        updateStatusInCircleMatcher(deployment.circle, request)
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

    private fun updateStatusInCircleMatcher(circle: Circle, request: DeploymentCallbackRequest) {
        if (isSuccessCallback(request.deploymentStatus) && !circle.defaultCircle) {
            val workspace = this.workspaceService.find(circle.workspaceId)
            val isActive = request.deploymentStatus === DeploymentRequestStatus.SUCCEEDED
            if (circle.matcherType == MatcherTypeEnum.SIMPLE_KV) {
                this.updateImportOnMatcherAndSave(circle, workspace.circleMatcherUrl!!, isActive)
            } else {
                this.circleMatcherService.update(circle, circle.reference, workspace.circleMatcherUrl!!, isActive)
            }
        }
    }

    private fun updateImportOnMatcherAndSave(circle: Circle, matcherUrl: String, active: Boolean) {
        val updatedCircle = updateCircleMetadata(circle)
        val rules = keyValueRuleService.findByCircle(circle.id)
        rules.map { it.rule }.chunked(100).forEach {
            this.circleMatcherService.updateImport(updatedCircle, circle.reference, it, matcherUrl, active)
        }
    }

    private fun updateCircleMetadata(circle: Circle) = circleService.update(circle.copy(
            reference = UUID.randomUUID().toString()
    ))

    private fun isSuccessCallback(deploymentStatus: DeploymentRequestStatus): Boolean {
        return deploymentStatus === DeploymentRequestStatus.SUCCEEDED || deploymentStatus === DeploymentRequestStatus.UNDEPLOYED
    }

    private fun notifyEvent(request: DeploymentCallbackRequest, deployment: Deployment) {
        val webhookEventType = getWebhookEventType(request)
        val webhookEventSubType = getWebhookEventSubType(webhookEventType)
        val webhookEventStatus = getWebhookEventStatus(request)
        webhookEventService.notifyDeploymentEvent(deployment.workspaceId, webhookEventType, webhookEventSubType, webhookEventStatus, deployment)
    }

    private fun getWebhookEventType(callbackRequest: DeploymentCallbackRequest): WebhookEventTypeEnum {
        if (callbackRequest.isDeployEvent() || callbackRequest.deploymentStatus == DeploymentRequestStatus.TIMED_OUT) {
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
