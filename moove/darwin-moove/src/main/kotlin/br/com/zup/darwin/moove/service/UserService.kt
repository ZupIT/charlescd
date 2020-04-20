/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.moove.service

import br.com.zup.darwin.commons.extension.toRepresentation
import br.com.zup.darwin.commons.representation.UserRepresentation
import br.com.zup.darwin.entity.User
import br.com.zup.darwin.moove.request.user.AddGroupsRequest
import br.com.zup.darwin.moove.request.user.CreateUserRequest
import br.com.zup.darwin.moove.request.user.ResetPasswordRequest
import br.com.zup.darwin.moove.request.user.UpdateUserRequest
import br.com.zup.darwin.repository.UserRepository
import br.com.zup.exception.handler.exception.NotFoundException
import br.com.zup.exception.handler.to.ResourceValue
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import java.util.*
import javax.transaction.Transactional

@Service
class UserService(
    private val userRepository: UserRepository,
    private val keycloakService: KeycloakService
) {

    fun findAll(pageable: Pageable): Page<UserRepresentation> {
        return userRepository.findAll(pageable)
            .map { it.toRepresentation() }
    }

    fun findByEmail(email: String): UserRepresentation {
        return userRepository.findByEmail(String(Base64.getDecoder().decode(email)).toLowerCase())
            .orElseThrow { NotFoundException(ResourceValue("user", email)) }
            .toRepresentation()
    }

    @Transactional
    fun create(createUserRequest: CreateUserRequest): UserRepresentation {
        return createUserRequest
            .toModel()
            .let(this::saveAndFlushUser)
            .apply { addUserToKeycloak(createUserRequest) }
            .toRepresentation()
    }

    fun addGroupsToUser(userId: String, addGroupsRequest: AddGroupsRequest) {
        this.userRepository.findById(userId)
            .map { this.keycloakService.addGroupsToUser(it.email, addGroupsRequest.groupIds) }
            .orElseThrow { NotFoundException(ResourceValue("user", userId)) }
    }

    fun removeUserFromGroup(userId: String, groupId: String) {
        this.userRepository.findById(userId)
            .orElseThrow { NotFoundException(ResourceValue("user", userId)) }
            .let { keycloakService.removeUserFromGroup(it.email, groupId) }
    }

    fun update(id: String, updateUserRequest: UpdateUserRequest): UserRepresentation {
        return userRepository.findById(id)
            .map(this.updateUserData(updateUserRequest))
            .map(this::saveAndFlushUser)
            .map(this::toRepresentation)
            .orElseThrow { NotFoundException(ResourceValue("user", id)) }
    }

    @Transactional
    fun delete(id: String): UserRepresentation {
        return userRepository.findById(id)
            .map(this::deleteUser)
            .map { keycloakService.deleteUserByEmail(it.email); it }
            .map(this::toRepresentation)
            .orElseThrow { NotFoundException(ResourceValue("user", id)) }
    }

    private fun updateUserData(updateUserRequest: UpdateUserRequest): (User) -> User =
        { user ->
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
        email = this.email.toLowerCase(),
        photoUrl = this.photoUrl,
        createdAt = LocalDateTime.now()
    )

    private fun addUserToKeycloak(it: CreateUserRequest) {
        this.keycloakService.createUser(
            it.email,
            it.name,
            it.password
        )
    }

    fun resetPassword(email: String, request: ResetPasswordRequest) {

        keycloakService.resetPassword(
            email,
            request.newPassword
        )

    }
}
