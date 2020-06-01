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

import io.charlescd.moove.application.WorkspaceService
import io.charlescd.moove.application.circle.IdentifyCircleInteractor
import io.charlescd.moove.application.circle.response.IdentifyCircleResponse
import io.charlescd.moove.domain.MooveErrorCode
import io.charlescd.moove.domain.SimpleCircle
import io.charlescd.moove.domain.Workspace
import io.charlescd.moove.domain.exceptions.BusinessException
import io.charlescd.moove.domain.service.CircleMatcherService
import javax.inject.Named

@Named
class IdentifyCircleInteractorImpl(
    private val workspaceService: WorkspaceService,
    private val circleMatcherService: CircleMatcherService
) : IdentifyCircleInteractor {
    override fun execute(workspaceId: String, request: Map<String, Any>): List<IdentifyCircleResponse> {
        val workspace = workspaceService.find(workspaceId)
        return createResponseList(circleMatcherService.identify(workspace, request))
    }

    private fun validateWorkspace(workspace: Workspace) {
        workspace.circleMatcherUrl ?: throw BusinessException.of(MooveErrorCode.INVALID_CIRCLE_MATCHER_URL_ERROR)
    }

    private fun createResponseList(simpleCircles: List<SimpleCircle>): List<IdentifyCircleResponse> {
        return simpleCircles.map { IdentifyCircleResponse.from(it) }
    }
}
