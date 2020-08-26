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

    def "should throw an exception when user is not found on keycloak on add permissions to user"() {
        given:
        def userId = "author-id"
        def workspaceId = "workspace-id"
        def user = new User(userId, "charles", "authors@zup.com.br", "http://charles.com/dummy_photo.jpg", [], false, LocalDateTime.now())

        when:
        keycloakClientService.addPermissionsToUser(workspaceId, user, [])

        then:
        1 * keycloakClient.realm(_ as String) >> realmResource
        1 * realmResource.users() >> usersResource
        1 * usersResource.search(user.email) >> Collections.emptyList()
        thrown(NotFoundException)

    }

    def "should add permissions to a user on keycloak"() {
        given:
        def userId = "author-id"
        def workspaceId = "workspace-id"
        def user = new User(userId, "charles", "authors@zup.com.br", "http://charles.com/dummy_photo.jpg", [], false, LocalDateTime.now())
        def keycloakUser = new UserRepresentation()
        keycloakUser.id = "fake-user-id"
        keycloakUser.firstName = "John"
        keycloakUser.lastName = "Doe"
        keycloakUser.email = user.email
        keycloakUser.username = user.email
        keycloakUser.attributes = [:]
        def keycloakUsers = new ArrayList()
        keycloakUsers.add(keycloakUser)

        def permission = new Permission("permission-id", "permission-name", LocalDateTime.now())
        def expectedWorkspacesAndPermissionsMapping = [id: workspaceId, permissions: [permission.name]]

        when:
        keycloakClientService.addPermissionsToUser(workspaceId, user, [permission])

        then:
        1 * keycloakClient.realm(_ as String) >> realmResource
        1 * realmResource.users() >> usersResource
        1 * usersResource.search(user.email) >> keycloakUsers
        1 * keycloakClient.realm(_ as String) >> realmResource
        1 * realmResource.users() >> usersResource
        1 * usersResource.get(keycloakUser.id) >> userResource
        1 * userResource.update(_) >> { arguments ->
            def updatedKeycloakUser = arguments[0]

            assert updatedKeycloakUser instanceof UserRepresentation

            assert updatedKeycloakUser.id == keycloakUser.id
            assert updatedKeycloakUser.firstName == keycloakUser.firstName
            assert updatedKeycloakUser.lastName == keycloakUser.lastName
            assert updatedKeycloakUser.email == keycloakUser.email
            assert updatedKeycloakUser.username == keycloakUser.username
            assert updatedKeycloakUser.attributes.size() == 1
            assert updatedKeycloakUser.attributes["workspaces"] != null
            assert updatedKeycloakUser.attributes["workspaces"].size() == 1
            assert updatedKeycloakUser.attributes["workspaces"].get(0) == objectMapper.writeValueAsString(expectedWorkspacesAndPermissionsMapping)
        }

        notThrown()

    }

    def "should throw an exception when user is not found on keycloak on remove permissions from user"() {
        given:
        def userId = "author-id"
        def workspaceId = "workspace-id"
        def user = new User(userId, "charles", "authors@zup.com.br", "http://charles.com/dummy_photo.jpg", [], false, LocalDateTime.now())

        when:
        keycloakClientService.removePermissionsFromUser(workspaceId, user, [])

        then:
        1 * keycloakClient.realm(_ as String) >> realmResource
        1 * realmResource.users() >> usersResource
        1 * usersResource.search(user.email) >> Collections.emptyList()
        thrown(NotFoundException)

    }

    def "should remove permissions from a user on keycloak"() {
        given:
        def userId = "author-id"
        def workspaceId = "workspace-id"
        def user = new User(userId, "charles", "authors@zup.com.br", "http://charles.com/dummy_photo.jpg", [], false, LocalDateTime.now())
        def keycloakUser = new UserRepresentation()
        keycloakUser.id = "fake-user-id"
        keycloakUser.firstName = "John"
        keycloakUser.lastName = "Doe"
        keycloakUser.email = user.email
        keycloakUser.username = user.email
        keycloakUser.attributes = [workspaces: ['{"id":"workspace-id","permissions":["permission-name"]}']]
        def keycloakUsers = new ArrayList()
        keycloakUsers.add(keycloakUser)

        def permission = new Permission("permission-id", "permission-name", LocalDateTime.now())
        def expectedWorkspacesAndPermissionsMapping = []

        when:
        keycloakClientService.removePermissionsFromUser(workspaceId, user, [permission])

        then:
        1 * keycloakClient.realm(_ as String) >> realmResource
        1 * realmResource.users() >> usersResource
        1 * usersResource.search(user.email) >> keycloakUsers
        1 * keycloakClient.realm(_ as String) >> realmResource
        1 * realmResource.users() >> usersResource
        1 * usersResource.get(keycloakUser.id) >> userResource
        1 * userResource.update(_) >> { arguments ->
            def updatedKeycloakUser = arguments[0]

            assert updatedKeycloakUser instanceof UserRepresentation

            assert updatedKeycloakUser.id == keycloakUser.id
            assert updatedKeycloakUser.firstName == keycloakUser.firstName
            assert updatedKeycloakUser.lastName == keycloakUser.lastName
            assert updatedKeycloakUser.email == keycloakUser.email
            assert updatedKeycloakUser.username == keycloakUser.username
            assert updatedKeycloakUser.attributes.size() == 1
            assert updatedKeycloakUser.attributes["workspaces"] != null
            assert updatedKeycloakUser.attributes["workspaces"].size() == 0
        }

        notThrown()

    }

    def "when a user is added to a user group that already have associations, should include permissions on keycloak for all associations"() {
        given:
        def userId = "ccd9f717-6b38-4f1e-ad64-f735cda7a0da"
        def user = new User(userId, "charles", "member@zup.com.br", "http://charles.com/dummy_photo.jpg", [], false, LocalDateTime.now())

        def workspaceId = "workspace-id"

        def permissions = []
        def permission = new Permission("permission-id", "permission-name", LocalDateTime.now())
        permissions.add(permission)

        def workspaceRoleMapping = new HashMap<String, List<Permission>>()
        workspaceRoleMapping.put(workspaceId, [permission])

        def keycloakUser = new UserRepresentation()
        keycloakUser.id = "fake-user-id"
        keycloakUser.firstName = "John"
        keycloakUser.lastName = "Doe"
        keycloakUser.email = user.email
        keycloakUser.username = user.email
        keycloakUser.attributes = [:]
        def keycloakUsers = new ArrayList()
        keycloakUsers.add(keycloakUser)

        def expectedWorkspacesAndRolesMapping = [id: workspaceId, permissions: [permission.name]]

        when:
        keycloakClientService.associatePermissionsToNewUsers(user, workspaceRoleMapping)

        then:
        1 * keycloakClient.realm(_ as String) >> realmResource
        1 * realmResource.users() >> usersResource
        1 * usersResource.search(user.email) >> keycloakUsers
        1 * keycloakClient.realm(_ as String) >> realmResource
        1 * realmResource.users() >> usersResource
        1 * usersResource.get(keycloakUser.id) >> userResource
        1 * userResource.update(_) >> { arguments ->
            def updatedKeycloakUser = arguments[0]

            assert updatedKeycloakUser instanceof UserRepresentation

            assert updatedKeycloakUser.id == keycloakUser.id
            assert updatedKeycloakUser.firstName == keycloakUser.firstName
            assert updatedKeycloakUser.lastName == keycloakUser.lastName
            assert updatedKeycloakUser.email == keycloakUser.email
            assert updatedKeycloakUser.username == keycloakUser.username
            assert updatedKeycloakUser.attributes.size() == 1
            assert updatedKeycloakUser.attributes["workspaces"] != null
            assert updatedKeycloakUser.attributes["workspaces"].size() == 1
            assert updatedKeycloakUser.attributes["workspaces"].get(0) == objectMapper.writeValueAsString(expectedWorkspacesAndRolesMapping)
        }

        notThrown()
    }

    def "when a user is removed from a user group that already have associations, should remove permissions on keycloak for all associations"() {
        given:
        def userId = "ccd9f717-6b38-4f1e-ad64-f735cda7a0da"
        def user = new User(userId, "charles", "member@zup.com.br", "http://charles.com/dummy_photo.jpg", [], false, LocalDateTime.now())

        def workspaceId = "workspace-id"

        def permissions = []
        def permission = new Permission("permission-id", "permission-name", LocalDateTime.now())
        permissions.add(permission)

        def workspaceRoleMapping = new HashMap<String, List<Permission>>()
        workspaceRoleMapping.put(workspaceId, [permission])

        def keycloakUser = new UserRepresentation()
        keycloakUser.id = "fake-user-id"
        keycloakUser.firstName = "John"
        keycloakUser.lastName = "Doe"
        keycloakUser.email = user.email
        keycloakUser.username = user.email
        keycloakUser.attributes = [workspaces: ['{"id":"workspace-id","permissions":["permission-name"]}']]
        def keycloakUsers = new ArrayList()
        keycloakUsers.add(keycloakUser)

        when:
        keycloakClientService.disassociatePermissionsFromNewUsers(user, workspaceRoleMapping)

        then:
        1 * keycloakClient.realm(_ as String) >> realmResource
        1 * realmResource.users() >> usersResource
        1 * usersResource.search(user.email) >> keycloakUsers
        1 * keycloakClient.realm(_ as String) >> realmResource
        1 * realmResource.users() >> usersResource
        1 * usersResource.get(keycloakUser.id) >> userResource
        1 * userResource.update(_) >> { arguments ->
            def updatedKeycloakUser = arguments[0]

            assert updatedKeycloakUser instanceof UserRepresentation

            assert updatedKeycloakUser.id == keycloakUser.id
            assert updatedKeycloakUser.firstName == keycloakUser.firstName
            assert updatedKeycloakUser.lastName == keycloakUser.lastName
            assert updatedKeycloakUser.email == keycloakUser.email
            assert updatedKeycloakUser.username == keycloakUser.username
            assert updatedKeycloakUser.attributes.size() == 1
            assert updatedKeycloakUser.attributes["workspaces"] != null
            assert updatedKeycloakUser.attributes["workspaces"].size() == 0
        }

        notThrown()
    }

    def "should aggregate permissions on keycloak for user because user already had permissions on that workspace on another user group"() {
        given:
        def workspaceId = "workspace-id"
        def userId = "ccd9f717-6b38-4f1e-ad64-f735cda7a0da"
        def user = new User(userId, "charles", "member@zup.com.br", "http://charles.com/dummy_photo.jpg", [], false, LocalDateTime.now())

        def permission1 = new Permission("permission-id1", "permission-name1", LocalDateTime.now())

        def permissions = []
        def permission2 = new Permission("permission-id2", "permission-name2", LocalDateTime.now())
        permissions.add(permission2)

        def keycloakUser = new UserRepresentation()
        keycloakUser.id = "fake-user-id"
        keycloakUser.firstName = "John"
        keycloakUser.lastName = "Doe"
        keycloakUser.email = user.email
        keycloakUser.username = user.email
        keycloakUser.attributes = [workspaces: ['{"id":"workspace-id","permissions":["permission-name1"]}']]
        def keycloakUsers = new ArrayList()
        keycloakUsers.add(keycloakUser)

        def expectedWorkspacesAndRolesMapping = [id: workspaceId, permissions: [permission1.name, permission2.name]]

        when:
        keycloakClientService.addPermissionsToUser(workspaceId, user, permissions)

        then:
        1 * keycloakClient.realm(_ as String) >> realmResource
        1 * realmResource.users() >> usersResource
        1 * usersResource.search(user.email) >> keycloakUsers
        1 * keycloakClient.realm(_ as String) >> realmResource
        1 * realmResource.users() >> usersResource
        1 * usersResource.get(keycloakUser.id) >> userResource
        1 * userResource.update(_) >> { arguments ->
            def updatedKeycloakUser = arguments[0]

            assert updatedKeycloakUser instanceof UserRepresentation

            assert updatedKeycloakUser.id == keycloakUser.id
            assert updatedKeycloakUser.firstName == keycloakUser.firstName
            assert updatedKeycloakUser.lastName == keycloakUser.lastName
            assert updatedKeycloakUser.email == keycloakUser.email
            assert updatedKeycloakUser.username == keycloakUser.username
            assert updatedKeycloakUser.attributes.size() == 1
            assert updatedKeycloakUser.attributes["workspaces"] != null
            assert updatedKeycloakUser.attributes["workspaces"].size() == 1
            assert updatedKeycloakUser.attributes["workspaces"].get(0) == objectMapper.writeValueAsString(expectedWorkspacesAndRolesMapping)
        }

        notThrown()
    }

    def "should disaggregate permissions on keycloak for user but keep permissions on that workspaces from another user group"() {
        given:
        def workspaceId = "workspace-id"
        def userId = "ccd9f717-6b38-4f1e-ad64-f735cda7a0da"
        def user = new User(userId, "charles", "member@zup.com.br", "http://charles.com/dummy_photo.jpg", [], false, LocalDateTime.now())

        def permission1 = new Permission("permission-id1", "permission-name1", LocalDateTime.now())

        def permissions = []
        def permission2 = new Permission("permission-id2", "permission-name2", LocalDateTime.now())
        permissions.add(permission2)

        def keycloakUser = new UserRepresentation()
        keycloakUser.id = "fake-user-id"
        keycloakUser.firstName = "John"
        keycloakUser.lastName = "Doe"
        keycloakUser.email = user.email
        keycloakUser.username = user.email
        keycloakUser.attributes = [workspaces: ['{"id":"workspace-id","permissions":["permission-name1", "permission-name2"]}']]
        def keycloakUsers = new ArrayList()
        keycloakUsers.add(keycloakUser)

        def expectedWorkspacesAndRolesMapping = [id: workspaceId, permissions: [permission1.name]]

        when:
        keycloakClientService.removePermissionsFromUser(workspaceId, user, permissions)

        then:
        1 * keycloakClient.realm(_ as String) >> realmResource
        1 * realmResource.users() >> usersResource
        1 * usersResource.search(user.email) >> keycloakUsers
        1 * keycloakClient.realm(_ as String) >> realmResource
        1 * realmResource.users() >> usersResource
        1 * usersResource.get(keycloakUser.id) >> userResource
        1 * userResource.update(_) >> { arguments ->
            def updatedKeycloakUser = arguments[0]

            assert updatedKeycloakUser instanceof UserRepresentation

            assert updatedKeycloakUser.id == keycloakUser.id
            assert updatedKeycloakUser.firstName == keycloakUser.firstName
            assert updatedKeycloakUser.lastName == keycloakUser.lastName
            assert updatedKeycloakUser.email == keycloakUser.email
            assert updatedKeycloakUser.username == keycloakUser.username
            assert updatedKeycloakUser.attributes.size() == 1
            assert updatedKeycloakUser.attributes["workspaces"] != null
            assert updatedKeycloakUser.attributes["workspaces"].size() == 1
            assert updatedKeycloakUser.attributes["workspaces"].get(0) == objectMapper.writeValueAsString(expectedWorkspacesAndRolesMapping)
        }

        notThrown()
    }

    def 'should create a new keycloak user'() {
        given:
        def email = "john.doe@zup.com.br"
        def firstName = "John"
        def lastName = "Doe"
        def fullName = "John Doe"
        def password = "xpto123@"

        when:
        keycloakClientService.createUser(email, fullName, password, false)

        then:
        1 * keycloakClient.realm(_ as String) >> realmResource
        1 * realmResource.users() >> usersResource
        1 * usersResource.create(_) >> { arguments ->
            def userRepresentation = arguments[0]

            assert userRepresentation instanceof UserRepresentation

            assert userRepresentation.email == email
            assert userRepresentation.firstName == firstName
            assert userRepresentation.lastName == lastName
            assert userRepresentation.attributes["isRoot"].get(0) == "false"

            return response
        }
        1 * response.status >> 201
        notThrown()
    }

    def 'should create a new keycloak user with root privileges on charles'() {
        given:
        def email = "john.doe@zup.com.br"
        def firstName = "John"
        def lastName = "Doe"
        def fullName = "John Doe"
        def password = "xpto123@"

        when:
        keycloakClientService.createUser(email, fullName, password, true)

        then:
        1 * keycloakClient.realm(_ as String) >> realmResource
        1 * realmResource.users() >> usersResource
        1 * usersResource.create(_) >> { arguments ->
            def userRepresentation = arguments[0]

            assert userRepresentation instanceof UserRepresentation

            assert userRepresentation.email == email
            assert userRepresentation.firstName == firstName
            assert userRepresentation.lastName == lastName
            assert userRepresentation.attributes["isRoot"].get(0) == "true"

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
        keycloakClientService.createUser(email, fullName, password, true)

        then:
        1 * keycloakClient.realm(_ as String) >> realmResource
        1 * realmResource.users() >> usersResource
        1 * usersResource.create(_) >> { arguments ->
            def userRepresentation = arguments[0]

            assert userRepresentation instanceof UserRepresentation

            assert userRepresentation.email == email
            assert userRepresentation.firstName == firstName
            assert userRepresentation.lastName == lastName
            assert userRepresentation.attributes["isRoot"].get(0) == "true"

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
