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

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import com.fasterxml.jackson.module.kotlin.KotlinModule
import io.charlescd.moove.application.*
import io.charlescd.moove.application.circle.UpdateCircleWithCsvFileInteractor
import io.charlescd.moove.application.circle.request.NodePart
import io.charlescd.moove.application.circle.request.UpdateCircleWithCsvRequest
import io.charlescd.moove.domain.*
import io.charlescd.moove.domain.repository.*
import io.charlescd.moove.domain.service.CircleMatcherService
import spock.lang.Specification

import java.time.LocalDateTime

class UpdateCircleWithCsvFileInteractorImplTest extends Specification {

    private UpdateCircleWithCsvFileInteractor updateCircleWithCsvFileInteractor

    private UserRepository userRepository = Mock(UserRepository)
    private CircleRepository circleRepository = Mock(CircleRepository)
    private WorkspaceRepository workspaceRepository = Mock(WorkspaceRepository)
    private DeploymentRepository deploymentRepository = Mock(DeploymentRepository)
    private BuildRepository buildRepository = Mock(BuildRepository)
    private CircleMatcherService circleMatcherService = Mock(CircleMatcherService)
    private ObjectMapper objectMapper = new ObjectMapper().registerModule(new KotlinModule()).registerModule(new JavaTimeModule())
    private CsvSegmentationService csvSegmentationService = new CsvSegmentationService(objectMapper)
    private KeyValueRuleRepository keyValueRuleRepository = Mock(KeyValueRuleRepository)

    void setup() {
        this.updateCircleWithCsvFileInteractor = new UpdateCircleWithCsvFileInteractorImpl(
                new CircleService(circleRepository),
                new WorkspaceService(workspaceRepository, userRepository),
                new DeploymentService(deploymentRepository),
                new BuildService(buildRepository),
                circleMatcherService,
                csvSegmentationService,
                new KeyValueRuleService(keyValueRuleRepository)
        )
    }

    def "should update a circle with a csv segmentation file"() {
        given:
        def fileContent = "IDs\n" +
                "ce532f07-3bcf-40f8-9a39-289fb527ed54\n" +
                "c4b13c9f-d151-4f68-aad5-313b08503bd6\n" +
                "d77c5d16-a39f-406e-a33b-cee986b82348\n" +
                "2dd5fd08-c23a-494a-80b6-66db39c73630\n"

        def inputStream = new ByteArrayInputStream(fileContent.getBytes())

        def circleId = "b40477e2-9374-47b5-a54e-8909fb867e6d"
        def name = "Women"
        def keyName = "IDs"
        def workspaceId = "c4ffc9ac-47ef-4f73-b7fa-0c0384e978e9"
        def authorId = "b312dd87-28e5-490d-967b-293a7e65f77d"
        def request = new UpdateCircleWithCsvRequest(circleId, name, keyName, inputStream)

        def rulePart = new NodePart.RulePart("username", "EQUAL", ["zup"])
        def rule = new NodePart(NodePart.NodeTypeRequest.CLAUSE, NodePart.LogicalOperatorRequest.OR, null, rulePart)
        def nodePart = new NodePart(NodePart.NodeTypeRequest.CLAUSE, NodePart.LogicalOperatorRequest.OR, [rule], null)

        def author = getDummyUser(authorId)
        def circle = getDummyCircle(circleId, author, nodePart, workspaceId, false)
        def workspace = getDummyWorkspace(workspaceId, author)
        def build = getDummyBuild(workspaceId, author, BuildStatusEnum.BUILT, DeploymentStatusEnum.DEPLOYED)

        def deploymentId = "1bbb7057-5415-463b-9c25-0e3af442cf69"
        def deployment = getDummyDeployment(deploymentId, author, circle, build.id, workspaceId)

        when:
        def response = this.updateCircleWithCsvFileInteractor.execute(request, workspaceId)

        then:
        1 * this.circleRepository.findById(circleId) >> Optional.of(circle)
        1 * this.circleRepository.update(_) >> { arguments ->
            def updatedCircle = arguments[0]

            assert updatedCircle instanceof Circle
            assert updatedCircle.id == circle.id
            assert updatedCircle.name == name
            assert updatedCircle.matcherType == MatcherTypeEnum.SIMPLE_KV
            assert !updatedCircle.defaultCircle
            assert updatedCircle.importedAt != null
            assert updatedCircle.author == author
            assert updatedCircle.importedKvRecords == 4

            def node = objectMapper.treeToValue(updatedCircle.rules, NodePart.class)
            assert node.clauses[0].clauses[0].content.value.contains("ce532f07-3bcf-40f8-9a39-289fb527ed54")
            assert node.clauses[0].clauses[1].content.value.contains("c4b13c9f-d151-4f68-aad5-313b08503bd6")
            assert node.clauses[0].clauses[2].content.value.contains("d77c5d16-a39f-406e-a33b-cee986b82348")
            assert node.clauses[0].clauses[3].content.value.contains("2dd5fd08-c23a-494a-80b6-66db39c73630")

            return updatedCircle
        }

        1 * this.keyValueRuleRepository.saveAll(_) >> { arguments ->
            def nodeList = arguments[0]
            assert nodeList instanceof List<KeyValueRule>
            assert nodeList.size() == 4
        }

        1 * this.workspaceRepository.find(workspaceId) >> Optional.of(workspace)

        1 * circleMatcherService.updateImport(_, _, _, _) >> { arguments ->
            def updatedCircle = arguments[0]
            def previousReference = arguments[1]
            def nodes = arguments[2]
            def matcherUri = arguments[3]

            assert updatedCircle instanceof Circle
            assert nodes instanceof List<JsonNode>

            matcherUri == workspace.circleMatcherUrl
            previousReference == circle.reference

            def node = objectMapper.treeToValue(updatedCircle.rules, NodePart.class)
            assert node.clauses[0].clauses[0].content.value.contains("ce532f07-3bcf-40f8-9a39-289fb527ed54")
            assert node.clauses[0].clauses[1].content.value.contains("c4b13c9f-d151-4f68-aad5-313b08503bd6")
            assert node.clauses[0].clauses[2].content.value.contains("d77c5d16-a39f-406e-a33b-cee986b82348")
            assert node.clauses[0].clauses[3].content.value.contains("2dd5fd08-c23a-494a-80b6-66db39c73630")
        }

        1 * deploymentRepository.findActiveByCircleId(circleId) >> [deployment]
        1 * buildRepository.findById(deployment.buildId) >> Optional.of(build)

        assert response != null
        assert response.rules != null
        assert response.reference != circle.reference
        assert response.importedKvRecords == 4
        assert response.importedAt != null
    }

    def "should update a circle without a csv segmentation file"() {
        given:

        def circleId = "b40477e2-9374-47b5-a54e-8909fb867e6d"
        def name = "Women"
        def workspaceId = "c4ffc9ac-47ef-4f73-b7fa-0c0384e978e9"
        def authorId = "b312dd87-28e5-490d-967b-293a7e65f77d"
        def request = new UpdateCircleWithCsvRequest(circleId, name, null, null)

        def rulePart = new NodePart.RulePart("username", "EQUAL", ["zup"])
        def rule = new NodePart(NodePart.NodeTypeRequest.CLAUSE, NodePart.LogicalOperatorRequest.OR, null, rulePart)
        def nodePart = new NodePart(NodePart.NodeTypeRequest.CLAUSE, NodePart.LogicalOperatorRequest.OR, [rule], null)

        def author = getDummyUser(authorId)
        def circle = getDummyCircle(circleId, author, nodePart, workspaceId, false)
        def build = getDummyBuild(workspaceId, author, BuildStatusEnum.BUILT, DeploymentStatusEnum.DEPLOYED)

        def deploymentId = "1bbb7057-5415-463b-9c25-0e3af442cf69"
        def deployment = getDummyDeployment(deploymentId, author, circle, build.id, workspaceId)

        when:
        def response = this.updateCircleWithCsvFileInteractor.execute(request, workspaceId)

        then:
        1 * this.circleRepository.findById(circleId) >> Optional.of(circle)
        1 * this.circleRepository.update(_) >> { arguments ->
            def updatedCircle = arguments[0]

            assert updatedCircle instanceof Circle
            assert updatedCircle.id == circle.id
            assert updatedCircle.name == name
            assert updatedCircle.matcherType == circle.matcherType
            assert !updatedCircle.defaultCircle
            assert updatedCircle.importedAt == circle.importedAt
            assert updatedCircle.author == author
            assert updatedCircle.importedKvRecords == circle.importedKvRecords

            return updatedCircle
        }

        0 * this.keyValueRuleRepository.saveAll(_)

        0 * this.workspaceRepository.find(_)

        0 * circleMatcherService.updateImport(_, _, _, _)

        1 * deploymentRepository.findActiveByCircleId(circleId) >> [deployment]
        1 * buildRepository.findById(deployment.buildId) >> Optional.of(build)

        assert response != null
        assert response.rules != null
        assert response.reference != circle.reference
        assert response.importedKvRecords == 0
        assert response.importedAt == null
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

    private Build getDummyBuild(String workspaceId, User author, BuildStatusEnum buildStatusEnum, DeploymentStatusEnum deploymentStatusEnum) {
        def componentSnapshotList = new ArrayList<ComponentSnapshot>()
        componentSnapshotList.add(new ComponentSnapshot('70189ffc-b517-4719-8e20-278a7e5f9b33', '20209ffc-b517-4719-8e20-278a7e5f9b00',
                'Component snapshot name', LocalDateTime.now(), null,
                workspaceId,  '3e1f3969-c6ec-4a44-96a0-101d45b668e7', 'hostValue', 'gatewayName'))

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
        deploymentList.add(new Deployment('f8296aea-6ae1-11ea-bc55-0242ac130003', author, LocalDateTime.now().minusDays(1),
                LocalDateTime.now(), deploymentStatusEnum, circle, '23f1eabd-fb57-419b-a42b-4628941e34ec', workspaceId))

        def build = new Build('23f1eabd-fb57-419b-a42b-4628941e34ec', author, LocalDateTime.now(), featureSnapshotList,
                'tag-name', '6181aaf1-10c4-47d8-963a-3b87186debbb', 'f53020d7-6c85-4191-9295-440a3e7c1307', buildStatusEnum,
                workspaceId, deploymentList)
        build
    }
}
