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

package io.charlescd.moove.application.workspace.impl

import io.charlescd.moove.application.CircleService
import io.charlescd.moove.application.UserService
import io.charlescd.moove.application.WorkspaceService
import io.charlescd.moove.application.workspace.CreateWorkspaceInteractor
import io.charlescd.moove.application.workspace.request.CreateWorkspaceRequest
import io.charlescd.moove.application.workspace.response.WorkspaceResponse
import io.charlescd.moove.domain.Circle
import io.charlescd.moove.domain.MatcherTypeEnum
import io.charlescd.moove.domain.User
import io.charlescd.moove.domain.Workspace
import java.time.LocalDateTime
import java.util.*
import javax.inject.Inject
import javax.inject.Named
import org.springframework.transaction.annotation.Transactional

@Named
open class CreateWorkspaceInteractorImpl @Inject constructor(
    private val workspaceService: WorkspaceService,
    private val userService: UserService,
    private val circleService: CircleService
) : CreateWorkspaceInteractor {

    @Transactional
    override fun execute(request: CreateWorkspaceRequest): WorkspaceResponse {
        val author = userService.find(request.authorId)
        val workspace = workspaceService.save(request.toWorkspace(UUID.randomUUID().toString(), author))
        createDefaultCircle(author, workspace)

        return WorkspaceResponse.from(workspace)
    }

    private fun createDefaultCircle(
        author: User,
        workspace: Workspace
    ) {
        val circle = Circle(
            id = UUID.randomUUID().toString(),
            name = Circle.DEFAULT_CIRCLE_NAME,
            reference = UUID.randomUUID().toString(),
            author = author,
            createdAt = LocalDateTime.now(),
            matcherType = MatcherTypeEnum.REGULAR,
            defaultCircle = true,
            workspaceId = workspace.id
        )

        circleService.save(circle)
    }
}
