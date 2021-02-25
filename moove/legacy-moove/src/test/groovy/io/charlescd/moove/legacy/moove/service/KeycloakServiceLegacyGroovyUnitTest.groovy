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

    def 'get email by token'() {

        given:

        def authorization = "Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJpcm9waWVJZS0yVUt5U0dxN1F5Q0J1bmpHR1h3TTVuQmFuQnJrSGtWODJFIn0.eyJleHAiOjE2MDUwMzE1MzgsImlhdCI6MTYwNTAyNzkzOCwianRpIjoiNmQ5YmVmZmUtYTg4MC00YjNlLWJhMmEtNWNlMDIwMmUwMGRlIiwiaXNzIjoiaHR0cHM6Ly9jaGFybGVzLWRldi5jb250aW51b3VzcGxhdGZvcm0uY29tL2tleWNsb2FrL2F1dGgvcmVhbG1zL2NoYXJsZXNjZCIsImF1ZCI6ImRhcndpbi1jbGllbnQiLCJzdWIiOiI1MzQwYTFmMy02NTgzLTQ1ZTQtYmQwYS1kYmUwYmIxMjcxN2YiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJjaGFybGVzY2QtY2xpZW50Iiwic2Vzc2lvbl9zdGF0ZSI6IjNiZjhhNDVmLWQ4YTUtNGJjMy1iYmUwLWRhMTdkMTcyYWMyZSIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiKiJdLCJzY29wZSI6InByb2ZpbGUgZW1haWwiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibmFtZSI6IkRhcnRoVmFkZXIiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJkYXJ0aC52YWRlckBzaXRocy5jb20iLCJnaXZlbl9uYW1lIjoiRGFydGhWYWRlciIsImVtYWlsIjoiZGFydGgudmFkZXJAc2l0aHMuY29tIn0.eY7-okBAFaQlt7gMhsNMTnxB4WraQLzLE9k1DTGssTlaS3eelh2U_Q_pVTR3J3Kh494ND2eUFwISktTfG2stozYF6zpPhzF4qELOYSBQU4ZlaxvHwbUY5ubx1JPGu2HXESkpfIgey9Ixh2TY_udmznmdhh2xZcTsjGwcp5ysET8UnK3xh_ZbP7nHsg0rZ5M_t3Q3KJ4j2MXiVkuscrKe9NaftQgpU3yZ3ZJiCFGjnl7R39QryYXIoHcm07E_bq5YBCqPGJneD5cjMVqXLH-JARsblh0IXtZuYSTGccF22aw4EO_Zr1XkXaIsw_rNlXYmVeXqPbONnQrLhI7fbkH4UQ"

        when:

        def email = service.getEmailByAuthorizationToken(authorization)

        then:
        0 * keycloak.realm(_) >> realmResource
        email == "darth.vader@siths.com"
        notThrown()
    }
}

