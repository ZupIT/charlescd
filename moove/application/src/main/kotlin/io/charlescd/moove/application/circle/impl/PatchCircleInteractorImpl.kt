/*
 *
 *  * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *  *
 *  * Licensed under the Apache License, Version 2.0 (the "License");
 *  * you may not use this file except in compliance with the License.
 *  * You may obtain a copy of the License at
 *  *
 *  *     http://www.apache.org/licenses/LICENSE-2.0
 *  *
 *  * Unless required by applicable law or agreed to in writing, software
 *  * distributed under the License is distributed on an "AS IS" BASIS,
 *  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  * See the License for the specific language governing permissions and
 *  * limitations under the License.
 *
 */

package io.charlescd.moove.application.circle.impl

import io.charlescd.moove.application.BuildService
import io.charlescd.moove.application.CircleService
import io.charlescd.moove.application.DeploymentService
import io.charlescd.moove.application.WorkspaceService
import io.charlescd.moove.application.circle.PatchCircleInteractor
import io.charlescd.moove.application.circle.request.PatchCircleRequest
import io.charlescd.moove.application.circle.response.CircleResponse
import io.charlescd.moove.domain.Circle
import io.charlescd.moove.domain.MatcherTypeEnum
import io.charlescd.moove.domain.MooveErrorCode
import io.charlescd.moove.domain.exceptions.BusinessException
import io.charlescd.moove.domain.service.CircleMatcherService
import java.util.*
import javax.inject.Named
import javax.transaction.Transactional

@Named
open class PatchCircleInteractorImpl(
    private val circleMatcherService: CircleMatcherService,
    private val workspaceService: WorkspaceService,
    private val deploymentService: DeploymentService,
    private val buildService: BuildService,
    private val circleService: CircleService
) : PatchCircleInteractor {

    @Transactional
    override fun execute(id: String, request: PatchCircleRequest): CircleResponse {
        request.validate()
        val circle = circleService.find(id)
        canBeUpdated(circle)
        val updatedCircle = updateCircle(request, circle)
        updateCircleOnCircleMatcher(circle, updatedCircle)

        return createCircleResponse(updatedCircle)
    }

    private fun createCircleResponse(
        circle: Circle
    ): CircleResponse {
        val deployment = deploymentService.findLastActive(circle.id)
        val build = deployment?.let { buildService.find(it.buildId) }
        return CircleResponse.from(circle, deployment, build)
    }

    private fun canBeUpdated(circle: Circle) {
        if (!circle.canBeUpdated()) {
            throw BusinessException.of(MooveErrorCode.CANNOT_UPDATE_DEFAULT_CIRCLE)
        }
    }

    private fun updateCircle(
        request: PatchCircleRequest,
        circle: Circle
    ): Circle {
        val patched = request.applyPatch(
            circle.copy(
                reference = UUID.randomUUID().toString(),
                matcherType = MatcherTypeEnum.REGULAR,
                importedKvRecords = 0
            )
        )
        return circleService.update(patched)
    }

    private fun updateCircleOnCircleMatcher(
        circle: Circle,
        updated: Circle
    ) {
        val workspace = workspaceService.find(circle.workspaceId)
        this.circleMatcherService.update(updated, circle.reference, workspace.circleMatcherUrl!!)
    }
}
