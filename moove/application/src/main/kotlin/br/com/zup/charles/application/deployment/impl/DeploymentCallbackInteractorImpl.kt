/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charles.application.deployment.impl

import br.com.zup.charles.application.deployment.DeploymentCallbackInteractor
import br.com.zup.charles.application.deployment.request.DeploymentRequestStatus
import br.com.zup.charles.application.deployment.request.DeploymentCallbackRequest
import br.com.zup.charles.domain.Deployment
import br.com.zup.charles.domain.DeploymentStatusEnum
import br.com.zup.charles.domain.repository.DeploymentRepository
import br.com.zup.exception.handler.exception.NotFoundException
import br.com.zup.exception.handler.to.ResourceValue
import java.time.LocalDateTime
import javax.inject.Named
import javax.transaction.Transactional

@Named
open class DeploymentCallbackInteractorImpl(private val deploymentRepository: DeploymentRepository) :
    DeploymentCallbackInteractor {

    @Transactional
    override fun execute(id: String, request: DeploymentCallbackRequest) {
        val deployment = updateDeploymentInfo(findDeployment(id), request)
        updateStatusOfPreviousDeployment(deployment.circle.id)
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
            DeploymentRequestStatus.UNDEPLOYED -> deployment.copy(status = DeploymentStatusEnum.NOT_DEPLOYED)
            DeploymentRequestStatus.UNDEPLOY_FAILED -> deployment.copy(status = DeploymentStatusEnum.DEPLOYED)
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

    private fun findDeployment(id: String): Deployment {
        return this.deploymentRepository.findById(
            id
        ).orElseThrow {
            NotFoundException(
                ResourceValue("deployment", id)
            )
        }
    }
}