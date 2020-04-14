/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charles.application.build.impl

import br.com.zup.charles.application.build.CreateComposedBuildInteractor
import br.com.zup.charles.application.build.request.CreateComposedBuildRequest
import br.com.zup.charles.application.build.response.BuildResponse
import br.com.zup.charles.domain.*
import br.com.zup.charles.domain.repository.BuildRepository
import br.com.zup.charles.domain.repository.ModuleRepository
import br.com.zup.charles.domain.repository.UserRepository
import br.com.zup.exception.handler.exception.NotFoundException
import br.com.zup.exception.handler.to.ResourceValue
import java.time.LocalDateTime
import java.util.*
import javax.inject.Inject
import javax.inject.Named
import javax.transaction.Transactional

@Named
open class CreateComposedBuildInteractorImpl @Inject constructor(
    private val userRepository: UserRepository,
    private val moduleRepository: ModuleRepository,
    private val buildRepository: BuildRepository
) : CreateComposedBuildInteractor {

    @Transactional
    override fun execute(request: CreateComposedBuildRequest, applicationId: String): BuildResponse {
        val build = createBuild(request, applicationId)
        return BuildResponse.from(this.buildRepository.save(build))
    }

    private fun createBuild(request: CreateComposedBuildRequest, applicationId: String): Build {
        val user = findAuthor(request.authorId)

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
            applicationId = applicationId
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

    private fun findAuthor(authorId: String): User {
        return this.userRepository.findById(
            authorId
        ).orElseThrow {
            NotFoundException(ResourceValue("user", authorId))
        }
    }

    private fun findModules(request: CreateComposedBuildRequest): List<Module> {
        val ids = request.modules.map { it.id }

        val modules = this.moduleRepository.findByIds(ids)
        val difference = ids.minus(modules.map { it.id })

        if (difference.isNotEmpty()) {
            throw NotFoundException(
                ResourceValue("module", difference.joinToString(", "))
            )
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