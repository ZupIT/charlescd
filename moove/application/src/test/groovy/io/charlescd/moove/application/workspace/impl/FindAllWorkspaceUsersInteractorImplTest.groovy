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

import io.charlescd.moove.application.UserService
import io.charlescd.moove.application.WorkspaceService
import io.charlescd.moove.application.workspace.FindAllWorkspaceUsersInteractor
import io.charlescd.moove.domain.*
import io.charlescd.moove.domain.exceptions.NotFoundException
import io.charlescd.moove.domain.repository.UserRepository
import io.charlescd.moove.domain.repository.WorkspaceRepository
import io.charlescd.moove.domain.service.ManagementUserSecurityService
import spock.lang.Specification


import java.time.LocalDateTime

class FindAllWorkspaceUsersInteractorImplTest extends Specification {

    private FindAllWorkspaceUsersInteractor findAllWorkspaceUsersInteractor

    private WorkspaceRepository workspaceRepository = Mock(WorkspaceRepository)
    private UserRepository userRepository = Mock(UserRepository)
    private ManagementUserSecurityService managementUserSecurityService = Mock(ManagementUserSecurityService)

    def setup() {
        this.findAllWorkspaceUsersInteractor = new FindAllWorkspaceUsersInteractorImpl(new WorkspaceService(workspaceRepository, userRepository), new UserService(userRepository, managementUserSecurityService))
    }

    def "when the workspace is not found should return an empty page of users"() {
        given:
        def workspaceId = "workspace-id"
        def authorization = "Bearer qwerty"
        def user = buildUser()
        def pageRequest = new PageRequest()
        def emptyPage = new Page([], 0, 20, 0)

        when:
        def response = this.findAllWorkspaceUsersInteractor.execute(authorization, workspaceId, null, null, pageRequest)

        then:
        1 * this.managementUserSecurityService.getUserEmail(authorization) >> user.email
        1 * this.userRepository.findByEmail(user.email) >> Optional.of(user)
        1 * this.userRepository.findByWorkspace(workspaceId, null, null, _) >> { arguments ->
            def argPageRequest = arguments[3]


            assert argPageRequest instanceof PageRequest

            return emptyPage
        }

        assert response != null
        assert response.page == 0
        assert response.size == 0
        assert response.content.size() == 0
        assert response.totalPages == 1
        assert response.isLast
    }

    def "when there are user linked to that workspace, should list them"() {
        given:
        def pageRequest = new PageRequest()
        def authorization = "Bearer qwerty"
        def author = new User("author", "charles", "charles@zup.com.br", "http://charles.com/dummy_photo.jpg", [], false, LocalDateTime.now())
        def workspaceId = "workspace-id"
        def permission = new Permission("permission-id", "permission-name", LocalDateTime.now())
        def workspacePermission = new WorkspacePermissions(workspaceId, "workspace-name", [permission], author, LocalDateTime.now(), WorkspaceStatusEnum.COMPLETE)
        def member1 = new User("member1", "charles", "member1@zup.com.br", "http://charles.com/dummy_photo.jpg", [workspacePermission], false, LocalDateTime.now())
        def member2 = new User("member2", "charles", "member2@zup.com.br", "http://charles.com/dummy_photo.jpg", [workspacePermission], false, LocalDateTime.now())
        def page = new Page([member1, member2], 0, 20, 1)
        def user = buildUser()

        when:
        def response = this.findAllWorkspaceUsersInteractor.execute(authorization, workspaceId, null, null, pageRequest)

        then:
        1 * this.managementUserSecurityService.getUserEmail(authorization) >> user.email
        1 * this.userRepository.findByEmail(user.email) >> Optional.of(user)
        1 * this.userRepository.findByWorkspace(workspaceId, null, null, _) >> { arguments ->
            def argPageRequest = arguments[3]

            assert argPageRequest instanceof PageRequest

            return page
        }

        assert response != null
        assert response.page == 0
        assert response.size == 2
        assert response.content.size() == 2
        assert response.content[0].id == member1.id
        assert response.content[0].name == member1.name
        assert response.content[0].email == member1.email
        assert response.content[0].photoUrl == member1.photoUrl
        assert response.content[0].root == member1.root
        assert response.content[0].workspaces[0].id == workspacePermission.id
        assert response.content[0].workspaces[0].name == workspacePermission.name
        assert response.content[0].workspaces[0].permissions.size() == workspacePermission.permissions.size()
        assert response.content[0].workspaces[0].permissions[0] == workspacePermission.permissions[0].name
        assert response.content[1].id == member2.id
        assert response.content[1].name == member2.name
        assert response.content[1].email == member2.email
        assert response.content[1].photoUrl == member2.photoUrl
        assert response.content[1].root == member2.root
        assert response.content[1].workspaces[0].id == workspacePermission.id
        assert response.content[1].workspaces[0].name == workspacePermission.name
        assert response.content[1].workspaces[0].permissions.size() == workspacePermission.permissions.size()
        assert response.content[1].workspaces[0].permissions[0] == workspacePermission.permissions[0].name
        assert response.totalPages == 1
        assert response.isLast
    }

    def "when requester not have access to workspace shoult thown NotFoundException"() {
        given:
        def authorization = "Bearer qwerty"
        def user = buildUser()
        def pageRequest = new PageRequest()


        when:
        this.findAllWorkspaceUsersInteractor.execute(authorization, "workspaceId", null, null, pageRequest)

        then:
        1 * this.managementUserSecurityService.getUserEmail(authorization) >> user.email
        1 * this.userRepository.findByEmail(user.email) >> Optional.of(user)

        thrown(NotFoundException)
    }

    private static User buildUser() {
        def author = new User("f52f94b8-6775-470f-bac8-125ebfd6b636", "zup", "zup@zup.com.br", "http://image.com.br/photo.png",
                [], false, LocalDateTime.now())
        def permission = new Permission("permission-id", "permission-name", LocalDateTime.now())
        def workspacePermission = new WorkspacePermissions("workspace-id", "workspace-name", [permission], author, LocalDateTime.now(), WorkspaceStatusEnum.COMPLETE)
        return new User("cfb1a3a4-d3af-46c6-b6c3-33f30f68b28b", "user name", "user@zup.com.br", "http://image.com.br/photo.png",
                [workspacePermission], false, LocalDateTime.now())
    }


}
