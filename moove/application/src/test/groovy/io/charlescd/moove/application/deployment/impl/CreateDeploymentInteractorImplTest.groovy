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
import io.charlescd.moove.application.deployment.CreateDeploymentInteractor
import io.charlescd.moove.application.deployment.request.CreateDeploymentRequest
import io.charlescd.moove.domain.*
import io.charlescd.moove.domain.exceptions.BusinessException
import io.charlescd.moove.domain.exceptions.NotFoundException
import io.charlescd.moove.domain.repository.*
import io.charlescd.moove.domain.service.DeployService
import spock.lang.Specification

import java.time.LocalDateTime

class CreateDeploymentInteractorImplTest extends Specification {

    private CreateDeploymentInteractor createDeploymentInteractor

    private DeploymentRepository deploymentRepository = Mock(DeploymentRepository)
    private BuildRepository buildRepository = Mock(BuildRepository)
    private UserRepository userRepository = Mock(UserRepository)
    private CircleRepository circleRepository = Mock(CircleRepository)
    private DeployService deployService = Mock(DeployService)
    private WorkspaceRepository workspaceRepository = Mock(WorkspaceRepository)

    def setup() {
        this.createDeploymentInteractor = new CreateDeploymentInteractorImpl(
                new DeploymentService(deploymentRepository),
                new BuildService(buildRepository),
                new UserService(userRepository),
                new CircleService(circleRepository),
                deployService,
                new WorkspaceService(workspaceRepository, userRepository))
    }

    def 'when build does not exist, should throw exception'() {
        given:
        def authorId = "5d4c9244-6f83-11ea-bc55-0242ac130003"
        def circleId = "5d4c9492-6f83-11ea-bc55-0242ac130003"
        def buildId = "5d4c95b4-6f83-11ea-bc55-0242ac130003"
        def workspaceId = "5d4c97da-6f83-11ea-bc55-0242ac130003"
        def createDeploymentRequest = new CreateDeploymentRequest(authorId, circleId, buildId)

        def author = getDummyUser()

        def workspace = new Workspace(workspaceId, "CharlesCD", author, LocalDateTime.now(), [],
                WorkspaceStatusEnum.COMPLETE, null, "http://matcher.com.br",
                null, "b9c8ca61-b963-499b-814d-71a66e89eabd", null)

        when:
        createDeploymentInteractor.execute(createDeploymentRequest, workspaceId)

        then:
        1 * buildRepository.find(buildId, workspaceId) >> Optional.empty()
        0 * workspaceRepository.find(workspaceId) >> Optional.of(workspace)

        def ex = thrown(NotFoundException)
        ex.resourceName == "build"
        ex.id == buildId
    }

    def 'when build can not be deployed, because status is BUILDING, should throw exception'() {
        given:
        def author = getDummyUser()
        def circleId = "5d4c9492-6f83-11ea-bc55-0242ac130003"
        def workspaceId = "5d4c97da-6f83-11ea-bc55-0242ac130003"
        def build = getDummyBuild(workspaceId, author, BuildStatusEnum.BUILDING, DeploymentStatusEnum.NOT_DEPLOYED, circleId)
        def createDeploymentRequest = new CreateDeploymentRequest(author.id, circleId, build.id)

        def workspace = new Workspace(workspaceId, "CharlesCD", author, LocalDateTime.now(), [],
                WorkspaceStatusEnum.COMPLETE, null, "http://matcher.com.br",
                null, "b9c8ca61-b963-499b-814d-71a66e89eabd", null)

        when:
        createDeploymentInteractor.execute(createDeploymentRequest, workspaceId)

        then:
        1 * buildRepository.find(build.id, workspaceId) >> Optional.of(build)
        1 * workspaceRepository.find(workspaceId) >> Optional.of(workspace)


        def ex = thrown(BusinessException)
        ex.errorCode == MooveErrorCode.DEPLOY_INVALID_BUILD
    }

    def 'when user does not exist, should throw exception'() {
        given:
        def author = getDummyUser()
        def circleId = "5d4c9492-6f83-11ea-bc55-0242ac130003"
        def workspaceId = "5d4c97da-6f83-11ea-bc55-0242ac130003"
        def build = getDummyBuild(workspaceId, author, BuildStatusEnum.BUILT, DeploymentStatusEnum.NOT_DEPLOYED, circleId)
        def createDeploymentRequest = new CreateDeploymentRequest(author.id, circleId, build.id)

        def workspace = new Workspace(workspaceId, "CharlesCD", author, LocalDateTime.now(), [],
                WorkspaceStatusEnum.COMPLETE, null, "http://matcher.com.br",
                null, "b9c8ca61-b963-499b-814d-71a66e89eabd", null)

        when:
        createDeploymentInteractor.execute(createDeploymentRequest, workspaceId)

        then:
        1 * buildRepository.find(build.id, workspaceId) >> Optional.of(build)
        1 * workspaceRepository.find(workspaceId) >> Optional.of(workspace)
        1 * userRepository.findById(author.id) >> Optional.empty()

        def ex = thrown(NotFoundException)
        ex.resourceName == "user"
        ex.id == author.id
    }

    def 'when circle does not exist, should throw exception'() {
        given:
        def author = getDummyUser()
        def circleId = "5d4c9492-6f83-11ea-bc55-0242ac130003"
        def workspaceId = "5d4c97da-6f83-11ea-bc55-0242ac130003"
        def build = getDummyBuild(workspaceId, author, BuildStatusEnum.BUILT, DeploymentStatusEnum.NOT_DEPLOYED, circleId)
        def createDeploymentRequest = new CreateDeploymentRequest(author.id, circleId, build.id)

        def workspace = new Workspace(workspaceId, "CharlesCD", author, LocalDateTime.now(), [],
                WorkspaceStatusEnum.COMPLETE, null, "http://matcher.com.br",
                null, "b9c8ca61-b963-499b-814d-71a66e89eabd", null)

        when:
        createDeploymentInteractor.execute(createDeploymentRequest, workspaceId)

        then:
        1 * buildRepository.find(build.id, workspaceId) >> Optional.of(build)
        1 * workspaceRepository.find(workspaceId) >> Optional.of(workspace)
        1 * userRepository.findById(author.id) >> Optional.of(author)
        1 * circleRepository.findById(circleId) >> Optional.empty()

        def ex = thrown(NotFoundException)
        ex.resourceName == "circle"
        ex.id == circleId
    }

    def 'when there is an active deployment in the circle and it is not default circle, should undeploy it and deploy new one'() {
        given:
        def author = getDummyUser()
        def circleId = "5d4c9492-6f83-11ea-bc55-0242ac130003"
        def workspaceId = "5d4c97da-6f83-11ea-bc55-0242ac130003"
        def build = getDummyBuild(workspaceId, author, BuildStatusEnum.BUILT, DeploymentStatusEnum.DEPLOYED, circleId)
        def createDeploymentRequest = new CreateDeploymentRequest(author.id, circleId, build.id)

        def circle = new Circle(circleId, 'Circle name', 'f8296df6-6ae1-11ea-bc55-0242ac130003',
                author, LocalDateTime.now(), MatcherTypeEnum.SIMPLE_KV, null, null, null, false, "1a58c78a-6acb-11ea-bc55-0242ac130003")

        def activeDeployment = new Deployment('3c3b864a-702e-11ea-bc55-0242ac130003', author, LocalDateTime.now().minusDays(1),
                LocalDateTime.now(), DeploymentStatusEnum.DEPLOYED, circle, '23f1eabd-fb57-419b-a42b-4628941e34ec', workspaceId, null)

        def notDeployedDeployment = new Deployment('3c3b864a-702e-11ea-bc55-0242ac130003', author, LocalDateTime.now().minusDays(2),
                LocalDateTime.now(), DeploymentStatusEnum.NOT_DEPLOYED, circle, '23f1eabd-fb57-419b-a42b-4628941e34ec', workspaceId, LocalDateTime.now())

        def workspace = new Workspace(workspaceId, "CharlesCD", author, LocalDateTime.now(), [],
                WorkspaceStatusEnum.COMPLETE, null, "http://matcher.com.br",
                null, "b9c8ca61-b963-499b-814d-71a66e89eabd", null)

        when:
        def deploymentResponse = createDeploymentInteractor.execute(createDeploymentRequest, workspaceId)

        then:
        1 * buildRepository.find(build.id, workspaceId) >> Optional.of(build)
        1 * workspaceRepository.find(workspaceId) >> Optional.of(workspace)
        1 * userRepository.findById(author.id) >> Optional.of(author)
        1 * circleRepository.findById(circleId) >> Optional.of(build.deployments[0].circle)
        1 * deploymentRepository.findByCircleIdAndWorkspaceId(build.deployments[0].circle.id, workspaceId) >> [notDeployedDeployment, activeDeployment]
        1 * deployService.undeploy(activeDeployment.id, activeDeployment.author.id)
        1 * deploymentRepository.save(_) >> _
        1 * deploymentRepository.updateStatus(activeDeployment.id, DeploymentStatusEnum.UNDEPLOYING) >> _
        1 * deployService.deploy(_, _, false, _) >> { arguments ->
            def deploymentArgument = arguments[0]
            def buildArgument = arguments[1]

            assert deploymentArgument instanceof Deployment
            assert buildArgument instanceof Build

            deploymentArgument.status == DeploymentStatusEnum.DEPLOYING
            buildArgument.id == build.id
        }

        notThrown()
        deploymentResponse.id != null
        deploymentResponse.author.createdAt != null
        deploymentResponse.status == DeploymentStatusEnum.DEPLOYING.name()
        deploymentResponse.author.id == author.id
        deploymentResponse.author.name == author.name
        deploymentResponse.author.email == author.email
        deploymentResponse.author.photoUrl == author.photoUrl
        deploymentResponse.circle.id == build.deployments[0].circle.id
        deploymentResponse.circle.name == build.deployments[0].circle.name
        deploymentResponse.circle.author.id == build.deployments[0].circle.author.id
        deploymentResponse.circle.author.name == build.deployments[0].circle.author.name
        deploymentResponse.circle.author.email == build.deployments[0].circle.author.email
        deploymentResponse.circle.author.photoUrl == build.deployments[0].circle.author.photoUrl
        deploymentResponse.circle.importedAt == build.deployments[0].circle.importedAt
        deploymentResponse.circle.importedKvRecords == build.deployments[0].circle.importedKvRecords
        deploymentResponse.circle.matcherType == build.deployments[0].circle.matcherType.name()
        deploymentResponse.circle.rules == build.deployments[0].circle.rules
        deploymentResponse.buildId == build.id
        deploymentResponse.deployedAt == null
    }

    def 'when there is an active deployment in the circle and it is default circle, should not undeploy it only deploy new one'() {
        given:
        def author = getDummyUser()
        def circle = new Circle("44406b2a-557b-45c5-91be-1e1db909b000", 'Default', 'f8296df6-6ae1-11ea-bc55-0242ac130003',
                author, LocalDateTime.now(), MatcherTypeEnum.SIMPLE_KV, null, null, null, true, "1a58c78a-6acb-11ea-bc55-0242ac130003")
        def workspaceId = "5d4c97da-6f83-11ea-bc55-0242ac130003"
        def build = getDummyBuild(workspaceId, author, BuildStatusEnum.BUILT, DeploymentStatusEnum.DEPLOYED, circle.id)
        def createDeploymentRequest = new CreateDeploymentRequest(author.id, circle.id, build.id)
        def activeDeployment = new Deployment('3c3b864a-702e-11ea-bc55-0242ac130003', author, LocalDateTime.now().minusDays(1),
                LocalDateTime.now(), DeploymentStatusEnum.DEPLOYED, circle, '23f1eabd-fb57-419b-a42b-4628941e34ec', workspaceId, null)

        def notDeployedDeployment = new Deployment('3c3b864a-702e-11ea-bc55-0242ac130003', author, LocalDateTime.now().minusDays(2),
                LocalDateTime.now(), DeploymentStatusEnum.NOT_DEPLOYED, circle, '23f1eabd-fb57-419b-a42b-4628941e34ec', workspaceId, LocalDateTime.now())

        def workspace = new Workspace(workspaceId, "CharlesCD", author, LocalDateTime.now(), [],
                WorkspaceStatusEnum.COMPLETE, null, "http://matcher.com.br",
                null, "b9c8ca61-b963-499b-814d-71a66e89eabd", null)

        when:
        def deploymentResponse = createDeploymentInteractor.execute(createDeploymentRequest, workspaceId)

        then:
        1 * buildRepository.find(build.id, workspaceId) >> Optional.of(build)
        1 * workspaceRepository.find(workspaceId) >> Optional.of(workspace)
        1 * userRepository.findById(author.id) >> Optional.of(author)
        1 * circleRepository.findById(circle.id) >> Optional.of(circle)
        0 * deployService.undeploy(_, _)
        1 * deploymentRepository.findByCircleIdAndWorkspaceId(circle.id, workspaceId) >> [notDeployedDeployment, activeDeployment]
        1 * deploymentRepository.save(_) >> _
        1 * deployService.deploy(_, _, true, _) >> { arguments ->
            def deploymentArgument = arguments[0]
            def buildArgument = arguments[1]

            assert deploymentArgument instanceof Deployment
            assert buildArgument instanceof Build

            deploymentArgument.status == DeploymentStatusEnum.DEPLOYING
            buildArgument.id == build.id
        }

        notThrown()
        deploymentResponse.id != null
        deploymentResponse.author.createdAt != null
        deploymentResponse.status == DeploymentStatusEnum.DEPLOYING.name()
        deploymentResponse.author.id == author.id
        deploymentResponse.author.name == author.name
        deploymentResponse.author.email == author.email
        deploymentResponse.author.photoUrl == author.photoUrl
        deploymentResponse.circle.id == circle.id
        deploymentResponse.circle.name == circle.name
        deploymentResponse.circle.author.id == circle.author.id
        deploymentResponse.circle.author.name == circle.author.name
        deploymentResponse.circle.author.email == circle.author.email
        deploymentResponse.circle.author.photoUrl == circle.author.photoUrl
        deploymentResponse.circle.importedAt == circle.importedAt
        deploymentResponse.circle.importedKvRecords == circle.importedKvRecords
        deploymentResponse.circle.matcherType == circle.matcherType.name()
        deploymentResponse.circle.rules == build.deployments[0].circle.rules
        deploymentResponse.buildId == build.id
        deploymentResponse.deployedAt == null
    }

    def 'when there is no active deployment in the circle and it is default circle, should not undeploy it and deploy new one'() {
        given:
        def author = getDummyUser()
        def circle = new Circle("44406b2a-557b-45c5-91be-1e1db909b000", 'Default', 'f8296df6-6ae1-11ea-bc55-0242ac130003',
                author, LocalDateTime.now(), MatcherTypeEnum.SIMPLE_KV, null, null, null, true, "1a58c78a-6acb-11ea-bc55-0242ac130003")
        def workspaceId = "5d4c97da-6f83-11ea-bc55-0242ac130003"
        def build = getDummyBuild(workspaceId, author, BuildStatusEnum.BUILT, DeploymentStatusEnum.DEPLOYED, circle.id)
        def createDeploymentRequest = new CreateDeploymentRequest(author.id, circle.id, build.id)
        def notDeployedDeployment = new Deployment('3c3b864a-702e-11ea-bc55-0242ac130003', author, LocalDateTime.now().minusDays(2),
                LocalDateTime.now(), DeploymentStatusEnum.NOT_DEPLOYED, circle, '23f1eabd-fb57-419b-a42b-4628941e34ec', workspaceId, LocalDateTime.now())

        def workspace = new Workspace(workspaceId, "CharlesCD", author, LocalDateTime.now(), [],
                WorkspaceStatusEnum.COMPLETE, null, "http://matcher.com.br",
                null, "b9c8ca61-b963-499b-814d-71a66e89eabd", null)

        when:
        def deploymentResponse = createDeploymentInteractor.execute(createDeploymentRequest, workspaceId)

        then:
        1 * buildRepository.find(build.id, workspaceId) >> Optional.of(build)
        1 * workspaceRepository.find(workspaceId) >> Optional.of(workspace)
        1 * userRepository.findById(author.id) >> Optional.of(author)
        1 * circleRepository.findById(circle.id) >> Optional.of(circle)
        0 * deployService.undeploy(_, _)
        1 * deploymentRepository.findByCircleIdAndWorkspaceId(build.deployments[0].circle.id, workspaceId) >> [notDeployedDeployment]
        1 * deploymentRepository.save(_) >> _
        1 * deployService.deploy(_, _, true, _) >> { arguments ->
            def deploymentArgument = arguments[0]
            def buildArgument = arguments[1]

            assert deploymentArgument instanceof Deployment
            assert buildArgument instanceof Build

            deploymentArgument.status == DeploymentStatusEnum.DEPLOYING
            buildArgument.id == build.id
        }

        notThrown()
        deploymentResponse.id != null
        deploymentResponse.author.createdAt != null
        deploymentResponse.status == DeploymentStatusEnum.DEPLOYING.name()
        deploymentResponse.author.id == author.id
        deploymentResponse.author.name == author.name
        deploymentResponse.author.email == author.email
        deploymentResponse.author.photoUrl == author.photoUrl
        deploymentResponse.circle.id == circle.id
        deploymentResponse.circle.name == circle.name
        deploymentResponse.circle.author.id == circle.author.id
        deploymentResponse.circle.author.name == circle.author.name
        deploymentResponse.circle.author.email == circle.author.email
        deploymentResponse.circle.author.photoUrl == circle.author.photoUrl
        deploymentResponse.circle.importedAt == circle.importedAt
        deploymentResponse.circle.importedKvRecords == circle.importedKvRecords
        deploymentResponse.circle.matcherType == circle.matcherType.name()
        deploymentResponse.circle.rules == build.deployments[0].circle.rules
        deploymentResponse.buildId == build.id
        deploymentResponse.deployedAt == null
    }

    def 'when there is no active deployment in the circle and it is not default circle, should not undeploy it and deploy new one'() {
        given:
        def author = getDummyUser()
        def circleId = "5d4c9492-6f83-11ea-bc55-0242ac130003"
        def workspaceId = "5d4c97da-6f83-11ea-bc55-0242ac130003"
        def build = getDummyBuild(workspaceId, author, BuildStatusEnum.BUILT, DeploymentStatusEnum.DEPLOYED, circleId)
        def createDeploymentRequest = new CreateDeploymentRequest(author.id, circleId, build.id)

        def circle = new Circle(circleId, 'Circle name', 'f8296df6-6ae1-11ea-bc55-0242ac130003',
                author, LocalDateTime.now(), MatcherTypeEnum.SIMPLE_KV, null, null, null, false, "1a58c78a-6acb-11ea-bc55-0242ac130003")

        def notDeployedDeployment = new Deployment('3c3b864a-702e-11ea-bc55-0242ac130003', author, LocalDateTime.now().minusDays(2),
                LocalDateTime.now(), DeploymentStatusEnum.NOT_DEPLOYED, circle, '23f1eabd-fb57-419b-a42b-4628941e34ec', workspaceId, LocalDateTime.now())

        def workspace = new Workspace(workspaceId, "CharlesCD", author, LocalDateTime.now(), [],
                WorkspaceStatusEnum.COMPLETE, null, "http://matcher.com.br",
                null, "b9c8ca61-b963-499b-814d-71a66e89eabd", null)

        when:
        def deploymentResponse = createDeploymentInteractor.execute(createDeploymentRequest, workspaceId)

        then:
        1 * buildRepository.find(build.id, workspaceId) >> Optional.of(build)
        1 * workspaceRepository.find(workspaceId) >> Optional.of(workspace)
        1 * userRepository.findById(author.id) >> Optional.of(author)
        1 * circleRepository.findById(circleId) >> Optional.of(build.deployments[0].circle)
        0 * deployService.undeploy(_, _)
        1 * deploymentRepository.findByCircleIdAndWorkspaceId(build.deployments[0].circle.id, workspaceId) >> [notDeployedDeployment]
        1 * deploymentRepository.save(_) >> _
        1 * deployService.deploy(_, _, false, _) >> { arguments ->
            def deploymentArgument = arguments[0]
            def buildArgument = arguments[1]

            assert deploymentArgument instanceof Deployment
            assert buildArgument instanceof Build

            deploymentArgument.status == DeploymentStatusEnum.DEPLOYING
            buildArgument.id == build.id
        }

        notThrown()
        deploymentResponse.id != null
        deploymentResponse.author.createdAt != null
        deploymentResponse.status == DeploymentStatusEnum.DEPLOYING.name()
        deploymentResponse.author.id == author.id
        deploymentResponse.author.name == author.name
        deploymentResponse.author.email == author.email
        deploymentResponse.author.photoUrl == author.photoUrl
        deploymentResponse.circle.id == build.deployments[0].circle.id
        deploymentResponse.circle.name == build.deployments[0].circle.name
        deploymentResponse.circle.author.id == build.deployments[0].circle.author.id
        deploymentResponse.circle.author.name == build.deployments[0].circle.author.name
        deploymentResponse.circle.author.email == build.deployments[0].circle.author.email
        deploymentResponse.circle.author.photoUrl == build.deployments[0].circle.author.photoUrl
        deploymentResponse.circle.importedAt == build.deployments[0].circle.importedAt
        deploymentResponse.circle.importedKvRecords == build.deployments[0].circle.importedKvRecords
        deploymentResponse.circle.matcherType == build.deployments[0].circle.matcherType.name()
        deploymentResponse.circle.rules == build.deployments[0].circle.rules
        deploymentResponse.buildId == build.id
        deploymentResponse.deployedAt == null
    }

    private static User getDummyUser() {
        new User('4e806b2a-557b-45c5-91be-1e1db909bef6', 'User name', 'user@email.com', 'user.photo.png',
                new ArrayList<Workspace>(), false, LocalDateTime.now())
    }

    private static Build getDummyBuild(String workspaceId, User author, BuildStatusEnum buildStatusEnum,
                                       DeploymentStatusEnum deploymentStatusEnum, String circleId) {
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

        def circle = new Circle(circleId, 'Circle name', 'f8296df6-6ae1-11ea-bc55-0242ac130003',
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
