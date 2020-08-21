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
import io.charlescd.moove.application.BuildService
import io.charlescd.moove.application.CircleService
import io.charlescd.moove.application.DeploymentService
import io.charlescd.moove.application.circle.FindCircleByIdInteractor
import io.charlescd.moove.application.circle.request.NodePart
import io.charlescd.moove.domain.*
import io.charlescd.moove.domain.exceptions.NotFoundException
import io.charlescd.moove.domain.repository.BuildRepository
import io.charlescd.moove.domain.repository.CircleRepository
import io.charlescd.moove.domain.repository.DeploymentRepository
import spock.lang.Specification

import java.time.LocalDateTime

class FindCircleByIdInteractorImplTest extends Specification {

    private FindCircleByIdInteractor findCircleByIdInteractor

    private CircleRepository circleRepository = Mock(CircleRepository)
    private BuildRepository buildRepository = Mock(BuildRepository)
    private DeploymentRepository deploymentRepository = Mock(DeploymentRepository)

    void setup() {
        this.findCircleByIdInteractor = new FindCircleByIdInteractorImpl(
                new CircleService(circleRepository),
                new BuildService(buildRepository),
                new DeploymentService(deploymentRepository)
        )
    }

    def "should return a circle by its id"() {
        given:
        def circleId = "1a5b375f-4eef-45cd-80a5-b5b705b3d73a"
        def workspaceId = "ba0d7a48-4a70-4efa-b068-e351b933e4e1"
        def authorId = "d961f594-c5c5-4940-bee2-1f67d7841567"
        def deploymentId = "5e7323f9-bd7d-492e-980c-241b087a563f"
        def buildId = "73fc1a01-1787-4bf9-80d3-e0420d6dfbd2"

        def rulePart = new NodePart.RulePart("username", NodePart.ConditionEnum.EQUAL, ["zup"])
        def rule = new NodePart(NodePart.NodeTypeRequest.CLAUSE, NodePart.LogicalOperatorRequest.OR, null, rulePart)
        def nodePart = new NodePart(NodePart.NodeTypeRequest.CLAUSE, NodePart.LogicalOperatorRequest.OR, [rule], null)

        def user = getDummyUser(authorId)
        def circle = getDummyCircle(circleId, user, nodePart, workspaceId, false)
        def deployment = getDummyDeployment(deploymentId, user, circle, buildId, workspaceId)
        def build = getDummyBuild(workspaceId, user, BuildStatusEnum.BUILT, DeploymentStatusEnum.DEPLOYED)

        when:
        def response = this.findCircleByIdInteractor.execute(circleId, workspaceId)

        then:
        1 * circleRepository.find(circleId, workspaceId) >> Optional.of(circle)

        1 * deploymentRepository.findActiveByCircleId(circleId) >> [deployment]

        1 * buildRepository.findById(buildId) >> Optional.of(build)

        assert response != null
        assert response.id == circle.id
        assert response.reference == circle.reference
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
        assert response.deployment.buildId == deployment.buildId
        assert response.deployment.createdAt == deployment.createdAt
        assert response.deployment.tag == build.tag
        assert response.deployment.status == deployment.status.name()
        assert response.deployment.deployedAt == deployment.deployedAt
    }

    def "should return a circle without an active deployment when it doesnt exists"() {
        given:
        def circleId = "1a5b375f-4eef-45cd-80a5-b5b705b3d73a"
        def workspaceId = "ba0d7a48-4a70-4efa-b068-e351b933e4e1"
        def authorId = "d961f594-c5c5-4940-bee2-1f67d7841567"

        def rulePart = new NodePart.RulePart("username", NodePart.ConditionEnum.EQUAL, ["zup"])
        def rule = new NodePart(NodePart.NodeTypeRequest.CLAUSE, NodePart.LogicalOperatorRequest.OR, null, rulePart)
        def nodePart = new NodePart(NodePart.NodeTypeRequest.CLAUSE, NodePart.LogicalOperatorRequest.OR, [rule], null)

        def user = getDummyUser(authorId)
        def circle = getDummyCircle(circleId, user, nodePart, workspaceId, false)

        when:
        def response = this.findCircleByIdInteractor.execute(circleId, workspaceId)

        then:
        1 * circleRepository.find(circleId, workspaceId) >> Optional.of(circle)

        1 * deploymentRepository.findActiveByCircleId(circleId) >> []

        0 * buildRepository.findById(_)

        assert response != null
        assert response.id == circle.id
        assert response.reference == circle.reference
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

    def "should throw an exception when circle doesnt exists"() {
        given:
        def circleId = "1a5b375f-4eef-45cd-80a5-b5b705b3d73a"
        def workspaceId = "ba0d7a48-4a70-4efa-b068-e351b933e4e1"

        when:
        this.findCircleByIdInteractor.execute(circleId, workspaceId)

        then:
        1 * circleRepository.find(circleId, workspaceId) >> Optional.empty()

        0 * deploymentRepository.findActiveByCircleId(circleId) >> []

        0 * buildRepository.findById(_)

        def exception = thrown(NotFoundException)
        assert exception.resourceName == "circle"
        assert exception.id == circleId
    }

    private static Deployment getDummyDeployment(String deploymentId, User user, Circle circle, String buildId, String workspaceId) {
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
                componentSnapshotList,
                workspaceId, '3e25a77e-5f14-45f3-9ae7-c25c00ad9ca6'))

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
