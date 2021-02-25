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

import io.charlescd.moove.domain.service.KeycloakService
import io.charlescd.moove.domain.service.ManagementUserSecurityService
import org.springframework.stereotype.Service

@Service
class KeycloakManagementUserSecurityService(
    val keycloakService: KeycloakService
) : ManagementUserSecurityService {

    override fun getUserEmail(authorization: String): String {
        return keycloakService.getEmailByAccessToken(authorization)
    }

    override fun resetUserPassword(email: String, newPassword: String) {
        keycloakService.resetPassword(email, newPassword)
    }

    override fun changePassword(email: String, oldPassword: String, newPassword: String) {
        keycloakService.changeUserPassword(email, oldPassword, newPassword)
    }

    override fun createUser(email: String, name: String, password: String) {
        keycloakService.createUser(email, name, password)
    }
}
