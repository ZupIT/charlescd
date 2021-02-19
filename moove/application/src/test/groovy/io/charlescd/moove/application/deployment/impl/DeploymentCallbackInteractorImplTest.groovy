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
import io.charlescd.moove.application.CsvSegmentationService
import io.charlescd.moove.application.WorkspaceService
import io.charlescd.moove.application.circle.request.NodePart
import io.charlescd.moove.application.deployment.DeploymentCallbackInteractor
import io.charlescd.moove.application.deployment.request.DeploymentCallbackRequest
import io.charlescd.moove.application.deployment.request.DeploymentRequestStatus
import io.charlescd.moove.domain.*
import io.charlescd.moove.domain.exceptions.NotFoundException
import io.charlescd.moove.domain.repository.DeploymentRepository
import io.charlescd.moove.domain.repository.UserRepository
import io.charlescd.moove.domain.repository.WorkspaceRepository
import io.charlescd.moove.domain.service.CircleMatcherService
import spock.lang.Specification
import java.time.LocalDateTime

class DeploymentCallbackInteractorImplTest extends Specification {

    private DeploymentCallbackInteractor deploymentCallbackInteractor

    private DeploymentRepository deploymentRepository = Mock(DeploymentRepository)
    private WorkspaceRepository workspaceRepository = Mock(WorkspaceRepository)
    private UserRepository userRepository = Mock(UserRepository)

    private CircleMatcherService circleMatcherService
    private WorkspaceService workspaceService
    private CsvSegmentationService csvSegmentationService
    private ObjectMapper objectMapper = new ObjectMapper().registerModule(new KotlinModule()).registerModule(new JavaTimeModule())

    void setup() {
        this.workspaceService = new WorkspaceService(workspaceRepository, userRepository)
        this.circleMatcherService = Mock(CircleMatcherService)

        this.csvSegmentationService = new CsvSegmentationService(objectMapper);
        this.deploymentCallbackInteractor = new DeploymentCallbackInteractorImpl(
                deploymentRepository,
                circleMatcherService,
                workspaceService,
                csvSegmentationService
        )

    }

    def "when deployment does not exists should throw an exception"() {
        given:
        def deploymentId = "314d7293-47d0-4d68-900c-02b834a15cef"
        def request = new DeploymentCallbackRequest(DeploymentRequestStatus.SUCCEEDED)

        when:
        this.deploymentCallbackInteractor.execute(deploymentId, request)

        then:
        1 * this.deploymentRepository.findById(deploymentId) >> Optional.empty()

        def exception = thrown(NotFoundException)
        assert exception.resourceName == "deployment"
        assert exception.id == deploymentId
    }

    def "when deployment exists should update status of current and previous as well"() {
        given:
        def deploymentId = "314d7293-47d0-4d68-900c-02b834a15cef"
        def request = new DeploymentCallbackRequest(DeploymentRequestStatus.SUCCEEDED)

        def author = new User('4e806b2a-557b-45c5-91be-1e1db909bef6', 'User name', 'user@email.com', 'user.photo.png',
                new ArrayList<Workspace>(), false, LocalDateTime.now())

        def workspaceId = '1a58c78a-6acb-11ea-bc55-0242ac130003'

        def workspace = new Workspace(workspaceId, "Women", author, LocalDateTime.now(), [],
                WorkspaceStatusEnum.COMPLETE, "7a973eed-599b-428d-89f0-9ef6db8fd39d",
                "http://matcher-uri.com.br", "833336cd-742c-4f62-9594-45ac0a1e807a",
                "c5147c49-1923-44c5-870a-78aaba646fe4", null)
        def circle = new Circle("9aec1a44-77e7-49db-9998-54835cb4aae8", "default", "8997c35d-7861-4198-9c9b-a2491bf08911", author,
                LocalDateTime.now(), MatcherTypeEnum.REGULAR, null, null, null, false, "1a58c78a-6acb-11ea-bc55-0242ac130003")

        def currentDeployment = new Deployment(deploymentId, author, LocalDateTime.now(), null, DeploymentStatusEnum.DEPLOYING, circle,
                "97f508ad-cdbd-45df-969f-07781cc00513", "be8fce55-c2cf-4213-865b-69cf89178008", null)

        def previousDeployment = new Deployment("44b87381-6616-462a-9437-27608246bc1b", author, LocalDateTime.now(), null, DeploymentStatusEnum.DEPLOYED, circle,
                "6ba1d6f1-d443-42d9-b9cc-89097d76ab70", "be8fce55-c2cf-4213-865b-69cf89178008", null)

        when:
        this.deploymentCallbackInteractor.execute(deploymentId, request)

        then:
        1 * this.deploymentRepository.findById(deploymentId) >> Optional.of(currentDeployment)

        1 * this.deploymentRepository.find(circle.id, DeploymentStatusEnum.DEPLOYED) >> Optional.of(previousDeployment)

        1 * this.deploymentRepository.updateStatus(previousDeployment.id, DeploymentStatusEnum.NOT_DEPLOYED)

        1 * this.workspaceRepository.find(workspaceId) >> Optional.of(workspace)

        1 * this.deploymentRepository.update(_) >> { arguments ->
            def deployment = arguments[0]

            assert deployment instanceof Deployment
            assert deployment.id == currentDeployment.id
            assert deployment.status == DeploymentStatusEnum.DEPLOYED
            assert deployment.deployedAt != null
            assert deployment.circle.id == circle.id

            return deployment
        }
        1 * circleMatcherService.update(_, _ , _, _)

        notThrown()
    }

    def "when deployment exists and callback is success should update status of current and do not update previous deployment because is default circle"() {
        given:
        def deploymentId = "314d7293-47d0-4d68-900c-02b834a15cef"
        def request = new DeploymentCallbackRequest(DeploymentRequestStatus.SUCCEEDED)

        def author = new User('4e806b2a-557b-45c5-91be-1e1db909bef6', 'User name', 'user@email.com', 'user.photo.png',
                new ArrayList<Workspace>(), false, LocalDateTime.now())

        def circle = new Circle("9aec1a44-77e7-49db-9998-54835cb4aae8", "default", "8997c35d-7861-4198-9c9b-a2491bf08911", author,
                LocalDateTime.now(), MatcherTypeEnum.REGULAR, null, null, null, true, "1a58c78a-6acb-11ea-bc55-0242ac130003")

        def currentDeployment = new Deployment(deploymentId, author, LocalDateTime.now(), null, DeploymentStatusEnum.DEPLOYING, circle,
                "97f508ad-cdbd-45df-969f-07781cc00513", "be8fce55-c2cf-4213-865b-69cf89178008", null)

        def previousDeployment = new Deployment("44b87381-6616-462a-9437-27608246bc1b", author, LocalDateTime.now(), null, DeploymentStatusEnum.DEPLOYED, circle,
                "6ba1d6f1-d443-42d9-b9cc-89097d76ab70", "be8fce55-c2cf-4213-865b-69cf89178008", null)

        when:
        this.deploymentCallbackInteractor.execute(deploymentId, request)

        then:
        1 * this.deploymentRepository.findById(deploymentId) >> Optional.of(currentDeployment)

        0 * this.deploymentRepository.find(circle.id, DeploymentStatusEnum.DEPLOYED) >> Optional.of(previousDeployment)

        0 * this.deploymentRepository.updateStatus(previousDeployment.id, DeploymentStatusEnum.NOT_DEPLOYED)


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
        def deploymentId = "314d7293-47d0-4d68-900c-02b834a15cef"
        def request = new DeploymentCallbackRequest(DeploymentRequestStatus.FAILED)

        def author = new User('4e806b2a-557b-45c5-91be-1e1db909bef6', 'User name', 'user@email.com', 'user.photo.png',
                new ArrayList<Workspace>(), false, LocalDateTime.now())

        def circle = new Circle("9aec1a44-77e7-49db-9998-54835cb4aae8", "default", "8997c35d-7861-4198-9c9b-a2491bf08911", author,
                LocalDateTime.now(), MatcherTypeEnum.REGULAR, null, null, null, false, "1a58c78a-6acb-11ea-bc55-0242ac130003")

        def currentDeployment = new Deployment(deploymentId, author, LocalDateTime.now(), null, DeploymentStatusEnum.DEPLOYING, circle,
                "97f508ad-cdbd-45df-969f-07781cc00513", "be8fce55-c2cf-4213-865b-69cf89178008", null)

        def previousDeployment = new Deployment("44b87381-6616-462a-9437-27608246bc1b", author, LocalDateTime.now(), null, DeploymentStatusEnum.DEPLOYED, circle,
                "6ba1d6f1-d443-42d9-b9cc-89097d76ab70", "be8fce55-c2cf-4213-865b-69cf89178008", null)

        when:
        this.deploymentCallbackInteractor.execute(deploymentId, request)

        then:
        1 * this.deploymentRepository.findById(deploymentId) >> Optional.of(currentDeployment)

        0 * this.deploymentRepository.find(circle.id, DeploymentStatusEnum.DEPLOYED) >> Optional.of(previousDeployment)

        0 * this.deploymentRepository.updateStatus(previousDeployment.id, DeploymentStatusEnum.NOT_DEPLOYED)

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
        def deploymentId = "314d7293-47d0-4d68-900c-02b834a15cef"
        def request = new DeploymentCallbackRequest(DeploymentRequestStatus.UNDEPLOYED)
        def workspaceId = '1a58c78a-6acb-11ea-bc55-0242ac130003'
        def author = new User('4e806b2a-557b-45c5-91be-1e1db909bef6', 'User name', 'user@email.com', 'user.photo.png',
                new ArrayList<Workspace>(), false, LocalDateTime.now())
        def workspace = new Workspace(workspaceId, "Women", author, LocalDateTime.now(), [],
                WorkspaceStatusEnum.COMPLETE, "7a973eed-599b-428d-89f0-9ef6db8fd39d",
                "http://matcher-uri.com.br", "833336cd-742c-4f62-9594-45ac0a1e807a",
                "c5147c49-1923-44c5-870a-78aaba646fe4", null)

        def circle = new Circle("9aec1a44-77e7-49db-9998-54835cb4aae8", "default", "8997c35d-7861-4198-9c9b-a2491bf08911", author,
                LocalDateTime.now(), MatcherTypeEnum.REGULAR, null, null, null, false, "1a58c78a-6acb-11ea-bc55-0242ac130003")

        def currentDeployment = new Deployment(deploymentId, author, LocalDateTime.now(), null, DeploymentStatusEnum.UNDEPLOYING, circle,
                "97f508ad-cdbd-45df-969f-07781cc00513", "be8fce55-c2cf-4213-865b-69cf89178008", null)

        when:
        this.deploymentCallbackInteractor.execute(deploymentId, request)

        then:
        1 * this.workspaceRepository.find(workspaceId) >> Optional.of(workspace)
        1 * this.deploymentRepository.findById(deploymentId) >> Optional.of(currentDeployment)

        0 * this.deploymentRepository.find(circle.id, DeploymentStatusEnum.DEPLOYED)

        0 * this.deploymentRepository.updateStatus(_ as String, _ as DeploymentStatusEnum)

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
        def deploymentId = "314d7293-47d0-4d68-900c-02b834a15cef"
        def request = new DeploymentCallbackRequest(DeploymentRequestStatus.UNDEPLOY_FAILED)

        def author = new User('4e806b2a-557b-45c5-91be-1e1db909bef6', 'User name', 'user@email.com', 'user.photo.png',
                new ArrayList<Workspace>(), false, LocalDateTime.now())

        def circle = new Circle("9aec1a44-77e7-49db-9998-54835cb4aae8", "default", "8997c35d-7861-4198-9c9b-a2491bf08911", author,
                LocalDateTime.now(), MatcherTypeEnum.REGULAR, null, null, null, false, "1a58c78a-6acb-11ea-bc55-0242ac130003")

        def currentDeployment = new Deployment(deploymentId, author, LocalDateTime.now(), null, DeploymentStatusEnum.UNDEPLOYING, circle,
                "97f508ad-cdbd-45df-969f-07781cc00513", "be8fce55-c2cf-4213-865b-69cf89178008", null)

        when:
        this.deploymentCallbackInteractor.execute(deploymentId, request)

        then:
        1 * this.deploymentRepository.findById(deploymentId) >> Optional.of(currentDeployment)

        0 * this.deploymentRepository.find(circle.id, DeploymentStatusEnum.DEPLOYED)

        0 * this.deploymentRepository.updateStatus(_ as String, _ as DeploymentStatusEnum)

        1 * this.deploymentRepository.update(_) >> { arguments ->
            def deployment = arguments[0]

            assert deployment instanceof Deployment
            assert deployment.id == currentDeployment.id
            assert deployment.status == DeploymentStatusEnum.DEPLOYED
            assert deployment.circle.id == circle.id

            return deployment
        }
        0 * this.circleMatcherService.update(_, _, _,_)

        notThrown()
    }
    def 'when callback is in default circle should not update status in circle matcher'() {
        given:
        def deploymentId = "314d7293-47d0-4d68-900c-02b834a15cef"
        def request = new DeploymentCallbackRequest(DeploymentRequestStatus.SUCCEEDED)

        def author = new User('4e806b2a-557b-45c5-91be-1e1db909bef6', 'User name', 'user@email.com', 'user.photo.png',
                new ArrayList<Workspace>(), false, LocalDateTime.now())

        def circle = new Circle("9aec1a44-77e7-49db-9998-54835cb4aae8", "Default", "8997c35d-7861-4198-9c9b-a2491bf08911", author,
                LocalDateTime.now(), MatcherTypeEnum.REGULAR, null, null, null, true, "1a58c78a-6acb-11ea-bc55-0242ac130003")

        def currentDeployment = new Deployment(deploymentId, author, LocalDateTime.now(), null, DeploymentStatusEnum.UNDEPLOYING, circle,
                "97f508ad-cdbd-45df-969f-07781cc00513", "be8fce55-c2cf-4213-865b-69cf89178008", null)

        when:
        this.deploymentCallbackInteractor.execute(deploymentId, request)

        then:
        1 * this.deploymentRepository.findById(deploymentId) >> Optional.of(currentDeployment)
        1 * this.deploymentRepository.update(_)
        0 * circleMatcherService.update(_, _, _, _)
    }

    def 'when callback of deploy is SUCCEEDED should update status to active in circle matcher'() {
        given:
        def deploymentId = "314d7293-47d0-4d68-900c-02b834a15cef"
        def request = new DeploymentCallbackRequest(DeploymentRequestStatus.SUCCEEDED)

        def author = new User('4e806b2a-557b-45c5-91be-1e1db909bef6', 'User name', 'user@email.com', 'user.photo.png',
                new ArrayList<Workspace>(), false, LocalDateTime.now())
        def workspaceId = '1a58c78a-6acb-11ea-bc55-0242ac130003'

        def workspace = new Workspace(workspaceId, "Women", author, LocalDateTime.now(), [],
                WorkspaceStatusEnum.COMPLETE, "7a973eed-599b-428d-89f0-9ef6db8fd39d",
                "http://matcher-uri.com.br", "833336cd-742c-4f62-9594-45ac0a1e807a",
                "c5147c49-1923-44c5-870a-78aaba646fe4", null)

        def circle = new Circle("9aec1a44-77e7-49db-9998-54835cb4aae8", "Circle", "8997c35d-7861-4198-9c9b-a2491bf08911", author,
                LocalDateTime.now(), MatcherTypeEnum.REGULAR, null, null, null, false, "1a58c78a-6acb-11ea-bc55-0242ac130003")

        def currentDeployment = new Deployment(deploymentId, author, LocalDateTime.now(), null, DeploymentStatusEnum.UNDEPLOYING, circle,
                "97f508ad-cdbd-45df-969f-07781cc00513", "be8fce55-c2cf-4213-865b-69cf89178008", null)
        def previousDeployment = new Deployment("44b87381-6616-462a-9437-27608246bc1b", author, LocalDateTime.now(), null, DeploymentStatusEnum.DEPLOYED, circle,
                "6ba1d6f1-d443-42d9-b9cc-89097d76ab70", "be8fce55-c2cf-4213-865b-69cf89178008", null)
        when:
        this.deploymentCallbackInteractor.execute(deploymentId, request)

        then:
        1 * this.deploymentRepository.findById(deploymentId) >> Optional.of(currentDeployment)

        1 * this.workspaceRepository.find(workspaceId) >> Optional.of(workspace)

        1 * this.deploymentRepository.find(circle.id, DeploymentStatusEnum.DEPLOYED) >> Optional.of(previousDeployment)

        1 * this.deploymentRepository.update(_)

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
        def deploymentId = "314d7293-47d0-4d68-900c-02b834a15cef"
        def request = new DeploymentCallbackRequest(DeploymentRequestStatus.UNDEPLOYED)

        def author = new User('4e806b2a-557b-45c5-91be-1e1db909bef6', 'User name', 'user@email.com', 'user.photo.png',
                new ArrayList<Workspace>(), false, LocalDateTime.now())
        def workspaceId = '1a58c78a-6acb-11ea-bc55-0242ac130003'

        def workspace = new Workspace(workspaceId, "Women", author, LocalDateTime.now(), [],
                WorkspaceStatusEnum.COMPLETE, "7a973eed-599b-428d-89f0-9ef6db8fd39d",
                "http://matcher-uri.com.br", "833336cd-742c-4f62-9594-45ac0a1e807a",
                "c5147c49-1923-44c5-870a-78aaba646fe4", null)

        def circle = new Circle("9aec1a44-77e7-49db-9998-54835cb4aae8", "Circle", "8997c35d-7861-4198-9c9b-a2491bf08911", author,
                LocalDateTime.now(), MatcherTypeEnum.REGULAR, null, null, null, false, "1a58c78a-6acb-11ea-bc55-0242ac130003")

        def currentDeployment = new Deployment(deploymentId, author, LocalDateTime.now(), null, DeploymentStatusEnum.UNDEPLOYING, circle,
                "97f508ad-cdbd-45df-969f-07781cc00513", "be8fce55-c2cf-4213-865b-69cf89178008", null)
        def previousDeployment = new Deployment("44b87381-6616-462a-9437-27608246bc1b", author, LocalDateTime.now(), null, DeploymentStatusEnum.DEPLOYED, circle,
                "6ba1d6f1-d443-42d9-b9cc-89097d76ab70", "be8fce55-c2cf-4213-865b-69cf89178008", null)
        when:
        this.deploymentCallbackInteractor.execute(deploymentId, request)

        then:
        1 * this.workspaceRepository.find(workspaceId) >> Optional.of(workspace)

        1 * this.deploymentRepository.findById(deploymentId) >> Optional.of(currentDeployment)

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
        def deploymentId = "314d7293-47d0-4d68-900c-02b834a15cef"
        def request = new DeploymentCallbackRequest(DeploymentRequestStatus.FAILED)

        def author = new User('4e806b2a-557b-45c5-91be-1e1db909bef6', 'User name', 'user@email.com', 'user.photo.png',
                new ArrayList<Workspace>(), false, LocalDateTime.now())
        def workspaceId = '1a58c78a-6acb-11ea-bc55-0242ac130003'

        def workspace = new Workspace(workspaceId, "Women", author, LocalDateTime.now(), [],
                WorkspaceStatusEnum.COMPLETE, "7a973eed-599b-428d-89f0-9ef6db8fd39d",
                "http://matcher-uri.com.br", "833336cd-742c-4f62-9594-45ac0a1e807a",
                "c5147c49-1923-44c5-870a-78aaba646fe4", null)

        def circle = new Circle("9aec1a44-77e7-49db-9998-54835cb4aae8", "Circle", "8997c35d-7861-4198-9c9b-a2491bf08911", author,
                LocalDateTime.now(), MatcherTypeEnum.REGULAR, null, null, null, false, "1a58c78a-6acb-11ea-bc55-0242ac130003")

        def currentDeployment = new Deployment(deploymentId, author, LocalDateTime.now(), null, DeploymentStatusEnum.UNDEPLOYING, circle,
                "97f508ad-cdbd-45df-969f-07781cc00513", "be8fce55-c2cf-4213-865b-69cf89178008", null)
        def previousDeployment = new Deployment("44b87381-6616-462a-9437-27608246bc1b", author, LocalDateTime.now(), null, DeploymentStatusEnum.DEPLOYED, circle,
                "6ba1d6f1-d443-42d9-b9cc-89097d76ab70", "be8fce55-c2cf-4213-865b-69cf89178008", null)
        when:
        this.deploymentCallbackInteractor.execute(deploymentId, request)

        then:
        0 * this.workspaceRepository.find(workspaceId) >> Optional.of(workspace)

        1 * this.deploymentRepository.findById(deploymentId) >> Optional.of(currentDeployment)

        0 * this.circleMatcherService.update(_, _, _, _)
    }

    def 'when callback of deploy is UNDEPLOY_FAILED should not update status in circle matcher'() {
        given:
        def deploymentId = "314d7293-47d0-4d68-900c-02b834a15cef"
        def request = new DeploymentCallbackRequest(DeploymentRequestStatus.UNDEPLOY_FAILED)

        def author = new User('4e806b2a-557b-45c5-91be-1e1db909bef6', 'User name', 'user@email.com', 'user.photo.png',
                new ArrayList<Workspace>(), false, LocalDateTime.now())
        def workspaceId = '1a58c78a-6acb-11ea-bc55-0242ac130003'

        def workspace = new Workspace(workspaceId, "Women", author, LocalDateTime.now(), [],
                WorkspaceStatusEnum.COMPLETE, "7a973eed-599b-428d-89f0-9ef6db8fd39d",
                "http://matcher-uri.com.br", "833336cd-742c-4f62-9594-45ac0a1e807a",
                "c5147c49-1923-44c5-870a-78aaba646fe4", null)

        def circle = new Circle("9aec1a44-77e7-49db-9998-54835cb4aae8", "Circle", "8997c35d-7861-4198-9c9b-a2491bf08911", author,
                LocalDateTime.now(), MatcherTypeEnum.REGULAR, null, null, null, false, "1a58c78a-6acb-11ea-bc55-0242ac130003")

        def currentDeployment = new Deployment(deploymentId, author, LocalDateTime.now(), null, DeploymentStatusEnum.UNDEPLOYING, circle,
                "97f508ad-cdbd-45df-969f-07781cc00513", "be8fce55-c2cf-4213-865b-69cf89178008", null)
        def previousDeployment = new Deployment("44b87381-6616-462a-9437-27608246bc1b", author, LocalDateTime.now(), null, DeploymentStatusEnum.DEPLOYED, circle,
                "6ba1d6f1-d443-42d9-b9cc-89097d76ab70", "be8fce55-c2cf-4213-865b-69cf89178008", null)
        when:
        this.deploymentCallbackInteractor.execute(deploymentId, request)

        then:
        0 * this.workspaceRepository.find(workspaceId) >> Optional.of(workspace)

        1 * this.deploymentRepository.findById(deploymentId) >> Optional.of(currentDeployment)

        0 * this.circleMatcherService.update(_, _, _, )
    }

    def "when callback is of a circle created with csv should create the correct list of nodes "() {
        given:
        def deploymentId = "314d7293-47d0-4d68-900c-02b834a15cef"
        def request = new DeploymentCallbackRequest(DeploymentRequestStatus.SUCCEEDED)
        def rulePart = new NodePart.RulePart("exampleId", NodePart.ConditionEnum.EQUAL, ["4567"])
        def rulePart2 = new NodePart.RulePart("exampleId", NodePart.ConditionEnum.EQUAL, ["5678"])
        def rule = new NodePart(NodePart.NodeTypeRequest.RULE, null, null, rulePart)
        def rule2 = new NodePart(NodePart.NodeTypeRequest.RULE, null, null, rulePart2)
        def clause = new NodePart(NodePart.NodeTypeRequest.CLAUSE, NodePart.LogicalOperatorRequest.AND, [rule, rule2], null)
        def clauses = new NodePart(NodePart.NodeTypeRequest.CLAUSE, NodePart.LogicalOperatorRequest.AND, [clause], null)

        def author = new User('4e806b2a-557b-45c5-91be-1e1db909bef6', 'User name', 'user@email.com', 'user.photo.png',
                new ArrayList<Workspace>(), false, LocalDateTime.now())
        def workspaceId = '1a58c78a-6acb-11ea-bc55-0242ac130003'

        def workspace = new Workspace(workspaceId, "Women", author, LocalDateTime.now(), [],
                WorkspaceStatusEnum.COMPLETE, "7a973eed-599b-428d-89f0-9ef6db8fd39d",
                "http://matcher-uri.com.br", "833336cd-742c-4f62-9594-45ac0a1e807a",
                "c5147c49-1923-44c5-870a-78aaba646fe4", null)

        def circle = new Circle("9aec1a44-77e7-49db-9998-54835cb4aae8", "Circle", "8997c35d-7861-4198-9c9b-a2491bf08911", author,
                LocalDateTime.now(), MatcherTypeEnum.SIMPLE_KV, new ObjectMapper().valueToTree(clauses), null, null, false, "1a58c78a-6acb-11ea-bc55-0242ac130003")

        def currentDeployment = new Deployment(deploymentId, author, LocalDateTime.now(), null, DeploymentStatusEnum.UNDEPLOYING, circle,
                "97f508ad-cdbd-45df-969f-07781cc00513", "be8fce55-c2cf-4213-865b-69cf89178008", null)
        def previousDeployment = new Deployment("44b87381-6616-462a-9437-27608246bc1b", author, LocalDateTime.now(), null, DeploymentStatusEnum.DEPLOYED, circle,
                "6ba1d6f1-d443-42d9-b9cc-89097d76ab70", "be8fce55-c2cf-4213-865b-69cf89178008", null)
        when:
        this.deploymentCallbackInteractor.execute(deploymentId, request)

        then:
        1 * this.deploymentRepository.findById(deploymentId) >> Optional.of(currentDeployment)

        1 * this.workspaceRepository.find(workspaceId) >> Optional.of(workspace)

        1 * this.deploymentRepository.find(circle.id, DeploymentStatusEnum.DEPLOYED) >> Optional.of(previousDeployment)

        1 * this.deploymentRepository.update(_)

        1 * this.circleMatcherService.updateImport(_, _, _, _, _) >> { arguments ->
            def circleCompare = arguments[0]
            def reference = arguments[1]
            def nodes = arguments[2]
            def matcherUrl = arguments[3]
            def active = arguments[4]


            assert nodes instanceof List<JsonNode>
            assert nodes.size() == 2
            def ruleCompare = objectMapper.treeToValue(nodes[0],NodePart.class)
            def ruleCompare2 = objectMapper.treeToValue(nodes[1],NodePart.class)
            assert ruleCompare.content.key == rule.content.key
            assert ruleCompare.content.value == rule.content.value
            assert ruleCompare2.content.value == rule2.content.value
            assert circleCompare instanceof Circle
            assert circleCompare.id == circle.id
            assert matcherUrl.toString() == workspace.circleMatcherUrl
            assert reference == circle.reference
            assert active == true
        }

    }

    def "when callback is of a circle created with csv and rules are empty should create a empty list of nodes "() {
        given:
        def deploymentId = "314d7293-47d0-4d68-900c-02b834a15cef"
        def request = new DeploymentCallbackRequest(DeploymentRequestStatus.SUCCEEDED)

        def author = new User('4e806b2a-557b-45c5-91be-1e1db909bef6', 'User name', 'user@email.com', 'user.photo.png',
                new ArrayList<Workspace>(), false, LocalDateTime.now())
        def workspaceId = '1a58c78a-6acb-11ea-bc55-0242ac130003'

        def workspace = new Workspace(workspaceId, "Women", author, LocalDateTime.now(), [],
                WorkspaceStatusEnum.COMPLETE, "7a973eed-599b-428d-89f0-9ef6db8fd39d",
                "http://matcher-uri.com.br", "833336cd-742c-4f62-9594-45ac0a1e807a",
                "c5147c49-1923-44c5-870a-78aaba646fe4", null)

        def circle = new Circle("9aec1a44-77e7-49db-9998-54835cb4aae8", "Circle", "8997c35d-7861-4198-9c9b-a2491bf08911", author,
                LocalDateTime.now(), MatcherTypeEnum.SIMPLE_KV, null, null, null, false, "1a58c78a-6acb-11ea-bc55-0242ac130003")

        def currentDeployment = new Deployment(deploymentId, author, LocalDateTime.now(), null, DeploymentStatusEnum.UNDEPLOYING, circle,
                "97f508ad-cdbd-45df-969f-07781cc00513", "be8fce55-c2cf-4213-865b-69cf89178008", null)
        def previousDeployment = new Deployment("44b87381-6616-462a-9437-27608246bc1b", author, LocalDateTime.now(), null, DeploymentStatusEnum.DEPLOYED, circle,
                "6ba1d6f1-d443-42d9-b9cc-89097d76ab70", "be8fce55-c2cf-4213-865b-69cf89178008", null)
        when:
        this.deploymentCallbackInteractor.execute(deploymentId, request)

        then:
        1 * this.deploymentRepository.findById(deploymentId) >> Optional.of(currentDeployment)

        1 * this.workspaceRepository.find(workspaceId) >> Optional.of(workspace)

        1 * this.deploymentRepository.find(circle.id, DeploymentStatusEnum.DEPLOYED) >> Optional.of(previousDeployment)

        1 * this.deploymentRepository.update(_)

        0 * this.circleMatcherService.updateImport(_, _, _, _, _) >> { arguments ->
        }

    }

}
