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

package io.charlescd.moove.legacy.moove.service

import io.charlescd.moove.legacy.repository.UserRepository
import org.keycloak.TokenVerifier

import org.keycloak.admin.client.Keycloak

import org.keycloak.representations.AccessToken
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service

@Service
class KeycloakServiceLegacy(private val keycloak: Keycloak, private val userRepository: UserRepository) {

    @Value("\${charlescd.keycloak.realm}")
    lateinit var realm: String

    fun deleteUserByEmail(id: String) {
        deleteUserById(id)
    }

    fun getEmailByToken(authorization: String): String {
        val token = authorization.substringAfter("Bearer").trim()
        return TokenVerifier.create(token, AccessToken::class.java).token.email
    }

    private fun deleteUserById(userId: String) {
        this.keycloak
            .realm(realm)
            .users()
            .delete(userId)
    }


}
