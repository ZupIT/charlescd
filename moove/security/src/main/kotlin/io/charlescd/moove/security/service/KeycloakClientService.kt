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

package io.charlescd.moove.security.service

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import io.charlescd.moove.domain.MooveErrorCode
import io.charlescd.moove.domain.Permission
import io.charlescd.moove.domain.User
import io.charlescd.moove.domain.exceptions.BusinessException
import io.charlescd.moove.domain.exceptions.NotFoundException
import io.charlescd.moove.domain.service.KeycloakService
import io.charlescd.moove.infrastructure.service.client.KeycloakFormEncodedClient
import io.charlescd.moove.security.CharlesAccessToken
import io.charlescd.moove.security.WorkspacePermissionsMapping
import java.time.LocalDateTime
import java.time.ZoneOffset
import org.keycloak.TokenVerifier
import org.keycloak.admin.client.Keycloak
import org.keycloak.representations.idm.CredentialRepresentation
import org.keycloak.representations.idm.UserRepresentation
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service

@Service
class KeycloakClientService(
    val keycloak: Keycloak,
    val keycloakFormEncodedClient: KeycloakFormEncodedClient
) : KeycloakService {

    @Value("\${charlescd.keycloak.realm}")
    lateinit var realm: String

    @Value("\${charlescd.keycloak.public.clientId}")
    lateinit var publicClientId: String

    private val objectMapper = jacksonObjectMapper()

    override fun addPermissionsToUser(workspaceId: String, user: User, permissions: List<Permission>) {
        val keycloakUser = loadKeycloakUser(user.email)
        val keycloakWorkspaceAttribute = keycloakUser.attributes["workspaces"]
        val actualPermissionsMapping = keycloakWorkspaceAttribute?.map { objectMapper.readValue(it, WorkspacePermissionsMapping::class.java) }?.toMutableList()
        val workspaceAndPermissionsMapping = actualPermissionsMapping?.firstOrNull { it.id == workspaceId }
        val permissionsToBeAddedMapping = WorkspacePermissionsMapping(
            id = workspaceId,
            permissions = permissions.map { it.name })

        if (workspaceAndPermissionsMapping != null) {
            actualPermissionsMapping.remove(workspaceAndPermissionsMapping)

            actualPermissionsMapping.add(
                workspaceAndPermissionsMapping.copy(
                    permissions = workspaceAndPermissionsMapping.permissions.union(permissionsToBeAddedMapping.permissions).toList()
                )
            )
        } else {
            actualPermissionsMapping?.add(permissionsToBeAddedMapping)
        }

        val workspaceAndPermissionsJson = actualPermissionsMapping?.map { objectMapper.writeValueAsString(it) }

        keycloakUser.attributes["workspaces"] = workspaceAndPermissionsJson ?: listOf(objectMapper.writeValueAsString(permissionsToBeAddedMapping))

        updateKeycloakUser(keycloakUser)
    }

    override fun removePermissionsFromUser(workspaceId: String, user: User, permissions: List<Permission>) {
        val keycloakUser = loadKeycloakUser(user.email)

        val keycloakWorkspaceAttribute = keycloakUser.attributes["workspaces"]

        val actualPermissionsMapping = keycloakWorkspaceAttribute?.map { objectMapper.readValue(it, WorkspacePermissionsMapping::class.java) }?.toMutableList()

        val permissionsToBeRemovedMapping = WorkspacePermissionsMapping(
            id = workspaceId,
            permissions = permissions.map { it.name })

        val workspaceAndPermissionsMapping = actualPermissionsMapping?.firstOrNull { it.id == workspaceId }

        if (workspaceAndPermissionsMapping != null) {
            actualPermissionsMapping.remove(workspaceAndPermissionsMapping)
            val updatedWorkspaceAndPermissionsMapping = workspaceAndPermissionsMapping.copy(
                permissions = workspaceAndPermissionsMapping.permissions.subtract(permissionsToBeRemovedMapping.permissions).toList()
            )
            actualPermissionsMapping.takeIf { updatedWorkspaceAndPermissionsMapping.permissions.isNotEmpty() }?.add(updatedWorkspaceAndPermissionsMapping)
        } else {
            actualPermissionsMapping?.add(permissionsToBeRemovedMapping)
        }

        val workspaceAndPermissionsJson = actualPermissionsMapping?.map { objectMapper.writeValueAsString(it) }

        keycloakUser.attributes["workspaces"] = workspaceAndPermissionsJson ?: listOf()

        updateKeycloakUser(keycloakUser)
    }

    override fun associatePermissionsToNewUsers(user: User, workspacePermissionsMapping: Map<String, List<Permission>>) {
        val keycloakUser = loadKeycloakUser(user.email)

        val userWorkspaces = keycloakUser.attributes["workspaces"]

        val workspaceAndPermissions = workspacePermissionsMapping.map { entry ->
            mapOf(
                "id" to entry.key,
                "permissions" to entry.value.map { permission -> permission.name }
            )
        }

        if (userWorkspaces != null) {
            workspaceAndPermissions.forEach { userWorkspaces.add(objectMapper.writeValueAsString(it)) }
        }

        keycloakUser.attributes["workspaces"] = userWorkspaces ?: workspaceAndPermissions.map { objectMapper.writeValueAsString(it) }

        updateKeycloakUser(keycloakUser)
    }

    override fun disassociatePermissionsFromNewUsers(user: User, workspacePermissionsMapping: Map<String, List<Permission>>) {
        val keycloakUser = loadKeycloakUser(user.email)

        val keycloakWorkspaceAndPermissions = keycloakUser.attributes["workspaces"]?.map { objectMapper.readValue(it, WorkspacePermissionsMapping::class.java) }

        val workspaceAndPermissionsToBeRemoved = workspacePermissionsMapping.map { entry ->
            WorkspacePermissionsMapping(
                id = entry.key,
                permissions = entry.value.map { permission -> permission.name })
        }

        val updatedWorkspaceAndPermissions = keycloakWorkspaceAndPermissions?.minus(workspaceAndPermissionsToBeRemoved)

        val workspaceAndPermissionsJson = updatedWorkspaceAndPermissions?.map { objectMapper.writeValueAsString(it) }

        keycloakUser.attributes["workspaces"] = workspaceAndPermissionsJson

        updateKeycloakUser(keycloakUser)
    }

    override fun getEmailByAccessToken(authorization: String): String {
        val token = authorization.substringAfter("Bearer").trim()
        return TokenVerifier.create(token, CharlesAccessToken::class.java).token.email
    }

    override fun changeUserPassword(email: String, oldPassword: String, newPassword: String) {
        try {
            keycloakFormEncodedClient.authorizeUser(
                realm = realm,
                params = mapOf(
                    "grant_type" to "password",
                    "client_id" to publicClientId,
                    "username" to email,
                    "password" to oldPassword
                )
            )
        } catch (exception: Exception) {
            throw BusinessException.of(MooveErrorCode.USER_PASSWORD_DOES_NOT_MATCH)
        }

        val keycloakUser = loadKeycloakUser(email)

        val credentialRepresentation = CredentialRepresentation()
        credentialRepresentation.type = CredentialRepresentation.PASSWORD
        credentialRepresentation.value = newPassword
        credentialRepresentation.isTemporary = false

        keycloak.realm(this.realm)
            .users()
            .get(keycloakUser.id)
            .resetPassword(credentialRepresentation)
    }

    override fun createUser(email: String, name: String, password: String, isRoot: Boolean) {
        this.keycloak
            .realm(this.realm)
            .users()
            .create(createUserRepresentation(email, name, password, isRoot))
            .takeIf { it.status == 201 }
            ?: throw RuntimeException("Could not create user on keycloak.")
    }

    private fun createUserRepresentation(
        email: String,
        name: String,
        password: String,
        isRoot: Boolean
    ): UserRepresentation {
        val userRepresentation = UserRepresentation()

        val names = name.split(" ")
        if (names.size > 1) userRepresentation.lastName = names.last()

        userRepresentation.isEmailVerified = true
        userRepresentation.isEnabled = true
        userRepresentation.firstName = names.first()
        userRepresentation.email = email
        userRepresentation.username = email
        userRepresentation.createdTimestamp = LocalDateTime.now().toInstant(ZoneOffset.UTC).toEpochMilli()
        userRepresentation.credentials = listOf(createCredentialRepresentation(password))
        userRepresentation.singleAttribute("isRoot", isRoot.toString())

        return userRepresentation
    }

    private fun createCredentialRepresentation(password: String): CredentialRepresentation {
        val credential = CredentialRepresentation()
        credential.type = "password"
        credential.value = password
        return credential
    }

    private fun loadKeycloakUser(email: String): UserRepresentation {
        return keycloak.realm(this.realm)
            .users()
            .search(email)
            .firstOrNull() ?: throw NotFoundException("user", email)
    }

    private fun updateKeycloakUser(keycloakUser: UserRepresentation) {
        keycloak.realm(this.realm)
            .users()
            .get(keycloakUser.id)
            .update(keycloakUser)
    }
}
