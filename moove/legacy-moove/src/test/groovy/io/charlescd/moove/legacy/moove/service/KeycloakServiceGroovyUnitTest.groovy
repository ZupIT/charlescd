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

import io.charlescd.moove.commons.exceptions.NotFoundExceptionLegacy
import io.charlescd.moove.legacy.moove.request.group.CreateGroupRequest
import io.charlescd.moove.legacy.moove.request.group.UpdateGroupRequest
import io.charlescd.moove.legacy.moove.request.role.CreateRoleRequest
import io.charlescd.moove.legacy.repository.UserRepository
import io.charlescd.moove.legacy.repository.entity.User
import org.keycloak.admin.client.Keycloak
import org.keycloak.admin.client.resource.*
import org.keycloak.representations.idm.CredentialRepresentation
import org.keycloak.representations.idm.GroupRepresentation
import org.keycloak.representations.idm.RoleRepresentation
import org.keycloak.representations.idm.UserRepresentation
import spock.lang.Specification

import javax.ws.rs.core.Response
import java.time.LocalDateTime

class KeycloakServiceGroovyUnitTest extends Specification {

    private KeycloakService service
    private Keycloak keycloak = Mock(Keycloak)
    private RealmResource realmResource = Mock(RealmResource)
    private RolesResource rolesResource = Mock(RolesResource)
    private RoleResource roleResource = Mock(RoleResource)
    private RoleMappingResource roleMappingResource = Mock(RoleMappingResource)
    private RoleScopeResource roleScopeResource = Mock(RoleScopeResource)
    private RoleByIdResource roleByIdResource = Mock(RoleByIdResource)
    private UserResource userResource = Mock(UserResource)
    private UsersResource usersResource = Mock(UsersResource)
    private UserRepository userRepository = Mock(UserRepository)
    private GroupsResource groupsResource = Mock(GroupsResource)
    private GroupResource groupResource = Mock(GroupResource)
    private Response response = Mock(Response)

    def setup() {
        service = new KeycloakService(keycloak, userRepository)
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

    def 'should find all roles'() {
        given:
        def representation = new RoleRepresentation()
        representation.name = "fake_role"
        representation.id = "fake-role-id"
        representation.description = "this is a fake role description"
        def representations = new ArrayList()
        representations.add(representation)

        when:
        def roles = service.findAllRoles()

        then:
        1 * keycloak.realm(_ as String) >> realmResource
        1 * realmResource.roles() >> rolesResource
        1 * rolesResource.list() >> representations

        assert !roles.isEmpty()
        assert roles.get(0).name == representation.name
        assert roles.get(0).id == representation.id
        assert roles.get(0).description == representation.description
        notThrown()
    }

    def 'should create role'() {
        given:
        def representation = new RoleRepresentation()
        representation.name = "fake_role"
        representation.id = "fake-role-id"
        representation.description = "this is a fake role description"
        def createRoleRequest = new CreateRoleRequest("fake_role", "this is a fake role description")

        when:
        def role = service.createRole(createRoleRequest)

        then:
        2 * keycloak.realm(_ as String) >> realmResource
        2 * realmResource.roles() >> rolesResource
        1 * rolesResource.create(_)
        1 * rolesResource.get(_) >> roleResource
        1 * roleResource.toRepresentation() >> representation

        assert role != null
        assert role.id == representation.id
        assert role.name == representation.name
        assert role.description == representation.description
        notThrown()
    }

    def 'should create group'() {
        given:
        def roleRepresentationList = new ArrayList()
        def roleRepresentation = new RoleRepresentation()
        roleRepresentation.name = "fake-role"
        roleRepresentation.id = "fake-role-id"
        roleRepresentation.description = "this is a fake role description"
        roleRepresentationList.add(roleRepresentation)

        def roleIds = new ArrayList<String>()
        roleIds.add("fake-role-id")

        def groupRepresentation = new GroupRepresentation()
        groupRepresentation.id = "fake-group-id"
        groupRepresentation.name = "fake-group-name"
        groupRepresentation.realmRoles = roleIds

        def createGroupRequest = new CreateGroupRequest("fake-group-name", roleIds)

        when:
        def group = service.createGroup(createGroupRequest)

        then:
        8 * keycloak.realm(_) >> realmResource
        6 * realmResource.groups() >> groupsResource
        1 * groupsResource.add(_) >> response
        1 * realmResource.getGroupByPath(_ as String) >> groupRepresentation
        5 * groupsResource.group(_ as String) >> groupResource
        4 * groupResource.roles() >> roleMappingResource
        1 * groupResource.members() >> Collections.emptyList()
        4 * roleMappingResource.realmLevel() >> roleScopeResource
        2 * roleScopeResource.listAll() >> roleRepresentationList
        1 * roleScopeResource.add(_)
        1 * roleScopeResource.remove(_)
        1 * realmResource.rolesById() >> roleByIdResource
        1 * roleByIdResource.getRole(_ as String) >> roleRepresentation

        assert group != null
        assert group.name == createGroupRequest.name
        assert group.id == "fake-group-id"
        assert group.roles != null
        assert !group.roles.isEmpty()
        notThrown()
    }

    def 'should update a group'() {
        given:
        def roleIds = new ArrayList()
        roleIds.add("fake-role-id")

        def updateGroupRequest = new UpdateGroupRequest("fake-group-name", roleIds)

        def groupRepresentation = new GroupRepresentation()
        groupRepresentation.id = "fake-group-id"
        groupRepresentation.name = "fake-group-name"
        groupRepresentation.realmRoles = roleIds

        def roleRepresentationList = new ArrayList()
        def roleRepresentation = new RoleRepresentation()
        roleRepresentation.name = "fake-role"
        roleRepresentation.id = "fake-role-id"
        roleRepresentation.description = "this is a fake role description"
        roleRepresentationList.add(roleRepresentation)

        when:
        def group = service.updateGroup("fake-group-id", updateGroupRequest)

        then:
        8 * keycloak.realm(_) >> realmResource
        6 * realmResource.groups() >> groupsResource
        6 * groupsResource.group(_ as String) >> groupResource
        1 * groupResource.update(_)
        1 * realmResource.getGroupByPath(_ as String) >> groupRepresentation
        4 * groupResource.roles() >> roleMappingResource
        1 * groupResource.members() >> Collections.emptyList()
        4 * roleMappingResource.realmLevel() >> roleScopeResource
        2 * roleScopeResource.listAll() >> roleRepresentationList
        1 * roleScopeResource.add(_)
        1 * roleScopeResource.remove(_)
        1 * realmResource.rolesById() >> roleByIdResource
        1 * roleByIdResource.getRole(_ as String) >> roleRepresentation

        assert group != null
        assert group.name == updateGroupRequest.name
        assert group.id == "fake-group-id"
        assert group.roles != null
        assert !group.roles.isEmpty()
        notThrown()
    }

    def 'should find group by id'() {
        given:
        def roleIds = new ArrayList()
        roleIds.add("fake-role-id")

        def groupRepresentation = new GroupRepresentation()
        groupRepresentation.id = "fake-group-id"
        groupRepresentation.name = "fake-group-name"
        groupRepresentation.realmRoles = roleIds

        def roleRepresentationList = new ArrayList()
        def roleRepresentation = new RoleRepresentation()
        roleRepresentation.name = "fake-role"
        roleRepresentation.id = "fake-role-id"
        roleRepresentation.description = "this is a fake role description"
        roleRepresentationList.add(roleRepresentation)

        def memberRepresentationList = new ArrayList()
        def memberRepresentation = new UserRepresentation()
        memberRepresentation.id = "fake-member-id"
        memberRepresentation.username = "fake-email"
        memberRepresentation.firstName = "fake-name"
        memberRepresentationList.add(memberRepresentation)

        def user = new User("fake-member-id", "fake-name", "fake-email", "fake-photo", false, LocalDateTime.now())

        when:
        def group = service.findGroupById("fake-group-id")

        then:
        3 * keycloak.realm(_) >> realmResource
        3 * realmResource.groups() >> groupsResource
        3 * groupsResource.group(_ as String) >> groupResource
        1 * groupResource.toRepresentation() >> groupRepresentation
        1 * groupResource.roles() >> roleMappingResource
        1 * groupResource.members() >> memberRepresentationList
        1 * userRepository.findByEmail(_) >> Optional.of(user)
        1 * roleMappingResource.realmLevel() >> roleScopeResource
        1 * roleScopeResource.listAll() >> roleRepresentationList

        assert group.id == "fake-group-id"
        assert group.name == "fake-group-name"
        assert group.roles != null
        assert !group.roles.isEmpty()
        assert group.roles.size() == 1
        assert group.roles.get(0).id == "fake-role-id"
        assert group.roles.get(0).name == "fake-role"
        assert group.roles.get(0).description == "this is a fake role description"
        assert !group.members.isEmpty()
        assert group.members.size() == 1
        assert group.members.get(0).id == "fake-member-id"
        assert group.members.get(0).email == "fake-email"
        assert group.members.get(0).name == "fake-name"
        assert group.members.get(0).photoUrl == "fake-photo"
        notThrown()
    }

    def 'should find group roles by group id'() {
        given:
        def roleIds = new ArrayList()
        roleIds.add("fake-role-id")

        def groupRepresentation = new GroupRepresentation()
        groupRepresentation.id = "fake-group-id"
        groupRepresentation.name = "fake-group-name"
        groupRepresentation.realmRoles = roleIds

        def roleRepresentationList = new ArrayList()
        def roleRepresentation = new RoleRepresentation()
        roleRepresentation.name = "fake-role"
        roleRepresentation.id = "fake-role-id"
        roleRepresentation.description = "this is a fake role description"
        roleRepresentationList.add(roleRepresentation)

        when:
        def groupRoles = service.findGroupRolesById("fake-group-id")

        then:
        2 * keycloak.realm(_) >> realmResource
        2 * realmResource.groups() >> groupsResource
        2 * groupsResource.group(_) >> groupResource
        1 * groupResource.toRepresentation() >> groupRepresentation

        1 * groupResource.roles() >> roleMappingResource
        1 * roleMappingResource.realmLevel() >> roleScopeResource
        1 * roleScopeResource.listAll() >> roleRepresentationList

        assert groupRoles != null
        assert !groupRoles.isEmpty()
        assert groupRoles.size() == 1
        assert groupRoles.get(0).id == "fake-role-id"
        assert groupRoles.get(0).name == "fake-role"
        assert groupRoles.get(0).description == "this is a fake role description"
        notThrown()
    }

    def 'should find all groups'() {
        given:
        def roleIds = new ArrayList()
        roleIds.add("fake-role-id")

        def groupRepresentation = new GroupRepresentation()
        groupRepresentation.id = "fake-group-id"
        groupRepresentation.name = "fake-group-name"
        groupRepresentation.realmRoles = roleIds

        def groupRepresentationList = new ArrayList()
        groupRepresentationList.add(groupRepresentation)

        def roleRepresentationList = new ArrayList()
        def roleRepresentation = new RoleRepresentation()
        roleRepresentation.name = "fake-role"
        roleRepresentation.id = "fake-role-id"
        roleRepresentation.description = "this is a fake role description"
        roleRepresentationList.add(roleRepresentation)

        def memberRepresentationList = new ArrayList()
        def memberRepresentation = new UserRepresentation()
        memberRepresentation.id = "fake-member-id"
        memberRepresentation.username = "fake-email"
        memberRepresentation.firstName = "fake-name"
        memberRepresentationList.add(memberRepresentation)

        def user = new User("fake-member-id", "fake-name", "fake-email", "fake-photo", false, LocalDateTime.now())

        when:
        def groups = service.findAllGroups()

        then:
        3 * keycloak.realm(_) >> realmResource
        3 * realmResource.groups() >> groupsResource
        1 * groupsResource.groups() >> groupRepresentationList
        2 * groupsResource.group(_) >> groupResource
        1 * groupResource.members() >> memberRepresentationList
        1 * groupResource.roles() >> roleMappingResource
        1 * userRepository.findByEmail(_) >> Optional.of(user)
        1 * roleMappingResource.realmLevel() >> roleScopeResource
        1 * roleScopeResource.listAll() >> roleRepresentationList

        assert groups != null
        assert !groups.isEmpty()
        assert groups.size() == 1
        assert groups.get(0).id == "fake-group-id"
        assert groups.get(0).name == "fake-group-name"
        assert groups.get(0).roles != null
        assert !groups.get(0).roles.isEmpty()
        assert groups.get(0).roles.size() == 1
        assert groups.get(0).roles.get(0).id == "fake-role-id"
        assert groups.get(0).roles.get(0).name == "fake-role"
        assert groups.get(0).roles.get(0).description == "this is a fake role description"
        assert groups.get(0).membersCount == 1
        notThrown()

    }

    def 'should delete role by id'() {

        given:
        def roleId = "fake-role-id"

        when:
        service.deleteRoleById(roleId)

        then:
        1 * keycloak.realm(_) >> realmResource
        1 * realmResource.rolesById() >> roleByIdResource
        1 * roleByIdResource.deleteRole(roleId)
        notThrown()

    }

    def 'should delete group by id'() {

        given:
        def groupId = "fake-group-id"

        when:
        service.deleteGroupById(groupId)

        then:
        1 * keycloak.realm(_) >> realmResource
        1 * realmResource.groups() >> groupsResource
        1 * groupsResource.group(groupId) >> groupResource
        1 * groupResource.remove()
        notThrown()

    }

    def 'should add groups to an user'() {

        given:
        def groupId = "fake-group-id"
        def email = "john.doe@zup.com.br"
        def groupIds = new ArrayList()
        groupIds.add(groupId)

        def user = new UserRepresentation()
        user.id = "fake-user-id"
        user.firstName = "John"
        user.lastName = "Doe"
        user.email = "john.doe@zup.com.br"
        user.username = "john.doe@zup.com.br"
        def users = new ArrayList()
        users.add(user)

        def roleIds = new ArrayList()
        roleIds.add("fake-role-id")

        def groupRepresentation = new GroupRepresentation()
        groupRepresentation.id = "fake-group-id"
        groupRepresentation.name = "fake-group-name"
        groupRepresentation.realmRoles = roleIds

        def groupRepresentationList = new ArrayList()
        groupRepresentationList.add(groupRepresentation)

        when:
        service.addGroupsToUser(email, groupIds)

        then:
        3 * keycloak.realm(_) >> realmResource
        1 * realmResource.groups() >> groupsResource
        1 * groupsResource.group(groupId) >> groupResource
        1 * groupResource.toRepresentation() >> groupRepresentation
        2 * realmResource.users() >> usersResource
        1 * usersResource.get(user.id) >> userResource
        1 * usersResource.search(email) >> users
        1 * userResource.joinGroup(groupId)
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

    def "should reset password to an user"() {

        given:
        def email = "john.doe@zup.com.br"
        def newPassword = "newPassword"
        def user = new UserRepresentation()
        user.id = "fake-user-id"
        user.firstName = "John"
        user.lastName = "Doe"
        user.email = "john.doe@zup.com.br"
        user.username = "john.doe@zup.com.br"
        def users = new ArrayList()
        users.add(user)

        when:
        service.resetPassword(email, newPassword)

        then:
        2 * keycloak.realm(_) >> realmResource
        2 * realmResource.users() >> usersResource
        1 * usersResource.search(email) >> users
        1 * usersResource.get(user.id) >> userResource
        1 * userResource.resetPassword(_ as CredentialRepresentation)
        notThrown()

    }

    def 'should remove user from a group'() {
        given:
        def email = "john.doe@zup.com.br"
        def groupId = "fake-group-id"
        def user = new UserRepresentation()
        user.id = "fake-user-id"
        user.firstName = "John"
        user.lastName = "Doe"
        user.email = email
        user.username = email

        when:
        service.removeUserFromGroup(email, groupId)

        then:
        2 * keycloak.realm(_) >> realmResource
        2 * realmResource.users() >> usersResource
        1 * usersResource.search(email) >> [user]
        1 * usersResource.get(_) >> userResource
        1 * userResource.leaveGroup(_)

        notThrown()
    }


    def "should throw exception on reset password if user id do not exist"() {

        given:
        def email = "john.doe@zup.com.br"
        def newPassword = "newPassword"

        when:
        service.resetPassword(email, newPassword)

        then:
        1 * keycloak.realm(_) >> realmResource
        1 * realmResource.users() >> usersResource
        1 * usersResource.search(email) >> new ArrayList()
        def ex = thrown(NotFoundExceptionLegacy)
        ex.resourceName == "user"
        ex.id == email
    }

    def "should get user groups"() {

        given:
        def role = new RoleRepresentation()
        role.name = "fake_role"
        role.id = "fake-role-id"
        role.description = "this is a fake role description"

        def roleList = new ArrayList<RoleRepresentation>()
        roleList.add(role)

        def group = new GroupRepresentation()
        group.id = "fake-group-id"
        group.name = "fake-group-name"
        group.realmRoles = roleList

        def groupList = new ArrayList<GroupRepresentation>()
        groupList.add(group)

        def id = "fake-id"
        def firstName = "fake-first-name"
        def email = "fake-email"
        def User = new User(id, firstName, email, "", false, LocalDateTime.now())
        def user = new UserRepresentation()
        user.id = id
        user.firstName = firstName
        user.email = email
        user.groups = groupList

        def userList = new ArrayList<UserRepresentation>()
        userList.add(user)

        when:
        def groups = service.findUserGroups(user.id)

        then:
        1 * this.userRepository.findById(user.id) >> Optional.of(User)
        4 * keycloak.realm(_) >> realmResource
        1 * realmResource.users() >> usersResource
        1 * usersResource.search(user.email) >> userList
        1 * realmResource.users() >> usersResource
        1 * usersResource.get(userList[0].id) >> userResource
        1 * userResource.groups() >> groupList
        2 * realmResource.groups() >> groupsResource
        2 * groupsResource.group(group.id) >> groupResource
        1 * groupResource.roles() >> roleMappingResource
        1 * groupResource.members() >> Collections.emptyList()
        1 * roleMappingResource.realmLevel() >> roleScopeResource
        1 * roleScopeResource.listAll() >> roleList

        assert groups != null
        assert !groups.groups.isEmpty()
        assert groups.groups[0].id == "fake-group-id"
        assert groups.groups[0].name == "fake-group-name"
        assert groups.groups[0].roles[0].id == "fake-role-id"
        assert groups.groups[0].roles[0].name == "fake_role"
        assert groups.groups[0].roles[0].description == "this is a fake role description"

        notThrown()
    }

}

