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
import io.charlescd.moove.application.CircleService
import io.charlescd.moove.application.DeploymentService
import io.charlescd.moove.application.circle.FindCircleByIdInteractor
import io.charlescd.moove.application.circle.response.CircleResponse
import io.charlescd.moove.domain.Circle
import javax.inject.Named

@Named
class FindCircleByIdInteractorImpl(
    private val circleService: CircleService,
    private val buildService: BuildService,
    private val deploymentService: DeploymentService
) : FindCircleByIdInteractor {
    override fun execute(id: String, workspaceId: String): CircleResponse {
        return createCircleResponse(circleService.find(id, workspaceId))
    }

    private fun createCircleResponse(
        circle: Circle
    ): CircleResponse {
        val deployment = deploymentService.findLastActive(circle.id)
        val build = deployment?.let { buildService.find(it.buildId) }
        return CircleResponse.from(circle, deployment, build)
    }
}
