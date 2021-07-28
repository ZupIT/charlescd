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


import feign.FeignException
import io.charlescd.moove.domain.MooveErrorCode
import io.charlescd.moove.domain.exceptions.BusinessException
import io.charlescd.moove.infrastructure.service.client.KeycloakFormEncodedClient
import org.keycloak.admin.client.Keycloak
import org.keycloak.admin.client.resource.RealmResource
import org.keycloak.admin.client.resource.UserResource
import org.keycloak.admin.client.resource.UsersResource
import org.keycloak.representations.idm.CredentialRepresentation
import org.keycloak.representations.idm.UserRepresentation
import spock.lang.Specification

import javax.ws.rs.core.Response

class KeycloakClientServiceTest extends Specification {

    private KeycloakClientService keycloakClientService
    private Keycloak keycloakClient = Mock(Keycloak)
    private KeycloakFormEncodedClient keycloakFormEncodedClient = Mock(KeycloakFormEncodedClient)

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

    def "when request a email with authorization should return email inside token"(){
        given:
        def authorization = "Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJpcm9waWVJZS0yVUt5U0dxN1F5Q0J1bmpHR1h3TTVuQmFuQnJrSGtWODJFIn0.eyJleHAiOjE2MDUwMzE1MzgsImlhdCI6MTYwNTAyNzkzOCwianRpIjoiNmQ5YmVmZmUtYTg4MC00YjNlLWJhMmEtNWNlMDIwMmUwMGRlIiwiaXNzIjoiaHR0cHM6Ly9jaGFybGVzLWRldi5jb250aW51b3VzcGxhdGZvcm0uY29tL2tleWNsb2FrL2F1dGgvcmVhbG1zL2NoYXJsZXNjZCIsImF1ZCI6ImRhcndpbi1jbGllbnQiLCJzdWIiOiI1MzQwYTFmMy02NTgzLTQ1ZTQtYmQwYS1kYmUwYmIxMjcxN2YiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJjaGFybGVzY2QtY2xpZW50Iiwic2Vzc2lvbl9zdGF0ZSI6IjNiZjhhNDVmLWQ4YTUtNGJjMy1iYmUwLWRhMTdkMTcyYWMyZSIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiKiJdLCJzY29wZSI6InByb2ZpbGUgZW1haWwiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibmFtZSI6IkRhcnRoVmFkZXIiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJkYXJ0aC52YWRlckBzaXRocy5jb20iLCJnaXZlbl9uYW1lIjoiRGFydGhWYWRlciIsImVtYWlsIjoiZGFydGgudmFkZXJAc2l0aHMuY29tIn0.eY7-okBAFaQlt7gMhsNMTnxB4WraQLzLE9k1DTGssTlaS3eelh2U_Q_pVTR3J3Kh494ND2eUFwISktTfG2stozYF6zpPhzF4qELOYSBQU4ZlaxvHwbUY5ubx1JPGu2HXESkpfIgey9Ixh2TY_udmznmdhh2xZcTsjGwcp5ysET8UnK3xh_ZbP7nHsg0rZ5M_t3Q3KJ4j2MXiVkuscrKe9NaftQgpU3yZ3ZJiCFGjnl7R39QryYXIoHcm07E_bq5YBCqPGJneD5cjMVqXLH-JARsblh0IXtZuYSTGccF22aw4EO_Zr1XkXaIsw_rNlXYmVeXqPbONnQrLhI7fbkH4UQ"

        when:
        def email = keycloakClientService.getEmailByAccessToken(authorization)

        then:
        email == "darth.vader@siths.com"
        notThrown()
    }

    def "should reset user password"() {
        given:
        def userEmail = "charles@email.com"
        def newPassword = "newPassword"
        def keycloakUser = new UserRepresentation()
        keycloakUser.id = "fake-user-id"
        keycloakUser.firstName = "John"
        keycloakUser.lastName = "Doe"
        keycloakUser.email = userEmail
        keycloakUser.username = userEmail
        keycloakUser.attributes = [:]
        def keycloakUsers = new ArrayList()
        keycloakUsers.add(keycloakUser)

        when:
        this.keycloakClientService.resetPassword(userEmail, newPassword)

        then:
        1 * keycloakClient.realm(_ as String) >> realmResource
        1 * realmResource.users() >> usersResource
        1 * usersResource.search(userEmail) >> keycloakUsers
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

    def 'should delete a keycloak user by userId'() {
        given:
        def userId = "qwerty"

        when:
        keycloakClientService.deleteUser(userId)

        then:
        1 * keycloakClient.realm(_ as String) >> realmResource
        1 * realmResource.users() >> usersResource
        1 * usersResource.delete(_) >> { arguments ->

            return response
        }
        notThrown()
    }
}
