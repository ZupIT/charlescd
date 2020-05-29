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

package io.charlescd.moove.application.usergroup.impl

import io.charlescd.moove.application.UserGroupService
import io.charlescd.moove.application.UserService
import io.charlescd.moove.application.usergroup.RemoveMemberFromUserGroupInteractor
import io.charlescd.moove.domain.MooveErrorCode
import io.charlescd.moove.domain.exceptions.BusinessException
import io.charlescd.moove.domain.service.KeycloakService
import javax.inject.Inject
import javax.inject.Named

@Named
class RemoveMemberFromUserGroupInteractorImpl @Inject constructor(
    private val userGroupService: UserGroupService,
    private val userService: UserService,
    private val keycloakService: KeycloakService
) : RemoveMemberFromUserGroupInteractor {

    override fun execute(id: String, memberId: String) {
        val userGroup = userGroupService.find(id)
        val member = userService.find(memberId)
        if (!userGroup.users.any { it.id == member.id }) {
            throw BusinessException.of(MooveErrorCode.USER_ALREADY_DISASSOCIATED)
        }
        userGroupService.removeMember(userGroup, member)
        val workspaceAndPermissionsMapping = userGroupService.findPermissionsFromUserGroupAssociations(userGroup)
        if (workspaceAndPermissionsMapping.isNotEmpty()) {
            keycloakService.disassociatePermissionsFromNewUsers(member, workspaceAndPermissionsMapping)
        }
    }
}
