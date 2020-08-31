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
import io.charlescd.moove.application.circle.FindAllCirclesInteractor
import io.charlescd.moove.application.circle.request.NodePart
import io.charlescd.moove.domain.*
import io.charlescd.moove.domain.repository.BuildRepository
import io.charlescd.moove.domain.repository.CircleRepository
import io.charlescd.moove.domain.repository.DeploymentRepository
import spock.lang.Specification

import java.time.LocalDateTime

class FindAllCirclesInteractorImplTest extends Specification {

    private FindAllCirclesInteractor findAllCirclesInteractor

    private CircleRepository circleRepository = Mock(CircleRepository)
    private DeploymentRepository deploymentRepository = Mock(DeploymentRepository)
    private BuildRepository buildRepository = Mock(BuildRepository)

    void setup() {
        this.findAllCirclesInteractor = new FindAllCirclesInteractorImpl(
                new CircleService(circleRepository),
                new DeploymentService(deploymentRepository),
                new BuildService(buildRepository)
        )
    }

    def "should find all active circles without name parameter"() {
        given:
        def workspaceId = "d3828cdb-b87c-4360-a3b6-4563aff459a8"
        def pageRequest = new PageRequest(0, 10)

        def rulePart = new NodePart.RulePart("username", NodePart.ConditionEnum.EQUAL, ["zup"])
        def rule = new NodePart(NodePart.NodeTypeRequest.CLAUSE, NodePart.LogicalOperatorRequest.OR, null, rulePart)
        def nodePart = new NodePart(NodePart.NodeTypeRequest.CLAUSE, NodePart.LogicalOperatorRequest.OR, [rule], null)

        def authorId = "89363883-cc6e-4711-8a2b-63c0665d5b7d"
        def author = getDummyUser(authorId)

        def womenCircleId = "4b664b17-ca05-4ced-a73c-1293f8d0f756"
        def womenCircle = getDummyCircle(womenCircleId, author, nodePart, workspaceId, false)

        def menCircleId = "6d19ab59-33c1-4145-9637-0ebdaa5703bf"
        def menCircle = getDummyCircle(menCircleId, author, nodePart, workspaceId, false)

        def circleList = [womenCircle, menCircle]

        def buildId = "3e5e7abc-234b-41be-ad91-c20cfa6bf0cf"

        def womenDeploymentId = "bf387447-60f4-4e02-b77c-d4b32030bb1c"
        def womenDeployment = getDummyDeployment(womenDeploymentId, author, menCircle, buildId, workspaceId)

        def menDeploymentId = "080b64d1-7204-4a2f-87fd-815a78e42455"
        def menDeployment = getDummyDeployment(menDeploymentId, author, menCircle, buildId, workspaceId)

        def build = getDummyBuild(workspaceId, author, BuildStatusEnum.BUILT, DeploymentStatusEnum.DEPLOYED)

        when:
        def response = this.findAllCirclesInteractor.execute(null, true, workspaceId, pageRequest)

        then:
        1 * this.circleRepository.find(_, _, _, _) >> { arguments ->

            assert arguments[0] == null
            assert arguments[1] == true
            assert arguments[2] == workspaceId
            assert arguments[3] == pageRequest

            return new Page<Circle>(circleList, 0, 10, 1)
        }

        1 * this.deploymentRepository.findActiveByCircleId(womenCircleId) >> [womenDeployment]
        1 * this.deploymentRepository.findActiveByCircleId(menCircleId) >> [menDeployment]

        2 * this.buildRepository.findById(buildId) >> Optional.of(build)

        assert response != null
        assert response.content != null
        assert !response.content.isEmpty()
        assert response.isLast
        assert response.page == 0
        assert response.totalPages == 1
        assert response.content[0].id == womenCircleId
        assert response.content[1].id == menCircleId
        assert response.content[0].deployment.id == womenDeploymentId
        assert response.content[1].deployment.id == menDeploymentId
        assert response.content[0].deployment.tag == build.tag
        assert response.content[1].deployment.tag == build.tag
    }

    def "should find all inactive circles without name parameter"() {
        given:
        def workspaceId = "d3828cdb-b87c-4360-a3b6-4563aff459a8"
        def pageRequest = new PageRequest(0, 10)

        def rulePart = new NodePart.RulePart("username", NodePart.ConditionEnum.EQUAL, ["zup"])
        def rule = new NodePart(NodePart.NodeTypeRequest.CLAUSE, NodePart.LogicalOperatorRequest.OR, null, rulePart)
        def nodePart = new NodePart(NodePart.NodeTypeRequest.CLAUSE, NodePart.LogicalOperatorRequest.OR, [rule], null)

        def authorId = "89363883-cc6e-4711-8a2b-63c0665d5b7d"
        def author = getDummyUser(authorId)

        def womenCircleId = "4b664b17-ca05-4ced-a73c-1293f8d0f756"
        def womenCircle = getDummyCircle(womenCircleId, author, nodePart, workspaceId, false)

        def menCircleId = "6d19ab59-33c1-4145-9637-0ebdaa5703bf"
        def menCircle = getDummyCircle(menCircleId, author, nodePart, workspaceId, false)

        def circleList = [womenCircle, menCircle]

        when:
        def response = this.findAllCirclesInteractor.execute(null, false, workspaceId, pageRequest)

        then:
        1 * this.circleRepository.find(_, _, _, _) >> { arguments ->

            assert arguments[0] == null
            assert arguments[1] == false
            assert arguments[2] == workspaceId
            assert arguments[3] == pageRequest

            return new Page<Circle>(circleList, 0, 10, 1)
        }

        0 * this.deploymentRepository.findActiveByCircleId(_)
        0 * this.deploymentRepository.findActiveByCircleId(_)

        0 * this.buildRepository.findById(_)

        assert response != null
        assert response.content != null
        assert !response.content.isEmpty()
        assert response.isLast
        assert response.page == 0
        assert response.totalPages == 1
        assert response.content[0].id == womenCircleId
        assert response.content[1].id == menCircleId
        assert response.content[0].deployment == null
        assert response.content[1].deployment == null
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
                workspaceId, '3e1f3969-c6ec-4a44-96a0-101d45b668e7', 'host', 'gateway', 'namespace'))

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
