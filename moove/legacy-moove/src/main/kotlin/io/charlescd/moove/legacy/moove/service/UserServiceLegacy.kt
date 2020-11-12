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

package io.charlescd.moove.legacy.moove.service

import io.charlescd.moove.commons.exceptions.NotFoundExceptionLegacy
import io.charlescd.moove.commons.extension.toRepresentation
import io.charlescd.moove.commons.representation.UserRepresentation
import io.charlescd.moove.legacy.moove.request.user.UpdateUserRequest
import io.charlescd.moove.legacy.repository.UserRepository
import io.charlescd.moove.legacy.repository.entity.User
import javax.transaction.Transactional
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service

@Service
class UserServiceLegacy(
    private val userRepository: UserRepository,
    private val keycloakServiceLegacy: KeycloakServiceLegacy,
    @Value("\${charles.internal.idm.enabled:true}") private val internalIdmEnabled: Boolean
) {

    fun update(id: String, updateUserRequest: UpdateUserRequest): UserRepresentation {
        return userRepository.findById(id)
            .map(this.updateUserData(updateUserRequest))
            .map(this::saveAndFlushUser)
            .map(this::toRepresentation)
            .orElseThrow { NotFoundExceptionLegacy("user", id) }
    }

    @Transactional
    fun delete(id: String, authorization: String): UserRepresentation {
        val user = findByToken(authorization)
        if (user.isRoot) {
            return deleteUser(id)
        }
        return deleteUser(user.id)
    }

    fun findUsers(users: List<String>): List<User> =
        this.userRepository.findAllById(users)
            .takeIf { users.size == it.size }
            ?: throw NotFoundExceptionLegacy(
                "users",
                users.joinToString(", ")
            )

    fun findUser(id: String): User =
        this.userRepository.findById(id)
            .orElseThrow { NotFoundExceptionLegacy("user", id) }

    fun findByToken(authorization: String): User {
        val email = keycloakServiceLegacy.getEmailByToken(authorization)
        return userRepository.findByEmail(email).orElseThrow {
            NotFoundExceptionLegacy("user", email)
        }
    }

    private fun deleteUser(id: String): UserRepresentation {
        return userRepository.findById(id)
            .map(this::deleteUser)
            .map(this::deleteOnKeycloak)
            .map(this::toRepresentation)
            .orElseThrow { NotFoundExceptionLegacy("user", id) }
    }

    private fun deleteOnKeycloak(it: User): User {
        if (internalIdmEnabled) {
            keycloakServiceLegacy.deleteUserById(it.id)
        }
        return it
    }

    private fun updateUserData(updateUserRequest: UpdateUserRequest): (User) -> User = { user ->
        user.copy(
            name = updateUserRequest.name,
            email = updateUserRequest.email.toLowerCase(),
            photoUrl = updateUserRequest.photoUrl
        )
    }

    private fun saveAndFlushUser(user: User): User =
        userRepository.saveAndFlush(user)

    private fun deleteUser(user: User): User =
        user.also { userRepository.delete(it) }

    private fun toRepresentation(user: User): UserRepresentation = user.toRepresentation()
}
