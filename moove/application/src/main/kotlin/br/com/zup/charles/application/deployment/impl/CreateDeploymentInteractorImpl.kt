/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charles.application.deployment.impl

import br.com.zup.charles.application.deployment.CreateDeploymentInteractor
import br.com.zup.charles.application.deployment.request.CreateDeploymentRequest
import br.com.zup.charles.application.deployment.response.DeploymentResponse
import br.com.zup.charles.domain.*
import br.com.zup.charles.domain.repository.BuildRepository
import br.com.zup.charles.domain.repository.CircleRepository
import br.com.zup.charles.domain.repository.DeploymentRepository
import br.com.zup.charles.domain.repository.UserRepository
import br.com.zup.charles.domain.service.DeployService
import br.com.zup.darwin.commons.constants.MooveErrorCode
import br.com.zup.exception.handler.exception.BusinessException
import br.com.zup.exception.handler.exception.NotFoundException
import br.com.zup.exception.handler.to.ResourceValue
import javax.inject.Inject
import javax.inject.Named

@Named
open class CreateDeploymentInteractorImpl @Inject constructor(
    private val deploymentRepository: DeploymentRepository,
    private val buildRepository: BuildRepository,
    private val userRepository: UserRepository,
    private val circleRepository: CircleRepository,
    private val deployService: DeployService
) : CreateDeploymentInteractor {

    override fun execute(request: CreateDeploymentRequest, applicationId: String): DeploymentResponse {
        val build: Build = findBuild(request, applicationId)

        if (build.canBeDeployed()) {
            val deployment = createDeployment(request, applicationId)
            undeployActiveDeploymentFromCircleIfExists(deployment, applicationId)
            deploymentRepository.save(deployment)
            deployService.deploy(deployment, build, deployment.circle.isDefault())
            return DeploymentResponse.from(deployment, build.tag)
        } else {
            throw BusinessException.of(MooveErrorCode.DEPLOY_INVALID_BUILD, build.id)
        }
    }

    private fun findBuild(
        request: CreateDeploymentRequest,
        applicationId: String
    ): Build {
        return this.buildRepository.find(
            request.buildId, applicationId
        ).orElseThrow {
            NotFoundException(ResourceValue("build", request.buildId))
        }
    }

    private fun createDeployment(
        request: CreateDeploymentRequest,
        applicationId: String
    ): Deployment {
        val user = findUser(request)
        val circle = findCircle(request)
        return request.toDeployment(applicationId, user, circle)
    }

    private fun findCircle(
        request: CreateDeploymentRequest
    ): Circle {
        return this.circleRepository.findById(
            request.circleId
        ).orElseThrow {
            NotFoundException(ResourceValue("circle", request.circleId))
        }
    }

    private fun findUser(request: CreateDeploymentRequest): User {
        return this.userRepository.findById(
            request.authorId
        ).orElseThrow {
            NotFoundException(ResourceValue("user", request.authorId))
        }
    }

    private fun undeployActiveDeploymentFromCircleIfExists(
        deployment: Deployment,
        applicationId: String
    ) {
        findActiveDeployment(deployment.circle.id, applicationId)
            ?.also { deployService.undeploy(it.id, it.author.id) }
            ?.let { deploymentRepository.updateStatus(it.id, DeploymentStatusEnum.UNDEPLOYING) }
    }

    private fun findActiveDeployment(circleId: String, applicationId: String): Deployment? {
        return deploymentRepository.findByCircleIdAndApplicationId(circleId, applicationId).filter { deployment ->
            deployment.isActive()
        }.maxBy { it.createdAt }
    }
}