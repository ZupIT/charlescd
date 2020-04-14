/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.moove.api.request

import br.com.zup.darwin.entity.Build
import br.com.zup.darwin.entity.Component
import br.com.zup.darwin.entity.Module

data class DeployRequest(
    val deploymentId: String,
    val applicationName: String,
    val modules: List<DeployModuleRequest>,
    val authorId: String,
    val description: String,
    val circle: DeployCircleRequest? = null,
    val callbackUrl: String
) {

    companion object {
        fun buildDeployRequest(
            authorId: String,
            circleId: String?,
            build: Build,
            deploymentId: String,
            mooveCallbackUrl: String,
            applicationName: String
        ): DeployRequest {
            return DeployRequest(
                deploymentId = deploymentId,
                applicationName = applicationName,
                modules = buildModulesDeployRequest(build),
                authorId = authorId,
                description = "Darwin deploy request",
                circle = if(!circleId.isNullOrEmpty()) { DeployCircleRequest(headerValue = circleId) } else { null },
                callbackUrl = mooveCallbackUrl
            )
        }

        private fun buildModulesDeployRequest(build: Build): List<DeployModuleRequest> =
            getModulesFromBuild(build).map { module ->
                DeployModuleRequest(
                    moduleId = module.id,
                    helmRepository = module.helmRepository,
                    components = buildComponentsDeployRequest(build, module)
                )
            }

        private fun buildComponentsDeployRequest(build: Build, module: Module): List<DeployComponentRequest> =
            getComponentsFromModule(moduleId = module.id, build = build).map { component ->
                buildComponentDeployRequest(build, component)
            }

        private fun buildComponentDeployRequest(build: Build, component: Component): DeployComponentRequest {
            val artifact = build.artifacts.first { it.component.id == component.id }
            return DeployComponentRequest(
                componentId = component.id,
                componentName = component.name,
                buildImageUrl = artifact.artifact,
                buildImageTag = artifact.version,
                contextPath = component.contextPath,
                healthCheck = component.healthCheck,
                port = component.port
            )
        }

        private fun getComponentsFromModule(moduleId: String, build: Build): List<Component> {
            return build.artifacts.map { it.component }.filter { it.module.id == moduleId }
        }

        private fun getModulesFromBuild(build: Build): List<Module> {
            return build.artifacts.map { it.component.module }.distinct()
        }
    }

}

data class DeployModuleRequest(
    val moduleId: String,
    val helmRepository: String,
    val components: List<DeployComponentRequest>
)

data class DeployComponentRequest(
    val componentId: String,
    val componentName: String,
    val buildImageUrl: String,
    val buildImageTag: String,
    val contextPath: String?,
    val healthCheck: String?,
    val port: Int?
)

data class DeployCircleRequest(
    val headerValue: String,
    val removeCircle: Boolean? = null
)