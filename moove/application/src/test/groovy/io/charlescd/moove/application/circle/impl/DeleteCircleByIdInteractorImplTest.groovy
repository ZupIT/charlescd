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
import io.charlescd.moove.application.DeploymentService
import io.charlescd.moove.application.KeyValueRuleService
import io.charlescd.moove.application.WorkspaceService
import io.charlescd.moove.application.circle.DeleteCircleByIdInteractor
import io.charlescd.moove.application.circle.request.NodePart
import io.charlescd.moove.domain.*
import io.charlescd.moove.domain.exceptions.BusinessException
import io.charlescd.moove.domain.exceptions.NotFoundException
import io.charlescd.moove.domain.repository.*
import io.charlescd.moove.domain.service.CircleMatcherService
import spock.lang.Specification

import java.time.LocalDateTime

class DeleteCircleByIdInteractorImplTest extends Specification {

    private DeleteCircleByIdInteractor deleteCircleByIdInteractor

    private UserRepository userRepository = Mock(UserRepository)
    private CircleRepository circleRepository = Mock(CircleRepository)
    private CircleMatcherService circleMatcherService = Mock(CircleMatcherService)
    private DeploymentRepository deploymentRepository = Mock(DeploymentRepository)
    private KeyValueRuleRepository keyValueRuleRepository = Mock(KeyValueRuleRepository)
    private WorkspaceRepository workspaceRepository = Mock(WorkspaceRepository)

    void setup() {
        this.deleteCircleByIdInteractor = new DeleteCircleByIdInteractorImpl(
                new CircleService(circleRepository),
                circleMatcherService,
                new DeploymentService(deploymentRepository),
                new KeyValueRuleService(keyValueRuleRepository),
                new WorkspaceService(workspaceRepository, userRepository)
        )
    }

    def "should delete a circle by its id"() {
        given:
        def circleId = "292e18e0-da59-4540-ba44-e46a07de8d16"
        def workspaceId = "c71ac012-9a7f-4f63-9c21-d9e1ec6ebbf5"
        def authorId = "95bdd01a-6adc-4303-9193-836f1f76896e"

        def rulePart = new NodePart.RulePart("username", "EQUAL", ["zup"])
        def rule = new NodePart(NodePart.NodeTypeRequest.CLAUSE, NodePart.LogicalOperatorRequest.OR, null, rulePart)
        def nodePart = new NodePart(NodePart.NodeTypeRequest.CLAUSE, NodePart.LogicalOperatorRequest.OR, [rule], null)

        def author = getDummyUser(authorId)
        def circle = getDummyCircle(circleId, author, nodePart, workspaceId, false)
        def workspace = getDummyWorkspace(workspaceId, author)

        when:
        this.deleteCircleByIdInteractor.execute(circleId, workspaceId)

        then:
        1 * this.circleRepository.find(circleId, workspaceId) >> Optional.of(circle)
        1 * this.deploymentRepository.findActiveByCircleId(circleId) >> []
        1 * this.workspaceRepository.find(workspaceId) >> Optional.of(workspace)
        1 * this.keyValueRuleRepository.delete(circleId)
        1 * this.circleRepository.delete(circleId)
        1 * this.circleMatcherService.delete(circle.reference, workspace.circleMatcherUrl)

        notThrown(Exception)
    }

    def "should throw an exception when an active deployment exists"() {
        given:
        def circleId = "292e18e0-da59-4540-ba44-e46a07de8d16"
        def workspaceId = "c71ac012-9a7f-4f63-9c21-d9e1ec6ebbf5"
        def authorId = "95bdd01a-6adc-4303-9193-836f1f76896e"
        def deploymentId = "e8151dbf-94dd-4abb-a13a-0d47cbba7602"

        def rulePart = new NodePart.RulePart("username", "EQUAL", ["zup"])
        def rule = new NodePart(NodePart.NodeTypeRequest.CLAUSE, NodePart.LogicalOperatorRequest.OR, null, rulePart)
        def nodePart = new NodePart(NodePart.NodeTypeRequest.CLAUSE, NodePart.LogicalOperatorRequest.OR, [rule], null)

        def author = getDummyUser(authorId)
        def circle = getDummyCircle(circleId, author, nodePart, workspaceId, false)
        def deployment = getDummyDeployment(deploymentId, author, circle, "10bdd01a-6adc-4303-9193-836f1f76884d", workspaceId)

        when:
        this.deleteCircleByIdInteractor.execute(circleId, workspaceId)

        then:
        1 * this.circleRepository.find(circleId, workspaceId) >> Optional.of(circle)
        1 * this.deploymentRepository.findActiveByCircleId(circleId) >> [deployment]

        def exception = thrown(BusinessException)
        assert exception.message == "circle.deployment.active"
    }

    def "should throw an exception when circle does not exists"() {
        given:
        def circleId = "292e18e0-da59-4540-ba44-e46a07de8d16"
        def workspaceId = "c71ac012-9a7f-4f63-9c21-d9e1ec6ebbf5"

        when:
        this.deleteCircleByIdInteractor.execute(circleId, workspaceId)

        then:
        1 * this.circleRepository.find(circleId, workspaceId) >> Optional.empty()

        def exception = thrown(NotFoundException)
        assert exception.resourceName == "circle"
        assert exception.id == circleId
    }

    private Deployment getDummyDeployment(String deploymentId, User user, Circle circle, String buildId, String workspaceId) {
        new Deployment(
                deploymentId,
                user,
                LocalDateTime.now(),
                LocalDateTime.now(),
                DeploymentStatusEnum.DEPLOYED,
                circle,
                buildId,
                workspaceId
        )
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

    private Circle getDummyCircle(String circleId, User author, NodePart nodePart, String workspaceId, Boolean isDefault) {
        new Circle(
                circleId,
                "Women",
                "9d109f66-351b-426d-ad69-a49bbc329914",
                author, LocalDateTime.now(),
                MatcherTypeEnum.REGULAR,
                new ObjectMapper().valueToTree(nodePart),
                0,
                null,
                isDefault,
                workspaceId
        )
    }
}
