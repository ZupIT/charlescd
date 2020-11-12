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
    private Response response = Mock(Response)

    def setup() {
        service = new KeycloakServiceLegacy(keycloak)
        service.realm = "Charles"
    }

    def 'should delete a keycloak user by id'() {
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
        service.deleteUserById(user.id)

        then:
        1 * keycloak.realm(_ as String) >> realmResource
        1 * realmResource.users() >> usersResource
        1 * usersResource.delete(user.id) >> response
        notThrown()
    }

    def 'should delete user by id'() {

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
        service.deleteUserById(user.id)

        then:
        1 * keycloak.realm(_) >> realmResource
        1 * realmResource.users() >> usersResource
        1 * usersResource.delete(user.id)
        notThrown()
    }
}

