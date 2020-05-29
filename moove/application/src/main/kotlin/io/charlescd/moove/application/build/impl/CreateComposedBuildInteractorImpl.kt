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
import io.charlescd.moove.application.ModuleService
import io.charlescd.moove.application.UserService
import io.charlescd.moove.application.build.CreateComposedBuildInteractor
import io.charlescd.moove.application.build.request.CreateComposedBuildRequest
import io.charlescd.moove.application.build.response.BuildResponse
import io.charlescd.moove.domain.*
import io.charlescd.moove.domain.exceptions.NotFoundException
import java.time.LocalDateTime
import java.util.*
import javax.inject.Inject
import javax.inject.Named
import javax.transaction.Transactional

@Named
open class CreateComposedBuildInteractorImpl @Inject constructor(
    private val userService: UserService,
    private val moduleService: ModuleService,
    private val buildService: BuildService
) : CreateComposedBuildInteractor {

    @Transactional
    override fun execute(request: CreateComposedBuildRequest, workspaceId: String): BuildResponse {
        val build = createBuild(request, workspaceId)
        return BuildResponse.from(buildService.save(build))
    }

    private fun createBuild(request: CreateComposedBuildRequest, workspaceId: String): Build {
        val user = userService.find(request.authorId)

        val modules = findModules(request)

        val buildId = UUID.randomUUID().toString()
        val featureId = UUID.randomUUID().toString()

        val feature = createDefaultFeature(
            id = featureId,
            releaseName = request.releaseName,
            user = user,
            buildId = buildId,
            modules = createModuleSnapshots(modules, featureId, request)
        )

        return request.toBuild(
            id = buildId,
            user = user,
            feature = feature,
            workspaceId = workspaceId
        )
    }

    private fun createDefaultFeature(
        id: String,
        releaseName: String,
        user: User,
        buildId: String,
        modules: List<ModuleSnapshot>
    ) = FeatureSnapshot(
        id = id,
        featureId = UUID.randomUUID().toString(),
        name = releaseName,
        branchName = releaseName,
        authorId = user.id,
        authorName = user.name,
        createdAt = LocalDateTime.now(),
        modules = modules,
        buildId = buildId
    )

    private fun findModules(request: CreateComposedBuildRequest): List<Module> {
        val ids = request.modules.map { it.id }

        val modules = moduleService.findByIds(ids)
        val difference = ids.minus(modules.map { it.id })

        if (difference.isNotEmpty()) {
            throw NotFoundException("module", difference.joinToString(", "))
        }

        return filterModuleComponents(modules, request)
    }

    private fun filterModuleComponents(modules: List<Module>, request: CreateComposedBuildRequest): List<Module> {
        return modules.map {
            it.copy(
                components = it.findComponentsByIds(
                    findComponentIds(it, request)
                )
            )
        }
    }

    private fun createModuleSnapshots(
        modules: List<Module>,
        featureId: String,
        request: CreateComposedBuildRequest
    ): List<ModuleSnapshot> {
        return modules.map {
            addArtifactsToModulesSnapshots(
                it,
                ModuleSnapshot.from(UUID.randomUUID().toString(), featureId, it),
                request
            )
        }
    }

    private fun findComponentRequest(
        moduleId: String,
        componentId: String,
        request: CreateComposedBuildRequest
    ): CreateComposedBuildRequest.ComponentRequest {
        return request.modules.first {
            it.id == moduleId
        }.components.first { component ->
            component.id == componentId
        }
    }

    private fun findComponentIds(module: Module, request: CreateComposedBuildRequest): List<String> {
        return request.modules.first {
            it.id == module.id
        }.components.map { component ->
            component.id
        }
    }

    private fun addArtifactsToModulesSnapshots(
        module: Module,
        moduleSnapshot: ModuleSnapshot,
        request: CreateComposedBuildRequest
    ): ModuleSnapshot {
        return moduleSnapshot.copy(
            components = moduleSnapshot.components.map { componentSnapshot ->
                copyComponentSnapshot(
                    componentSnapshot,
                    findComponentRequest(module.id, componentSnapshot.componentId, request)
                )
            }
        )
    }

    private fun copyComponentSnapshot(
        componentSnapshot: ComponentSnapshot,
        componentRequest: CreateComposedBuildRequest.ComponentRequest
    ): ComponentSnapshot {
        return componentSnapshot.copy(
            artifact = createArtifactSnapshot(
                componentSnapshot,
                componentRequest
            )
        )
    }

    private fun createArtifactSnapshot(
        componentSnapshot: ComponentSnapshot,
        componentRequest: CreateComposedBuildRequest.ComponentRequest
    ) = ArtifactSnapshot(
        UUID.randomUUID().toString(),
        componentRequest.artifact,
        componentRequest.version,
        componentSnapshot.id,
        LocalDateTime.now()
    )
}
