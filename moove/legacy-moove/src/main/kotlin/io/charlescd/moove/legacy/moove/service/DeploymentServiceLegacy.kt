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

package io.charlescd.moove.legacy.moove.service

import io.charlescd.moove.commons.constants.MooveConstants
import io.charlescd.moove.commons.exceptions.NotFoundExceptionLegacy
import io.charlescd.moove.commons.extension.toRepresentation
import io.charlescd.moove.commons.extension.toResourcePageRepresentation
import io.charlescd.moove.commons.representation.DeploymentRepresentation
import io.charlescd.moove.commons.representation.ResourcePageRepresentation
import io.charlescd.moove.legacy.moove.api.DeployApi
import io.charlescd.moove.legacy.moove.api.request.UndeployRequest
import io.charlescd.moove.legacy.moove.request.deployment.CreateDeploymentRequest
import io.charlescd.moove.legacy.repository.BuildRepository
import io.charlescd.moove.legacy.repository.CircleRepository
import io.charlescd.moove.legacy.repository.DeploymentRepository
import io.charlescd.moove.legacy.repository.UserRepository
import io.charlescd.moove.legacy.repository.entity.*
import java.time.LocalDateTime
import java.util.*
import javax.transaction.Transactional
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Component

@Component
class DeploymentServiceLegacy(
    private val deploymentRepository: DeploymentRepository,
    private val userRepository: UserRepository,
    private val buildRepository: BuildRepository,
    private val circleRepository: CircleRepository,
    private val deployApi: DeployApi
) {

    @Value("\${charlescd.moove.url}")
    lateinit var MOOVE_BASE_PATH: String

    private val log = LoggerFactory.getLogger(this.javaClass)

    fun getDeploymentById(id: String, applicationId: String): DeploymentRepresentation {
        return this.deploymentRepository.findByIdAndWorkspaceId(id, applicationId)
            .map { it.toRepresentation() }
            .orElseThrow { NotFoundExceptionLegacy("deployment", id) }
    }

    fun getAllDeployments(
        workspaceId: String,
        pageable: Pageable
    ): ResourcePageRepresentation<DeploymentRepresentation> {
        return this.deploymentRepository.findAllByWorkspaceId(workspaceId, pageable)
            .map { it.toRepresentation() }
            .toResourcePageRepresentation()
    }

    fun deleteDeploymentById(id: String, workspaceId: String) {
        return this.deploymentRepository.findByIdAndWorkspaceId(id, workspaceId)
            .map { this.deploymentRepository.delete(it) }
            .orElseThrow { NotFoundExceptionLegacy("deployment", id) }
    }

    @Transactional
    fun undeploy(id: String, workspaceId: String) {
        return deploymentRepository.findByIdAndWorkspaceId(id, workspaceId)
            .orElseThrow { NotFoundExceptionLegacy("deployment", id) }
            .let { it.updateDeploymentStatus() }
            .let { deployApi.undeploy(id, UndeployRequest(it.author.id)) }
    }

    private fun Deployment.updateDeploymentStatus(): Deployment {
        return deploymentRepository.save(this.copy(status = DeploymentStatus.UNDEPLOYING))
    }

    private fun Circle.isNotDefault(): Boolean = this.name != MooveConstants.MOOVE_DEFAULT_CIRCLE_NAME

    private fun findBuild(id: String): Build =
        this.buildRepository.findById(id)
            .orElseThrow { NotFoundExceptionLegacy("build", id) }

    private fun findCircle(id: String): Circle =
        this.circleRepository.findById(id)
            .orElseThrow { NotFoundExceptionLegacy("circle", id) }

    private fun findUser(id: String): User =
        this.userRepository.findById(id)
            .orElseThrow { NotFoundExceptionLegacy("user", id) }

    private fun CreateDeploymentRequest.toEntity(workspaceId: String): Deployment {
        return Deployment(
            id = UUID.randomUUID().toString(),
            author = findUser(this.authorId),
            createdAt = LocalDateTime.now(),
            deployedAt = null,
            circle = findCircle(this.circleId),
            build = findBuild(this.buildId),
            status = DeploymentStatus.DEPLOYING,
            workspaceId = workspaceId
        )
    }
}
