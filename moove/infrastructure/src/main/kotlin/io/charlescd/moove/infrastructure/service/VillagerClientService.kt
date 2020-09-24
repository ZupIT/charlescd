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

package io.charlescd.moove.infrastructure.service

import io.charlescd.moove.domain.*
import io.charlescd.moove.domain.service.VillagerService
import io.charlescd.moove.infrastructure.service.client.*
import io.charlescd.moove.infrastructure.service.client.request.*
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service

@Service
class VillagerClientService(private val villagerClient: VillagerClient) : VillagerService {

    @Value("\${application.base.path}")
    lateinit var APPLICATION_BASE_PATH: String

    companion object {
        const val CALLBACK_API_PATH = "v2/builds"
    }

    override fun build(build: Build, registryConfigurationId: String) {
        this.villagerClient.build(build.workspaceId, createBuildRequest(build, registryConfigurationId))
    }

    override fun createRegistryConfiguration(registryConfiguration: RegistryConfiguration): String {
        val request = buildVillagerRegistryConfigurationRequest(registryConfiguration)
        return villagerClient.createRegistryConfiguration(request, registryConfiguration.workspace.id).id
    }

    override fun checkIfRegistryConfigurationExists(id: String, workspaceId: String): Boolean {
        val registryList = villagerClient.findRegistryConfigurations(workspaceId)
        return registryList.filter { registry ->
            registry.id == id
        }.any()
    }

    override fun delete(id: String, workspaceId: String) {
        villagerClient.deleteRegistryConfiguration(id, workspaceId)
    }

    override fun findRegistryConfigurationNameById(id: String, workspaceId: String): String? {
        val registryList = villagerClient.findRegistryConfigurations(workspaceId)
        return registryList.find { registry ->
            registry.id == id
        }?.name
    }

    override fun findComponentTags(
        componentName: String,
        registryConfigurationId: String,
        name: String,
        workspaceId: String
    ): List<SimpleArtifact> {
        return villagerClient.findComponentTags(
            registryConfigurationId,
            componentName,
            name,
            workspaceId
        ).tags.map { SimpleArtifact(it.name, it.artifact) }
    }

    private fun buildVillagerRegistryConfigurationRequest(
        registryConfiguration: RegistryConfiguration
    ): CreateVillagerRegistryConfigurationRequest {
        return when (registryConfiguration) {
            is AzureRegistryConfiguration -> buildAzureRegistryRequest(registryConfiguration)
            is AWSRegistryConfiguration -> buildAWSRegistryRequest(registryConfiguration)
            else -> throw IllegalArgumentException("Provider type not supported")
        }
    }

    private fun buildAWSRegistryRequest(registryConfiguration: AWSRegistryConfiguration): CreateVillagerRegistryConfigurationRequest {
        return CreateVillagerRegistryConfigurationRequest(
            name = registryConfiguration.name,
            address = registryConfiguration.address,
            provider = CreateVillagerRegistryConfigurationProvider.AWS,
            accessKey = registryConfiguration.accessKey,
            secretKey = registryConfiguration.secretKey,
            region = registryConfiguration.region,
            authorId = registryConfiguration.author.id
        )
    }

    private fun buildAzureRegistryRequest(registryConfiguration: AzureRegistryConfiguration): CreateVillagerRegistryConfigurationRequest {
        return CreateVillagerRegistryConfigurationRequest(
            name = registryConfiguration.name,
            address = registryConfiguration.address,
            provider = CreateVillagerRegistryConfigurationProvider.Azure,
            username = registryConfiguration.username,
            password = registryConfiguration.password,
            authorId = registryConfiguration.author.id
        )
    }

    private fun createBuildRequest(build: Build, registryConfigurationId: String): VillagerBuildRequest {
        return VillagerBuildRequest(
            tagName = build.tag,
            callbackUrl = createCallbackUrl(build),
            modules = createModuleParts(build, registryConfigurationId)
        )
    }

    private fun createModuleParts(build: Build, registryConfigurationId: String): List<BuildModulePart> {
        return build.modules().map { module ->
            BuildModulePart(
                id = module.moduleId,
                name = module.name,
                registryConfigurationId = registryConfigurationId,
                components = createComponentParts(build, module)
            )
        }
    }

    private fun createComponentParts(
        build: Build,
        module: ModuleSnapshot
    ): List<BuildModuleComponentPart> {
        return module.components.map { component ->
            BuildModuleComponentPart(
                component.name,
                build.tag
            )
        }
    }

    private fun createCallbackUrl(build: Build): String {
        return "$APPLICATION_BASE_PATH/$CALLBACK_API_PATH/${build.id}/callback"
    }
}
