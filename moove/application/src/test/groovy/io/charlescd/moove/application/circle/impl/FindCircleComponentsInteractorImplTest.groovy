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
import io.charlescd.moove.application.DeploymentService
import io.charlescd.moove.application.circle.FindCircleComponentsInteractor
import io.charlescd.moove.application.circle.request.NodePart
import io.charlescd.moove.domain.*
import io.charlescd.moove.domain.repository.BuildRepository
import io.charlescd.moove.domain.repository.DeploymentRepository
import spock.lang.Specification

import java.time.LocalDateTime

class FindCircleComponentsInteractorImplTest extends Specification {

    private FindCircleComponentsInteractor findCircleComponentsInteractor

    private BuildRepository buildRepository = Mock(BuildRepository)
    private DeploymentRepository deploymentRepository = Mock(DeploymentRepository)

    void setup() {
        this.findCircleComponentsInteractor = new FindCircleComponentsInteractorImpl(
                new DeploymentService(deploymentRepository),
                new BuildService(buildRepository)
        )
    }

    def "should return only the most recent deployed component in the response list"() {
        given:
        def authorId = "4bdf7f39-aa42-4177-8776-8d34bf0924b6"
        def circleId = "f1ce251d-80ef-4d28-b6a8-8e1363c74f66"
        def workspaceId = "0f996233-b4c4-4e14-a822-016e1cdf0f8a"

        def author = getDummyUser(authorId)

        def componentId = "23e2267c-dabc-4997-b25d-e1570d23bf6f"
        def componentSnapshotIdOne = "e14c0223-828f-47ec-a56a-bd60d577aae9"
        def componentSnapshotIdTwo = "5f7d206e-8db6-47b3-968e-c7b47826bd39"
        def componentName = "villager-component"
        def artifactIdOne = "d2765e0f-074e-4711-9a21-f902c40f78d0"
        def artifactIdTwo = "3349ba05-5c26-4707-806d-4e5883e4b8be"
        def artifactOne = new ArtifactSnapshot(artifactIdOne, "azure.acr/" + componentName, "1.1.4", componentSnapshotIdOne, LocalDateTime.now())
        def artifactTwo = new ArtifactSnapshot(artifactIdTwo, "azure.acr/" + componentName, "1.1.5", componentSnapshotIdTwo, LocalDateTime.now())
        def componentOne = getDummyComponentSnapshot(componentSnapshotIdOne, componentName, componentId, workspaceId, artifactOne)
        def componentTwo = getDummyComponentSnapshot(componentSnapshotIdTwo, componentName, componentId, workspaceId, artifactTwo)

        def moduleName = "charles"
        def moduleId = "0b235236-b224-4eab-bbcc-a9fade8af542"
        def moduleSnapshotIdOne = "64e8cd6b-7612-445c-8c75-cfac16ea94b0"
        def moduleSnapshotIdTwo = "4165c3e1-1561-4db2-8aab-9fce4007e88b"
        def moduleOne = getDummyModuleSnapshot(moduleSnapshotIdOne, moduleId, moduleName, workspaceId, [componentOne])
        def moduleTwo = getDummyModuleSnapshot(moduleSnapshotIdTwo, moduleId, moduleName, workspaceId, [componentTwo])

        def buildOne = getDummyBuild(workspaceId, author, BuildStatusEnum.BUILT, DeploymentStatusEnum.DEPLOYED, [moduleOne])
        def buildTwo = getDummyBuild(workspaceId, author, BuildStatusEnum.BUILT, DeploymentStatusEnum.DEPLOYED, [moduleTwo])

        def circle = getDummyCircle(circleId, author, null, workspaceId, true)

        def deploymentIdOne = "4ae67175-5625-49fd-820c-80197fa05a1f"
        def deploymentOne = getDummyDeployment(
                deploymentIdOne,
                author,
                circle,
                buildOne.id,
                workspaceId,
                LocalDateTime.of(2020, 4, 27, 12, 23),
                LocalDateTime.of(2020, 4, 27, 12, 23)
        )

        def deploymentIdTwo = "82601817-ce0c-415a-a301-d1d19dd5b221"
        def deploymentTwo = getDummyDeployment(
                deploymentIdTwo,
                author,
                circle,
                buildTwo.id,
                workspaceId,
                LocalDateTime.of(2020, 4, 27, 13, 29),
                LocalDateTime.of(2020, 4, 27, 13, 29)
        )

        when:
        def response = this.findCircleComponentsInteractor.execute(circleId, workspaceId)

        then:
        1 * this.deploymentRepository.findActiveByCircleId(circleId) >> [deploymentOne, deploymentTwo]
        1 * this.buildRepository.findById(buildOne.id) >> Optional.of(buildOne)
        1 * this.buildRepository.findById(buildTwo.id) >> Optional.of(buildTwo)

        assert response != null
        assert response.size() == 1
        assert response[0].id == componentTwo.componentId
        assert response[0].name == componentTwo.name
        assert response[0].version == componentTwo.artifact.version
        assert response[0].artifact == componentTwo.artifact.artifact
        assert response[0].module == moduleTwo.name
    }

    def "should return all recent deployed components in the response list"() {
        given:
        def authorId = "4bdf7f39-aa42-4177-8776-8d34bf0924b6"
        def circleId = "f1ce251d-80ef-4d28-b6a8-8e1363c74f66"
        def workspaceId = "0f996233-b4c4-4e14-a822-016e1cdf0f8a"

        def author = getDummyUser(authorId)

        def componentIdOne = "23e2267c-dabc-4997-b25d-e1570d23bf6f"
        def componentIdTwo = "923a8025-7854-4281-a68e-da221469d54b"
        def componentSnapshotIdOne = "e14c0223-828f-47ec-a56a-bd60d577aae9"
        def componentSnapshotIdTwo = "5f7d206e-8db6-47b3-968e-c7b47826bd39"
        def componentOneName = "villager-component"
        def componentTwoName = "application-component"
        def artifactIdOne = "d2765e0f-074e-4711-9a21-f902c40f78d0"
        def artifactIdTwo = "3349ba05-5c26-4707-806d-4e5883e4b8be"
        def artifactOne = new ArtifactSnapshot(artifactIdOne, "azure.acr/" + componentOneName, "1.1.4", componentSnapshotIdOne, LocalDateTime.now())
        def artifactTwo = new ArtifactSnapshot(artifactIdTwo, "azure.acr/" + componentTwoName, "1.1.5", componentSnapshotIdTwo, LocalDateTime.now())
        def componentOne = getDummyComponentSnapshot(componentSnapshotIdOne, componentOneName, componentIdOne, workspaceId, artifactOne)
        def componentTwo = getDummyComponentSnapshot(componentSnapshotIdTwo, componentTwoName, componentIdTwo, workspaceId, artifactTwo)

        def moduleName = "charles"
        def moduleId = "0b235236-b224-4eab-bbcc-a9fade8af542"
        def moduleSnapshotIdOne = "64e8cd6b-7612-445c-8c75-cfac16ea94b0"
        def moduleSnapshotIdTwo = "4165c3e1-1561-4db2-8aab-9fce4007e88b"
        def moduleOne = getDummyModuleSnapshot(moduleSnapshotIdOne, moduleId, moduleName, workspaceId, [componentOne])
        def moduleTwo = getDummyModuleSnapshot(moduleSnapshotIdTwo, moduleId, moduleName, workspaceId, [componentTwo])

        def buildOne = getDummyBuild(workspaceId, author, BuildStatusEnum.BUILT, DeploymentStatusEnum.DEPLOYED, [moduleOne])
        def buildTwo = getDummyBuild(workspaceId, author, BuildStatusEnum.BUILT, DeploymentStatusEnum.DEPLOYED, [moduleTwo])

        def circle = getDummyCircle(circleId, author, null, workspaceId, true)

        def deploymentIdOne = "4ae67175-5625-49fd-820c-80197fa05a1f"
        def deploymentOne = getDummyDeployment(
                deploymentIdOne,
                author,
                circle,
                buildOne.id,
                workspaceId,
                LocalDateTime.of(2020, 4, 27, 12, 23),
                LocalDateTime.of(2020, 4, 27, 12, 23)
        )

        def deploymentIdTwo = "82601817-ce0c-415a-a301-d1d19dd5b221"
        def deploymentTwo = getDummyDeployment(
                deploymentIdTwo,
                author,
                circle,
                buildTwo.id,
                workspaceId,
                LocalDateTime.of(2020, 4, 27, 13, 29),
                LocalDateTime.of(2020, 4, 27, 13, 29)
        )

        when:
        def response = this.findCircleComponentsInteractor.execute(circleId, workspaceId)

        then:
        1 * this.deploymentRepository.findActiveByCircleId(circleId) >> [deploymentOne, deploymentTwo]
        1 * this.buildRepository.findById(buildOne.id) >> Optional.of(buildOne)
        1 * this.buildRepository.findById(buildTwo.id) >> Optional.of(buildTwo)

        assert response != null
        assert response.size() == 2
        assert response[0].id == componentTwo.componentId
        assert response[0].name == componentTwo.name
        assert response[0].version == componentTwo.artifact.version
        assert response[0].artifact == componentTwo.artifact.artifact
        assert response[0].module == moduleTwo.name

        assert response[1].id == componentOne.componentId
        assert response[1].name == componentOne.name
        assert response[1].version == componentOne.artifact.version
        assert response[1].artifact == componentOne.artifact.artifact
        assert response[1].module == moduleOne.name
    }

    def "should return an empty list"() {
        given:
        def circleId = "f1ce251d-80ef-4d28-b6a8-8e1363c74f66"
        def workspaceId = "0f996233-b4c4-4e14-a822-016e1cdf0f8a"

        when:
        def response = this.findCircleComponentsInteractor.execute(circleId, workspaceId)

        then:
        1 * this.deploymentRepository.findActiveByCircleId(circleId) >> []

        assert response != null
        assert response.size() == 0
    }

    private Deployment getDummyDeployment(String deploymentId, User user, Circle circle, String buildId, String workspaceId,
                                          LocalDateTime createdAt, LocalDateTime deployedAt) {
        new Deployment(
                deploymentId,
                user,
                createdAt,
                deployedAt,
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

    private ComponentSnapshot getDummyComponentSnapshot(String id, String name, String componentId, String workspaceId, ArtifactSnapshot artifact) {
        return new ComponentSnapshot(id, componentId,
                name, LocalDateTime.now(), artifact,
                workspaceId, '3e1f3969-c6ec-4a44-96a0-101d45b668e7', 'host', 'gateway')
    }

    private ModuleSnapshot getDummyModuleSnapshot(String id, String moduleId, String name, String workspaceId, List<ComponentSnapshot> componentSnapshotList) {
        return new ModuleSnapshot(id, moduleId, name, 'https://git-repository-address.com', LocalDateTime.now(), 'https://helm-repository.com',
                componentSnapshotList, workspaceId, '3e25a77e-5f14-45f3-9ae7-c25c00ad9ca6')
    }

    private Build getDummyBuild(String workspaceId, User author, BuildStatusEnum buildStatusEnum, DeploymentStatusEnum deploymentStatusEnum, List<ModuleSnapshot> moduleSnapshotList) {
        def featureSnapshotList = new ArrayList<FeatureSnapshot>()
        featureSnapshotList.add(new FeatureSnapshot('3e25a77e-5f14-45f3-9ae7-c25c00ad9ca6', 'cc869c36-311c-4523-ba5b-7b69286e0df4',
                'Feature name', 'feature-branch-name', LocalDateTime.now(), author.name, author.id, moduleSnapshotList, '23f1eabd-fb57-419b-a42b-4628941e34ec'))

        def circle = new Circle('f8296cfc-6ae1-11ea-bc55-0242ac130003', 'Circle name', 'f8296df6-6ae1-11ea-bc55-0242ac130003',
                author, LocalDateTime.now(), MatcherTypeEnum.SIMPLE_KV, null, null, null, false, "1a58c78a-6acb-11ea-bc55-0242ac130003")

        def deploymentList = new ArrayList<Deployment>()
        deploymentList.add(new Deployment('f8296aea-6ae1-11ea-bc55-0242ac130003', author, LocalDateTime.now().minusDays(1),
                LocalDateTime.now(), deploymentStatusEnum, circle, '23f1eabd-fb57-419b-a42b-4628941e34ec', workspaceId))

        def build = new Build(UUID.randomUUID().toString(), author, LocalDateTime.now(), featureSnapshotList,
                'tag-name', '6181aaf1-10c4-47d8-963a-3b87186debbb', 'f53020d7-6c85-4191-9295-440a3e7c1307', buildStatusEnum,
                workspaceId, deploymentList)
        build
    }
}
