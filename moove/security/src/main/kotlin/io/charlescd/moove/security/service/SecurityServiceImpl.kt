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

package io.charlescd.moove.security.service

import io.charlescd.moove.domain.User
import io.charlescd.moove.domain.exceptions.NotFoundException
import io.charlescd.moove.domain.repository.UserRepository
import io.charlescd.moove.domain.service.KeycloakService
import io.charlescd.moove.domain.service.SecurityService
import org.springframework.stereotype.Service

@Service
class SecurityServiceImpl(
    val keycloakService: KeycloakService,
    var userRepository: UserRepository
) : SecurityService {

    override fun getUser(authorization: String): User {
        return getUserByToken(authorization)
    }

    fun getUserByToken(authorization: String): User {
        val email = keycloakService.getEmailByAccessToken(authorization)
        return userRepository
            .findByEmail(email).orElseThrow {
                NotFoundException("user", email)
            }
    }
}
