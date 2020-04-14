/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charles.application.build.impl

import br.com.zup.charles.application.build.BuildCallbackInteractor
import br.com.zup.charles.application.build.request.BuildCallbackRequest
import br.com.zup.charles.domain.ArtifactSnapshot
import br.com.zup.charles.domain.Build
import br.com.zup.charles.domain.BuildStatusEnum
import br.com.zup.charles.domain.ComponentSnapshot
import br.com.zup.charles.domain.repository.BuildRepository
import br.com.zup.exception.handler.exception.NotFoundException
import br.com.zup.exception.handler.to.ResourceValue
import java.time.LocalDateTime
import java.util.*
import javax.inject.Named
import javax.transaction.Transactional

@Named
open class BuildCallbackInteractorImpl(private val buildRepository: BuildRepository) : BuildCallbackInteractor {

    @Transactional
    override fun execute(id: String, request: BuildCallbackRequest) {
        val build = findBuild(id)

        updateBuildStatus(build, id, request)

        saveArtifactSnapshots(build, request)
    }

    private fun saveArtifactSnapshots(
        build: Build,
        request: BuildCallbackRequest
    ) {
        val artifacts = createArtifactsSnapshots(build, request)

        if (artifacts.isNotEmpty()) {
            this.buildRepository.saveArtifacts(artifacts)
        }
    }

    private fun createArtifactsSnapshots(
        build: Build,
        request: BuildCallbackRequest
    ): List<ArtifactSnapshot> {
        return request.modules?.flatMap { module ->
            module.components.map { component ->
                createArtifactSnapshot(build, module.moduleId, component)
            }
        } ?: emptyList()
    }

    private fun createArtifactSnapshot(
        build: Build,
        moduleId: String,
        component: BuildCallbackRequest.ComponentPart
    ) = ArtifactSnapshot(
        id = UUID.randomUUID().toString(),
        artifact = component.name,
        version = component.tagName,
        createdAt = LocalDateTime.now(),
        componentSnapshotId = build.findComponentByModuleIdAndArtifactName(moduleId, component.name).id
    )

    private fun updateBuildStatus(
        build: Build,
        id: String,
        request: BuildCallbackRequest
    ) {
        if (build.canBeUpdated()) {
            this.buildRepository.updateStatus(id, convertStatus(request))
        }
    }

    private fun convertStatus(request: BuildCallbackRequest): BuildStatusEnum {
        return when (request.status) {
            BuildCallbackRequest.Status.SUCCESS -> BuildStatusEnum.BUILT
            else -> BuildStatusEnum.BUILD_FAILED
        }
    }

    private fun findBuild(id: String): Build {
        return this.buildRepository.findById(id)
            .orElseThrow {
                NotFoundException(ResourceValue("build", id))
            }
    }
}