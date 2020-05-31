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
import io.charlescd.moove.application.UserService
import io.charlescd.moove.application.usergroup.CreateUserGroupInteractor
import io.charlescd.moove.application.usergroup.request.CreateUserGroupRequest
import io.charlescd.moove.application.usergroup.response.UserGroupResponse
import javax.inject.Inject
import javax.inject.Named

@Named
class CreateUserGroupInteractorImpl @Inject constructor(
    private val userGroupService: UserGroupService,
    private val userService: UserService
) : CreateUserGroupInteractor {

    override fun execute(request: CreateUserGroupRequest): UserGroupResponse {
        val author = userService.find(request.authorId)
        val saved = userGroupService.save(request.toUserGroup(author))
        return UserGroupResponse.from(saved)
    }
}
