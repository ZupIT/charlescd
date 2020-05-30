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

package io.charlescd.moove.application.circle.impl

import io.charlescd.moove.application.BuildService
import io.charlescd.moove.application.DeploymentService
import io.charlescd.moove.application.circle.FindCircleComponentsInteractor
import io.charlescd.moove.application.circle.response.CircleComponentResponse
import io.charlescd.moove.domain.ComponentSnapshot
import io.charlescd.moove.domain.Deployment
import io.charlescd.moove.domain.ModuleSnapshot
import javax.inject.Named

@Named
class FindCircleComponentsInteractorImpl(
    private val deploymentService: DeploymentService,
    private val buildService: BuildService
) : FindCircleComponentsInteractor {

    override fun execute(id: String, workspaceId: String): List<CircleComponentResponse> {
        val deployments = deploymentService.findActiveList(id)
        return createResponseList(deployments)
    }

    private fun createResponseList(deployments: List<Deployment>): List<CircleComponentResponse> {
        val sorted = deployments.sortedByDescending { it.deployedAt }

        val componentResponses = ArrayList<CircleComponentResponse>()

        fillResponseList(sorted, componentResponses)

        return componentResponses
    }

    private fun fillResponseList(
        deployments: List<Deployment>,
        componentResponses: ArrayList<CircleComponentResponse>
    ) {
        deployments.forEach {
            buildService.find(it.buildId)
                .modules().forEach { module ->
                    module.components.forEach { component ->
                        filterResponse(component, module, componentResponses)
                    }
                }
        }
    }

    private fun filterResponse(
        component: ComponentSnapshot,
        module: ModuleSnapshot,
        componentResponses: ArrayList<CircleComponentResponse>
    ) {
        val componentResponse = createComponentResponse(component, module)
        if (!componentResponses.contains(componentResponse)) {
            componentResponses.add(componentResponse)
        }
    }

    private fun createComponentResponse(
        component: ComponentSnapshot,
        module: ModuleSnapshot
    ): CircleComponentResponse {
        return CircleComponentResponse(
            component.componentId,
            component.name,
            module.name,
            component.artifact!!.version,
            component.artifact!!.artifact
        )
    }
}
