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

package io.charlescd.moove.application.usergroup.impl

import io.charlescd.moove.application.UserGroupService
import io.charlescd.moove.application.UserService
import io.charlescd.moove.application.usergroup.AddMemberToUserGroupInteractor
import io.charlescd.moove.application.usergroup.request.AddMemberToUserGroupRequest
import io.charlescd.moove.domain.Permission
import io.charlescd.moove.domain.Role
import io.charlescd.moove.domain.User
import io.charlescd.moove.domain.UserGroup
import io.charlescd.moove.domain.exceptions.BusinessException
import io.charlescd.moove.domain.exceptions.NotFoundException
import io.charlescd.moove.domain.repository.UserGroupRepository
import io.charlescd.moove.domain.repository.UserRepository
import io.charlescd.moove.domain.service.KeycloakService
import spock.lang.Specification

import java.time.LocalDateTime

class AddMemberToUserGroupInteractorImplTest extends Specification {

    private AddMemberToUserGroupInteractor addMemberToUserGroupInteractor

    private UserGroupRepository userGroupRepository = Mock(UserGroupRepository)
    private UserRepository userRepository = Mock(UserRepository)
    private KeycloakService keycloakService = Mock(KeycloakService)

    void setup() {
        this.addMemberToUserGroupInteractor = new AddMemberToUserGroupInteractorImpl(
                new UserGroupService(userGroupRepository),
                new UserService(userRepository),
                keycloakService
        )
    }

    def "when user group does not exist should throw an exception"() {
        given:
        def userGroupId = "user-group-id"
        def memberId = "0a859e6c-3cdf-4b34-84d0-f9038576ac58"
        def addMemberToUserGroupRequest = new AddMemberToUserGroupRequest(memberId)

        when:
        this.addMemberToUserGroupInteractor.execute(userGroupId, addMemberToUserGroupRequest)

        then:
        1 * this.userGroupRepository.findById(userGroupId) >> Optional.empty()

        def ex = thrown(NotFoundException)
        ex.resourceName == "user_group"
        ex.id == userGroupId
    }

    def "when member does not exist should throw an exception"() {
        given:
        def authorId = "0a859e6c-3cdf-4b34-84d0-f9038576ac58"
        def author = getDummyUser(authorId)
        def userGroupId = "user-group-id"
        def userGroup = new UserGroup(userGroupId, "group-name", author, LocalDateTime.now(), [])

        def memberId = "ccd9f717-6b38-4f1e-ad64-f735cda7a0da"
        def addMemberToUserGroupRequest = new AddMemberToUserGroupRequest(memberId)

        when:
        this.addMemberToUserGroupInteractor.execute(userGroupId, addMemberToUserGroupRequest)

        then:
        1 * this.userGroupRepository.findById(userGroupId) >> Optional.of(userGroup)
        1 * this.userRepository.findById(memberId) >> Optional.empty()

        def ex = thrown(NotFoundException)
        ex.resourceName == "user"
        ex.id == memberId
    }

    def "should not call method to add member cause user is already associated to user group"() {
        given:
        def authorId = "0a859e6c-3cdf-4b34-84d0-f9038576ac58"
        def author = getDummyUser(authorId)
        def memberId = "ccd9f717-6b38-4f1e-ad64-f735cda7a0da"
        def member = getDummyUser(memberId)
        def userGroupId = "user-group-id"
        def userGroup = new UserGroup(userGroupId, "group-name", author, LocalDateTime.now(), [member])

        def addMemberToUserGroupRequest = new AddMemberToUserGroupRequest(memberId)

        when:
        this.addMemberToUserGroupInteractor.execute(userGroupId, addMemberToUserGroupRequest)

        then:
        1 * this.userGroupRepository.findById(userGroupId) >> Optional.of(userGroup)
        1 * this.userRepository.findById(memberId) >> Optional.of(member)
        0 * this.userGroupRepository.addMember(_, _)
        0 * this.userGroupRepository.findPermissionsFromUserGroupAssociations(_)
        0 * this.keycloakService.associatePermissionsToNewUsers(_, _)

        def exception = thrown(BusinessException)
        assert exception.message == "user.already.associated"
    }

    def "should call method to add member to user group and not call keycloak service to update user permissions"() {
        given:
        def authorId = "0a859e6c-3cdf-4b34-84d0-f9038576ac58"
        def author = getDummyUser(authorId)
        def userGroupId = "user-group-id"
        def userGroup = new UserGroup(userGroupId, "group-name", author, LocalDateTime.now(), [])

        def memberId = "ccd9f717-6b38-4f1e-ad64-f735cda7a0da"
        def member = getDummyUser(memberId)
        def addMemberToUserGroupRequest = new AddMemberToUserGroupRequest(memberId)

        when:
        this.addMemberToUserGroupInteractor.execute(userGroupId, addMemberToUserGroupRequest)

        then:
        1 * this.userGroupRepository.findById(userGroupId) >> Optional.of(userGroup)
        1 * this.userRepository.findById(memberId) >> Optional.of(member)
        1 * this.userGroupRepository.addMember(_, _) >> { arguments ->
            def userGroupArg = arguments[0]
            def memberArg = arguments[1]

            assert userGroupArg == userGroup
            assert memberArg == member
        }
        1 * this.userGroupRepository.findPermissionsFromUserGroupAssociations(userGroup) >> Collections.emptyMap()
        0 * this.keycloakService.associatePermissionsToNewUsers(_, _)

        notThrown()

    }

    def "should call method to add member to user group and call keycloak service to update user permissions"() {
        given:
        def authorId = "0a859e6c-3cdf-4b34-84d0-f9038576ac58"
        def author = getDummyUser(authorId)
        def userGroupId = "user-group-id"
        def userGroup = new UserGroup(userGroupId, "group-name", author, LocalDateTime.now(), [])

        def memberId = "ccd9f717-6b38-4f1e-ad64-f735cda7a0da"
        def member = getDummyUser(memberId)
        def addMemberToUserGroupRequest = new AddMemberToUserGroupRequest(memberId)

        def workspaceAndRoles = [:]
        def permission = new Permission("permission-id", "permission-name", LocalDateTime.now())
        def role = new Role("role-id", "role-name", "role-description", [permission], LocalDateTime.now())
        workspaceAndRoles.put('workspace-id', [role])

        when:
        this.addMemberToUserGroupInteractor.execute(userGroupId, addMemberToUserGroupRequest)

        then:
        1 * this.userGroupRepository.findById(userGroupId) >> Optional.of(userGroup)
        1 * this.userRepository.findById(memberId) >> Optional.of(member)
        1 * this.userGroupRepository.addMember(_, _) >> { arguments ->
            def userGroupArg = arguments[0]
            def memberArg = arguments[1]

            assert userGroupArg == userGroup
            assert memberArg == member
        }
        1 * this.userGroupRepository.findPermissionsFromUserGroupAssociations(userGroup) >> workspaceAndRoles
        1 * this.keycloakService.associatePermissionsToNewUsers(member, workspaceAndRoles)

        notThrown()
    }

    private User getDummyUser(String userId) {
        new User(userId, "charles", "charles@zup.com.br", "http://charles.com/dummy_photo.jpg", [], false, LocalDateTime.now())
    }
}
