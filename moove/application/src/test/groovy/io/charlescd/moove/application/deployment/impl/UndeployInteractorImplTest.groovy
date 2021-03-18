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

package io.charlescd.moove.application.deployment.impl

import io.charlescd.moove.application.*
import io.charlescd.moove.application.deployment.UndeployInteractor
import io.charlescd.moove.domain.*
import io.charlescd.moove.domain.exceptions.NotFoundException
import io.charlescd.moove.domain.repository.*
import io.charlescd.moove.domain.service.DeployService
import io.charlescd.moove.domain.service.HermesService
import io.charlescd.moove.domain.service.ManagementUserSecurityService
import org.springframework.dao.DuplicateKeyException
import scalaz.concurrent.Run
import spock.lang.Specification

import java.time.LocalDateTime

class UndeployInteractorImplTest extends Specification {

    private  UndeployInteractor undeployInteractor

    private DeploymentRepository deploymentRepository = Mock(DeploymentRepository)
    private BuildRepository buildRepository = Mock(BuildRepository)
    private UserRepository userRepository = Mock(UserRepository)
    private DeployService deployService = Mock(DeployService)
    private ManagementUserSecurityService managementUserSecurityService = Mock(ManagementUserSecurityService)
    private HermesService hermesService = Mock(HermesService)

    def setup() {
        this.undeployInteractor = new  UndeployInteractorImpl(
                new DeploymentService(deploymentRepository),
                new UserService(userRepository, managementUserSecurityService),
                deployService,
                new WebhookEventService(hermesService, new BuildService(buildRepository)))
    }

    def 'when deploy does not exist, should throw exception and notify hermes'() {
        given:
        def id = "5d4c95b4-6f83-11ea-bc55-0242ac130003"
        def workspaceId = TestUtils.workspaceId
        def authorization = TestUtils.authorization

        when:
        undeployInteractor.execute(workspaceId, authorization, id)

        then:
        1 * deploymentRepository.find(id, workspaceId) >> Optional.empty()
        1 * hermesService.notifySubscriptionEvent(_)

        thrown(NotFoundException)
    }

    def 'when undeploy has successful should not throw exception and notify'() {
        given:
        def workspaceId = TestUtils.workspaceId
        def authorization = TestUtils.authorization
        def build = getDummyBuild(BuildStatusEnum.BUILT, DeploymentStatusEnum.DEPLOYED, false)
        def author = TestUtils.user

        when:
        undeployInteractor.execute(workspaceId, authorization, deploymentId)

        then:
        1 * deploymentRepository.find(deploymentId, workspaceId) >> Optional.of(getDummyDeployment())
        1 * buildRepository.findById(buildId) >> Optional.of(build)
        1 * deployService.undeploy(deploymentId, author.id)
        1 * managementUserSecurityService.getUserEmail(authorization) >> author.email
        1 * userRepository.findByEmail(author.email) >> Optional.of(author)
        1 * hermesService.notifySubscriptionEvent(_)
        1 * deploymentRepository.update(_)

       notThrown()
    }

    def 'when undeploy has error should throw exception and notify'() {
        given:
        def workspaceId = TestUtils.workspaceId
        def authorization = TestUtils.authorization
        def build = getDummyBuild(BuildStatusEnum.BUILT, DeploymentStatusEnum.DEPLOYED, false)
        def author = TestUtils.user

        when:
        undeployInteractor.execute(workspaceId, authorization, deploymentId)

        then:
        1 * deploymentRepository.find(deploymentId, workspaceId) >> Optional.of(getDummyDeployment())
        1 * buildRepository.findById(buildId) >> Optional.of(build)
        1 * deployService.undeploy(deploymentId, author.id) >> {
            throw new RuntimeException("Error")
        }
        1 * managementUserSecurityService.getUserEmail(authorization) >> author.email
        1 * userRepository.findByEmail(author.email) >> Optional.of(author)
        1 * hermesService.notifySubscriptionEvent(_)
        1 * deploymentRepository.update(_)

        thrown(RuntimeException)
    }

    private static Deployment getDummyDeployment() {
        return new Deployment(
                deploymentId,
                TestUtils.getUser(),
                LocalDateTime.now(),
                LocalDateTime.now(),
                DeploymentStatusEnum.DEPLOYED,
                getCircle(false),
                buildId,
                TestUtils.workspaceId,
                null
        )
    }

    private static Build getDummyBuild(BuildStatusEnum buildStatusEnum,
                                       DeploymentStatusEnum deploymentStatusEnum, Boolean isDefaultCircle) {

        def author = TestUtils.user
        def workspaceId =  TestUtils.workspaceId

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

        def deploymentList = new ArrayList<Deployment>()
        def undeployedAt = deploymentStatusEnum == DeploymentStatusEnum.NOT_DEPLOYED ? LocalDateTime.now() : null
        deploymentList.add(getDeployment(deploymentStatusEnum, LocalDateTime.now().minusDays(1), undeployedAt, isDefaultCircle))

        def build = new Build(buildId, author, LocalDateTime.now(), featureSnapshotList,
                'tag-name', '6181aaf1-10c4-47d8-963a-3b87186debbb', 'f53020d7-6c85-4191-9295-440a3e7c1307', buildStatusEnum,
                workspaceId, deploymentList)
        build
    }

    private static Circle getCircle(Boolean defaultCircle) {
        return new Circle("5d4c9492-6f83-11ea-bc55-0242ac130003", 'Circle name', 'f8296df6-6ae1-11ea-bc55-0242ac130003',
                TestUtils.user, LocalDateTime.now(), MatcherTypeEnum.SIMPLE_KV, null, null, null, defaultCircle, TestUtils.workspaceId, null)
    }

    private static String getBuildId() {
        return "5d4c9492-6f83-11ea-bc55-0242ac130003"
    }

    private static String getDeploymentId() {
        return "5d4c95b4-6f83-11ea-bc55-0242ac130003"
    }

    private static Deployment getDeployment(DeploymentStatusEnum status, LocalDateTime deployedAt, LocalDateTime undeployAt, Boolean isDefaultCircle) {
        return new Deployment('3c3b864a-702e-11ea-bc55-0242ac130003', TestUtils.user,
                LocalDateTime.now(), deployedAt, status, getCircle(isDefaultCircle), buildId, TestUtils.workspaceId, undeployAt)
    }
}
