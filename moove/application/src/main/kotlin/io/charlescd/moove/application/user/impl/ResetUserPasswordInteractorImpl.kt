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

package io.charlescd.moove.application.user.impl

import io.charlescd.moove.application.UserPasswordFormat
import io.charlescd.moove.application.UserPasswordGeneratorService
import io.charlescd.moove.application.UserService
import io.charlescd.moove.application.user.ResetUserPasswordInteractor
import io.charlescd.moove.application.user.response.UserNewPasswordResponse
import io.charlescd.moove.domain.MooveErrorCode
import io.charlescd.moove.domain.User
import io.charlescd.moove.domain.exceptions.BusinessException
import java.util.*
import javax.inject.Named

@Named
class ResetUserPasswordInteractorImpl(
    private val passGenerator: UserPasswordGeneratorService,
    private val userService: UserService
) : ResetUserPasswordInteractor {
    override fun execute(authorization: String, id: UUID): UserNewPasswordResponse {
        val userToResetPassword = userService.find(id.toString())
        validateUser(authorization, userToResetPassword)
        val newPassword = resetPassword(userToResetPassword.email)
        return UserNewPasswordResponse(newPassword)
    }

    private fun validateUser(authorization: String, userToResetPassword: User) {
        val tokenUser = userService.findByAuthorizationToken(authorization)

        if (!tokenUser.root) {
            throw BusinessException.of(MooveErrorCode.FORBIDDEN)
        }

        if (tokenUser.email == userToResetPassword.email) {
            throw BusinessException.of(MooveErrorCode.CANNOT_RESET_YOUR_OWN_PASSWORD)
        }
    }

    private fun resetPassword(email: String): String {
        val newPassword = generatePassword()
        userService.resetPassword(email, newPassword)
        return newPassword
    }

    private fun generatePassword(): String {
        val userPasswordFormat = UserPasswordFormat(
            numberDigits = 2,
            numberLowerCase = 4,
            numberUpperCase = 2,
            numberSpecialChars = 2,
            passwordLength = 10
        )
        return passGenerator.create(userPasswordFormat)
    }
}
