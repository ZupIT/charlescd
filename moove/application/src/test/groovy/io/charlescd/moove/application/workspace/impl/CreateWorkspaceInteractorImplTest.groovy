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
import io.charlescd.moove.domain.repository.UserRepository
import io.charlescd.moove.domain.repository.WorkspaceRepository
import spock.lang.Specification

import java.time.LocalDateTime

class CreateWorkspaceInteractorImplTest extends Specification {

    private CreateWorkspaceInteractor createWorkspaceInteractor

    private WorkspaceRepository workspaceRepository = Mock(WorkspaceRepository)
    private UserRepository userRepository = Mock(UserRepository)
    private CircleRepository circleRepository = Mock(CircleRepository)

    def setup() {
        createWorkspaceInteractor = new CreateWorkspaceInteractorImpl(new WorkspaceService(workspaceRepository, userRepository), new UserService(userRepository),
                new CircleService(circleRepository))
    }

    def 'when user does not exist, should throw exception'() {
        given:
        def authorId = "4e806b2a-557b-45c5-91be-1e1db909bef6"
        def createWorkspaceRequest = new CreateWorkspaceRequest("Workspace name", authorId)

        when:
        createWorkspaceInteractor.execute(createWorkspaceRequest)

        then:
        1 * userRepository.findById(authorId) >> Optional.empty()
        0 * workspaceRepository.save(_)

        def ex = thrown(NotFoundException)
        ex.resourceName == "user"
        ex.id == authorId
    }

    def 'should create workspace successfully'() {
        given:
        def workspaceName = "Workspace name"
        def author = new User('4e806b2a-557b-45c5-91be-1e1db909bef6', 'User name', 'user@email.com', 'user.photo.png',
                new ArrayList<Workspace>(), false, LocalDateTime.now())
        def createWorkspaceRequest = new CreateWorkspaceRequest(workspaceName, author.id)
        def expectedWorkspace = new Workspace(UUID.randomUUID().toString(), workspaceName, author, LocalDateTime.now(), [],
                WorkspaceStatusEnum.INCOMPLETE, null, null, null, null, null)

        when:
        def workspaceResponse = createWorkspaceInteractor.execute(createWorkspaceRequest)

        then:
        1 * userRepository.findById(author.id) >> Optional.of(author)
        1 * workspaceRepository.save(_) >> { arguments ->
            def workspace = arguments[0]
            assert workspace instanceof Workspace

            assert workspace.name == expectedWorkspace.name
            assert workspace.author.id == expectedWorkspace.author.id
            assert workspace.author.name == expectedWorkspace.author.name
            assert workspace.author.photoUrl == expectedWorkspace.author.photoUrl
            assert workspace.author.createdAt == expectedWorkspace.author.createdAt
            assert workspace.author.email == expectedWorkspace.author.email
            assert workspace.author.workspaces == expectedWorkspace.author.workspaces
            assert workspace.status == expectedWorkspace.status

            expectedWorkspace
        }
        1 * circleRepository.save(_) >> { arguments ->
            def circle = arguments[0]
            assert circle instanceof Circle

            assert circle.name == "Default"
            assert circle.defaultCircle == true
            assert circle.workspaceId == expectedWorkspace.id
        }

        workspaceResponse != null
        workspaceResponse.id == expectedWorkspace.id
        workspaceResponse.status == expectedWorkspace.status.name()
        workspaceResponse.createdAt == expectedWorkspace.createdAt
        workspaceResponse.authorId == expectedWorkspace.author.id
        workspaceResponse.cdConfiguration == null
        workspaceResponse.circleMatcherUrl == null
        workspaceResponse.gitConfiguration == null
        workspaceResponse.registryConfiguration == null
    }
}
