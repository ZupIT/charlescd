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

package io.charlescd.moove.application.module.impl

import io.charlescd.moove.application.ModuleService
import io.charlescd.moove.application.UserService
import io.charlescd.moove.application.WorkspaceService
import io.charlescd.moove.application.module.CreateModuleInteractor
import io.charlescd.moove.application.module.request.CreateModuleRequest
import io.charlescd.moove.application.module.response.ModuleResponse
import io.charlescd.moove.domain.MooveErrorCode
import io.charlescd.moove.domain.WorkspaceStatusEnum
import io.charlescd.moove.domain.exceptions.BusinessException
import java.util.*
import javax.inject.Named
import javax.transaction.Transactional

@Named
open class CreateModuleInteractorImpl(
    private val moduleService: ModuleService,
    private val userService: UserService,
    private val workspaceService: WorkspaceService
) :
    CreateModuleInteractor {

    @Transactional
    override fun execute(request: CreateModuleRequest, workspaceId: String): ModuleResponse {

        val workspace = workspaceService.find(workspaceId)

        if (workspace.status == WorkspaceStatusEnum.INCOMPLETE) {
            throw BusinessException.of(MooveErrorCode.CANNOT_CREATE_MODULES_IN_A_INCOMPLETE_WORKSPACE)
        }

        return ModuleResponse.from(
            moduleService.create(
                request.toDomain(
                    UUID.randomUUID().toString(),
                    workspace.id,
                    userService.find(request.authorId)
                )
            )
        )
    }
}
