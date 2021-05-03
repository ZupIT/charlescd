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

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import com.fasterxml.jackson.module.kotlin.KotlinModule
import io.charlescd.moove.application.*
import io.charlescd.moove.application.circle.request.NodePart
import io.charlescd.moove.application.deployment.DeploymentCallbackInteractor
import io.charlescd.moove.application.deployment.request.DeploymentCallbackRequest
import io.charlescd.moove.application.deployment.request.DeploymentRequestStatus
import io.charlescd.moove.domain.*
import io.charlescd.moove.domain.exceptions.NotFoundException
import io.charlescd.moove.domain.repository.BuildRepository
import io.charlescd.moove.domain.repository.CircleRepository
import io.charlescd.moove.domain.repository.DeploymentRepository
import io.charlescd.moove.domain.repository.KeyValueRuleRepository
import io.charlescd.moove.domain.repository.UserRepository
import io.charlescd.moove.domain.repository.WorkspaceRepository
import io.charlescd.moove.domain.service.CircleMatcherService
import io.charlescd.moove.domain.service.HermesService
import spock.lang.Specification

import java.time.LocalDateTime

class DeploymentCallbackInteractorImplTest extends Specification {

    private DeploymentCallbackInteractor deploymentCallbackInteractor

    private DeploymentRepository deploymentRepository = Mock(DeploymentRepository)
    private HermesService hermesService = Mock(HermesService)
    private BuildRepository buildRepository = Mock(BuildRepository)
    private CircleRepository circleRepository = Mock(CircleRepository)
    private WorkspaceRepository workspaceRepository = Mock(WorkspaceRepository)
    private KeyValueRuleRepository keyValueRuleRepository

    private UserRepository userRepository = Mock(UserRepository)
    private CircleMatcherService circleMatcherService
    private WorkspaceService workspaceService
    private KeyValueRuleService keyValueRuleService
    private WebhookEventService webhookEventService
    private DeploymentService deploymentService
    private CircleService circleService
    private ObjectMapper objectMapper = new ObjectMapper().registerModule(new KotlinModule()).registerModule(new JavaTimeModule())

    void setup() {
        this.workspaceService = new WorkspaceService(workspaceRepository, userRepository)
        this.circleMatcherService = Mock(CircleMatcherService)
        this.circleService = new CircleService(circleRepository)
        this.webhookEventService = new WebhookEventService(hermesService, new BuildService(buildRepository))
        this.deploymentService = new DeploymentService(deploymentRepository)
        this.keyValueRuleRepository = Mock(KeyValueRuleRepository);
        this.keyValueRuleService = new KeyValueRuleService(keyValueRuleRepository)

        this.deploymentCallbackInteractor = new DeploymentCallbackInteractorImpl(
                deploymentService,
                webhookEventService,
                circleMatcherService,
                workspaceService,
                circleService,
                keyValueRuleService
        )
    }

    def "when deployment does not exists should throw an exception"() {
        given:
        def request = new DeploymentCallbackRequest(DeploymentRequestStatus.SUCCEEDED)

        when:
        this.deploymentCallbackInteractor.execute(deploymentId, request)

        then:
        1 * this.deploymentRepository.findById(deploymentId) >> Optional.empty()

        0 * this.hermesService.notifySubscriptionEvent(_)

        def exception = thrown(NotFoundException)
        assert exception.resourceName == "deployment"
        assert exception.id == deploymentId
    }

    def "when deployment exists should update status of current and previous as well"() {
        given:

        def request = new DeploymentCallbackRequest(DeploymentRequestStatus.SUCCEEDED)

        def circle = getCircle(false)

        def workspaceId = '1a58c78a-6acb-11ea-bc55-0242ac130003'

        def workspace = new Workspace(workspaceId, "Women", author, LocalDateTime.now(), [],
                WorkspaceStatusEnum.COMPLETE, "7a973eed-599b-428d-89f0-9ef6db8fd39d",
                "http://matcher-uri.com.br", "833336cd-742c-4f62-9594-45ac0a1e807a",
                "c5147c49-1923-44c5-870a-78aaba646fe4", null)

        def currentDeployment = new Deployment(deploymentId, author, LocalDateTime.now(), null, DeploymentStatusEnum.DEPLOYING, circle,
                buildId, "be8fce55-c2cf-4213-865b-69cf89178008", null, null)

        def previousDeployment = new Deployment("44b87381-6616-462a-9437-27608246bc1b", author, LocalDateTime.now(), null, DeploymentStatusEnum.DEPLOYED, circle,
                "6ba1d6f1-d443-42d9-b9cc-89097d76ab70", "be8fce55-c2cf-4213-865b-69cf89178008", null, null)

        when:
        this.deploymentCallbackInteractor.execute(deploymentId, request)

        then:
        1 * this.deploymentRepository.findById(deploymentId) >> Optional.of(currentDeployment)

        1 * this.deploymentRepository.find(circle.id, DeploymentStatusEnum.DEPLOYED) >> Optional.of(previousDeployment)

        1 * this.deploymentRepository.updateStatus(previousDeployment.id, DeploymentStatusEnum.NOT_DEPLOYED)

        1 * this.buildRepository.findById(buildId) >> Optional.of(getBuild(DeploymentStatusEnum.DEPLOYED, circle))

        1 * this.hermesService.notifySubscriptionEvent(_)

        1 * this.workspaceRepository.find(workspaceId) >> Optional.of(workspace)

        1 * circleMatcherService.update(_, _ , _, _)

        1 * this.deploymentRepository.update(_) >> { arguments ->
            def deployment = arguments[0]
            assert deployment instanceof Deployment
            assert deployment.id == currentDeployment.id
            assert deployment.status == DeploymentStatusEnum.DEPLOYED
            assert deployment.deployedAt != null
            assert deployment.circle.id == circle.id

            return deployment
        }

        notThrown()
    }

    def "when deployment exists and callback is success should update status of current and do not update previous deployment because is default circle"() {
        given:
        def request = new DeploymentCallbackRequest(DeploymentRequestStatus.SUCCEEDED)

        def circle = getCircle(true)

        def currentDeployment = new Deployment(deploymentId, author, LocalDateTime.now(), null, DeploymentStatusEnum.DEPLOYING, circle, buildId, workspaceId, null, null)


        def previousDeployment = new Deployment("44b87381-6616-462a-9437-27608246bc1b", author, LocalDateTime.now(), null, DeploymentStatusEnum.DEPLOYED, circle,
                "6ba1d6f1-d443-42d9-b9cc-89097d76ab70", "be8fce55-c2cf-4213-865b-69cf89178008", null, null)

        when:
        this.deploymentCallbackInteractor.execute(deploymentId, request)

        then:
        1 * this.deploymentRepository.findById(deploymentId) >> Optional.of(currentDeployment)

        0 * this.deploymentRepository.find(circle.id, DeploymentStatusEnum.DEPLOYED) >> Optional.of(previousDeployment)

        0 * this.deploymentRepository.updateStatus(previousDeployment.id, DeploymentStatusEnum.NOT_DEPLOYED)

        1 * this.buildRepository.findById(buildId) >> Optional.of(getBuild(DeploymentStatusEnum.DEPLOYED, circle))

        1 * this.hermesService.notifySubscriptionEvent(_)

        1 * this.deploymentRepository.update(_) >> { arguments ->
            def deployment = arguments[0]

            assert deployment instanceof Deployment
            assert deployment.id == currentDeployment.id
            assert deployment.status == DeploymentStatusEnum.DEPLOYED
            assert deployment.deployedAt != null
            assert deployment.circle.id == circle.id

            return deployment
        }

        notThrown()
    }

    def "when deployment exists and callback is fail should update status of current and do not update previous deployment"() {
        given:
        def request = new DeploymentCallbackRequest(DeploymentRequestStatus.FAILED)

        def circle = getCircle(false)

        def currentDeployment = new Deployment(deploymentId, author, LocalDateTime.now(), null, DeploymentStatusEnum.DEPLOYING, circle,
                buildId, workspaceId, null, null)

        def previousDeployment = new Deployment("44b87381-6616-462a-9437-27608246bc1b", author, LocalDateTime.now(), null, DeploymentStatusEnum.DEPLOYED, circle,
                "6ba1d6f1-d443-42d9-b9cc-89097d76ab70", workspaceId, null, null)

        when:
        this.deploymentCallbackInteractor.execute(deploymentId, request)

        then:
        1 * this.deploymentRepository.findById(deploymentId) >> Optional.of(currentDeployment)

        0 * this.deploymentRepository.find(circle.id, DeploymentStatusEnum.DEPLOYED) >> Optional.of(previousDeployment)

        0 * this.deploymentRepository.updateStatus(previousDeployment.id, DeploymentStatusEnum.NOT_DEPLOYED)

        1 * this.buildRepository.findById(buildId) >> Optional.of(getBuild(DeploymentStatusEnum.DEPLOY_FAILED, circle))

        1 * this.hermesService.notifySubscriptionEvent(_)

        1 * this.deploymentRepository.update(_) >> { arguments ->
            def deployment = arguments[0]

            assert deployment instanceof Deployment
            assert deployment.id == currentDeployment.id
            assert deployment.status == DeploymentStatusEnum.DEPLOY_FAILED
            assert deployment.circle.id == circle.id

            return deployment
        }

        notThrown()
    }

    def "when deployment exists and callback is timeout should update status of current and do not update previous deployment"() {
        given:
        def request = new DeploymentCallbackRequest(DeploymentRequestStatus.TIMED_OUT)

        def circle = getCircle(false)

        def currentDeployment = new Deployment(deploymentId, author, LocalDateTime.now(), null, DeploymentStatusEnum.DEPLOYING, circle,
                buildId, workspaceId, null, null)

        def previousDeployment = new Deployment("44b87381-6616-462a-9437-27608246bc1b", author, LocalDateTime.now(), null, DeploymentStatusEnum.DEPLOYED, circle,
                "6ba1d6f1-d443-42d9-b9cc-89097d76ab70", "be8fce55-c2cf-4213-865b-69cf89178008", null, null)

        when:
        this.deploymentCallbackInteractor.execute(deploymentId, request)

        then:
        1 * this.deploymentRepository.findById(deploymentId) >> Optional.of(currentDeployment)

        0 * this.deploymentRepository.find(circle.id, DeploymentStatusEnum.DEPLOYED) >> Optional.of(previousDeployment)

        0 * this.deploymentRepository.updateStatus(previousDeployment.id, DeploymentStatusEnum.NOT_DEPLOYED)

        1 * this.buildRepository.findById(buildId) >> Optional.of(getBuild(DeploymentStatusEnum.DEPLOY_FAILED, circle))

        1 * this.hermesService.notifySubscriptionEvent(_)

        1 * this.deploymentRepository.update(_) >> { arguments ->
            def deployment = arguments[0]

            assert deployment instanceof Deployment
            assert deployment.id == currentDeployment.id
            assert deployment.status == DeploymentStatusEnum.DEPLOY_FAILED
            assert deployment.circle.id == circle.id

            return deployment
        }

        notThrown()
    }

    def "when deployment exists and callback is undeployed should update status of current and do not update previous deployment"() {
        given:
        def request = new DeploymentCallbackRequest(DeploymentRequestStatus.UNDEPLOYED)

        def circle = getCircle(false)
        def currentDeployment = new Deployment(deploymentId, author, LocalDateTime.now(), LocalDateTime.now(), DeploymentStatusEnum.UNDEPLOYING, circle,
                buildId, workspaceId, null, null )

        when:
        this.deploymentCallbackInteractor.execute(deploymentId, request)

        then:
        1 * this.workspaceRepository.find(workspaceId) >> Optional.of(workspace)
        1 * this.deploymentRepository.findById(deploymentId) >> Optional.of(currentDeployment)

        0 * this.deploymentRepository.find(circle.id, DeploymentStatusEnum.DEPLOYED)

        0 * this.deploymentRepository.updateStatus(_ as String, _ as DeploymentStatusEnum)

        1 * this.buildRepository.findById(buildId) >> Optional.of(getBuild(DeploymentStatusEnum.DEPLOYED, circle))

        1 * this.hermesService.notifySubscriptionEvent(_)

        1 * this.deploymentRepository.update(_) >> { arguments ->
            def deployment = arguments[0]

            assert deployment instanceof Deployment
            assert deployment.id == currentDeployment.id
            assert deployment.status == DeploymentStatusEnum.NOT_DEPLOYED
            assert deployment.circle.id == circle.id
            assert deployment.undeployedAt != null

            return deployment
        }

        notThrown()
    }

    def "when deployment exists and callback is undeploy_failed should update status of current and do not update previous deployment"() {
        given:
        def request = new DeploymentCallbackRequest(DeploymentRequestStatus.UNDEPLOY_FAILED)

        def circle = getCircle(false)

        def currentDeployment = new Deployment(deploymentId, author, LocalDateTime.now(), null, DeploymentStatusEnum.UNDEPLOYING, circle,
                buildId, workspaceId, null, null)


        when:
        this.deploymentCallbackInteractor.execute(deploymentId, request)

        then:
        1 * this.deploymentRepository.findById(deploymentId) >> Optional.of(currentDeployment)

        0 * this.deploymentRepository.find(circle.id, DeploymentStatusEnum.DEPLOYED)

        0 * this.deploymentRepository.updateStatus(_ as String, _ as DeploymentStatusEnum)

        1 * this.buildRepository.findById(buildId) >> Optional.of(getBuild(DeploymentStatusEnum.DEPLOYED, circle))

        1 * this.hermesService.notifySubscriptionEvent(_)

        0 * this.circleMatcherService.update(_, _, _,_)

        1 * this.deploymentRepository.update(_) >> { arguments ->
            def deployment = arguments[0]

            assert deployment instanceof Deployment
            assert deployment.id == currentDeployment.id
            assert deployment.status == DeploymentStatusEnum.DEPLOYED
            assert deployment.circle.id == circle.id

            return deployment
        }

        notThrown()
    }

    def 'when callback is in default circle should not update status in circle matcher'() {
        given:

        def request = new DeploymentCallbackRequest(DeploymentRequestStatus.SUCCEEDED)

        def circle = getCircle(true)

        def currentDeployment = new Deployment(deploymentId, author, LocalDateTime.now(), null, DeploymentStatusEnum.UNDEPLOYING, circle,
                buildId, workspaceId, null, null)

        when:
        this.deploymentCallbackInteractor.execute(deploymentId, request)

        then:
        1 * this.deploymentRepository.findById(deploymentId) >> Optional.of(currentDeployment)
        1 * this.deploymentRepository.update(_)
        1 * this.buildRepository.findById(buildId) >> Optional.of(getBuild(DeploymentStatusEnum.UNDEPLOYING, circle))
        0 * circleMatcherService.update(_, _, _, _)
        1 * this.hermesService.notifySubscriptionEvent(_)
    }

    def 'when callback of deploy is SUCCEEDED should update status to active in circle matcher'() {
        given:
        def deploymentId = "314d7293-47d0-4d68-900c-02b834a15cef"

        def request = new DeploymentCallbackRequest(DeploymentRequestStatus.SUCCEEDED)

        def circle = getCircle(false)

        def workspaceId = '1a58c78a-6acb-11ea-bc55-0242ac130003'

        def workspace = new Workspace(workspaceId, "Women", author, LocalDateTime.now(), [],
                WorkspaceStatusEnum.COMPLETE, "7a973eed-599b-428d-89f0-9ef6db8fd39d",
                "http://matcher-uri.com.br", "833336cd-742c-4f62-9594-45ac0a1e807a",
                "c5147c49-1923-44c5-870a-78aaba646fe4", null)

        def currentDeployment = new Deployment(deploymentId, author, LocalDateTime.now(), null, DeploymentStatusEnum.UNDEPLOYING, circle,
                buildId, workspaceId, null, null)
        def previousDeployment = new Deployment("44b87381-6616-462a-9437-27608246bc1b", author, LocalDateTime.now(), null, DeploymentStatusEnum.DEPLOYED, circle,
                "6ba1d6f1-d443-42d9-b9cc-89097d76ab70", workspaceId, null, null)
        when:
        this.deploymentCallbackInteractor.execute(deploymentId, request)

        then:
        1 * this.deploymentRepository.findById(deploymentId) >> Optional.of(currentDeployment)

        1 * this.buildRepository.findById(buildId) >> Optional.of(getBuild(DeploymentStatusEnum.DEPLOYED, circle))

        1 * this.workspaceRepository.find(workspaceId) >> Optional.of(workspace)

        1 * this.deploymentRepository.find(circle.id, DeploymentStatusEnum.DEPLOYED) >> Optional.of(previousDeployment)

        1 * this.deploymentRepository.update(_)

        1 * this.hermesService.notifySubscriptionEvent(_)

        1 * this.circleMatcherService.update(_, _, _, _) >> { arguments ->
            def circleCompare = arguments[0]
            def reference = arguments[1]
            def matcherUrl = arguments[2]
            def active = arguments[3]

            assert circleCompare instanceof Circle
            assert circleCompare.id == circle.id
            assert matcherUrl.toString() == workspace.circleMatcherUrl
            assert reference == circle.reference
            assert active == true
        }

    }

    def 'when callback of deploy is UNDEPLOYED should update status to inactive in circle matcher'() {
        given:

        def request = new DeploymentCallbackRequest(DeploymentRequestStatus.UNDEPLOYED)

        def circle = getCircle(false)

        def workspaceId = '1a58c78a-6acb-11ea-bc55-0242ac130003'

        def workspace = new Workspace(workspaceId, "Women", author, LocalDateTime.now(), [],
                WorkspaceStatusEnum.COMPLETE, "7a973eed-599b-428d-89f0-9ef6db8fd39d",
                "http://matcher-uri.com.br", "833336cd-742c-4f62-9594-45ac0a1e807a",
                "c5147c49-1923-44c5-870a-78aaba646fe4", null)

        def currentDeployment = new Deployment(deploymentId, author, LocalDateTime.now(), null, DeploymentStatusEnum.UNDEPLOYING, circle,
                buildId, workspaceId, null, null)
        when:
        this.deploymentCallbackInteractor.execute(deploymentId, request)

        then:
        1 * this.workspaceRepository.find(workspaceId) >> Optional.of(workspace)

        1 * this.deploymentRepository.findById(deploymentId) >> Optional.of(currentDeployment)

        1 * this.hermesService.notifySubscriptionEvent(_)

        1 * this.buildRepository.findById(buildId) >> Optional.of(getBuild(DeploymentStatusEnum.DEPLOYED, circle))

        1 * this.circleMatcherService.update(_, _, _, _) >> { arguments ->
            def circleCompare = arguments[0]
            def reference = arguments[1]
            def matcherUrl = arguments[2]
            def active = arguments[3]

            assert circleCompare instanceof Circle
            assert circleCompare.id == circle.id
            assert matcherUrl.toString() == workspace.circleMatcherUrl
            assert reference == circle.reference
            assert active == false
        }
    }

    def 'when callback of deploy is FAILED should not update status in circle matcher'() {
        given:
        def request = new DeploymentCallbackRequest(DeploymentRequestStatus.FAILED)

        def circle = getCircle(false)

        def workspaceId = '1a58c78a-6acb-11ea-bc55-0242ac130003'

        def workspace = new Workspace(workspaceId, "Women", author, LocalDateTime.now(), [],
                WorkspaceStatusEnum.COMPLETE, "7a973eed-599b-428d-89f0-9ef6db8fd39d",
                "http://matcher-uri.com.br", "833336cd-742c-4f62-9594-45ac0a1e807a",
                "c5147c49-1923-44c5-870a-78aaba646fe4", null)

        def currentDeployment = new Deployment(deploymentId, author, LocalDateTime.now(), null, DeploymentStatusEnum.UNDEPLOYING, circle,
                buildId, workspaceId, null, null)
        when:
        this.deploymentCallbackInteractor.execute(deploymentId, request)

        then:
        0 * this.workspaceRepository.find(workspaceId) >> Optional.of(workspace)

        1 * this.deploymentRepository.findById(deploymentId) >> Optional.of(currentDeployment)

        0 * this.circleMatcherService.update(_, _, _, _)

        1 * this.hermesService.notifySubscriptionEvent(_)

        1 * this.buildRepository.findById(buildId) >> Optional.of(getBuild(DeploymentStatusEnum.DEPLOYED, circle))

    }

    def 'when callback of deploy is UNDEPLOY_FAILED should not update status in circle matcher'() {
        given:
        def request = new DeploymentCallbackRequest(DeploymentRequestStatus.UNDEPLOY_FAILED)

        def circle = getCircle(false)

        def workspaceId = '1a58c78a-6acb-11ea-bc55-0242ac130003'

        def workspace = new Workspace(workspaceId, "Women", author, LocalDateTime.now(), [],
                WorkspaceStatusEnum.COMPLETE, "7a973eed-599b-428d-89f0-9ef6db8fd39d",
                "http://matcher-uri.com.br", "833336cd-742c-4f62-9594-45ac0a1e807a",
                "c5147c49-1923-44c5-870a-78aaba646fe4", null)

        def currentDeployment = new Deployment(deploymentId, author, LocalDateTime.now(), null, DeploymentStatusEnum.UNDEPLOYING, circle,
                buildId, workspaceId, null, null)

        when:
        this.deploymentCallbackInteractor.execute(deploymentId, request)

        then:
        0 * this.workspaceRepository.find(workspaceId) >> Optional.of(workspace)

        1 * this.deploymentRepository.findById(deploymentId) >> Optional.of(currentDeployment)

        0 * this.circleMatcherService.update(_, _, _, )

        1 * this.hermesService.notifySubscriptionEvent(_)

        1 * this.buildRepository.findById(buildId) >> Optional.of(getBuild(DeploymentStatusEnum.DEPLOYED, circle))
    }

    def "when callback is of a circle created with csv should create the correct list of nodes "() {

        given:
        def request = new DeploymentCallbackRequest(DeploymentRequestStatus.UNDEPLOYED)
        def keyValueRule = getKeyValueRule("user", "charles" )
        def secondKeyValueRule = getKeyValueRule("user", "admin" )
        def circle = new Circle("9aec1a44-77e7-49db-9998-54835cb4aae8", "default", "8997c35d-7861-4198-9c9b-a2491bf08911", author,
                LocalDateTime.now(), MatcherTypeEnum.SIMPLE_KV, null, null, null, false,
                workspaceId, false, null)
        def workspace = new Workspace(workspaceId, "Women", author, LocalDateTime.now(), [],
                WorkspaceStatusEnum.COMPLETE, "7a973eed-599b-428d-89f0-9ef6db8fd39d",
                "http://matcher-uri.com.br", "833336cd-742c-4f62-9594-45ac0a1e807a",
                "c5147c49-1923-44c5-870a-78aaba646fe4", null)


        def currentDeployment = new Deployment(deploymentId, author, LocalDateTime.now(), null, DeploymentStatusEnum.UNDEPLOYING, circle,
                buildId, "be8fce55-c2cf-4213-865b-69cf89178008", null, null)
        when:
        this.deploymentCallbackInteractor.execute(deploymentId, request)

        then:
        1 * this.deploymentRepository.findById(deploymentId) >> Optional.of(currentDeployment)

        1 * this.workspaceRepository.find(workspaceId) >> Optional.of(workspace)

        1 * this.deploymentRepository.update(_)

        1 * this.hermesService.notifySubscriptionEvent(_)

        1 * this.buildRepository.findById(buildId) >> Optional.of(getBuild(DeploymentStatusEnum.DEPLOYED, circle))

        1 * keyValueRuleRepository.findByCircle(circle.id) >> [keyValueRule,secondKeyValueRule]

        1 * circleRepository.update(_) >> circle

        1 * this.circleMatcherService.updateImport(_, _, _, _, _) >> { arguments ->
            def circleCompare = arguments[0]
            def reference = arguments[1]
            def nodes = arguments[2]
            def matcherUrl = arguments[3]
            def active = arguments[4]

            assert circleCompare instanceof Circle
            assert circleCompare.id == circle.id
            assert matcherUrl.toString() == workspace.circleMatcherUrl
            assert reference == circle.reference
            assert active == false
            assert nodes instanceof List<JsonNode>
            assert nodes.size() == 2
            def ruleCompare = objectMapper.treeToValue(nodes[0],NodePart.class)
            def SecondRuleCompare = objectMapper.treeToValue(nodes[1],NodePart.class)
            assert ruleCompare.content.key == "user"
            assert ruleCompare.content.value[0] == "charles"
            assert SecondRuleCompare.content.key == "user"
            assert SecondRuleCompare.content.value[0] == "admin"
        }

    }

    def "when callback is of a circle created with csv and rules are empty should create a empty list of nodes "() {
        given:
        def request = new DeploymentCallbackRequest(DeploymentRequestStatus.SUCCEEDED)

        def workspaceId = workspaceId

        def workspace = new Workspace(workspaceId, "Women", author, LocalDateTime.now(), [],
                WorkspaceStatusEnum.COMPLETE, "7a973eed-599b-428d-89f0-9ef6db8fd39d",
                "http://matcher-uri.com.br", "833336cd-742c-4f62-9594-45ac0a1e807a",
                "c5147c49-1923-44c5-870a-78aaba646fe4", null)

        def circle = new Circle("9aec1a44-77e7-49db-9998-54835cb4aae8", "Circle", "8997c35d-7861-4198-9c9b-a2491bf08911", author,
                LocalDateTime.now(), MatcherTypeEnum.SIMPLE_KV, null, null, null, false, "1a58c78a-6acb-11ea-bc55-0242ac130003", false, null)

        def currentDeployment = new Deployment(deploymentId, author, LocalDateTime.now(), null, DeploymentStatusEnum.UNDEPLOYING, circle,
                buildId, "be8fce55-c2cf-4213-865b-69cf89178008", null, null)
        def previousDeployment = new Deployment("44b87381-6616-462a-9437-27608246bc1b", author, LocalDateTime.now(), null, DeploymentStatusEnum.DEPLOYED, circle,
                "6ba1d6f1-d443-42d9-b9cc-89097d76ab70", workspaceId, null, null)
        when:
        this.deploymentCallbackInteractor.execute(deploymentId, request)

        then:
        1 * this.deploymentRepository.findById(deploymentId) >> Optional.of(currentDeployment)

        1 * this.workspaceRepository.find(workspaceId) >> Optional.of(workspace)

        1 * this.deploymentRepository.find(circle.id, DeploymentStatusEnum.DEPLOYED) >> Optional.of(previousDeployment)

        1 * this.deploymentRepository.update(_)

        1 * this.hermesService.notifySubscriptionEvent(_)

        1 * keyValueRuleRepository.findByCircle(circle.id) >> []

        1 * this.buildRepository.findById(buildId) >> Optional.of(getBuild(DeploymentStatusEnum.DEPLOYED, circle))

        0 * this.circleMatcherService.updateImport(_, _, _, _, _) >> { arguments ->
        }

    }

    private static getDeploymentId() {
        return "314d7293-47d0-4d68-900c-02b834a15cef"
    }

    private static getWorkspaceId() {
        return "1a58c78a-6acb-11ea-bc55-0242ac130003"
    }

    private static getBuildId() {
        return "9aec1a44-77e7-49db-9998-54835cb4aae8"
    }

    private static getModuleSnapshotId() {
        return '3e1f3969-c6ec-4a44-96a0-101d45b668e7'
    }

    private static getFeatureSnapshotId() {
        return '3e25a77e-5f14-45f3-9ae7-c25c00ad9ca6'
    }

    private static listComponentSnapshot() {
        def componentSnapshotList = new ArrayList<ComponentSnapshot>()
        componentSnapshotList.add(new ComponentSnapshot('70189ffc-b517-4719-8e20-278a7e5f9b33', '20209ffc-b517-4719-8e20-278a7e5f9b00',
                'Component snapshot name', LocalDateTime.now(), null,
                workspaceId, moduleSnapshotId, 'host', 'gateway'))
        return componentSnapshotList
    }

    private static listModuleSnapshot() {
        def moduleSnapshotList = new ArrayList<ModuleSnapshot>()
        moduleSnapshotList.add(new ModuleSnapshot(moduleSnapshotId, '000f3969-c6ec-4a44-96a0-101d45b668e7',
                'Module Snapshot Name', 'https://git-repository-address.com', LocalDateTime.now(), 'https://helm-repository.com',
                listComponentSnapshot(), workspaceId, featureSnapshotId))
        return moduleSnapshotList
    }

    private static listFeatureSnapshot() {
        def featureSnapshotList = new ArrayList<FeatureSnapshot>()
        featureSnapshotList.add(new FeatureSnapshot(featureSnapshotId, 'cc869c36-311c-4523-ba5b-7b69286e0df4',
                'Feature name', 'feature-branch-name', LocalDateTime.now(), author.name, author.id, listModuleSnapshot(), buildId))
        return featureSnapshotList
    }

    private static getAuthor() {
        return new User('4e806b2a-557b-45c5-91be-1e1db909bef6', 'User name', 'user@email.com', 'user.photo.png',
                new ArrayList<WorkspacePermissions>(), false, LocalDateTime.now())

    }

    private static getCircle(boolean defaultCircle) {
        return new Circle("9aec1a44-77e7-49db-9998-54835cb4aae8", "default", "8997c35d-7861-4198-9c9b-a2491bf08911", author,
                LocalDateTime.now(), MatcherTypeEnum.REGULAR, null, null, null, defaultCircle, workspaceId, false, null)

    }

    private static getBuild(DeploymentStatusEnum status, Circle circle) {
        return new Build(buildId, author, LocalDateTime.now(), listFeatureSnapshot(),
                'tag-name', '6181aaf1-10c4-47d8-963a-3b87186debbb', 'f53020d7-6c85-4191-9295-440a3e7c1307', BuildStatusEnum.BUILT,
                workspaceId, listDeployment(status, circle))
    }

    private static getWorkspace() {
        return  new Workspace(workspaceId, "Women", author, LocalDateTime.now(), [],
                WorkspaceStatusEnum.COMPLETE, "7a973eed-599b-428d-89f0-9ef6db8fd39d",
                "http://matcher-uri.com.br", "833336cd-742c-4f62-9594-45ac0a1e807a",
                "c5147c49-1923-44c5-870a-78aaba646fe4", null)

    }

    private static listDeployment(DeploymentStatusEnum status, Circle circle) {
        def deployments = new ArrayList<Deployment>()

        def deployment = new Deployment(deploymentId, author, LocalDateTime.now(), null, status, circle,
                buildId, workspaceId, null, null)

        deployments.add(deployment)
        return deployments
    }

    private static NodePart getNodePart(String key, String value) {
        def rulePart = new NodePart.RulePart(key, NodePart.ConditionEnum.EQUAL, [value])
        return new NodePart(NodePart.NodeTypeRequest.RULE, NodePart.LogicalOperatorRequest.OR, null, rulePart)
    }

    private static KeyValueRule getKeyValueRule(String key, String value)  {
        def nodePart = getNodePart(key, value)
        def jsonNode = new ObjectMapper().valueToTree(nodePart)
        return new KeyValueRule("8c6e4281-ae17-415c-b904-e5514aff6bc1", jsonNode, TestUtils.cirleId)
    }
}
