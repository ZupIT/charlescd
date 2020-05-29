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

import io.charlescd.moove.application.UserGroupService
import io.charlescd.moove.application.WorkspaceService
import io.charlescd.moove.application.workspace.DisassociateUserGroupFromWorkspaceInteractor
import io.charlescd.moove.domain.MooveErrorCode
import io.charlescd.moove.domain.exceptions.BusinessException
import io.charlescd.moove.domain.service.KeycloakService
import javax.inject.Inject
import javax.inject.Named

@Named
class DisassociateUserGroupFromWorkspaceInteractorImpl @Inject constructor(
    private val workspaceService: WorkspaceService,
    private val userGroupService: UserGroupService,
    private val keycloakService: KeycloakService
) : DisassociateUserGroupFromWorkspaceInteractor {

    override fun execute(workspaceId: String, userGroupId: String) {
        val workspace = workspaceService.find(workspaceId)
        if (workspace.userGroups.none { it.id == userGroupId }) {
            throw BusinessException.of(MooveErrorCode.USER_GROUP_ALREADY_DISASSOCIATED)
        }
        val userGroup = userGroupService.find(userGroupId)
        val permissionsToBeRemoved = userGroupService.findPermissionsFromWorkspaceAndUserGroupAssociation(workspaceId, userGroup)
        workspaceService.disassociateUserGroupAndPermissions(workspace.id, userGroup.id)
        userGroup.users.forEach { user ->
            val userPermissionsFlatten = workspaceService.findUserPermissions(workspaceId, user).values.flatten().distinct()
            if(!userPermissionsFlatten.containsAll(permissionsToBeRemoved)) {
                keycloakService.removePermissionsFromUser(workspace.id, user, permissionsToBeRemoved.minus(userPermissionsFlatten))
            }
        }
    }
}
