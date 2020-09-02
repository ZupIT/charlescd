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
import io.charlescd.moove.application.user.ChangeUserPasswordInteractor
import io.charlescd.moove.application.user.request.ChangeUserPasswordRequest
import io.charlescd.moove.domain.MooveErrorCode
import io.charlescd.moove.domain.exceptions.BusinessException
import io.charlescd.moove.domain.service.KeycloakService
import javax.inject.Inject
import javax.inject.Named

@Named
class ChangeUserPasswordInteractorImpl @Inject constructor(
    private val userService: UserService,
    private val keycloakService: KeycloakService
) : ChangeUserPasswordInteractor {

    override fun execute(id: String, authorization: String, request: ChangeUserPasswordRequest) {
        val user = userService.find(id)
        if (!keycloakService.checkUserAuthenticity(user, authorization)) {
            throw BusinessException.of(MooveErrorCode.INVALID_USER_AUTHENTICITY)
        }
        keycloakService.changeUserPassword(user.email, request.oldPassword, request.newPassword)
    }
}
