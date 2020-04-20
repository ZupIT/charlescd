/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. 
 */

package br.com.zup.darwin.moove.controller

import br.com.zup.darwin.commons.representation.GroupMembersRepresentation
import br.com.zup.darwin.commons.representation.GroupRepresentation
import br.com.zup.darwin.commons.representation.RoleRepresentation
import br.com.zup.darwin.commons.representation.UserRepresentation
import br.com.zup.darwin.moove.request.group.CreateGroupRequest
import br.com.zup.darwin.moove.request.group.UpdateGroupRequest
import br.com.zup.darwin.moove.request.role.CreateRoleRequest
import br.com.zup.darwin.moove.service.KeycloakService
import spock.lang.Specification

import java.time.LocalDateTime

class AuthInfoControllerUnitTest extends Specification {

    private KeycloakService service = Mock(KeycloakService)
    private AuthInfoController controller = new AuthInfoController(service)

    def "should find all roles"() {

        given:
        def representation = new RoleRepresentation("fake-role-id", "fake-role", "this is a fake role")
        def representationList = new ArrayList()
        representationList.add(representation)

        when:
        def roles = controller.findAllRoles()

        then:
        1 * service.findAllRoles() >> representationList
        assert roles != null
        assert roles.size() == 1
        assert roles.get(0).id == representation.id
        assert roles.get(0).name == representation.name
        assert roles.get(0).description == representation.description
        notThrown()

    }

    def "should create role"() {

        given:
        def representation = new RoleRepresentation("fake-role-id", "fake-role", "this is a fake role")
        def request = new CreateRoleRequest("fake-role", "this is a fake role")

        when:
        def role = controller.createRole(request)

        then:
        1 * service.createRole(request) >> representation
        assert role != null
        assert role.id == representation.id
        assert role.name == representation.name
        assert role.description == representation.description
        notThrown()

    }

    def "should delete roles by id"() {

        given:
        def roleId = "fake-role-id"

        when:
        controller.deleteRoleById(roleId)

        then:
        1 * service.deleteRoleById(roleId)
        notThrown()

    }

    def "should find all groups"() {

        given:
        def roleRepresentationList = new ArrayList()
        def roleRepresentation = new RoleRepresentation("fake-role-id", "fake-role", "this is a fake role")
        roleRepresentationList.add(roleRepresentation)

        def groupRepresentation = new GroupRepresentation("fake-group-id", "fake-group", roleRepresentationList, 1)
        def groupRepresentationList = new ArrayList()
        groupRepresentationList.add(groupRepresentation)

        when:
        def groups = controller.findAllGroups()

        then:
        1 * service.findAllGroups() >> groupRepresentationList
        assert groups != null
        assert groups.size() == 1
        assert groups.get(0).id == groupRepresentation.id
        assert groups.get(0).name == groupRepresentation.name
        assert groups.get(0).roles != null
        assert groups.get(0).roles.size() == 1
        assert groups.get(0).roles.get(0).id == roleRepresentation.id
        assert groups.get(0).roles.get(0).name == roleRepresentation.name
        assert groups.get(0).roles.get(0).description == roleRepresentation.description
        assert groups.get(0).membersCount == 1
        notThrown()
    }

    def "should create group"() {

        given:
        def roleRepresentationList = new ArrayList()
        def roleRepresentation = new RoleRepresentation("fake-role-id", "fake-role", "this is a fake role")
        roleRepresentationList.add(roleRepresentation)
        def groupRepresentation = new GroupRepresentation("fake-group-id", "fake-group", roleRepresentationList, 0)

        def roleIds = new ArrayList()
        roleIds.add("fake-role-id")
        def request = new CreateGroupRequest("fake-group", roleIds)

        when:
        def group = controller.createGroup(request)

        then:
        1 * service.createGroup(request) >> groupRepresentation
        assert group != null
        assert group.id == groupRepresentation.id
        assert group.name == groupRepresentation.name
        assert group.roles != null
        assert group.roles.size() == 1
        assert group.roles.get(0).id == roleRepresentation.id
        assert group.roles.get(0).name == roleRepresentation.name
        assert group.roles.get(0).description == roleRepresentation.description
        notThrown()

    }

    def "should update group"() {

        given:
        def groupId = "fake-group-id"
        def roleRepresentationList = new ArrayList()
        def roleRepresentation = new RoleRepresentation("fake-role-id", "fake-role", "this is a fake role")
        roleRepresentationList.add(roleRepresentation)
        def groupRepresentation = new GroupRepresentation(groupId, "fake-group", roleRepresentationList, 0)

        def roleIds = new ArrayList()
        roleIds.add("fake-role-id")
        def request = new UpdateGroupRequest("fake-group", roleIds)

        when:
        def group = controller.updateGroup(groupId, request)

        then:
        1 * service.updateGroup(groupId, request) >> groupRepresentation
        assert group != null
        assert group.id == groupRepresentation.id
        assert group.name == groupRepresentation.name
        assert group.roles != null
        assert group.roles.size() == 1
        assert group.roles.get(0).id == roleRepresentation.id
        assert group.roles.get(0).name == roleRepresentation.name
        assert group.roles.get(0).description == roleRepresentation.description
        notThrown()
    }

    def "should find group by id"() {

        given:
        def groupId = "fake-group-id"
        def roleRepresentationList = new ArrayList()
        def roleRepresentation = new RoleRepresentation("fake-role-id", "fake-role", "this is a fake role")
        roleRepresentationList.add(roleRepresentation)

        def userRepresentationList = new ArrayList()
        def userRepresentation = new UserRepresentation("user-id", "user-name", "user-email", "user-photo", [], LocalDateTime.now())
        userRepresentationList.add(userRepresentation)
        def groupRepresentation = new GroupMembersRepresentation(groupId, "fake-group", roleRepresentationList, userRepresentationList)

        when:
        def group = controller.findGroupById(groupId)

        then:
        1 * service.findGroupById(groupId) >> groupRepresentation
        assert group != null
        assert group.id == groupRepresentation.id
        assert group.name == groupRepresentation.name
        assert group.roles != null
        assert group.roles.size() == 1
        assert group.roles.get(0).id == roleRepresentation.id
        assert group.roles.get(0).name == roleRepresentation.name
        assert group.roles.get(0).description == roleRepresentation.description
        assert group.members != null
        assert group.members.size() == 1
        assert group.members.get(0).id == userRepresentation.id
        assert group.members.get(0).name == userRepresentation.name
        assert group.members.get(0).email == userRepresentation.email
        assert group.members.get(0).photoUrl == userRepresentation.photoUrl
        notThrown()

    }

    def "should delete group by id"() {

        given:
        def groupId = "fake-group-id"

        when:
        controller.deleteGroupById(groupId)

        then:
        1 * service.deleteGroupById(groupId)
        notThrown()

    }

    def "should find group roles by id"() {

        given:
        def roleRepresentation = new RoleRepresentation("fake-role-id", "fake-role", "this is a fake role")
        def roleRepresentationList = new ArrayList()
        roleRepresentationList.add(roleRepresentation)
        def groupId = "fake-group-id"

        when:
        def groupRoles = controller.findGroupRolesById(groupId)

        then:
        1 * service.findGroupRolesById(groupId) >> roleRepresentationList
        assert groupRoles != null
        assert groupRoles.size() == 1
        assert groupRoles.get(0).id == roleRepresentation.id
        assert groupRoles.get(0).name == roleRepresentation.name
        assert groupRoles.get(0).description == roleRepresentation.description

    }

}
