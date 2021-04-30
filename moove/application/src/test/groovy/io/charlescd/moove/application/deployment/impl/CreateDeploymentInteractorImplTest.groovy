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
import io.charlescd.moove.domain.service.HermesService
import io.charlescd.moove.domain.service.ManagementUserSecurityService
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
    private DeploymentConfigurationRepository deploymentConfigurationRepository = Mock(DeploymentConfigurationRepository)
    private ManagementUserSecurityService managementUserSecurityService = Mock(ManagementUserSecurityService)
    private HermesService hermesService = Mock(HermesService)

    def setup() {
        this.createDeploymentInteractor = new CreateDeploymentInteractorImpl(
                new DeploymentService(deploymentRepository),
                new BuildService(buildRepository),
                new UserService(userRepository, managementUserSecurityService),
                new CircleService(circleRepository),
                deployService,
                new WorkspaceService(workspaceRepository, userRepository),
                new DeploymentConfigurationService(deploymentConfigurationRepository),
                new WebhookEventService(hermesService, new BuildService(buildRepository))
        )
    }

    def 'when build does not exist, should throw exception and notify hermes'() {
        given:
        def circleId = TestUtils.circle.id
        def buildId = "5d4c95b4-6f83-11ea-bc55-0242ac130003"
        def workspaceId = TestUtils.workspaceId
        def authorization = TestUtils.authorization
        def createDeploymentRequest = new CreateDeploymentRequest(circleId, buildId)
        def workspace = TestUtils.workspace

        when:
        createDeploymentInteractor.execute(createDeploymentRequest, workspaceId, authorization)

        then:
        1 * buildRepository.find(buildId, workspaceId) >> Optional.empty()
        0 * workspaceRepository.find(workspaceId) >> Optional.of(workspace)
        1 * hermesService.notifySubscriptionEvent(_)

        def ex = thrown(NotFoundException)
        ex.resourceName == "build"
        ex.id == buildId
    }

    def 'when build can not be deployed, because status is BUILDING, should throw exception'() {
        given:
        def author = TestUtils.user
        def circleId = TestUtils.circle.id
        def circle = TestUtils.circle
        def workspaceId = TestUtils.workspaceId
        def deploymentConfigId = TestUtils.deploymentConfigId
        def authorization = TestUtils.authorization
        def build = getDummyBuild(BuildStatusEnum.BUILDING, DeploymentStatusEnum.NOT_DEPLOYED, false)
        def createDeploymentRequest = new CreateDeploymentRequest(circleId, build.id)

        def workspace = TestUtils.workspace
        def deploymentConfig = TestUtils.deploymentConfig

        when:
        createDeploymentInteractor.execute(createDeploymentRequest, workspaceId, authorization)

        then:
        1 * managementUserSecurityService.getUserEmail(authorization) >> author.email
        1 * userRepository.findByEmail(author.email) >> Optional.of(author)
        1 * buildRepository.findById(build.id) >> Optional.of(build)
        1 * buildRepository.find(build.id, workspaceId) >> Optional.of(build)
        1 * workspaceRepository.find(workspaceId) >> Optional.of(workspace)
        1 * deploymentConfigurationRepository.find(deploymentConfigId) >> Optional.of(deploymentConfig)
        1 * circleRepository.findById(circleId) >> Optional.of(circle)
        1 * hermesService.notifySubscriptionEvent(_)

        def ex = thrown(BusinessException)
        ex.errorCode == MooveErrorCode.DEPLOY_INVALID_BUILD
    }

    def 'when user does not exist, should throw exception'() {
        given:
        def author = TestUtils.user
        def circleId = TestUtils.circle.id
        def workspaceId = TestUtils.workspaceId
        def deploymentConfigId = TestUtils.deploymentConfigId
        def authorization = TestUtils.authorization
        def build = getDummyBuild(BuildStatusEnum.BUILDING, DeploymentStatusEnum.NOT_DEPLOYED, false)
        def createDeploymentRequest = new CreateDeploymentRequest(circleId, build.id)

        def workspace = TestUtils.workspace
        def deploymentConfig = TestUtils.deploymentConfig

        when:
        createDeploymentInteractor.execute(createDeploymentRequest, workspaceId, authorization)

        then:
        1 * managementUserSecurityService.getUserEmail(authorization) >> author.email
        1 * userRepository.findByEmail(author.email) >> Optional.empty()
        1 * buildRepository.find(build.id, workspaceId) >> Optional.of(build)
        1 * workspaceRepository.find(workspaceId) >> Optional.of(workspace)
        0 * deploymentConfigurationRepository.find(deploymentConfigId) >> Optional.of(deploymentConfig)

        def ex = thrown(NotFoundException)
        ex.resourceName == "user"
    }

    def 'when circle does not exist, should throw exception'() {
        given:
        def authorization = TestUtils.authorization
        def author = TestUtils.user
        def circleId = "5d4c9492-6f83-11ea-bc55-0242ac130003"
        def workspaceId = TestUtils.workspaceId
        def deploymentConfigId = TestUtils.deploymentConfigId
        def build = getDummyBuild(BuildStatusEnum.BUILT, DeploymentStatusEnum.NOT_DEPLOYED, false)
        def createDeploymentRequest = new CreateDeploymentRequest(circleId, build.id)

        def workspace = TestUtils.workspace
        def deploymentConfig = TestUtils.deploymentConfig

        when:
        createDeploymentInteractor.execute(createDeploymentRequest, workspaceId, authorization)

        then:
        1 * buildRepository.find(build.id, workspaceId) >> Optional.of(build)
        1 * workspaceRepository.find(workspaceId) >> Optional.of(workspace)
        1 * managementUserSecurityService.getUserEmail(authorization) >> author.email
        1 * userRepository.findByEmail(author.email) >> Optional.of(author)
        1 * deploymentConfigurationRepository.find(deploymentConfigId) >> Optional.of(deploymentConfig)
        1 * circleRepository.findById(circleId) >> Optional.empty()

        def ex = thrown(NotFoundException)
        ex.resourceName == "circle"
        ex.id == circleId
    }

    def 'when all arguments are correct for a circle deployment, should return the correct response'() {
        given:

        def circle = getCircle(false);
        def authorization = TestUtils.authorization
        def author = TestUtils.user
        def workspaceId = TestUtils.workspaceId
        def deploymentConfigId = TestUtils.deploymentConfigId
        def build = getDummyBuild(BuildStatusEnum.BUILT, DeploymentStatusEnum.DEPLOYED, false)
        def createDeploymentRequest = new CreateDeploymentRequest(circleId, build.id)

        def workspace = TestUtils.workspace
        def deploymentConfig = TestUtils.deploymentConfig

        when:
        def deploymentResponse = createDeploymentInteractor.execute(createDeploymentRequest, workspaceId, authorization)

        then:
        1 * buildRepository.find(build.id, workspaceId) >> Optional.of(build)
        1 * workspaceRepository.find(workspaceId) >> Optional.of(workspace)
        1 * managementUserSecurityService.getUserEmail(authorization) >> author.email
        1 * userRepository.findByEmail(author.email) >> Optional.of(author)
        1 * deploymentConfigurationRepository.find(deploymentConfigId) >> Optional.of(deploymentConfig)
        1 * circleRepository.findById(circleId) >> Optional.of(build.deployments[0].circle)
        1 * buildRepository.findById(build.id) >> Optional.of(build)
        1 * hermesService.notifySubscriptionEvent(_)
        1 * deploymentRepository.save(_) >> _
        1 * deployService.deploy(_, _, false, _) >> { arguments ->
            def deploymentArgument = arguments[0]
            def buildArgument = arguments[1]
            def configArgument = arguments[3]

            assert deploymentArgument instanceof Deployment
            assert buildArgument instanceof Build
            assert configArgument instanceof DeploymentConfiguration

            deploymentArgument.status == DeploymentStatusEnum.DEPLOYING
            buildArgument.id == build.id
            configArgument.id == deploymentConfig.id
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

    def 'when all arguments are correct for a default deployment, should return the correct response'() {
        given:
        def author = getDummyUser()
        def circle = getCircle(true)
        def workspaceId = TestUtils.workspaceId
        def deploymentConfigId = TestUtils.deploymentConfigId
        def build = getDummyBuild(BuildStatusEnum.BUILT, DeploymentStatusEnum.DEPLOYED, true)
        def createDeploymentRequest = new CreateDeploymentRequest(circle.id, build.id)
        def authorization = TestUtils.authorization
        def workspace = TestUtils.workspace
        def deploymentConfig = TestUtils.deploymentConfig

        when:
        def deploymentResponse = createDeploymentInteractor.execute(createDeploymentRequest, workspaceId, authorization)

        then:
        1 * buildRepository.find(build.id, workspaceId) >> Optional.of(build)
        1 * buildRepository.findById(build.id) >> Optional.of(build)
        1 * workspaceRepository.find(workspaceId) >> Optional.of(workspace)
        1 * managementUserSecurityService.getUserEmail(authorization) >> author.email
        1 * userRepository.findByEmail(author.email) >> Optional.of(author)
        1 * deploymentConfigurationRepository.find(deploymentConfigId) >> Optional.of(deploymentConfig)
        1 * circleRepository.findById(circle.id) >> Optional.of(circle)
        1 * hermesService.notifySubscriptionEvent(_)
        0 * deployService.undeploy(_, _)
        1 * deploymentRepository.save(_) >> _
        1 * deployService.deploy(_, _, true, _) >> { arguments ->
            def deploymentArgument = arguments[0]
            def buildArgument = arguments[1]
            def configArgument = arguments[3]

            assert deploymentArgument instanceof Deployment
            assert buildArgument instanceof Build
            assert configArgument instanceof DeploymentConfiguration

            deploymentArgument.status == DeploymentStatusEnum.DEPLOYING
            buildArgument.id == build.id
            configArgument.id == deploymentConfig.id
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
        def author = TestUtils.user
        def circle = getCircle(true)
        def workspaceId = TestUtils.workspaceId
        def deploymentConfigId = TestUtils.deploymentConfigId
        def deploymentConfig = TestUtils.deploymentConfig
        def build = getDummyBuild(BuildStatusEnum.BUILT, DeploymentStatusEnum.DEPLOYED, true)
        def createDeploymentRequest = new CreateDeploymentRequest(circle.id, build.id)
        def authorization = TestUtils.authorization

        def workspace = TestUtils.workspace

        when:
        def deploymentResponse = createDeploymentInteractor.execute(createDeploymentRequest, workspaceId, authorization)

        then:
        1 * buildRepository.findById(build.id) >> Optional.of(build)
        1 * buildRepository.find(build.id, workspaceId) >> Optional.of(build)
        1 * workspaceRepository.find(workspaceId) >> Optional.of(workspace)
        1 * deploymentConfigurationRepository.find(deploymentConfigId) >> Optional.of(deploymentConfig)
        1 * managementUserSecurityService.getUserEmail(authorization) >> author.email
        1 * userRepository.findByEmail(author.email) >> Optional.of(author)
        1 * circleRepository.findById(circle.id) >> Optional.of(circle)
        1 * hermesService.notifySubscriptionEvent(_)
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
        def authorization = TestUtils.authorization
        def author = TestUtils.user
        def workspaceId = TestUtils.workspaceId
        def build = getDummyBuild(BuildStatusEnum.BUILT, DeploymentStatusEnum.DEPLOYED, false)
        def createDeploymentRequest = new CreateDeploymentRequest(circleId, build.id)
        def deploymentConfigId = TestUtils.deploymentConfigId
        def deploymentConfig = TestUtils.deploymentConfig

        def circle = new Circle(circleId, 'Circle name', 'f8296df6-6ae1-11ea-bc55-0242ac130003',
                author, LocalDateTime.now(), MatcherTypeEnum.SIMPLE_KV, null, null, null, false, "1a58c78a-6acb-11ea-bc55-0242ac130003", false, null)
        def notDeployedDeployment = getDeployment(DeploymentStatusEnum.NOT_DEPLOYED, LocalDateTime.now().plusDays(1), LocalDateTime.now(), false)

        def workspace = TestUtils.workspace

        when:
        def deploymentResponse = createDeploymentInteractor.execute(createDeploymentRequest, workspaceId, authorization)

        then:
        1 * buildRepository.findById(build.id) >> Optional.of(build)
        1 * buildRepository.find(build.id, workspaceId) >> Optional.of(build)
        1 * workspaceRepository.find(workspaceId) >> Optional.of(workspace)
        1 * managementUserSecurityService.getUserEmail(authorization) >> author.email
        1 * deploymentConfigurationRepository.find(deploymentConfigId) >> Optional.of(deploymentConfig)
        1 * userRepository.findByEmail(author.email) >> Optional.of(author)
        1 * circleRepository.findById(circleId) >> Optional.of(build.deployments[0].circle)
        1 * hermesService.notifySubscriptionEvent(_)
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

    def 'when deploy has error should throw exception and notify'() {
        given:
        def workspaceId = TestUtils.workspaceId
        def authorization = TestUtils.authorization
        def build = getDummyBuild(BuildStatusEnum.BUILT, DeploymentStatusEnum.DEPLOYED, false)
        def author = TestUtils.user
        def deploymentConfigId = TestUtils.deploymentConfigId
        def deploymentConfig = TestUtils.deploymentConfig
        def createDeploymentRequest = new CreateDeploymentRequest(circleId, build.id)
        def workspace = TestUtils.workspace

        when:
        createDeploymentInteractor.execute(createDeploymentRequest, workspaceId, authorization,)

        then:
        1 * buildRepository.findById(build.id) >> Optional.of(build)
        1 * buildRepository.find(build.id, workspaceId) >> Optional.of(build)
        1 * workspaceRepository.find(workspaceId) >> Optional.of(workspace)
        1 * managementUserSecurityService.getUserEmail(authorization) >> author.email
        1 * deploymentConfigurationRepository.find(deploymentConfigId) >> Optional.of(deploymentConfig)
        1 * userRepository.findByEmail(author.email) >> Optional.of(author)
        1 * circleRepository.findById(circleId) >> Optional.of(build.deployments[0].circle)
        1 * hermesService.notifySubscriptionEvent(_)
        1 * deploymentRepository.save(_) >> _
        1 * deployService.deploy(_, _, false, _) >> {
            throw new RuntimeException("Error")
        }

        thrown(RuntimeException)
    }

    def 'when the deploy is in a percentage circle and the limit of active percentage circles should not allow the deploy'() {
        given:
        def author = getDummyUser()
        def circleId = "5d4c9492-6f83-11ea-bc55-0242ac130003"
        def workspaceId = "5d4c97da-6f83-11ea-bc55-0242ac130003"
        def build = getDummyBuild(BuildStatusEnum.BUILT, DeploymentStatusEnum.DEPLOYED, false)
        def createDeploymentRequest = new CreateDeploymentRequest(circleId, build.id)

        def deploymentConfigId = TestUtils.deploymentConfigId
        def deploymentConfig = TestUtils.deploymentConfig

        def percentageCircle = new Circle(circleId, 'Circle name', 'f8296df6-6ae1-11ea-bc55-0242ac130003',
                author, LocalDateTime.now(), MatcherTypeEnum.PERCENTAGE, null, null, null, false, workspaceId, false, 20)
        def deployedPercentageCircle = new Circle('5d058a02-6406-4aea-be8c-3315ee202a56', 'Circle percentage', 'f8296df6-6ae1-11ea-bc55-0242ac130003',
                    author, LocalDateTime.now(), MatcherTypeEnum.PERCENTAGE, null, null, null, false, workspaceId, false, 90)
        def deployedPercentagesCirclePage = new Page([deployedPercentageCircle], 0, 5, 1)

        def workspace = new Workspace(workspaceId, "CharlesCD", author, LocalDateTime.now(), [],
                WorkspaceStatusEnum.COMPLETE, null, "http://matcher.com.br",
                null, "b9c8ca61-b963-499b-814d-71a66e89eabd", deploymentConfigId)
        def authorization = TestUtils.authorization
        when:
        createDeploymentInteractor.execute(createDeploymentRequest, workspaceId, authorization)

        then:
        1 * buildRepository.find(build.id, workspaceId) >> Optional.of(build)
        1 * managementUserSecurityService.getUserEmail(authorization) >> author.email
        1 * workspaceRepository.find(workspaceId) >> Optional.of(workspace)
        1 * userRepository.findByEmail(author.email) >> Optional.of(author)
        1 * deploymentConfigurationRepository.find(deploymentConfigId) >> Optional.of(deploymentConfig)
        1 * circleRepository.findById(circleId) >> Optional.of(percentageCircle)
        1 * circleRepository.findCirclesPercentage(workspaceId, null, true, null) >> deployedPercentagesCirclePage
        0 * deployService.undeploy(_, _)
        0 * deploymentRepository.save(_) >> _
        0 * deployService.deploy(_, _, false, _) >> {}

        def ex = thrown(BusinessException)
        println(ex)
        ex.message == 'limit.of.percentage.circles.exceeded'
    }

    def 'when the deploy is in a percentage circle that was already deployed before and the limit of percentage reached, should allow the deploy'() {
        given:
        def author = getDummyUser()
        def workspaceId = TestUtils.workspaceId
        def build = getDummyBuild(BuildStatusEnum.BUILT, DeploymentStatusEnum.DEPLOYED, true)
        def createDeploymentRequest = new CreateDeploymentRequest(circleId, build.id)

        def deploymentConfigId = TestUtils.deploymentConfigId
        def deploymentConfig = TestUtils.deploymentConfig

        def percentageCircle = getCircle(false,20)
        def deployedPercentageCircle = getCircle(false, 90)
        def deployedPercentageCircle2 = getCircle(false, 10)
        def deployedPercentagesCirclePage = new Page([deployedPercentageCircle, deployedPercentageCircle2], 0, 5, 1)


        def workspace = TestUtils.workspace

        def authorization = TestUtils.authorization
        when:
        createDeploymentInteractor.execute(createDeploymentRequest, workspaceId, authorization)

        then:
        1 * managementUserSecurityService.getUserEmail(authorization) >> author.email
        1 * buildRepository.findById(build.id) >> Optional.of(build)
        1 * buildRepository.find(build.id, workspaceId) >> Optional.of(build)
        1 * workspaceRepository.find(workspaceId) >> Optional.of(workspace)
        1 * deploymentConfigurationRepository.find(deploymentConfigId) >> Optional.of(deploymentConfig)
        1 * userRepository.findByEmail(author.email) >> Optional.of(author)
        1 * circleRepository.findById(circleId) >> Optional.of(percentageCircle)
        1 * circleRepository.findCirclesPercentage(workspaceId, null, true, null) >> deployedPercentagesCirclePage
        0 * deployService.undeploy(_, _)
        1 * deploymentRepository.save(_) >> _
        1 * deployService.deploy(_, _, false, _) >> {}

        notThrown()
    }

    private static User getDummyUser() {
        new User('4e806b2a-557b-45c5-91be-1e1db909bef6', 'User name', 'user@email.com', 'user.photo.png',
                new ArrayList<WorkspacePermissions>(), false, LocalDateTime.now())
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

        def circle = new Circle(circleId, 'Circle name', 'f8296df6-6ae1-11ea-bc55-0242ac130003',
                author, LocalDateTime.now(), MatcherTypeEnum.REGULAR, null, null, null, false, workspaceId, false, 20)
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
                TestUtils.user, LocalDateTime.now(), MatcherTypeEnum.SIMPLE_KV, null, null, null, defaultCircle, TestUtils.workspaceId, false, null)
    }

    private static Circle getCircle(Boolean defaultCircle, Integer percentage) {
        return new Circle("5d4c9492-6f83-11ea-bc55-0242ac130003", 'Circle name', 'f8296df6-6ae1-11ea-bc55-0242ac130003',
                TestUtils.user, LocalDateTime.now(), MatcherTypeEnum.PERCENTAGE, null, null, null, defaultCircle, TestUtils.workspaceId, false, percentage)
    }

    private static String getCircleId() {
        return "5d4c9492-6f83-11ea-bc55-0242ac130003"
    }

    private static String getBuildId() {
        return "5d4c9492-6f83-11ea-bc55-0242ac130003"
    }

    private static Deployment getDeployment(DeploymentStatusEnum status, LocalDateTime deployedAt, LocalDateTime undeployAt, Boolean isDefaultCircle) {
        return new Deployment('3c3b864a-702e-11ea-bc55-0242ac130003', TestUtils.user,
                LocalDateTime.now(), deployedAt, status, getCircle(isDefaultCircle), buildId, TestUtils.workspaceId, undeployAt)
    }
}
