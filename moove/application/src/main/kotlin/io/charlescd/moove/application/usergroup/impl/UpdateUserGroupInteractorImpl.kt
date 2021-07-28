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

package io.charlescd.moove.application.usergroup.impl

import io.charlescd.moove.application.UserGroupService
import io.charlescd.moove.application.usergroup.UpdateUserGroupInteractor
import io.charlescd.moove.application.usergroup.request.UpdateUserGroupRequest
import io.charlescd.moove.application.usergroup.response.UserGroupResponse
import javax.inject.Inject
import javax.inject.Named

@Named
class UpdateUserGroupInteractorImpl @Inject constructor(
    private val userGroupService: UserGroupService
) : UpdateUserGroupInteractor {

    override fun execute(id: String, request: UpdateUserGroupRequest): UserGroupResponse {
        val userGroupToUpdate = userGroupService.find(id).copy(name = request.name)
        val updatedUserGroup = userGroupService.update(userGroupToUpdate)
        return UserGroupResponse.from(updatedUserGroup)
    }
}
