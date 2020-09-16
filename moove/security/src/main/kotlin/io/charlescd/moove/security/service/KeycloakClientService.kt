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

import io.charlescd.moove.domain.MooveErrorCode
import io.charlescd.moove.domain.exceptions.BusinessException
import io.charlescd.moove.domain.exceptions.NotFoundException
import io.charlescd.moove.domain.service.KeycloakService
import io.charlescd.moove.infrastructure.service.client.KeycloakFormEncodedClient
import java.time.LocalDateTime
import java.time.ZoneOffset
import org.keycloak.TokenVerifier
import org.keycloak.admin.client.Keycloak
import org.keycloak.representations.AccessToken
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

    override fun getEmailByAccessToken(authorization: String): String {
        val token = authorization.substringAfter("Bearer").trim()
        return TokenVerifier.create(token, AccessToken::class.java).token.email
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

    override fun createUser(email: String, name: String, password: String) {
        this.keycloak
            .realm(this.realm)
            .users()
            .create(createUserRepresentation(email, name, password))
            .takeIf { it.status == 201 }
            ?: throw RuntimeException("Could not create user on keycloak.")
    }

    private fun createUserRepresentation(
        email: String,
        name: String,
        password: String
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

    override fun resetPassword(email: String, newPassword: String) {
        val keycloakUser = loadKeycloakUser(email)
        val credentialRepresentation = CredentialRepresentation()
        credentialRepresentation.type = CredentialRepresentation.PASSWORD
        credentialRepresentation.value = newPassword
        keycloak.realm(this.realm)
            .users()
            .get(keycloakUser.id)
            .resetPassword(credentialRepresentation)
    }
}
