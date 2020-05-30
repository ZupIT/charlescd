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

import com.fasterxml.jackson.databind.ObjectMapper
import io.charlescd.moove.application.CircleService
import io.charlescd.moove.application.UserService
import io.charlescd.moove.application.WorkspaceService
import io.charlescd.moove.application.circle.CreateCircleInteractor
import io.charlescd.moove.application.circle.request.CreateCircleRequest
import io.charlescd.moove.application.circle.request.NodePart
import io.charlescd.moove.domain.*
import io.charlescd.moove.domain.exceptions.NotFoundException
import io.charlescd.moove.domain.repository.CircleRepository
import io.charlescd.moove.domain.repository.UserRepository
import io.charlescd.moove.domain.repository.WorkspaceRepository
import io.charlescd.moove.domain.service.CircleMatcherService
import spock.lang.Specification

import java.time.LocalDateTime

class CreateCircleInteractorImplTest extends Specification {

    private CreateCircleInteractor createCircleInteractor

    private CircleRepository circleRepository = Mock(CircleRepository)
    private UserRepository userRepository = Mock(UserRepository)
    private WorkspaceRepository workspaceRepository = Mock(WorkspaceRepository)
    private CircleMatcherService circleMatcherService = Mock(CircleMatcherService)

    void setup() {
        this.createCircleInteractor = new CreateCircleInteractorImpl(
                new CircleService(circleRepository),
                new UserService(userRepository),
                new WorkspaceService(workspaceRepository, userRepository),
                circleMatcherService
        )
    }

    def "should create a new circle"() {
        given:
        def circleId = "5a0d5b3f-8c28-49ab-a6d0-7b5d1296f610"
        def authorId = "d7abd3c1-15a3-45b6-84fb-f0e548aca230"
        def workspaceId = "a51e2a7b-f1ea-4ff8-a6aa-77b4ea92dae2"
        def rulePart = new NodePart.RulePart("username", "EQUAL", ["zup"])
        def rule = new NodePart(NodePart.NodeTypeRequest.CLAUSE, NodePart.LogicalOperatorRequest.OR, null, rulePart)
        def nodePart = new NodePart(NodePart.NodeTypeRequest.CLAUSE, NodePart.LogicalOperatorRequest.OR, [rule], null)

        def author = getDummyUser(authorId)
        def workspace = getDummyWorkspace(workspaceId, author)
        def circle = getDummyCircle(circleId, author, nodePart, workspaceId)

        def request = new CreateCircleRequest("Women", authorId, nodePart)

        when:
        def response = this.createCircleInteractor.execute(request, workspaceId)

        then:
        1 * userRepository.findById(authorId) >> Optional.of(author)
        1 * workspaceRepository.find(workspaceId) >> Optional.of(workspace)
        1 * circleRepository.save(_) >> circle
        1 * circleMatcherService.create(circle, workspace.circleMatcherUrl)

        notThrown(NotFoundException)

        assert response != null
        assert response.id == circle.id
        assert response.author.id == authorId
        assert response.createdAt == circle.createdAt
        assert response.matcherType == circle.matcherType
        assert response.name == circle.name
        assert response.reference == circle.reference
        assert response.workspaceId == circle.workspaceId
        assert response.default == circle.defaultCircle
        assert !response.default
    }

    def "should throw a NotFoundException when user does not exists"() {
        given:
        def authorId = "d7abd3c1-15a3-45b6-84fb-f0e548aca230"
        def workspaceId = "a51e2a7b-f1ea-4ff8-a6aa-77b4ea92dae2"
        def rulePart = new NodePart.RulePart("username", "EQUAL", ["zup"])
        def rule = new NodePart(NodePart.NodeTypeRequest.CLAUSE, NodePart.LogicalOperatorRequest.OR, null, rulePart)
        def nodePart = new NodePart(NodePart.NodeTypeRequest.CLAUSE, NodePart.LogicalOperatorRequest.OR, [rule], null)

        def request = new CreateCircleRequest("Women", authorId, nodePart)

        when:
        this.createCircleInteractor.execute(request, workspaceId)

        then:
        1 * userRepository.findById(authorId) >> Optional.empty()

        def exception = thrown(NotFoundException)

        assert exception.resourceName == "user"
        assert exception.id == authorId
    }

    def "should throw a NotFoundException when workspace does not exists"() {
        given:
        def authorId = "d7abd3c1-15a3-45b6-84fb-f0e548aca230"
        def workspaceId = "a51e2a7b-f1ea-4ff8-a6aa-77b4ea92dae2"
        def rulePart = new NodePart.RulePart("username", "EQUAL", ["zup"])
        def rule = new NodePart(NodePart.NodeTypeRequest.CLAUSE, NodePart.LogicalOperatorRequest.OR, null, rulePart)
        def nodePart = new NodePart(NodePart.NodeTypeRequest.CLAUSE, NodePart.LogicalOperatorRequest.OR, [rule], null)

        def author = getDummyUser(authorId)

        def request = new CreateCircleRequest("Women", authorId, nodePart)

        when:
        this.createCircleInteractor.execute(request, workspaceId)

        then:
        1 * userRepository.findById(authorId) >> Optional.of(author)
        1 * workspaceRepository.find(workspaceId) >> Optional.empty()

        def exception = thrown(NotFoundException)

        assert exception.resourceName == "workspace"
        assert exception.id == workspaceId
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
                "aa3448d8-4421-4aba-99a9-184bdabe3046",
                null,
                null
        )
    }

    private Circle getDummyCircle(String circleId, User author, NodePart nodePart, String workspaceId) {
        new Circle(
                circleId,
                "Women",
                "9d109f66-351b-426d-ad69-a49bbc329914",
                author, LocalDateTime.now(),
                MatcherTypeEnum.REGULAR,
                new ObjectMapper().valueToTree(nodePart),
                0,
                null,
                false,
                workspaceId
        )
    }
}
