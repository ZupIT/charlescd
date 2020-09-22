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
import io.charlescd.moove.domain.service.DeployService
import io.charlescd.moove.infrastructure.service.client.*
import io.charlescd.moove.infrastructure.service.client.request.*
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service

@Service
class DeployClientService(private val deployClient: DeployClient) : DeployService {

    @Value("\${application.base.path}")
    lateinit var APPLICATION_BASE_PATH: String

    companion object {
        const val DEPLOY_CALLBACK_API_PATH = "v2/deployments"
    }

    override fun deploy(deployment: Deployment, build: Build, isDefaultCircle: Boolean, cdConfigurationId: String) {
        when (isDefaultCircle) {
            true -> deployInDefaultCircle(build, deployment, cdConfigurationId)
            else -> deployInSegmentedCircle(build, deployment, cdConfigurationId)
        }
    }

    private fun deployInSegmentedCircle(
        build: Build,
        deployment: Deployment,
        cdConfigurationId: String
    ) {
        deployClient.deployInSegmentedCircle(
            buildDeployRequest(
                deployment,
                build,
                deployment.circle.id,
                cdConfigurationId
            )
        )
    }

    private fun deployInDefaultCircle(
        build: Build,
        deployment: Deployment,
        cdConfigurationId: String
    ) {
        deployClient.deployInDefaultCircle(
            buildDeployRequest(
                deployment = deployment,
                build = build,
                cdConfigurationId = cdConfigurationId
            )
        )
    }

    override fun undeploy(deploymentId: String, authorId: String) {
        deployClient.undeploy(
            UndeployRequest(
                authorId,
                deploymentId
            )
        )
    }

    override fun getCdConfiguration(workspaceId: String, cdConfigurationId: String): CdConfiguration? {
        return deployClient.getCdConfigurations(workspaceId).find { cdConfiguration ->
            cdConfiguration.id == cdConfigurationId
        }?.let { CdConfiguration(id = it.id, name = it.name) }
    }

    private fun buildDeployRequest(
        deployment: Deployment,
        build: Build,
        circleId: String? = null,
        cdConfigurationId: String
    ): DeployRequest {
        return DeployRequest(
            deploymentId = deployment.id,
            applicationName = build.workspaceId,
            modules = buildModulesDeployRequest(build),
            authorId = deployment.author.id,
            description = "Deployment from Charles C.D.",
            circle = createDeployCircleRequest(circleId),
            callbackUrl = createCallbackUrl(deployment),
            cdConfigurationId = cdConfigurationId
        )
    }

    private fun createDeployCircleRequest(circleId: String?): DeployCircleRequest? {
        return circleId?.let { it ->
            DeployCircleRequest(headerValue = it)
        }
    }

    private fun buildModulesDeployRequest(build: Build): List<DeployModuleRequest> =
        getModulesFromBuild(
            build
        ).map { module ->
            DeployModuleRequest(
                moduleId = module.moduleId,
                helmRepository = module.helmRepository!!,
                components = buildComponentsDeployRequest(module)
            )
        }

    private fun buildComponentsDeployRequest(module: ModuleSnapshot): List<DeployComponentRequest> =
        module.components.map { component ->
            buildComponentDeployRequest(
                component
            )
        }

    private fun buildComponentDeployRequest(component: ComponentSnapshot): DeployComponentRequest {
        return DeployComponentRequest(
            componentId = component.componentId,
            componentName = component.name,
            buildImageUrl = component.artifact!!.artifact,
            buildImageTag = component.artifact!!.version,
            hostValue = component.hostValue,
            gatewayName = component.gatewayName
        )
    }

    private fun createCallbackUrl(deployment: Deployment): String {
        return "$APPLICATION_BASE_PATH/$DEPLOY_CALLBACK_API_PATH/${deployment.id}/callback"
    }

    private fun getModulesFromBuild(build: Build): List<ModuleSnapshot> {
        return build.features.map { featureSnapshot ->
            featureSnapshot.modules
        }.flatten().distinctBy { moduleSnapshot ->
            moduleSnapshot.moduleId
        }
    }
}
