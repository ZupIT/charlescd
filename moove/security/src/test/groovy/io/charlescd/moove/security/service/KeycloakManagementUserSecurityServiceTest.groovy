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

import io.charlescd.moove.domain.service.KeycloakService
import spock.lang.Specification

class KeycloakManagementUserSecurityServiceTest extends Specification {

    private KeycloakManagementUserSecurityService keycloackManagementUserSecurityService
    private KeycloakService keycloakService = Mock(KeycloakService)

    def setup() {
        keycloackManagementUserSecurityService = new KeycloakManagementUserSecurityService(keycloakService)
    }

    def 'should get email by token'() {
        given:
        def email = "john.doe@zup.com.br"
        def authorization = "Bearer xpto"

        when:
        keycloackManagementUserSecurityService.getUserEmail(authorization)

        then:
        1 * keycloakService.getEmailByAccessToken(authorization) >> email

        notThrown()
    }

    def 'should create a new user'() {
        given:
        def email = "john.doe@zup.com.br"
        def fullName = "John Doe"
        def password = "xpto123@"

        when:
        keycloackManagementUserSecurityService.createUser(email, fullName, password)

        then:
        1 * keycloakService.createUser(email, fullName, password)

        notThrown()
    }

    def "should change user password"() {
        given:
        def email = "email"
        def oldPassword = "old-password"
        def newPassword = "new-password"

        when:
        keycloackManagementUserSecurityService.changePassword(email, oldPassword, newPassword)

        then:
        1 * keycloakService.changeUserPassword(email, oldPassword, newPassword) >> {}
        notThrown()

    }

    def 'should reset a user password'() {
        given:
        def email = "email"
        def newPassword = "newPassword"

        when:
        keycloackManagementUserSecurityService.resetUserPassword(email, newPassword)

        then:
        1 * keycloakService.resetPassword(email, newPassword)

        notThrown()
    }
}
