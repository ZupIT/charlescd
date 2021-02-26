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

package io.charlescd.moove.application

import io.charlescd.moove.domain.MooveErrorCode
import io.charlescd.moove.domain.Page
import io.charlescd.moove.domain.PageRequest
import io.charlescd.moove.domain.User
import io.charlescd.moove.domain.exceptions.BusinessException
import io.charlescd.moove.domain.exceptions.NotFoundException
import io.charlescd.moove.domain.repository.UserRepository
import io.charlescd.moove.domain.service.ManagementUserSecurityService
import javax.inject.Named

@Named
class UserService(private val userRepository: UserRepository, private val managementUserSecurityService: ManagementUserSecurityService) {

    fun find(userId: String): User {
        return this.userRepository.findById(
            userId
        ).orElseThrow {
            NotFoundException("user", userId)
        }
    }

    fun findAll(name: String?, email: String?, pageRequest: PageRequest): Page<User> {
        return this.userRepository.findAll(name, email, pageRequest)
    }

    fun findByEmail(email: String): User {
        return this.userRepository.findByEmail(email).orElseThrow {
            NotFoundException("user", email)
        }
    }

    fun checkIfEmailAlreadyExists(user: User) {
        if (userRepository.findByEmail(user.email).isPresent) {
            throw BusinessException.of(MooveErrorCode.CREATE_USER_ERROR_EMAIL_ALREADY_EXISTS)
                .withParameters(user.email)
        }
    }

    fun save(user: User): User {
        return this.userRepository.save(user)
    }

    fun findByAuthorizationToken(authorization: String): User {
        return findByEmail(getEmailFromToken(authorization))
    }

    fun getEmailFromToken(authorization: String): String {
        return managementUserSecurityService.getUserEmail(authorization)
    }

    fun resetPassword(email: String, newPassword: String) {
        return managementUserSecurityService.resetUserPassword(email, newPassword)
    }

    fun changePassword(email: String, oldPassword: String, newPassword: String) {
        return managementUserSecurityService.changePassword(email, oldPassword, newPassword)
    }

    fun createUserOnKeycloak(email: String, name: String, password: String) {
        return managementUserSecurityService.createUser(email, name, password)
    }

    fun update(user: User): User {
        return userRepository.update(user)
    }
}
