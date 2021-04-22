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

import io.charlescd.moove.application.CircleService
import io.charlescd.moove.application.SystemTokenService
import io.charlescd.moove.application.TestUtils
import io.charlescd.moove.application.UserService
import io.charlescd.moove.application.WorkspaceService
import io.charlescd.moove.application.workspace.CreateWorkspaceInteractor
import io.charlescd.moove.application.workspace.request.CreateWorkspaceRequest
import io.charlescd.moove.domain.Circle
import io.charlescd.moove.domain.User
import io.charlescd.moove.domain.Workspace
import io.charlescd.moove.domain.WorkspaceStatusEnum
import io.charlescd.moove.domain.exceptions.NotFoundException
import io.charlescd.moove.domain.repository.CircleRepository
import io.charlescd.moove.domain.repository.SystemTokenRepository
import io.charlescd.moove.domain.repository.UserRepository
import io.charlescd.moove.domain.repository.WorkspaceRepository
import io.charlescd.moove.domain.service.ManagementUserSecurityService
import spock.lang.Specification

import java.time.LocalDateTime

class CreateWorkspaceInteractorImplTest extends Specification {

    private CreateWorkspaceInteractor createWorkspaceInteractor

    private WorkspaceRepository workspaceRepository = Mock(WorkspaceRepository)
    private UserRepository userRepository = Mock(UserRepository)
    private CircleRepository circleRepository = Mock(CircleRepository)
    private SystemTokenService systemTokenService = new SystemTokenService(Mock(SystemTokenRepository))
    private ManagementUserSecurityService managementUserSecurityService = Mock(ManagementUserSecurityService)

    def setup() {
        createWorkspaceInteractor =
                new CreateWorkspaceInteractorImpl(new WorkspaceService(workspaceRepository, userRepository), new UserService(userRepository, systemTokenService, managementUserSecurityService),
                new CircleService(circleRepository))
    }

    def 'when user does not exist, should throw exception'() {
        given:
        def email = TestUtils.email
        def authorization = TestUtils.authorization
        def createWorkspaceRequest = new CreateWorkspaceRequest("Workspace name")

        when:
        createWorkspaceInteractor.execute(createWorkspaceRequest, authorization, null)

        then:
        1 * managementUserSecurityService.getUserEmail(authorization) >> email
        1 * userRepository.findByEmail(email) >> Optional.empty()
        0 * workspaceRepository.save(_)

        def ex = thrown(NotFoundException)
        ex.resourceName == "user"
    }

    def 'should create workspace successfully'() {
        given:
        def authorization = TestUtils.authorization
        def author = TestUtils.user
        def expectedWorkspace = TestUtils.workspace
        def createWorkspaceRequest = new CreateWorkspaceRequest(expectedWorkspace.name)
        when:
        def workspaceResponse = createWorkspaceInteractor.execute(createWorkspaceRequest, authorization, null)

        then:
        1 * managementUserSecurityService.getUserEmail(authorization) >> author.email
        1 * userRepository.findByEmail(author.email) >> Optional.of(author)
        1 * workspaceRepository.save(_) >> { arguments ->
            def workspace = arguments[0]
            assert workspace instanceof Workspace

            assert workspace.name == expectedWorkspace.name
            assert workspace.author.id == expectedWorkspace.author.id
            assert workspace.author.name == expectedWorkspace.author.name
            assert workspace.author.photoUrl == expectedWorkspace.author.photoUrl
            assert workspace.author.email == expectedWorkspace.author.email
            assert workspace.author.workspaces == expectedWorkspace.author.workspaces
            assert workspace.status == WorkspaceStatusEnum.INCOMPLETE

            expectedWorkspace
        }
        1 * circleRepository.save(_) >> { arguments ->
            def circle = arguments[0]
            assert circle instanceof Circle

            assert circle.name == "Default"
            assert circle.defaultCircle
            assert circle.workspaceId == expectedWorkspace.id
        }

        workspaceResponse != null
        workspaceResponse.id == expectedWorkspace.id
        workspaceResponse.status == expectedWorkspace.status.name()
        workspaceResponse.createdAt == expectedWorkspace.createdAt
        workspaceResponse.authorId == expectedWorkspace.author.id
        workspaceResponse.cdConfiguration == null
        workspaceResponse.circleMatcherUrl == expectedWorkspace.circleMatcherUrl
        workspaceResponse.gitConfiguration == null
        workspaceResponse.registryConfiguration == null
    }
}
