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
import java.net.URI
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service

@Service
class DeployClientService(private val deployClient: DeployClient) : DeployService {

    @Value("\${deploy.callback.base.path}")
    lateinit var DEPLOY_CALLBACK_BASE_PATH: String

    companion object {
        const val DEPLOY_CALLBACK_API_PATH = "v2/deployments"
    }

    override fun deploy(deployment: Deployment, build: Build, isDefaultCircle: Boolean, configuration: DeploymentConfiguration) {
        deployClient.deploy(
            URI.create(configuration.butlerUrl),
            buildDeployRequest(
                deployment,
                build,
                deployment.circle.id,
                isDefaultCircle,
                configuration
            )
        )
    }

    override fun undeploy(deploymentId: String, authorId: String, configuration: DeploymentConfiguration) {
        deployClient.undeploy(
            URI.create(configuration.butlerUrl),
            deploymentId,
            UndeployRequest(authorId)
        )
    }

    override fun healthCheck(butlerUrl: String) {
        deployClient.healthCheck(URI.create(butlerUrl))
    }

    private fun buildDeployRequest(
        deployment: Deployment,
        build: Build,
        circleId: String,
        isDefault: Boolean,
        deploymentConfiguration: DeploymentConfiguration
    ): DeployRequest {
        return DeployRequest(
            deploymentId = deployment.id,
            authorId = deployment.author.id,
            callbackUrl = createCallbackUrl(deployment),
            namespace = deploymentConfiguration.namespace,
            components = buildComponentsDeployRequest(build),
            circle = CircleRequest(circleId, isDefault),
            git = GitRequest(deploymentConfiguration.gitToken, deploymentConfiguration.gitProvider)
        )
    }

    private fun buildComponentsDeployRequest(build: Build): List<DeployComponentRequest> =
        getModulesFromBuild(
            build
        ).flatMap { module ->
            module.components.map { component ->
                DeployComponentRequest(
                    componentId = component.componentId,
                    componentName = component.name,
                    buildImageUrl = component.artifact!!.artifact,
                    buildImageTag = component.artifact!!.version,
                    hostValue = component.hostValue,
                    gatewayName = component.gatewayName,
                    helmRepository = module.helmRepository!!
                )
            }
        }

    private fun createCallbackUrl(deployment: Deployment): String {
        return "$DEPLOY_CALLBACK_BASE_PATH/$DEPLOY_CALLBACK_API_PATH/${deployment.id}/callback"
    }

    private fun getModulesFromBuild(build: Build): List<ModuleSnapshot> {
        return build.features.map { featureSnapshot ->
            featureSnapshot.modules
        }.flatten().distinctBy { moduleSnapshot ->
            moduleSnapshot.moduleId
        }
    }
}
