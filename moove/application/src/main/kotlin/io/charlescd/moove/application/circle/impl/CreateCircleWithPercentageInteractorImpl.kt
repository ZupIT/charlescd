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

import io.charlescd.moove.application.CircleService
import io.charlescd.moove.application.UserService
import io.charlescd.moove.application.WorkspaceService
import io.charlescd.moove.application.circle.CreateCircleInteractor
import io.charlescd.moove.application.circle.CreateCircleWIthPercentageInteractor
import io.charlescd.moove.application.circle.request.CreateCircleRequest
import io.charlescd.moove.application.circle.request.CreateCircleWithPercentageRequest
import io.charlescd.moove.application.circle.response.CircleResponse
import io.charlescd.moove.domain.Circle
import io.charlescd.moove.domain.service.CircleMatcherService
import javax.inject.Named
import javax.transaction.Transactional

@Named
open class CreateCircleWithPercentageInteractorImpl(
    private val circleService: CircleService,
    private val userService: UserService,
    private val workspaceService: WorkspaceService,
    private val circleMatcherService: CircleMatcherService
) : CreateCircleWIthPercentageInteractor {

    @Transactional
    override fun execute(request: CreateCircleWithPercentageRequest, workspaceId: String): CircleResponse {
//        this.checkIfLimitOfPercentageReached()
        val circle = circleService.save(createCircle(request, workspaceId))

        createCircleOnCircleMatcher(workspaceId, circle)
        return CircleResponse.from(circle)
    }

    private fun createCircleOnCircleMatcher(workspaceId: String, circle: Circle) {
        val workspace = workspaceService.find(workspaceId)
        this.circleMatcherService.create(circle, workspace.circleMatcherUrl!!)
    }

    private fun createCircle(
        request: CreateCircleWithPercentageRequest,
        workspaceId: String
    ): Circle {
        val author = userService.find(request.authorId)
        return request.toDomain(author, workspaceId)
    }
    private fun checkIfLimitOfPercentageReached() {
        TODO("Not yet implemented")
    }
}
