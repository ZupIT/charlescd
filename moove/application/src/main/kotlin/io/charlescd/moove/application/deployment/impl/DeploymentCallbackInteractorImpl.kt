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

import io.charlescd.moove.application.BuildService
import io.charlescd.moove.application.DeploymentService
import io.charlescd.moove.application.deployment.DeploymentCallbackInteractor
import io.charlescd.moove.application.deployment.request.DeploymentCallbackRequest
import io.charlescd.moove.application.deployment.request.DeploymentRequestStatus
import io.charlescd.moove.domain.*
import io.charlescd.moove.domain.service.HermesService
import java.time.LocalDateTime
import javax.inject.Named
import javax.transaction.Transactional

@Named
open class DeploymentCallbackInteractorImpl(
    private val deploymentService: DeploymentService,
    private val hermesService: HermesService,
    private val buildService: BuildService
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
        val webhookEventStatus = getWebhookEventStatus(request)
        val simpleWebhookEvent = SimpleWebhookEvent(deployment.workspaceId, webhookEventType, webhookEventStatus)

        hermesService.notifySubscriptionEvent(
            buildWebhookDeploymentEventType(simpleWebhookEvent, deployment))
    }

    private fun getWebhookEventType(callbackRequest: DeploymentCallbackRequest, deployment: Deployment): WebhookEventTypeEnum {
        if (callbackRequest.isDeployEvent() || deployment.deployedAt != null) {
            return WebhookEventTypeEnum.DEPLOY
        }
        return WebhookEventTypeEnum.UNDEPLOY
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

    private fun buildWebhookDeploymentEventType(simpleWebhookEvent: SimpleWebhookEvent, deployment: Deployment): WebhookDeploymentEventType {
        return WebhookDeploymentEventType(
            simpleWebhookEvent.workspaceId,
            simpleWebhookEvent.eventType,
            simpleWebhookEvent.eventStatus,
            buildWebhookDeploymentEvent(deployment, simpleWebhookEvent)
        )
    }

    private fun buildWebhookDeploymentEvent(deployment: Deployment, simpleWebhookEvent: SimpleWebhookEvent): WebhookDeploymentEvent {
        return WebhookDeploymentEvent(
            workspaceId = deployment.workspaceId,
            type = simpleWebhookEvent.eventType,
            status = simpleWebhookEvent.eventStatus,
            date = getDeploymentDateEvent(deployment, simpleWebhookEvent.eventType),
            timeExecution = getTimeExecutionEvent(),
            author = getAuthorEvent(deployment),
            circle = getCircleEvent(deployment),
            release = getReleaseEvent(deployment)
        )
    }

    private fun getTimeExecutionEvent(): Int {
        // TODO deploy deployed-created
        //Não existe esse cara para undeploy
        return 0
    }

    private fun getAuthorEvent(deployment: Deployment): WebhookDeploymentAuthorEvent {
        return WebhookDeploymentAuthorEvent(
            deployment.author.email,
            deployment.author.name
        )
    }

    private fun getCircleEvent(deployment: Deployment): WebhookDeploymentCircleEvent {
        return WebhookDeploymentCircleEvent(
            deployment.circle.id,
            deployment.circle.name
        )
    }

    private fun getReleaseEvent(deployment: Deployment): WebhookDeploymentReleaseEvent {
        val build = buildService.find(deployment.buildId)
        return WebhookDeploymentReleaseEvent(
            tag = build.tag,
            features = build.features.map { getFeatureEvent(it) }, // TODO verificar list
            modules = emptyList() // TODO VERIFICAR COMO PEGAR ESSA INFORMACAO
        )
    }

    private fun getFeatureEvent(feature: FeatureSnapshot): WebhookDeploymentFeatureEvent {
        return WebhookDeploymentFeatureEvent(
            name = feature.name,
            branchName = feature.branchName
        )
    }

    private fun getDeploymentDateEvent(deployment: Deployment, webhookEventType: WebhookEventTypeEnum): LocalDateTime? {
        if (webhookEventType == WebhookEventTypeEnum.DEPLOY) {
            if (deployment.deployedAt != null) {
                return deployment.deployedAt
            }
            return deployment.createdAt
        }
        return deployment.undeployedAt //TODO: pode ser null tbm verificar
    }
}
