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
import io.charlescd.moove.application.*
import io.charlescd.moove.application.circle.PatchCircleInteractor
import io.charlescd.moove.application.circle.request.NodePart
import io.charlescd.moove.application.circle.request.PatchCircleRequest
import io.charlescd.moove.domain.*
import io.charlescd.moove.domain.exceptions.BusinessException
import io.charlescd.moove.domain.repository.*
import io.charlescd.moove.domain.service.CircleMatcherService
import spock.lang.Specification

import java.time.LocalDateTime

class PatchCircleInteractorImplTest extends Specification {

    private PatchCircleInteractor patchCircleInteractor

    private UserRepository userRepository = Mock(UserRepository)
    private CircleRepository circleRepository = Mock(CircleRepository)
    private CircleMatcherService circleMatcherService = Mock(CircleMatcherService)
    private WorkspaceRepository workspaceRepository = Mock(WorkspaceRepository)
    private DeploymentRepository deploymentRepository = Mock(DeploymentRepository)
    private BuildRepository buildRepository = Mock(BuildRepository)

    void setup() {
        this.patchCircleInteractor = new PatchCircleInteractorImpl(
                circleMatcherService,
                new WorkspaceService(workspaceRepository, userRepository),
                new DeploymentService(deploymentRepository),
                new BuildService(buildRepository),
                new CircleService(circleRepository)
        )
    }

    def "should patch a circle"() {
        given:
        def authorId = "5952df12-fc50-4697-9cd9-a7c41fec2bc3"
        def circleId = "3de80951-94b1-4894-b784-c0b069994640"
        def workspaceId = "53dc2fcb-34c8-421b-b58a-df5b6ff89dd1"
        def buildId = "97f508ad-cdbd-45df-969f-07781cc00513"
        def deploymentId = "037533c9-f3f5-42ee-8d53-1fab77038a25"
        def patches = [new PatchOperation(OpCodeEnum.ADD, "/name", "Men")]
        def request = new PatchCircleRequest(patches)

        def rulePart = new NodePart.RulePart("username", "EQUAL", ["zup"])
        def rule = new NodePart(NodePart.NodeTypeRequest.CLAUSE, NodePart.LogicalOperatorRequest.OR, null, rulePart)
        def nodePart = new NodePart(NodePart.NodeTypeRequest.CLAUSE, NodePart.LogicalOperatorRequest.OR, [rule], null)

        def user = getDummyUser(authorId)
        def circle = getDummyCircle(circleId, user, nodePart, workspaceId, false)
        def workspace = getDummyWorkspace(workspaceId, user)
        def deployment = getDummyDeployment(deploymentId, user, circle, buildId, workspaceId)
        def build = getDummyBuild(workspaceId, user, BuildStatusEnum.BUILT, DeploymentStatusEnum.DEPLOYED)

        when:
        def response = this.patchCircleInteractor.execute(circleId, request)

        then:
        1 * this.circleRepository.findById(_) >> Optional.of(circle)
        1 * this.workspaceRepository.find(_) >> Optional.of(workspace)
        1 * this.circleRepository.update(_) >> { arguments ->
            def patchedCircle = arguments[0]

            assert patchedCircle instanceof Circle
            assert patchedCircle.name == "Men"

            return patchedCircle
        }
        1 * this.circleMatcherService.update(_, _, _) >> { arguments ->
            def patchedCircle = arguments[0]
            def previousReference = arguments[1]
            def matcherUri = arguments[2]

            assert patchedCircle instanceof Circle
            assert patchedCircle.name == "Men"
            assert previousReference == circle.reference
            assert matcherUri == workspace.circleMatcherUrl
        }
        1 * deploymentRepository.findActiveByCircleId(circle.id) >> [deployment]
        1 * buildRepository.findById(_) >> Optional.of(build)

        assert response != null
        assert response.id == circle.id
        assert response.reference != circle.reference
        assert response.matcherType == circle.matcherType
        assert response.default == circle.defaultCircle
        assert response.workspaceId == circle.workspaceId
        assert response.importedKvRecords == circle.importedKvRecords
        assert response.rules == circle.rules
        assert response.importedAt == circle.importedAt
        assert response.createdAt == circle.createdAt
        assert response.author.id == circle.author.id
        assert response.deployment != null
        assert response.deployment.id == deployment.id
        assert response.deployment.tag == build.tag
    }

    def "should patch a circle and return an response with no active deployment"() {
        given:
        def authorId = "5952df12-fc50-4697-9cd9-a7c41fec2bc3"
        def circleId = "3de80951-94b1-4894-b784-c0b069994640"
        def workspaceId = "53dc2fcb-34c8-421b-b58a-df5b6ff89dd1"
        def patches = [new PatchOperation(OpCodeEnum.ADD, "/name", "Men")]
        def request = new PatchCircleRequest(patches)

        def rulePart = new NodePart.RulePart("username", "EQUAL", ["zup"])
        def rule = new NodePart(NodePart.NodeTypeRequest.CLAUSE, NodePart.LogicalOperatorRequest.OR, null, rulePart)
        def nodePart = new NodePart(NodePart.NodeTypeRequest.CLAUSE, NodePart.LogicalOperatorRequest.OR, [rule], null)

        def user = getDummyUser(authorId)
        def circle = getDummyCircle(circleId, user, nodePart, workspaceId, false)
        def workspace = getDummyWorkspace(workspaceId, user)

        when:
        def response = this.patchCircleInteractor.execute(circleId, request)

        then:
        1 * this.circleRepository.findById(_) >> Optional.of(circle)
        1 * this.workspaceRepository.find(_) >> Optional.of(workspace)
        1 * this.circleRepository.update(_) >> { arguments ->
            def patchedCircle = arguments[0]

            assert patchedCircle instanceof Circle
            assert patchedCircle.name == "Men"

            return patchedCircle
        }
        1 * this.circleMatcherService.update(_, _, _) >> { arguments ->
            def patchedCircle = arguments[0]
            def previousReference = arguments[1]
            def matcherUri = arguments[2]

            assert patchedCircle instanceof Circle
            assert patchedCircle.name == "Men"
            assert previousReference == circle.reference
            assert matcherUri == workspace.circleMatcherUrl
        }
        1 * deploymentRepository.findActiveByCircleId(circle.id) >> []
        0 * buildRepository.findById(_)

        assert response != null
        assert response.id == circle.id
        assert response.reference != circle.reference
        assert response.matcherType == circle.matcherType
        assert response.default == circle.defaultCircle
        assert response.workspaceId == circle.workspaceId
        assert response.importedKvRecords == circle.importedKvRecords
        assert response.rules == circle.rules
        assert response.importedAt == circle.importedAt
        assert response.createdAt == circle.createdAt
        assert response.author.id == circle.author.id
        assert response.deployment == null
    }

    def "should throw an exception when the circle is default"() {
        given:
        def authorId = "5952df12-fc50-4697-9cd9-a7c41fec2bc3"
        def workspaceId = "53dc2fcb-34c8-421b-b58a-df5b6ff89dd1"

        def rulePart = new NodePart.RulePart("username", "EQUAL", ["zup"])
        def rule = new NodePart(NodePart.NodeTypeRequest.CLAUSE, NodePart.LogicalOperatorRequest.OR, null, rulePart)
        def nodePart = new NodePart(NodePart.NodeTypeRequest.CLAUSE, NodePart.LogicalOperatorRequest.OR, [rule], null)

        def user = getDummyUser(authorId)
        def circle = getDummyCircle(circleId, user, nodePart, workspaceId, true)

        when:
        this.patchCircleInteractor.execute(circleId, request)

        then:
        1 * this.circleRepository.findById(_) >> Optional.of(circle)

        def exception = thrown(BusinessException)
        exception.message == message

        where:
        circleId                               | request                                                                      | message
        "3de80951-94b1-4894-b784-c0b069994640" | new PatchCircleRequest([new PatchOperation(OpCodeEnum.ADD, "/name", "Men")]) | "cannot.update.default.circle"
    }

    def "should throw an exception when the value of allowed paths is null"() {
        when:
        this.patchCircleInteractor.execute(circleId, request)

        then:
        def exception = thrown(IllegalArgumentException)
        exception.message == message

        where:
        circleId                               | request                                                                      | message
        "3de80951-94b1-4894-b784-c0b069994640" | new PatchCircleRequest([new PatchOperation(OpCodeEnum.ADD, "/name", null)])  | "Name cannot be null."
        "3de80951-94b1-4894-b784-c0b069994640" | new PatchCircleRequest([new PatchOperation(OpCodeEnum.ADD, "/rules", null)]) | "Rules cannot be null."
    }

    def "should throw an exception when the patch operation is equal to REMOVE"() {
        when:
        this.patchCircleInteractor.execute(circleId, request)

        then:
        def exception = thrown(IllegalArgumentException)
        exception.message == message

        where:
        circleId                               | request                                                                        | message
        "3de80951-94b1-4894-b784-c0b069994640" | new PatchCircleRequest([new PatchOperation(OpCodeEnum.REMOVE, "/name", null)]) | "Remove operation not allowed."
    }

    def "should throw an exception when one patch path is not allowed list"() {
        when:
        this.patchCircleInteractor.execute(circleId, request)

        then:
        def exception = thrown(IllegalArgumentException)
        exception.message == message

        where:
        circleId                               | request                                                                                                               | message
        "3de80951-94b1-4894-b784-c0b069994640" | new PatchCircleRequest([new PatchOperation(OpCodeEnum.ADD, "/id", "5rED80951-94b1-4894-b784-c0b069994888")])          | "Path /id is not allowed."
        "3de80951-94b1-4894-b784-c0b069994640" | new PatchCircleRequest([new PatchOperation(OpCodeEnum.ADD, "/reference", "5rED80951-94b1-4894-b784-c0b069994888")])   | "Path /reference is not allowed."
        "3de80951-94b1-4894-b784-c0b069994640" | new PatchCircleRequest([new PatchOperation(OpCodeEnum.ADD, "/author", null)])                                         | "Path /author is not allowed."
        "3de80951-94b1-4894-b784-c0b069994640" | new PatchCircleRequest([new PatchOperation(OpCodeEnum.ADD, "/createdAt", LocalDateTime.now())])                       | "Path /createdAt is not allowed."
        "3de80951-94b1-4894-b784-c0b069994640" | new PatchCircleRequest([new PatchOperation(OpCodeEnum.ADD, "/matcherType", MatcherTypeEnum.REGULAR)])                 | "Path /matcherType is not allowed."
        "3de80951-94b1-4894-b784-c0b069994640" | new PatchCircleRequest([new PatchOperation(OpCodeEnum.ADD, "/importedKvRecords", 0)])                                 | "Path /importedKvRecords is not allowed."
        "3de80951-94b1-4894-b784-c0b069994640" | new PatchCircleRequest([new PatchOperation(OpCodeEnum.ADD, "/importedAt", LocalDateTime.now())])                      | "Path /importedAt is not allowed."
        "3de80951-94b1-4894-b784-c0b069994640" | new PatchCircleRequest([new PatchOperation(OpCodeEnum.ADD, "/defaultCircle", false)])                                 | "Path /defaultCircle is not allowed."
        "3de80951-94b1-4894-b784-c0b069994640" | new PatchCircleRequest([new PatchOperation(OpCodeEnum.ADD, "/workspaceId", "5rED80951-94b1-4894-b784-c0b069994888")]) | "Path /workspaceId is not allowed."
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
                workspaceId,
                null
        )
    }

    private static User getDummyUser(String authorId) {
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

    private static Workspace getDummyWorkspace(String workspaceId, User author) {
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

    private static Circle getDummyCircle(String circleId, User author, NodePart nodePart, String workspaceId, Boolean isDefault) {
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

    private static Build getDummyBuild(String workspaceId, User author, BuildStatusEnum buildStatusEnum, DeploymentStatusEnum deploymentStatusEnum) {
        def componentSnapshotList = new ArrayList<ComponentSnapshot>()
        componentSnapshotList.add(new ComponentSnapshot('70189ffc-b517-4719-8e20-278a7e5f9b33', '20209ffc-b517-4719-8e20-278a7e5f9b00',
                'Component snapshot name', LocalDateTime.now(), null,
                workspaceId, '3e1f3969-c6ec-4a44-96a0-101d45b668e7', 'host', 'gateway'))

        def moduleSnapshotList = new ArrayList<ModuleSnapshot>()
        moduleSnapshotList.add(new ModuleSnapshot('3e1f3969-c6ec-4a44-96a0-101d45b668e7', '000f3969-c6ec-4a44-96a0-101d45b668e7',
                'Module Snapshot Name', 'https://git-repository-address.com', LocalDateTime.now(), 'https://helm-repository.com',
                componentSnapshotList, workspaceId, '3e25a77e-5f14-45f3-9ae7-c25c00ad9ca6'))

        def featureSnapshotList = new ArrayList<FeatureSnapshot>()
        featureSnapshotList.add(new FeatureSnapshot('3e25a77e-5f14-45f3-9ae7-c25c00ad9ca6', 'cc869c36-311c-4523-ba5b-7b69286e0df4',
                'Feature name', 'feature-branch-name', LocalDateTime.now(), author.name, author.id, moduleSnapshotList, '23f1eabd-fb57-419b-a42b-4628941e34ec'))

        def circle = new Circle('f8296cfc-6ae1-11ea-bc55-0242ac130003', 'Circle name', 'f8296df6-6ae1-11ea-bc55-0242ac130003',
                author, LocalDateTime.now(), MatcherTypeEnum.SIMPLE_KV, null, null, null, false, "1a58c78a-6acb-11ea-bc55-0242ac130003")

        def deploymentList = new ArrayList<Deployment>()
        def undeployedAt = deploymentStatusEnum == DeploymentStatusEnum.NOT_DEPLOYED ? LocalDateTime.now() : null
        deploymentList.add(new Deployment('f8296aea-6ae1-11ea-bc55-0242ac130003', author, LocalDateTime.now().minusDays(1),
                LocalDateTime.now(), deploymentStatusEnum, circle, '23f1eabd-fb57-419b-a42b-4628941e34ec', workspaceId, undeployedAt))

        def build = new Build('23f1eabd-fb57-419b-a42b-4628941e34ec', author, LocalDateTime.now(), featureSnapshotList,
                'tag-name', '6181aaf1-10c4-47d8-963a-3b87186debbb', 'f53020d7-6c85-4191-9295-440a3e7c1307', buildStatusEnum,
                workspaceId, deploymentList)
        build
    }
}
