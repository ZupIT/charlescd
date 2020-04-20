/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charles.infrastructure.service

import br.com.zup.charles.domain.Build
import br.com.zup.charles.domain.ComponentSnapshot
import br.com.zup.charles.domain.Deployment
import br.com.zup.charles.domain.ModuleSnapshot
import br.com.zup.charles.domain.service.DeployService
import br.com.zup.charles.infrastructure.service.client.*
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service

@Service
class DeployClientService(private val deployClient: DeployClient) : DeployService {

    @Value("\${application.base.path}")
    lateinit var APPLICATION_BASE_PATH: String

    companion object {
        const val DEPLOY_CALLBACK_API_PATH = "v2/deployments"
    }

    override fun deploy(deployment: Deployment, build: Build, isDefaultCircle: Boolean) {
        when (isDefaultCircle) {
            true -> deployInDefaultCircle(build, deployment)
            else -> deployInSegmentedCircle(build, deployment)
        }
    }

    private fun deployInSegmentedCircle(
        build: Build,
        deployment: Deployment
    ) {
        deployClient.deployInSegmentedCircle(
            buildDeployRequest(
                deployment,
                build,
                deployment.circle.id
            )
        )
    }

    private fun deployInDefaultCircle(
        build: Build,
        deployment: Deployment
    ) {
        deployClient.deployInDefaultCircle(
            buildDeployRequest(
                deployment,
                build
            )
        )
    }

    override fun undeploy(deploymentId: String, authorId: String) {
        deployClient.undeploy(deploymentId, UndeployRequest(authorId))
    }

    private fun buildDeployRequest(deployment: Deployment, build: Build, circleId: String? = null): DeployRequest {
        return DeployRequest(
            deploymentId = deployment.id,
            applicationName = build.applicationId,
            modules = buildModulesDeployRequest(build),
            authorId = deployment.author.id,
            description = "Deployment from Charles C.D.",
            circle = createDeployCircleRequest(circleId),
            callbackUrl = createCallbackUrl(deployment)
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
                helmRepository = module.helmRepository,
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
            contextPath = component.contextPath,
            healthCheck = component.healthCheck,
            port = component.port
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
