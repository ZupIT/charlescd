/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.moove.service

import br.com.zup.darwin.commons.constants.MooveConstants
import br.com.zup.darwin.commons.constants.MooveConstants.MOOVE_DEFAULT_CIRCLE_NAME
import br.com.zup.darwin.commons.constants.MooveConstants.MOOVE_DEPLOY_CALLBACK_API_PATH
import br.com.zup.darwin.commons.constants.MooveErrorCode
import br.com.zup.darwin.commons.extension.toJsonNode
import br.com.zup.darwin.commons.extension.toRepresentation
import br.com.zup.darwin.commons.extension.toResourcePageRepresentation
import br.com.zup.darwin.commons.representation.DeploymentRepresentation
import br.com.zup.darwin.commons.representation.ResourcePageRepresentation
import br.com.zup.darwin.entity.*
import br.com.zup.darwin.moove.api.DeployApi
import br.com.zup.darwin.moove.api.request.DeployRequest.Companion.buildDeployRequest
import br.com.zup.darwin.moove.api.request.UndeployRequest
import br.com.zup.darwin.moove.request.deployment.CreateDeploymentRequest
import br.com.zup.darwin.repository.*
import br.com.zup.exception.handler.exception.BusinessException
import br.com.zup.exception.handler.exception.NotFoundException
import br.com.zup.exception.handler.to.ResourceValue
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Component
import java.time.LocalDateTime
import java.util.*
import javax.transaction.Transactional

@Component
class DeploymentService(
        private val deploymentRepository: DeploymentRepository,
        private val userRepository: UserRepository,
        private val buildRepository: BuildRepository,
        private val circleRepository: CircleRepository,
        private val deployApi: DeployApi,
        private val darwinNotificationService: DarwinNotificationService
) {

    @Value("\${darwin.moove.url}")
    lateinit var MOOVE_BASE_PATH: String

    private val log = LoggerFactory.getLogger(this.javaClass)

    @Transactional
    fun createDeployment(
            createDeploymentRequest: CreateDeploymentRequest,
            applicationId: String
    ): DeploymentRepresentation {

        val build: Build = this.buildRepository.findByIdAndApplicationId(createDeploymentRequest.buildId, applicationId)
                .orElseThrow { NotFoundException(ResourceValue("build", createDeploymentRequest.buildId)) }



        return if (build.canBeDeployed()) {
            createDeploymentRequest.toEntity(applicationId)
                    .also { undeployActiveDeployment(it.circle.id, it.author.id, applicationId) }
                    .let { this.deploymentRepository.save(it) }
                    .also { deployment ->
                        if (MOOVE_DEFAULT_CIRCLE_NAME == deployment.circle.name) {
                            callDefaultDeploy(deployment = deployment, build = build)
                        } else {
                            callSegmentedDeploy(deployment = deployment, build = build)
                        }
                    }
                    .also { this.notificationCreateDeployment(it) }
                    .toRepresentation()
        } else {
            throw BusinessException.of(MooveErrorCode.DEPLOY_INVALID_BUILD, build.id)
        }
    }
    private fun callDefaultDeploy(deployment: Deployment, build: Build) {
        deployApi.deployInDefaultCircle(
                buildDeployRequest(
                        deploymentId = deployment.id,
                        applicationName = build.applicationId,
                        authorId = deployment.author.id,
                        build = deployment.build,
                        circleId = null,
                        mooveCallbackUrl = "$MOOVE_BASE_PATH/$MOOVE_DEPLOY_CALLBACK_API_PATH/${deployment.id}"
                )
        )
    }

    private fun callSegmentedDeploy(deployment: Deployment, build: Build) {
        deployApi.deployInSegmentedCircle(
                buildDeployRequest(
                        deploymentId = deployment.id,
                        applicationName = build.applicationId,
                        authorId = deployment.author.id,
                        build = deployment.build,
                        circleId = deployment.circle.id,
                        mooveCallbackUrl = "$MOOVE_BASE_PATH/$MOOVE_DEPLOY_CALLBACK_API_PATH/${deployment.id}"
                )
        )
    }

    fun getDeploymentById(id: String, applicationId: String): DeploymentRepresentation {
        return this.deploymentRepository.findByIdAndApplicationId(id, applicationId)
                .map { it.toRepresentation() }
                .orElseThrow { NotFoundException(ResourceValue("deployment", id)) }
    }

    fun getAllDeployments(applicationId: String, pageable: Pageable): ResourcePageRepresentation<DeploymentRepresentation> {
        return this.deploymentRepository.findAllByApplicationId(applicationId, pageable)
                .map { it.toRepresentation() }
                .toResourcePageRepresentation()
    }

    fun deleteDeploymentById(id: String, applicationId: String) {
        return this.deploymentRepository.findByIdAndApplicationId(id, applicationId)
                .map { this.deploymentRepository.delete(it) }
                .orElseThrow { NotFoundException(ResourceValue("deployment", id)) }
    }

    @Transactional
    fun undeploy(id: String, applicationId: String) {
        return deploymentRepository.findByIdAndApplicationId(id, applicationId)
                .orElseThrow { NotFoundException(ResourceValue("deployment", id)) }
                .let { it.updateDeploymentStatus() }
                .let { deployApi.undeploy(id, UndeployRequest(it.author.id)) }
    }

    private fun Deployment.updateDeploymentStatus(): Deployment {
        return deploymentRepository.save(this.copy(status = DeploymentStatus.UNDEPLOYING))
    }

    private fun findActiveDeployment(circleId: String, applicationId: String): Deployment? {
        return deploymentRepository.findByCircleIdAndApplicationId(circleId, applicationId).filter { deployment ->
            deployment.isActiveSegmentedDeployment()
        }.sortedByDescending { it.createdAt }.firstOrNull()
    }

    private fun Deployment.isActiveSegmentedDeployment(): Boolean =
            (this.status == DeploymentStatus.DEPLOYED || this.status == DeploymentStatus.DEPLOYING) && this.circle.isNotDefault()

    private fun Circle.isNotDefault(): Boolean = this.name != MooveConstants.MOOVE_DEFAULT_CIRCLE_NAME

    private fun findBuild(id: String): Build =
            this.buildRepository.findById(id)
                    .orElseThrow { NotFoundException(ResourceValue("build", id)) }

    private fun findCircle(id: String): Circle =
            this.circleRepository.findById(id)
                    .orElseThrow { NotFoundException(ResourceValue("circle", id)) }

    private fun findUser(id: String): User =
            this.userRepository.findById(id)
                    .orElseThrow { NotFoundException(ResourceValue("user", id)) }

    private fun CreateDeploymentRequest.toEntity(applicationId: String): Deployment {
        return Deployment(
                id = UUID.randomUUID().toString(),
                author = findUser(this.authorId),
                createdAt = LocalDateTime.now(),
                deployedAt = null,
                circle = findCircle(this.circleId),
                build = findBuild(this.buildId),
                status = DeploymentStatus.DEPLOYING,
                applicationId = applicationId
        )
    }

    private fun undeployActiveDeployment(circleId: String, authorId: String, applicationId: String) {
        findActiveDeployment(circleId, applicationId)
                ?.also { deployApi.undeploy(it.id, UndeployRequest(authorId)) }
                ?.let { it.updateDeploymentStatus() }
    }

    private fun notificationCreateDeployment(deployment: Deployment) {

        try {
            this.darwinNotificationService.createDeployment(deployment)
        } catch (e: Exception) {
            log.error("error notification create deployment", deployment.toJsonNode())
        }

    }
}

