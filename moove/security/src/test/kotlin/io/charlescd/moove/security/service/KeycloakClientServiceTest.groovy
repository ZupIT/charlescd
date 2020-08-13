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
import io.charlescd.moove.domain.Role
import io.charlescd.moove.domain.User
import io.charlescd.moove.domain.UserGroup
import org.keycloak.admin.client.Keycloak
import org.keycloak.admin.client.resource.RealmResource
import org.keycloak.admin.client.resource.UserResource
import org.keycloak.admin.client.resource.UsersResource
import org.keycloak.representations.idm.UserRepresentation
import spock.lang.Specification

import java.time.LocalDateTime

class KeycloakClientServiceTest extends Specification {

    private KeycloakClientService keycloakClientService
    private Keycloak keycloakClient = Mock(Keycloak)

    private ObjectMapper objectMapper = new ObjectMapper()

    private RealmResource realmResource = Mock(RealmResource)
    private UserResource userResource = Mock(UserResource)
    private UsersResource usersResource = Mock(UsersResource)

    def setup() {
        keycloakClientService = new KeycloakClientService(keycloakClient)
        keycloakClientService.realm = "Charles"
    }

    def "when a user group is associated, should include roles on keycloak for each user on user group"() {
        given:
        def authorId = "author-id"
        def workspaceId = "workspace-id"
        def author = new User(authorId, "charles", "authors@zup.com.br", "http://charles.com/dummy_photo.jpg", [], LocalDateTime.now())
        def memberId = "ccd9f717-6b38-4f1e-ad64-f735cda7a0da"
        def member = new User(memberId, "charles", "member@zup.com.br", "http://charles.com/dummy_photo.jpg", [], LocalDateTime.now())
        def userGroupId = "user-group-id"
        def userGroup = new UserGroup(userGroupId, "group-name", author, LocalDateTime.now(), [member])

        def roles = []
        def role = new Role("role-id", "role-name", LocalDateTime.now())
        roles.add(role)

        def keycloakUser = new UserRepresentation()
        keycloakUser.id = "fake-user-id"
        keycloakUser.firstName = "John"
        keycloakUser.lastName = "Doe"
        keycloakUser.email = member.email
        keycloakUser.username = member.email
        keycloakUser.attributes = [:]
        def keycloakUsers = new ArrayList()
        keycloakUsers.add(keycloakUser)

        def expectedWorkspacesAndRolesMapping = [id: workspaceId, roles: [role.name]]

        when:
        keycloakClientService.associateRolesToUsers(workspaceId, userGroup, roles)

        then:
        1 * keycloakClient.realm(_ as String) >> realmResource
        1 * realmResource.users() >> usersResource
        1 * usersResource.search(member.email) >> keycloakUsers
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

    def "when a user group is disassociated, should remove roles on keycloak for each user on user group"() {
        given:
        def authorId = "author-id"
        def workspaceId = "workspace-id"
        def author = new User(authorId, "charles", "authors@zup.com.br", "http://charles.com/dummy_photo.jpg", [], LocalDateTime.now())
        def memberId = "ccd9f717-6b38-4f1e-ad64-f735cda7a0da"
        def member = new User(memberId, "charles", "member@zup.com.br", "http://charles.com/dummy_photo.jpg", [], LocalDateTime.now())
        def userGroupId = "user-group-id"
        def userGroup = new UserGroup(userGroupId, "group-name", author, LocalDateTime.now(), [member])

        def keycloakUser = new UserRepresentation()
        keycloakUser.id = "fake-user-id"
        keycloakUser.firstName = "John"
        keycloakUser.lastName = "Doe"
        keycloakUser.email = member.email
        keycloakUser.username = member.email
        keycloakUser.attributes = [workspaces: ['{"id":"workspace-id","roles":["role-name"]}']]
        def keycloakUsers = new ArrayList()
        keycloakUsers.add(keycloakUser)

        def roles = []
        def role = new Role("role-id", "role-name", LocalDateTime.now())
        roles.add(role)

        when:
        keycloakClientService.disassociateRolesFromUsers(workspaceId, userGroup, roles)

        then:
        1 * keycloakClient.realm(_ as String) >> realmResource
        1 * realmResource.users() >> usersResource
        1 * usersResource.search(member.email) >> keycloakUsers
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

    def "when a user is added to a user group that already have associations, should include roles on keycloak for all associations"() {
        given:
        def userId = "ccd9f717-6b38-4f1e-ad64-f735cda7a0da"
        def user = new User(userId, "charles", "member@zup.com.br", "http://charles.com/dummy_photo.jpg", [], LocalDateTime.now())

        def workspaceId = "workspace-id"

        def roles = []
        def role = new Role("role-id", "role-name", LocalDateTime.now())
        roles.add(role)

        def workspaceRoleMapping = new HashMap<String, List<Role>>()
        workspaceRoleMapping.put(workspaceId, [role])

        def keycloakUser = new UserRepresentation()
        keycloakUser.id = "fake-user-id"
        keycloakUser.firstName = "John"
        keycloakUser.lastName = "Doe"
        keycloakUser.email = user.email
        keycloakUser.username = user.email
        keycloakUser.attributes = [:]
        def keycloakUsers = new ArrayList()
        keycloakUsers.add(keycloakUser)

        def expectedWorkspacesAndRolesMapping = [id: workspaceId, roles: [role.name]]

        when:
        keycloakClientService.associateRolesToNewUsers(user, workspaceRoleMapping)

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

    def "when a user is removed from a user group that already have associations, should remove roles on keycloak for all associations"() {
        given:
        def userId = "ccd9f717-6b38-4f1e-ad64-f735cda7a0da"
        def user = new User(userId, "charles", "member@zup.com.br", "http://charles.com/dummy_photo.jpg", [], LocalDateTime.now())

        def workspaceId = "workspace-id"

        def roles = []
        def role = new Role("role-id", "role-name", LocalDateTime.now())
        roles.add(role)

        def workspaceRoleMapping = new HashMap<String, List<Role>>()
        workspaceRoleMapping.put(workspaceId, [role])

        def keycloakUser = new UserRepresentation()
        keycloakUser.id = "fake-user-id"
        keycloakUser.firstName = "John"
        keycloakUser.lastName = "Doe"
        keycloakUser.email = user.email
        keycloakUser.username = user.email
        keycloakUser.attributes = [workspaces: ['{"id":"workspace-id","roles":["role-name"]}']]
        def keycloakUsers = new ArrayList()
        keycloakUsers.add(keycloakUser)

        when:
        keycloakClientService.disassociateRolesFromNewUsers(user, workspaceRoleMapping)

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

    def "when a user group is associated, should aggregate roles on keycloak for each user because some users already have associations with same workspace"() {
        given:
        def authorId = "author-id"
        def workspaceId = "workspace-id"
        def author = new User(authorId, "charles", "authors@zup.com.br", "http://charles.com/dummy_photo.jpg", [], false, LocalDateTime.now())
        def memberId = "ccd9f717-6b38-4f1e-ad64-f735cda7a0da"
        def member = new User(memberId, "charles", "member@zup.com.br", "http://charles.com/dummy_photo.jpg", [], false, LocalDateTime.now())
        def userGroupId = "user-group-id"
        def userGroup = new UserGroup(userGroupId, "group-name", author, LocalDateTime.now(), [member])

        def role1 = new Role("role-id1", "role-name1", "description", [], LocalDateTime.now())

        def roles = []
        def role2 = new Role("role-id2", "role-name2", "description", [], LocalDateTime.now())
        roles.add(role2)

        def keycloakUser = new UserRepresentation()
        keycloakUser.id = "fake-user-id"
        keycloakUser.firstName = "John"
        keycloakUser.lastName = "Doe"
        keycloakUser.email = member.email
        keycloakUser.username = member.email
        keycloakUser.attributes = [workspaces: ['{"id":"workspace-id","roles":["role-name1"]}']]
        def keycloakUsers = new ArrayList()
        keycloakUsers.add(keycloakUser)

        def expectedWorkspacesAndRolesMapping = [id: workspaceId, roles: [role1.name, role2.name]]

        when:
        keycloakClientService.associateRolesToUsers(workspaceId, userGroup, roles)

        then:
        1 * keycloakClient.realm(_ as String) >> realmResource
        1 * realmResource.users() >> usersResource
        1 * usersResource.search(member.email) >> keycloakUsers
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

    def "when a user group is disassociated, should disintegrate roles on keycloak for each user because some users still have associations with same workspace by another user group"() {
        given:
        def authorId = "author-id"
        def workspaceId = "workspace-id"
        def author = new User(authorId, "charles", "authors@zup.com.br", "http://charles.com/dummy_photo.jpg", [], LocalDateTime.now())
        def memberId = "ccd9f717-6b38-4f1e-ad64-f735cda7a0da"
        def member = new User(memberId, "charles", "member@zup.com.br", "http://charles.com/dummy_photo.jpg", [], LocalDateTime.now())
        def userGroupId = "user-group-id"
        def userGroup = new UserGroup(userGroupId, "group-name", author, LocalDateTime.now(), [member])

        def role1 = new Role("role-id1", "role-name1", LocalDateTime.now())

        def roles = []
        def role2 = new Role("role-id2", "role-name2", LocalDateTime.now())
        roles.add(role2)

        def keycloakUser = new UserRepresentation()
        keycloakUser.id = "fake-user-id"
        keycloakUser.firstName = "John"
        keycloakUser.lastName = "Doe"
        keycloakUser.email = member.email
        keycloakUser.username = member.email
        keycloakUser.attributes = [workspaces: ['{"id":"workspace-id","roles":["role-name1", "role-name2"]}']]
        def keycloakUsers = new ArrayList()
        keycloakUsers.add(keycloakUser)

        def expectedWorkspacesAndRolesMapping = [id: workspaceId, roles: [role1.name]]

        when:
        keycloakClientService.disassociateRolesFromUsers(workspaceId, userGroup, roles)

        then:
        1 * keycloakClient.realm(_ as String) >> realmResource
        1 * realmResource.users() >> usersResource
        1 * usersResource.search(member.email) >> keycloakUsers
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

//        notThrown()
    }

}
