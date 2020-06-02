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

package io.charlescd.moove.application.circle.impl

import io.charlescd.moove.application.WorkspaceService
import io.charlescd.moove.application.circle.IdentifyCircleInteractor
import io.charlescd.moove.domain.SimpleCircle
import io.charlescd.moove.domain.User
import io.charlescd.moove.domain.Workspace
import io.charlescd.moove.domain.WorkspaceStatusEnum
import io.charlescd.moove.domain.repository.UserRepository
import io.charlescd.moove.domain.repository.WorkspaceRepository
import io.charlescd.moove.domain.service.CircleMatcherService
import spock.lang.Specification

import java.time.LocalDateTime

class IdentifyCircleInteractorImplTest extends Specification {

    private IdentifyCircleInteractor identifyCircleInteractor

    private UserRepository userRepository = Mock(UserRepository)
    private WorkspaceRepository workspaceRepository = Mock(WorkspaceRepository)
    private CircleMatcherService circleMatcherService = Mock(CircleMatcherService)

    void setup() {
        identifyCircleInteractor = new IdentifyCircleInteractorImpl(
                new WorkspaceService(workspaceRepository, userRepository),
                circleMatcherService
        )
    }

    def "should return all circles that match request parameters"() {
        given:
        def workspaceId = "3cc92e74-4dd3-49f0-a1ec-b51a9ce80d95"
        def request = new HashMap<String, Object>()
        request.put("username", "zup")

        def author = getDummyUser("e57936b7-ae29-4cc7-a39c-f5c65b4c5f6d")
        def workspace = getDummyWorkspace(workspaceId, author)

        def simpleCircleOne = new SimpleCircle("efb488d1-bd99-4863-bc1b-abffb657dd01", "Men")
        def simpleCircleTwo = new SimpleCircle("c55d1f89-ead7-4906-8a17-b408ce7bd6eb", "Default")

        when:
        def response = identifyCircleInteractor.execute(workspaceId, request)

        then:
        1 * workspaceRepository.find(workspaceId) >> Optional.of(workspace)
        1 * circleMatcherService.identify(workspace, request) >> [simpleCircleOne, simpleCircleTwo]

        assert response != null
        assert response.size() == 2
        assert response[0].id == "efb488d1-bd99-4863-bc1b-abffb657dd01"
        assert response[0].name == "Men"
        assert response[1].id == "c55d1f89-ead7-4906-8a17-b408ce7bd6eb"
        assert response[1].name == "Default"
    }

    def "should return an empty list"() {
        given:
        def workspaceId = "3cc92e74-4dd3-49f0-a1ec-b51a9ce80d95"
        def request = new HashMap<String, Object>()
        request.put("username", "zup")

        def author = getDummyUser("e57936b7-ae29-4cc7-a39c-f5c65b4c5f6d")
        def workspace = getDummyWorkspace(workspaceId, author)

        when:
        def response = identifyCircleInteractor.execute(workspaceId, request)

        then:
        1 * workspaceRepository.find(workspaceId) >> Optional.of(workspace)
        1 * circleMatcherService.identify(workspace, request) >> []

        assert response != null
        assert response.size() == 0
    }

    private User getDummyUser(String authorId) {
        new User(
                authorId,
                "charles",
                "charles@zup.com.br",
                "http://charles.com/dummy_photo.jpg",
                [],
                false,
                LocalDateTime.now()
        )
    }

    private Workspace getDummyWorkspace(String workspaceId, User author) {
        new Workspace(
                workspaceId,
                "Charles",
                author,
                LocalDateTime.now(),
                [],
                WorkspaceStatusEnum.COMPLETE,
                null,
                "http://circle-matcher.com",
                null,
                null,
                null
        )
    }
}
