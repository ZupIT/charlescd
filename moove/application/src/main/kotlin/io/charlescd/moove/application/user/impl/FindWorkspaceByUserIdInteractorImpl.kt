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

package io.charlescd.moove.application.user.impl

import io.charlescd.moove.application.UserService
import io.charlescd.moove.application.user.FindWorkspaceByUserIdInteractor
import io.charlescd.moove.application.workspace.response.SimpleWorkspaceResponse
import io.charlescd.moove.domain.MooveErrorCode
import io.charlescd.moove.domain.Permission
import io.charlescd.moove.domain.User
import io.charlescd.moove.domain.exceptions.BusinessException
import io.charlescd.moove.domain.service.KeycloakService
import java.util.UUID
import javax.inject.Named

@Named
class FindWorkspaceByUserIdInteractorImpl(private val userService: UserService, private val keycloakService: KeycloakService) :
    FindWorkspaceByUserIdInteractor {

    override fun execute(authorization: String, id: UUID): List<SimpleWorkspaceResponse> {
        val user = userService.find(id.toString())
        val distinctWorkspaces = user.workspaces.distinctBy { it.id }
        val permissionMap = mutableMapOf<String, List<Permission>>()

        user.workspaces.groupBy({ it.id }, { it.permissions })
            .forEach { workspaceL ->
                permissionMap[workspaceL.key] = workspaceL.value.flatten()
            }

        val workspaceResult = distinctWorkspaces.mapNotNull { workspace ->
            permissionMap[workspace.id]?.let { workspacePermission ->
                SimpleWorkspaceResponse(
                    workspace.id,
                    workspace.name,
                    workspacePermission.distinctBy { it.name }.map { it.name })
            }
        }

        validateUser(authorization, user)
        return workspaceResult
    }

    private fun validateUser(authorization: String, user: User) {
        val parsedEmail = keycloakService.getEmailByAccessToken(authorization)
        val registeredUser = userService.findByEmail(parsedEmail)
        if (registeredUser.email != user.email && !registeredUser.root) {
            throw BusinessException.of(MooveErrorCode.FORBIDDEN)
        }
    }
}
