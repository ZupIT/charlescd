/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.moove.service

import br.com.zup.darwin.commons.constants.MooveConstants
import br.com.zup.darwin.entity.*
import br.com.zup.darwin.moove.request.callback.DeployCallbackRequest
import br.com.zup.darwin.moove.request.callback.DeployRequestStatus
import br.com.zup.darwin.moove.request.callback.VillagerCallbackRequest
import br.com.zup.darwin.moove.request.callback.VillagerCallbackRequest.VillagerBuildStatus
import br.com.zup.darwin.repository.*
import br.com.zup.exception.handler.exception.NotFoundException
import br.com.zup.exception.handler.to.ResourceValue
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import java.util.UUID
import javax.transaction.Transactional

@Service
class CallbackService(
    private val buildRepository: BuildRepository,
    private val artifactRepository: ArtifactRepository,
    private val componentRepository: ComponentRepository,
    private val deploymentRepository: DeploymentRepository
) {

    @Transactional
    fun villagerCallback(buildId: String, callbackRequest: VillagerCallbackRequest) {
        val build: Build = this.buildRepository.findById(buildId)
            .orElseThrow { NotFoundException(ResourceValue("build", buildId)) }

        if(build.canBeUpdated()) {
            updateBuildStatus(build, callbackRequest.status)
                .also { this.saveArtifactsList(it, callbackRequest) }
        }
    }

    @Transactional
    fun deploymentCallback(deploymentId: String, callbackRequest: DeployCallbackRequest) {
        this.deploymentRepository.findById(deploymentId)
            .orElseThrow { NotFoundException(ResourceValue("deployment", deploymentId)) }
            .let { updateDeploymentStatus(it, callbackRequest.deploymentStatus) }
    }

    private fun updateDeploymentStatus(deployment: Deployment, deployStatus: DeployRequestStatus): Deployment {
        return when (deployStatus) {
            DeployRequestStatus.SUCCEEDED -> deployment.copy(status = DeploymentStatus.DEPLOYED, deployedAt = LocalDateTime.now()).apply {
                if (deployment.circle.name != MooveConstants.MOOVE_DEFAULT_CIRCLE_NAME) { updateOldDeploymentStatus(deployment.circle.id) }
            }
            DeployRequestStatus.FAILED -> deployment.copy(status = DeploymentStatus.DEPLOY_FAILED)
            DeployRequestStatus.UNDEPLOYED -> deployment.copy(status = DeploymentStatus.NOT_DEPLOYED)
            DeployRequestStatus.UNDEPLOY_FAILED -> deployment.copy(status = DeploymentStatus.DEPLOYED)
        }.let(deploymentRepository::save)
    }

    private fun updateOldDeploymentStatus(circleId: String) {
        this.deploymentRepository.findByCircleIdAndStatus(circleId, DeploymentStatus.DEPLOYED).firstOrNull()
            ?.let { it ->
                it.copy(status = DeploymentStatus.NOT_DEPLOYED)
                    .let(deploymentRepository::save)
            }
    }

    private fun updateBuildStatus(build: Build, buildStatus: VillagerBuildStatus): Build {
        return when (buildStatus) {
            VillagerBuildStatus.SUCCESS -> build.copy(status = BuildStatus.BUILT)
            VillagerBuildStatus.TIME_OUT -> build.copy(status = BuildStatus.BUILD_FAILED)
        }.let(buildRepository::saveAndFlush)
    }

    private fun saveArtifactsList(build: Build, callbackRequest: VillagerCallbackRequest) {
        callbackRequest.modules?.forEach { module ->
            module.components.forEach { component ->
                artifactRepository.saveAndFlush(
                    buildArtifact(
                        build,
                        module.moduleId,
                        component.name,
                        component.tagName
                    )
                )
            }
        }
    }

    private fun buildArtifact(build: Build, moduleId: String, artifactName: String, version: String): Artifact =
        Artifact(
            id = UUID.randomUUID().toString(),
            artifact = artifactName,
            version = version,
            build = build,
            component = findComponentByModuleId(moduleId, artifactName),
            createdAt = LocalDateTime.now()
        )

    private fun findComponentByModuleId(moduleId: String, artifactName: String): Component =
        this.componentRepository.findByModuleId(moduleId)
            .first { artifactName.contains(it.name) }

}