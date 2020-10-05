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

package io.charlescd.moove.application.workspace.impl

import io.charlescd.moove.application.UserGroupService
import io.charlescd.moove.application.WorkspaceService
import io.charlescd.moove.application.workspace.DisassociateUserGroupFromWorkspaceInteractor
import io.charlescd.moove.domain.*
import io.charlescd.moove.domain.exceptions.BusinessException
import io.charlescd.moove.domain.exceptions.NotFoundException
import io.charlescd.moove.domain.repository.UserGroupRepository
import io.charlescd.moove.domain.repository.UserRepository
import io.charlescd.moove.domain.repository.WorkspaceRepository
import io.charlescd.moove.domain.service.KeycloakService
import spock.lang.Specification

import java.time.LocalDateTime

class DisassociateUserGroupFromWorkspaceInteractorImplTest extends Specification {

    private DisassociateUserGroupFromWorkspaceInteractor disassociateUserGroupFromWorkspaceInteractor

    private UserRepository userRepository = Mock(UserRepository)
    private WorkspaceRepository workspaceRepository = Mock(WorkspaceRepository)
    private UserGroupRepository userGroupRepository = Mock(UserGroupRepository)

    def setup() {
        disassociateUserGroupFromWorkspaceInteractor = new DisassociateUserGroupFromWorkspaceInteractorImpl(
                new WorkspaceService(workspaceRepository, userRepository),
                new UserGroupService(userGroupRepository)
        )
    }

    def 'should unlink user group from workspace'() {
        given:
        def authorId = "author-id"
        def author = getDummyUser(authorId)
        def workspaceId = "workspace-id"
        def userGroupId = "user-group-id"
        def memberId = "member-id"
        def member = getDummyUser(memberId)
        def userGroup = new UserGroup(userGroupId, "user-group-name", author, LocalDateTime.now(), [member])
        def workspace = getDummyWorkspace(workspaceId, author, [userGroup])
        def permission = new Permission("permission-id", "permission-name", LocalDateTime.now())
        def permissions = [permission]

        when:
        disassociateUserGroupFromWorkspaceInteractor.execute(workspaceId, userGroupId)

        then:
        1 * workspaceRepository.find(workspaceId) >> Optional.of(workspace)
        1 * userGroupRepository.findById(userGroupId) >> Optional.of(userGroup)
        1 * workspaceRepository.disassociateUserGroupAndPermissions(workspaceId, userGroupId)

        notThrown()

    }

    def 'should throw not found exception when workspace does not exist'() {
        given:
        def workspaceId = "workspace-id"
        def userGroupId = "user-group-id"

        when:
        disassociateUserGroupFromWorkspaceInteractor.execute(workspaceId, userGroupId)

        then:
        1 * workspaceRepository.find(workspaceId) >> Optional.empty()
        0 * userGroupRepository.findById(_)
        0 * workspaceRepository.disassociateUserGroupAndPermissions(_, _)

        def exception = thrown(NotFoundException)

        assert exception.resourceName == "workspace"
        assert exception.id == workspaceId

    }

    def 'should throw business exception when user group is already disassociated with workspace'() {
        given:
        def authorId = "author-id"
        def author = getDummyUser(authorId)
        def workspaceId = "workspace-id"
        def userGroupId = "user-group-id"
        def workspace = getDummyWorkspace(workspaceId, author, [])

        when:
        disassociateUserGroupFromWorkspaceInteractor.execute(workspaceId, userGroupId)

        then:
        1 * workspaceRepository.find(workspaceId) >> Optional.of(workspace)
        0 * userGroupRepository.findById(_)
        0 * workspaceRepository.disassociateUserGroupAndPermissions(_, _)

        def exception = thrown(BusinessException)

        assert exception.errorCode == MooveErrorCode.USER_GROUP_ALREADY_DISASSOCIATED

    }

    def 'should throw not found exception when user group does not exist'() {
        given:
        def authorId = "author-id"
        def author = getDummyUser(authorId)
        def workspaceId = "workspace-id"
        def userGroupId = "user-group-id"
        def memberId = "member-id"
        def member = getDummyUser(memberId)
        def userGroup = new UserGroup(userGroupId, "user-group-name", author, LocalDateTime.now(), [member])
        def workspace = getDummyWorkspace(workspaceId, author, [userGroup])

        when:
        disassociateUserGroupFromWorkspaceInteractor.execute(workspaceId, userGroupId)

        then:
        1 * workspaceRepository.find(workspaceId) >> Optional.of(workspace)
        1 * userGroupRepository.findById(userGroupId) >> Optional.empty()
        0 * workspaceRepository.disassociateUserGroupAndPermissions(_, _)

        def exception = thrown(NotFoundException)

        assert exception.resourceName == "user_group"
        assert exception.id == userGroupId

    }

    private User getDummyUser(String memberId) {
        new User(memberId, "user-name", "user-photo", "user-email", [], false, LocalDateTime.now())
    }

    private Workspace getDummyWorkspace(String workspaceId, User author, List<UserGroup> userGroupList) {
        new Workspace(workspaceId, "workspace-name", author, LocalDateTime.now(), userGroupList,
                WorkspaceStatusEnum.INCOMPLETE, null, null, null, null, null)
    }

}
