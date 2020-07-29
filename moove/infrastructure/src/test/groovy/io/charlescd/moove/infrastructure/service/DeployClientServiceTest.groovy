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

package io.charlescd.moove.infrastructure.service

import io.charlescd.moove.domain.*
import io.charlescd.moove.domain.service.DeployService
import io.charlescd.moove.infrastructure.service.client.DeployClient
import io.charlescd.moove.infrastructure.service.client.DeployRequest
import io.charlescd.moove.infrastructure.service.client.GetDeployCdConfigurationsResponse
import io.charlescd.moove.infrastructure.service.client.UndeployRequest
import org.springframework.test.util.ReflectionTestUtils
import spock.lang.Specification

import java.time.LocalDateTime

class DeployClientServiceTest extends Specification {
    private DeployService deployClientService

    private DeployClient deployClient = Mock(DeployClient)

    void setup() {
        this.deployClientService = new DeployClientService(deployClient)
        ReflectionTestUtils.setField(deployClientService, 'APPLICATION_BASE_PATH', 'http://localhost:8080')
    }

    def 'when circle is default, should call method to deploy into default circle'() {
        given:
        def workspaceId = '44446b2a-557b-45c5-91be-1e1db9095556'
        def user = getDummyUser()
        def circle = getDummyCircle('Default', user, true)
        def build = getDummyBuild(user, circle, workspaceId)
        def deployment = getDummyDeployment('1fe2b392-726d-11ea-bc55-0242ac130003', DeploymentStatusEnum.DEPLOYING,
                user, circle, workspaceId)

        when:
        deployClientService.deploy(deployment, build, circle.isDefaultCircle(), "f9927ee7-6589-4f17-9d92-e51877aad51b")

        then:
        0 * deployClient.deployInSegmentedCircle(_)
        1 * deployClient.deployInDefaultCircle(_) >> { arguments ->
            def deployRequest = arguments[0]
            assert deployRequest instanceof DeployRequest

            assert deployRequest.deploymentId == deployment.id
            assert deployRequest.applicationName == build.workspaceId
            assert deployRequest.authorId == deployment.author.id
            assert deployRequest.description != null
            assert deployRequest.circle == null
            assert deployRequest.callbackUrl.contains('http://localhost:8080/v2/deployments/1fe2b392-726d-11ea-bc55-0242ac130003/callback')
            assert deployRequest.modules.size() == 2

            assert deployRequest.modules[0].moduleId == build.features[0].modules[0].moduleId
            assert deployRequest.modules[0].helmRepository == build.features[0].modules[0].helmRepository
            assert deployRequest.modules[0].components.size() == 1
            assert deployRequest.modules[0].components[0].componentId == build.features[0].modules[0].components[0].componentId
            assert deployRequest.modules[0].components[0].componentName == build.features[0].modules[0].components[0].name
            assert deployRequest.modules[0].components[0].buildImageTag == build.features[0].modules[0].components[0].artifact.version
            assert deployRequest.modules[0].components[0].buildImageUrl == build.features[0].modules[0].components[0].artifact.artifact

            assert deployRequest.modules[1].moduleId == build.features[1].modules[0].moduleId
            assert deployRequest.modules[1].helmRepository == build.features[1].modules[0].helmRepository
            assert deployRequest.modules[1].components.size() == 1
            assert deployRequest.modules[1].components[0].componentId == build.features[1].modules[0].components[0].componentId
            assert deployRequest.modules[1].components[0].componentName == build.features[1].modules[0].components[0].name
            assert deployRequest.modules[1].components[0].buildImageTag == build.features[1].modules[0].components[0].artifact.version
            assert deployRequest.modules[1].components[0].buildImageUrl == build.features[1].modules[0].components[0].artifact.artifact
        }
    }

    def 'when circle is not default, should call method to deploy into segmented circle'() {
        given:
        def workspaceId = '44446b2a-557b-45c5-91be-1e1db9095556'
        def user = getDummyUser()
        def circle = getDummyCircle('Circle Name', user, false)
        def build = getDummyBuild(user, circle, workspaceId)
        def deployment = getDummyDeployment('1fe2b392-726d-11ea-bc55-0242ac130003', DeploymentStatusEnum.DEPLOYING,
                user, circle, workspaceId)

        when:
        deployClientService.deploy(deployment, build, circle.isDefaultCircle(), "f9927ee7-6589-4f17-9d92-e51877aad51b")

        then:
        0 * deployClient.deployInDefaultCircle(_)
        1 * deployClient.deployInSegmentedCircle(_) >> { arguments ->
            def deployRequest = arguments[0]
            assert deployRequest instanceof DeployRequest

            assert deployRequest.deploymentId == deployment.id
            assert deployRequest.applicationName == build.workspaceId
            assert deployRequest.authorId == deployment.author.id
            assert deployRequest.description != null

            assert deployRequest.circle != null
            assert deployRequest.circle.headerValue == circle.id
            assert deployRequest.circle.removeCircle == null

            assert deployRequest.callbackUrl.contains('http://localhost:8080/v2/deployments/1fe2b392-726d-11ea-bc55-0242ac130003/callback')
            assert deployRequest.modules.size() == 2

            assert deployRequest.modules[0].moduleId == build.features[0].modules[0].moduleId
            assert deployRequest.modules[0].helmRepository == build.features[0].modules[0].helmRepository
            assert deployRequest.modules[0].components.size() == 1
            assert deployRequest.modules[0].components[0].componentId == build.features[0].modules[0].components[0].componentId
            assert deployRequest.modules[0].components[0].componentName == build.features[0].modules[0].components[0].name
            assert deployRequest.modules[0].components[0].buildImageTag == build.features[0].modules[0].components[0].artifact.version
            assert deployRequest.modules[0].components[0].buildImageUrl == build.features[0].modules[0].components[0].artifact.artifact

            assert deployRequest.modules[1].moduleId == build.features[1].modules[0].moduleId
            assert deployRequest.modules[1].helmRepository == build.features[1].modules[0].helmRepository
            assert deployRequest.modules[1].components.size() == 1
            assert deployRequest.modules[1].components[0].componentId == build.features[1].modules[0].components[0].componentId
            assert deployRequest.modules[1].components[0].componentName == build.features[1].modules[0].components[0].name
            assert deployRequest.modules[1].components[0].buildImageTag == build.features[1].modules[0].components[0].artifact.version
            assert deployRequest.modules[1].components[0].buildImageUrl == build.features[1].modules[0].components[0].artifact.artifact
        }
    }

    def 'when getting cd configuration by id, if it exists should return id'() {
        given:
        def workspaceId = '44446b2a-557b-45c5-91be-1e1db9095556'
        def cdConfigurationId = '44446b2a-557b-45c5-91be-1e1db9095556'
        def cdConfigurationName = "cd-configuration-name"
        def responseFromDeploy = [new GetDeployCdConfigurationsResponse(cdConfigurationId, cdConfigurationName, "authorId", workspaceId,
                LocalDateTime.now()), new GetDeployCdConfigurationsResponse("gitConfigurationId", "name2", "authorId2", workspaceId,
                LocalDateTime.now())]

        when:
        def response = deployClientService.getCdConfiguration(workspaceId, cdConfigurationId)

        then:
        1 * deployClient.getCdConfigurations(workspaceId) >> responseFromDeploy

        response != null
        response.id == cdConfigurationId
        response.name == cdConfigurationName
    }

    def 'when getting cd configuration by id, if it does not exist should return null'() {
        given:
        def workspaceId = '44446b2a-557b-45c5-91be-1e1db9095556'
        def cdConfigurationId = '44446b2a-557b-45c5-91be-1e1db9095556'
        def responseFromDeploy = [new GetDeployCdConfigurationsResponse("cdConfigurationId", "cdConfigurationName", "authorId", workspaceId,
                LocalDateTime.now()), new GetDeployCdConfigurationsResponse("gitConfigurationId", "name2", "authorId2", workspaceId,
                LocalDateTime.now())]

        when:
        def response = deployClientService.getCdConfiguration(workspaceId, cdConfigurationId)

        then:
        1 * deployClient.getCdConfigurations(workspaceId) >> responseFromDeploy

        response == null
    }

    def 'when undeploy should call undeploy client'() {
        given:
        def workspaceId = '44446b2a-557b-45c5-91be-1e1db9095556'
        def user = getDummyUser()
        def circle = getDummyCircle('Default', user, true)
        def build = getDummyBuild(user, circle, workspaceId)
        def deployment = getDummyDeployment('1fe2b392-726d-11ea-bc55-0242ac130003', DeploymentStatusEnum.DEPLOYING,
                user, circle, workspaceId)
        def undeployRequestCompare = new UndeployRequest("author-id",deployment.id)

        when:
        deployClientService.undeploy(deployment.id,"author-id")

        then:
        1 * deployClient.undeploy(_) >> { arguments ->
            def undeployRequest = arguments[0]
            assert undeployRequest instanceof UndeployRequest
            assert undeployRequest.authorId == undeployRequestCompare.authorId
            assert undeployRequest.deploymentId == undeployRequestCompare.deploymentId
        }
    }

    private Build getDummyBuild(User user, Circle circle, String workspaceId) {
        def featureSnapshotList = getDummyFeatures(workspaceId, user)

        def deploymentList = new ArrayList<Deployment>()
        deploymentList.add(getDummyDeployment('f8296aea-6ae1-11ea-bc55-0242ac130003', DeploymentStatusEnum.UNDEPLOYING, user, circle, workspaceId))
        deploymentList.add(getDummyDeployment('1fe2b464-726d-11ea-bc55-0242ac130003', DeploymentStatusEnum.NOT_DEPLOYED, user, circle, workspaceId))

        return new Build('23f1eabd-fb57-419b-a42b-4628941e34ec', user, LocalDateTime.now(), featureSnapshotList,
                'tag-name', '6181aaf1-10c4-47d8-963a-3b87186debbb', 'f53020d7-6c85-4191-9295-440a3e7c1307', BuildStatusEnum.BUILT,
                workspaceId, deploymentList)
    }

    private ArrayList<FeatureSnapshot> getDummyFeatures(String workspaceId, User author) {
        def featureSnapshotList = new ArrayList<FeatureSnapshot>()

        def artifactSnapshotX = getDummyArtifactSnapshot('2884a5e0-7278-11ea-bc55-0242ac130003', 'artifact-name-1',
                'artifact-version-1', '70189ffc-b517-4719-8e20-278a7e5f9b33')

        def componentSnapshotListFeatureX = new ArrayList<ComponentSnapshot>()
        componentSnapshotListFeatureX.add(getDummyComponentSnapshot(workspaceId, '70189ffc-b517-4719-8e20-278a7e5f9b33',
                '20209ffc-b517-4719-8e20-278a7e5f9b00', 'test-application', '3e1f3969-c6ec-4a44-96a0-101d45b668e7', artifactSnapshotX))

        def moduleSnapshotXList = new ArrayList<ModuleSnapshot>()
        moduleSnapshotXList.add(getDummyModuleSnapshot('3e1f3969-c6ec-4a44-96a0-101d45b668e7', '000f3969-c6ec-4a44-96a0-101d45b668e7',
                'Module Snapshot Name', '3e25a77e-5f14-45f3-9ae7-c25c00ad9ca6', componentSnapshotListFeatureX, workspaceId))

        featureSnapshotList.add(getDummyFeatureSnapshot('3e25a77e-5f14-45f3-9ae7-c25c00ad9ca6', 'cc869c36-311c-4523-ba5b-7b69286e0df4',
                'Feature X', 'feature-x-branch-name', author, moduleSnapshotXList))

        def artifactSnapshotY = getDummyArtifactSnapshot('2884a860-7278-11ea-bc55-0242ac130003', 'artifact-name-2',
                'artifact-version-2', '7517be08-726c-11ea-bc55-0242ac130003')

        def componentSnapshotListFeatureY = new ArrayList<ComponentSnapshot>()
        componentSnapshotListFeatureY.add(getDummyComponentSnapshot(workspaceId, '7517be08-726c-11ea-bc55-0242ac130003',
                '7517c01a-726c-11ea-bc55-0242ac130003', 'lorem-application', '7517c10a-726c-11ea-bc55-0242ac130003', artifactSnapshotY))

        def moduleSnapshotYList = new ArrayList<ModuleSnapshot>()
        moduleSnapshotYList.add(getDummyModuleSnapshot('7517c1e6-726c-11ea-bc55-0242ac130003', '7517c2b8-726c-11ea-bc55-0242ac130003',
                'Module Lorem Snapshot Name', '1fe2ac1c-726d-11ea-bc55-0242ac130003', componentSnapshotListFeatureY, workspaceId))

        featureSnapshotList.add(getDummyFeatureSnapshot('1fe2ac1c-726d-11ea-bc55-0242ac130003', '1fe2b2c0-726d-11ea-bc55-0242ac130003',
                'Feature Y', 'feature-y-branch-name', author, moduleSnapshotYList))

        featureSnapshotList
    }

    private FeatureSnapshot getDummyFeatureSnapshot(String id, String featureId, String name, String branchName,
                                                    User author, ArrayList<ModuleSnapshot> moduleSnapshotList) {
        new FeatureSnapshot(id, featureId,
                name, branchName, LocalDateTime.now(), author.name, author.id,
                moduleSnapshotList, '23f1eabd-fb57-419b-a42b-4628941e34ec')
    }

    private Deployment getDummyDeployment(String id, DeploymentStatusEnum deploymentStatus, User author, Circle circle, String workspaceId) {
        new Deployment(id, author, LocalDateTime.now().minusDays(1),
                LocalDateTime.now(), deploymentStatus, circle, '23f1eabd-fb57-419b-a42b-4628941e34ec', workspaceId)
    }

    private ModuleSnapshot getDummyModuleSnapshot(String id, String moduleId, String name, String featureSnapshotId,
                                                  ArrayList<ComponentSnapshot> componentSnapshotList, String workspaceId) {
        new ModuleSnapshot(id, moduleId, name, 'https://git-repository-address.com', LocalDateTime.now(), 'https://helm-repository.com',
                componentSnapshotList, workspaceId, featureSnapshotId)
    }

    private User getDummyUser() {
        new User('4e806b2a-557b-45c5-91be-1e1db909bef6', 'User name', 'user@email.com', 'user.photo.png',
                new ArrayList<Workspace>(), false, LocalDateTime.now())
    }

    private ComponentSnapshot getDummyComponentSnapshot(String workspaceId, String id, String componentId, String name,
                                                        String moduleSnapshotId, ArtifactSnapshot artifact) {
        new ComponentSnapshot(id, componentId, name, LocalDateTime.now(), artifact,
                workspaceId, moduleSnapshotId, 'host', 'gateway')
    }

    private ArtifactSnapshot getDummyArtifactSnapshot(String id, String artifact, String version, String componentSnapshotId) {
        new ArtifactSnapshot(id, artifact, version, componentSnapshotId, LocalDateTime.now())
    }

    private Circle getDummyCircle(String name, User author, Boolean isDefault) {
        new Circle('w8296aea-6ae1-44ea-bc55-0242ac13000w', name, 'f8296df6-6ae1-11ea-bc55-0242ac130003',
                author, LocalDateTime.now(), MatcherTypeEnum.SIMPLE_KV, null, null, null, isDefault, "44446b2a-557b-45c5-91be-1e1db9095556")
    }
}
