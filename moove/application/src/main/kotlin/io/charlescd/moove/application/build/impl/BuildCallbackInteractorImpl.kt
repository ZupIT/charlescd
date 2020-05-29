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

package io.charlescd.moove.application.build.impl

import io.charlescd.moove.application.BuildService
import io.charlescd.moove.application.build.BuildCallbackInteractor
import io.charlescd.moove.application.build.request.BuildCallbackRequest
import io.charlescd.moove.domain.ArtifactSnapshot
import io.charlescd.moove.domain.Build
import io.charlescd.moove.domain.BuildStatusEnum
import java.time.LocalDateTime
import java.util.*
import javax.inject.Named
import javax.transaction.Transactional

@Named
open class BuildCallbackInteractorImpl(private val buildService: BuildService) : BuildCallbackInteractor {

    @Transactional
    override fun execute(id: String, request: BuildCallbackRequest) {
        val build = buildService.find(id)

        updateBuildStatus(build, id, request)

        saveArtifactSnapshots(build, request)
    }

    private fun saveArtifactSnapshots(
        build: Build,
        request: BuildCallbackRequest
    ) {
        val artifacts = createArtifactsSnapshots(build, request)

        if (artifacts.isNotEmpty()) {
            buildService.saveArtifacts(artifacts)
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
            this.buildService.updateStatus(id, convertStatus(request))
        }
    }

    private fun convertStatus(request: BuildCallbackRequest): BuildStatusEnum {
        return when (request.status) {
            BuildCallbackRequest.Status.SUCCESS -> BuildStatusEnum.BUILT
            else -> BuildStatusEnum.BUILD_FAILED
        }
    }
}
