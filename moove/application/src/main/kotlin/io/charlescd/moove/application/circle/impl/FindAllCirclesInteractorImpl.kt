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
import io.charlescd.moove.application.ResourcePageResponse
import io.charlescd.moove.application.circle.FindAllCirclesInteractor
import io.charlescd.moove.application.circle.response.CircleResponse
import io.charlescd.moove.domain.Circle
import io.charlescd.moove.domain.Deployment
import io.charlescd.moove.domain.Page
import io.charlescd.moove.domain.PageRequest
import javax.inject.Named

@Named
class FindAllCirclesInteractorImpl(
    private val circleService: CircleService,
    private val deploymentService: DeploymentService,
    private val buildService: BuildService
) : FindAllCirclesInteractor {
    override fun execute(
        name: String?,
        active: Boolean,
        workspaceId: String,
        pageRequest: PageRequest
    ): ResourcePageResponse<CircleResponse> {
        val page = circleService.find(name, active, workspaceId, pageRequest)
        return createResponsePage(page, convertContent(page, active))
    }

    private fun convertContent(page: Page<Circle>, active: Boolean): List<CircleResponse> {
        return when (page.total > 0) {
            true -> createCircleResponseList(page, active)
            else -> emptyList()
        }
    }

    private fun createResponsePage(
        page: Page<Circle>,
        content: List<CircleResponse>
    ) = ResourcePageResponse.from(
        content,
        page.pageNumber,
        page.pageSize,
        page.isLast(),
        page.totalPages()
    )

    private fun createCircleResponseList(page: Page<Circle>, active: Boolean): List<CircleResponse> {
        return page.content.map { circle ->
            val deployment = findActiveDeployment(active, circle)
            val build = deployment?.let { buildService.find(deployment.buildId) }
            CircleResponse.from(circle, deployment, build)
        }
    }

    private fun findActiveDeployment(
        active: Boolean,
        circle: Circle
    ): Deployment? {
        return when (active) {
            true -> deploymentService.findLastActive(circle.id)
            else -> null
        }
    }
}
