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
import org.keycloak.admin.client.Keycloak
import org.keycloak.admin.client.resource.*
import org.keycloak.representations.idm.UserRepresentation
import spock.lang.Specification

import javax.ws.rs.core.Response

class KeycloakServiceLegacyGroovyUnitTest extends Specification {

    private KeycloakServiceLegacy service
    private Keycloak keycloak = Mock(Keycloak)
    private RealmResource realmResource = Mock(RealmResource)
    private UsersResource usersResource = Mock(UsersResource)
    private UserRepository userRepository = Mock(UserRepository)
    private Response response = Mock(Response)

    def setup() {
        service = new KeycloakServiceLegacy(keycloak, userRepository)
        service.realm = "Charles"
    }

    def 'should delete a keycloak user by email'() {
        given:
        def user = new UserRepresentation()
        user.id = "fake-user-id"
        user.firstName = "John"
        user.lastName = "Doe"
        user.email = "john.doe@zup.com.br"
        user.username = "john.doe@zup.com.br"
        def users = new ArrayList()
        users.add(user)

        when:
        service.deleteUserByEmail("john.doe@zup.com.br")

        then:
        2 * keycloak.realm(_ as String) >> realmResource
        2 * realmResource.users() >> usersResource
        1 * usersResource.search(_ as String) >> users
        1 * usersResource.delete(_) >> response
        notThrown()
    }

    def 'should delete user by email'() {

        given:
        def email = "john.doe@zup.com.br"

        def user = new UserRepresentation()
        user.id = "fake-user-id"
        user.firstName = "John"
        user.lastName = "Doe"
        user.email = "john.doe@zup.com.br"
        user.username = "john.doe@zup.com.br"
        def users = new ArrayList()
        users.add(user)

        when:
        service.deleteUserByEmail(email)

        then:
        2 * keycloak.realm(_) >> realmResource
        2 * realmResource.users() >> usersResource
        1 * usersResource.search(email) >> users
        1 * usersResource.delete(user.id)
        notThrown()
    }
}

