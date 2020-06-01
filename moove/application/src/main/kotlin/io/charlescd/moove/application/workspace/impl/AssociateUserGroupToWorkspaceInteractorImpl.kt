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

import io.charlescd.moove.application.RoleService
import io.charlescd.moove.application.UserGroupService
import io.charlescd.moove.application.WorkspaceService
import io.charlescd.moove.application.workspace.AssociateUserGroupToWorkspaceInteractor
import io.charlescd.moove.application.workspace.request.AssociateUserGroupToWorkspaceRequest
import io.charlescd.moove.domain.MooveErrorCode
import io.charlescd.moove.domain.exceptions.BusinessException
import io.charlescd.moove.domain.service.KeycloakService
import javax.inject.Inject
import javax.inject.Named

@Named
class AssociateUserGroupToWorkspaceInteractorImpl @Inject constructor(
    private val workspaceService: WorkspaceService,
    private val userGroupService: UserGroupService,
    private val roleService: RoleService,
    private val keycloakService: KeycloakService
) : AssociateUserGroupToWorkspaceInteractor {

    override fun execute(workspaceId: String, request: AssociateUserGroupToWorkspaceRequest) {
        val workspace = workspaceService.find(workspaceId)
        if (workspace.userGroups.any { it.id == request.userGroupId }) {
            throw BusinessException.of(MooveErrorCode.USER_GROUP_ALREADY_ASSOCIATED)
        }
        val userGroup = userGroupService.find(request.userGroupId)
        val role = roleService.find(request.roleId)
        val permissionsToBeAdded = role.permissions
        userGroup.users.forEach { user ->
            val userPermissionsFlatten = workspaceService.findUserPermissions(workspaceId, user).values.flatten().distinct()
            if(!userPermissionsFlatten.containsAll(permissionsToBeAdded)) {
                keycloakService.addPermissionsToUser(workspace.id, user, permissionsToBeAdded.minus(userPermissionsFlatten))
            }
        }
        workspaceService.associateUserGroupAndPermissions(workspaceId, userGroup.id, permissionsToBeAdded)
    }
}
