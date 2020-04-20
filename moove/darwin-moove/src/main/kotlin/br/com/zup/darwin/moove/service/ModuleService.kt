/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.moove.service

import br.com.zup.darwin.commons.extension.toRepresentation
import br.com.zup.darwin.commons.extension.toResourcePageRepresentation
import br.com.zup.darwin.commons.representation.ComponentTagsRepresentation
import br.com.zup.darwin.commons.representation.ModuleRepresentation
import br.com.zup.darwin.commons.representation.ResourcePageRepresentation
import br.com.zup.darwin.entity.*
import br.com.zup.darwin.moove.api.DeployApi
import br.com.zup.darwin.moove.api.VillagerApi
import br.com.zup.darwin.moove.api.request.CreateDeployComponentRequest
import br.com.zup.darwin.moove.api.request.CreateDeployModuleRequest
import br.com.zup.darwin.moove.api.response.ComponentTagsResponse
import br.com.zup.darwin.moove.request.module.CreateComponentRequest
import br.com.zup.darwin.moove.request.module.CreateModuleRequest
import br.com.zup.darwin.moove.request.module.UpdateComponentRequest
import br.com.zup.darwin.moove.request.module.UpdateModuleRequest
import br.com.zup.darwin.repository.*
import br.com.zup.exception.handler.exception.NotFoundException
import br.com.zup.exception.handler.to.ResourceValue
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import java.util.*
import javax.transaction.Transactional

@Service
class ModuleService(
    private val userRepository: UserRepository,
    private val moduleRepository: ModuleRepository,
    private val labelRepository: LabelRepository,
    private val componentRepository: ComponentRepository,
    private val gitConfigurationRepository: GitConfigurationRepository,
    private val villagerApi: VillagerApi,
    private val deployApi: DeployApi
) {

    @Transactional
    fun createModule(createModuleRequest: CreateModuleRequest, applicationId: String): ModuleRepresentation {

        val module: Module =
            this.moduleRepository.save(createModuleRequest.toEntity(applicationId))
        val components: List<Component> =
            createModuleRequest.components.map { component -> saveComponents(component, module, applicationId) }

        deployApi.createModule(
            buildCreateModuleRequest(createModuleRequest, module, components)
        )
        return module.toRepresentation()
    }

    fun getModuleById(id: String, applicationId: String): ModuleRepresentation {
        return this.moduleRepository.findByIdAndApplicationId(id, applicationId)
            .map { it.toRepresentation() }
            .orElseThrow { NotFoundException(ResourceValue("module", id)) }
    }

    fun getAllModules(
        name: String? = null,
        applicationId: String,
        pageable: Pageable
    ): ResourcePageRepresentation<ModuleRepresentation> {
        return name?.let {
            this.moduleRepository.findByNameAndApplicationIdIgnoreCaseContaining(
                name,
                applicationId,
                pageable
            )
        }
            ?.map { it.toRepresentation() }
            ?.toResourcePageRepresentation()
            ?: this.moduleRepository.findAllByApplicationId(applicationId, pageable)
                .map { it.toRepresentation() }
                .toResourcePageRepresentation()
    }

    fun deleteModuleById(id: String, applicationId: String) {
        return this.moduleRepository.findByIdAndApplicationId(id, applicationId)
            .map { this.moduleRepository.delete(it) }
            .orElseThrow { NotFoundException(ResourceValue("module", id)) }
    }

    fun getComponentTags(componentId: String, applicationId: String): ComponentTagsRepresentation {
        return this.componentRepository.findByIdAndApplicationId(componentId, applicationId)
            .orElseThrow { NotFoundException(ResourceValue("component", componentId)) }
            .let { component ->
                villagerApi.getComponentTags(
                    component.module.registryConfigurationId,
                    component.name,
                    applicationId
                )
            }
            .let { tagsResponse -> tagsResponse.toComponentTagsRepresentation() }
    }

    private fun ComponentTagsResponse.toComponentTagsRepresentation(): ComponentTagsRepresentation {
        return ComponentTagsRepresentation(
            tags = tags.map { tagResponse ->
                ComponentTagsRepresentation.TagRepresentation(
                    name = tagResponse.name,
                    artifact = tagResponse.artifact
                )
            })
    }

    @Transactional
    fun updateModuleById(
        id: String,
        updateModuleRequest: UpdateModuleRequest,
        applicationId: String
    ): ModuleRepresentation {
        return this.moduleRepository.findByIdAndApplicationId(id, applicationId)
            .map { updateModule(updateModuleRequest, it) }
            .orElseThrow { NotFoundException(ResourceValue("module", id)) }
            .let { this.moduleRepository.save(it) }
            .toRepresentation()
    }

    private fun findUser(id: String): User =
        this.userRepository.findById(id)
            .orElseThrow { NotFoundException(ResourceValue("user", id)) }

    private fun findLabels(labels: List<String>): List<Label> =
        this.labelRepository.findAllById(labels)
            .takeIf { labels.size == it.size }
            ?: throw NotFoundException(ResourceValue("labels", labels.joinToString(", ")))

    private fun saveComponents(request: CreateComponentRequest, module: Module, applicationId: String): Component =
        this.componentRepository.save(
            Component(
                id = UUID.randomUUID().toString(),
                name = request.name,
                module = module,
                contextPath = request.contextPath,
                port = request.port,
                healthCheck = request.healthCheck,
                applicationId = applicationId
            )
        )

    private fun CreateModuleRequest.toEntity(applicationId: String): Module {
        return Module(
            id = UUID.randomUUID().toString(),
            name = this.name,
            createdAt = LocalDateTime.now(),
            author = findUser(this.authorId),
            labels = findLabels(this.labels),
            helmRepository = this.helmRepository,
            gitConfiguration = findGitConfiguration(this.gitConfigurationId),
            gitRepositoryAddress = this.gitRepositoryAddress,
            applicationId = applicationId,
            cdConfigurationId = this.cdConfigurationId,
            registryConfigurationId = this.registryConfigurationId
        )
    }

    private fun findGitConfiguration(
        gitConfigurationId: String
    ): GitConfiguration {
        return gitConfigurationRepository.findById(gitConfigurationId).orElseThrow {
            NotFoundException(
                ResourceValue("gitConfiguration", gitConfigurationId)
            )
        }
    }

    private fun updateModule(
        updateModuleRequest: UpdateModuleRequest,
        it: Module
    ): Module {
        return Module(
            id = it.id,
            name = updateModuleRequest.name,
            createdAt = it.createdAt,
            author = it.author,
            labels = findLabels(updateModuleRequest.labels),
            helmRepository = it.helmRepository,
            components = updateModuleComponents(updateModuleRequest.components),
            gitConfiguration = findGitConfiguration(updateModuleRequest.gitConfigurationId),
            gitRepositoryAddress = updateModuleRequest.gitRepositoryAddress,
            applicationId = it.applicationId,
            cdConfigurationId = updateModuleRequest.cdConfigurationId,
            registryConfigurationId = updateModuleRequest.registryConfigurationId
        )
    }

    private fun updateModuleComponents(components: List<UpdateComponentRequest>): List<Component> {
        return components.map { updateComponentRequest ->
            componentRepository.findById(updateComponentRequest.id)
                .orElseThrow { NotFoundException(ResourceValue("component", updateComponentRequest.id)) }
                .copy(
                    name = updateComponentRequest.name,
                    contextPath = updateComponentRequest.contextPath,
                    port = updateComponentRequest.port,
                    healthCheck = updateComponentRequest.healthCheck
                ).let { componentRepository.save(it) }
        }
    }

    private fun buildCreateModuleRequest(
        createModuleRequest: CreateModuleRequest,
        module: Module,
        components: List<Component>
    ): CreateDeployModuleRequest {

        return CreateDeployModuleRequest(
            module.id,
            createModuleRequest.cdConfigurationId,
            components.map { component -> CreateDeployComponentRequest(component.id) }
        )
    }
}
