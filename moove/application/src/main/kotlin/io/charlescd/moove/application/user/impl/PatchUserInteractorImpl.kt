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
import io.charlescd.moove.application.user.PatchUserInteractor
import io.charlescd.moove.application.user.request.PatchUserRequest
import io.charlescd.moove.application.user.response.UserResponse
import io.charlescd.moove.domain.MooveErrorCode
import io.charlescd.moove.domain.User
import io.charlescd.moove.domain.exceptions.BusinessException
import java.util.*
import javax.inject.Inject
import javax.inject.Named
import org.springframework.beans.factory.annotation.Value

@Named
class PatchUserInteractorImpl @Inject constructor(
    private val userService: UserService,
    @Value("\${charles.internal.idm.enabled:true}") private val internalIdmEnabled: Boolean
) : PatchUserInteractor {

    override fun execute(id: UUID, patchUserRequest: PatchUserRequest, authorization: String): UserResponse {
        if (internalIdmEnabled) {
            val authenticatedUser = userService.findByAuthorizationToken(authorization)
            if (authenticatedUser.root) {
                patchUserRequest.validate()
                return UserResponse.from(updateUser(patchUserRequest, userService.find(id.toString())))
            } else {
                throw BusinessException.of(MooveErrorCode.FORBIDDEN)
            }
        } else {
            throw BusinessException.of(MooveErrorCode.EXTERNAL_IDM_FORBIDDEN)
        }
    }

    private fun updateUser(patchUserRequest: PatchUserRequest, user: User): User {
        val patched = patchUserRequest.applyPatch(user)
        return userService.update(patched)
    }
}
