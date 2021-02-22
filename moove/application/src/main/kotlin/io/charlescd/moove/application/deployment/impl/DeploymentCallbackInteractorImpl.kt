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

import io.charlescd.moove.application.CsvSegmentationService
import io.charlescd.moove.application.WorkspaceService
import io.charlescd.moove.application.deployment.DeploymentCallbackInteractor
import io.charlescd.moove.application.deployment.request.DeploymentCallbackRequest
import io.charlescd.moove.application.deployment.request.DeploymentRequestStatus
import io.charlescd.moove.domain.Circle
import io.charlescd.moove.domain.Deployment
import io.charlescd.moove.domain.DeploymentStatusEnum
import io.charlescd.moove.domain.MatcherTypeEnum
import io.charlescd.moove.domain.exceptions.NotFoundException
import io.charlescd.moove.domain.repository.DeploymentRepository
import io.charlescd.moove.domain.service.CircleMatcherService
import java.time.LocalDateTime
import javax.inject.Named
import javax.transaction.Transactional

@Named
open class DeploymentCallbackInteractorImpl(
    private val deploymentRepository: DeploymentRepository,
    private val circleMatcherService: CircleMatcherService,
    private val workspaceService: WorkspaceService,
    private val csvSegmentationService: CsvSegmentationService
) : DeploymentCallbackInteractor {

    @Transactional
    override fun execute(id: String, request: DeploymentCallbackRequest) {
        val deployment = updateDeploymentInfo(findDeployment(id), request)
        if (request.isCallbackStatusSuccessful() && !deployment.circle.isDefaultCircle()) {
            updateStatusOfPreviousDeployment(deployment.circle.id)
        }
        updateStatusInCircleMatcher(deployment.circle, request)
        updateDeployment(deployment)
    }

    private fun updateDeployment(deployment: Deployment) {
        this.deploymentRepository.update(deployment)
    }

    private fun updateDeploymentInfo(deployment: Deployment, request: DeploymentCallbackRequest): Deployment {
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
        this.deploymentRepository.find(circleId, DeploymentStatusEnum.DEPLOYED)
            .map { deployment ->
                this.deploymentRepository.updateStatus(
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
                val jsonList = csvSegmentationService.createJsonNodeList(circle.rules)
                jsonList.chunked(100).map {
                        this.circleMatcherService.updateImport(circle, circle.reference, it, workspace.circleMatcherUrl!!, isActive)
                }
            } else {
                this.circleMatcherService.update(circle, circle.reference, workspace.circleMatcherUrl!!, isActive)
            }
        }
    }

    private fun isSuccessCallback(deploymentStatus: DeploymentRequestStatus): Boolean {
        return deploymentStatus === DeploymentRequestStatus.SUCCEEDED || deploymentStatus === DeploymentRequestStatus.UNDEPLOYED
    }

    private fun findDeployment(id: String): Deployment {
        return this.deploymentRepository.findById(
            id
        ).orElseThrow {
            NotFoundException("deployment", id)
        }
    }
}
