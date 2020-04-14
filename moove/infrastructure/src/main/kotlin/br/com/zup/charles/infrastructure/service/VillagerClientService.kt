/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charles.infrastructure.service

import br.com.zup.charles.domain.Build
import br.com.zup.charles.domain.ModuleSnapshot
import br.com.zup.charles.domain.service.VillagerService
import br.com.zup.charles.infrastructure.service.client.BuildModuleComponentPart
import br.com.zup.charles.infrastructure.service.client.BuildModulePart
import br.com.zup.charles.infrastructure.service.client.VillagerBuildRequest
import br.com.zup.charles.infrastructure.service.client.VillagerClient
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service

@Service
class VillagerClientService(private val villagerClient: VillagerClient) : VillagerService {

    @Value("\${application.base.path}")
    lateinit var APPLICATION_BASE_PATH: String

    companion object {
        const val CALLBACK_API_PATH = "v2/builds"
    }

    override fun build(build: Build) {
        this.villagerClient.build(build.applicationId, createBuildRequest(build))
    }

    private fun createBuildRequest(build: Build): VillagerBuildRequest {
        return VillagerBuildRequest(
            tagName = createTagName(build),
            callbackUrl = createCallbackUrl(build),
            modules = createModuleParts(build)
        )
    }

    private fun createModuleParts(build: Build): List<BuildModulePart> {
        return build.modules().map { module ->
            BuildModulePart(
                id = module.id,
                name = module.name,
                registryConfigurationId = module.registryConfigurationId,
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
                createTagName(build)
            )
        }
    }

    private fun createTagName(build: Build): String {
        return build.tag.removePrefix("release-")
    }

    private fun createCallbackUrl(build: Build): String {
        return "$APPLICATION_BASE_PATH/$CALLBACK_API_PATH/${build.id}/callback"
    }
}