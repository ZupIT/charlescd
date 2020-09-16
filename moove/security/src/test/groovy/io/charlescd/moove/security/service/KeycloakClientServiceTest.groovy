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

import com.fasterxml.jackson.databind.ObjectMapper
import feign.FeignException
import io.charlescd.moove.domain.MooveErrorCode
import io.charlescd.moove.domain.Permission
import io.charlescd.moove.domain.Role
import io.charlescd.moove.domain.User
import io.charlescd.moove.domain.UserGroup
import io.charlescd.moove.domain.exceptions.BusinessException
import io.charlescd.moove.domain.exceptions.NotFoundException
import io.charlescd.moove.infrastructure.service.client.KeycloakFormEncodedClient
import org.keycloak.admin.client.Keycloak
import org.keycloak.admin.client.resource.RealmResource
import org.keycloak.admin.client.resource.UserResource
import org.keycloak.admin.client.resource.UsersResource
import org.keycloak.representations.idm.CredentialRepresentation
import org.keycloak.representations.idm.UserRepresentation
import spock.lang.Specification

import javax.ws.rs.core.Response
import java.time.LocalDateTime

class KeycloakClientServiceTest extends Specification {

    private KeycloakClientService keycloakClientService
    private Keycloak keycloakClient = Mock(Keycloak)
    private KeycloakFormEncodedClient keycloakFormEncodedClient = Mock(KeycloakFormEncodedClient)

    private ObjectMapper objectMapper = new ObjectMapper()

    private RealmResource realmResource = Mock(RealmResource)
    private UserResource userResource = Mock(UserResource)
    private UsersResource usersResource = Mock(UsersResource)

    private Response response = Mock(Response)

    def setup() {
        keycloakClientService = new KeycloakClientService(keycloakClient, keycloakFormEncodedClient)
        keycloakClientService.realm = "Charles"
        keycloakClientService.publicClientId = "publicClientId"
    }

    def 'should create a new keycloak user'() {
        given:
        def email = "john.doe@zup.com.br"
        def firstName = "John"
        def lastName = "Doe"
        def fullName = "John Doe"
        def password = "xpto123@"

        when:
        keycloakClientService.createUser(email, fullName, password)

        then:
        1 * keycloakClient.realm(_ as String) >> realmResource
        1 * realmResource.users() >> usersResource
        1 * usersResource.create(_) >> { arguments ->
            def userRepresentation = arguments[0]

            assert userRepresentation instanceof UserRepresentation

            assert userRepresentation.email == email
            assert userRepresentation.firstName == firstName
            assert userRepresentation.lastName == lastName

            return response
        }
        1 * response.status >> 201
        notThrown()
    }

    def 'when trying to create user on keycloak but something wrong happens should throw exception'() {
        given:
        def email = "john.doe@zup.com.br"
        def firstName = "John"
        def lastName = "Doe"
        def fullName = "John Doe"
        def password = "xpto123@"

        when:
        keycloakClientService.createUser(email, fullName, password)

        then:
        1 * keycloakClient.realm(_ as String) >> realmResource
        1 * realmResource.users() >> usersResource
        1 * usersResource.create(_) >> { arguments ->
            def userRepresentation = arguments[0]

            assert userRepresentation instanceof UserRepresentation

            assert userRepresentation.email == email
            assert userRepresentation.firstName == firstName
            assert userRepresentation.lastName == lastName

            return response.status
        }
        1 * response.status >> 400

        thrown(RuntimeException)
    }

    def "should throw exception when user password does not match"(){
        given:
        def email = "email"
        def oldPassword = "old-password"
        def newPassword = "new-password"

        when:
        keycloakClientService.changeUserPassword(email, oldPassword, newPassword)

        then:
        1 * keycloakFormEncodedClient.authorizeUser(_, _) >> { throw new FeignException("Invalid credentials") }
        def exception = thrown(BusinessException)
        exception.errorCode == MooveErrorCode.USER_PASSWORD_DOES_NOT_MATCH
    }

    def "should change user password successfully"(){
        given:
        def email = "email"
        def oldPassword = "old-password"
        def newPassword = "new-password"
        def keycloakUser = new UserRepresentation()
        keycloakUser.id = "fake-user-id"
        keycloakUser.firstName = "John"
        keycloakUser.lastName = "Doe"
        keycloakUser.email = email
        keycloakUser.username = email
        keycloakUser.attributes = [:]
        def keycloakUsers = new ArrayList()
        keycloakUsers.add(keycloakUser)

        when:
        keycloakClientService.changeUserPassword(email, oldPassword, newPassword)

        then:
        1 * keycloakFormEncodedClient.authorizeUser(_, _) >> {}
        1 * keycloakClient.realm(_ as String) >> realmResource
        1 * realmResource.users() >> usersResource
        1 * usersResource.search(email) >> keycloakUsers
        1 * keycloakClient.realm(_ as String) >> realmResource
        1 * realmResource.users() >> usersResource
        1 * usersResource.get(keycloakUser.id) >> userResource
        1 * userResource.resetPassword(_) >> { arguments ->
            def updatedKeycloakCredentials = arguments[0]

            assert updatedKeycloakCredentials instanceof CredentialRepresentation

            assert updatedKeycloakCredentials.type == CredentialRepresentation.PASSWORD
            assert updatedKeycloakCredentials.value == newPassword
            assert !updatedKeycloakCredentials.isTemporary()
        }

        notThrown()

    }

}
