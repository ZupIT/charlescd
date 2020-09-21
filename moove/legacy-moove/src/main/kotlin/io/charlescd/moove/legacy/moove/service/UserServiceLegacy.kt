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
import io.charlescd.moove.legacy.moove.request.user.AddGroupsRequest
import io.charlescd.moove.legacy.moove.request.user.CreateUserRequest
import io.charlescd.moove.legacy.moove.request.user.ResetPasswordRequest
import io.charlescd.moove.legacy.moove.request.user.UpdateUserRequest
import io.charlescd.moove.legacy.repository.UserRepository
import io.charlescd.moove.legacy.repository.entity.User
import java.time.LocalDateTime
import java.util.*
import javax.transaction.Transactional
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service

@Service
class UserServiceLegacy(
    private val userRepository: UserRepository,
    private val keycloakService: KeycloakService,
    @Value("\${charles.internal.idm.enabled:true}") private val internalIdmEnabled: Boolean
) {

    fun addGroupsToUser(userId: String, addGroupsRequest: AddGroupsRequest) {
        this.userRepository.findById(userId)
            .map { this.keycloakService.addGroupsToUser(it.email, addGroupsRequest.groupIds) }
            .orElseThrow { NotFoundExceptionLegacy("user", userId) }
    }

    fun removeUserFromGroup(userId: String, groupId: String) {
        this.userRepository.findById(userId)
            .orElseThrow { NotFoundExceptionLegacy("user", userId) }
            .let { keycloakService.removeUserFromGroup(it.email, groupId) }
    }

    fun update(id: String, updateUserRequest: UpdateUserRequest): UserRepresentation {
        return userRepository.findById(id)
            .map(this.updateUserData(updateUserRequest))
            .map(this::saveAndFlushUser)
            .map(this::toRepresentation)
            .orElseThrow { NotFoundExceptionLegacy("user", id) }
    }

    @Transactional
    fun delete(id: String): UserRepresentation {
        return userRepository.findById(id)
            .map(this::deleteUser)
            .map(this::deleteOnKeycloak)
            .map(this::toRepresentation)
            .orElseThrow { NotFoundExceptionLegacy("user", id) }
    }

    private fun deleteOnKeycloak(it: User): User {
        if (internalIdmEnabled) {
            keycloakService.deleteUserByEmail(it.email)
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

    private fun CreateUserRequest.toModel() = User(
        id = UUID.randomUUID().toString(),
        name = this.name,
        email = this.email.toLowerCase().trim(),
        photoUrl = this.photoUrl,
        isRoot = this.isRoot ?: false,
        createdAt = LocalDateTime.now()
    )

    fun resetPassword(email: String, request: ResetPasswordRequest) {

        keycloakService.resetPassword(
            email,
            request.newPassword
        )
    }
}
