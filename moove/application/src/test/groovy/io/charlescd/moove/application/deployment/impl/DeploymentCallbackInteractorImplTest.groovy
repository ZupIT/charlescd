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

import io.charlescd.moove.application.BuildService
import io.charlescd.moove.application.DeploymentService
import io.charlescd.moove.application.WebhookEventService
import io.charlescd.moove.application.deployment.DeploymentCallbackInteractor
import io.charlescd.moove.application.deployment.request.DeploymentCallbackRequest
import io.charlescd.moove.application.deployment.request.DeploymentRequestStatus
import io.charlescd.moove.domain.*
import io.charlescd.moove.domain.exceptions.NotFoundException
import io.charlescd.moove.domain.repository.BuildRepository
import io.charlescd.moove.domain.repository.DeploymentRepository
import io.charlescd.moove.domain.service.HermesService
import spock.lang.Specification

import java.time.LocalDateTime

class DeploymentCallbackInteractorImplTest extends Specification {

    private DeploymentCallbackInteractor deploymentCallbackInteractor

    private DeploymentRepository deploymentRepository = Mock(DeploymentRepository)
    private HermesService hermesService = Mock(HermesService)
    private BuildRepository buildRepository = Mock(BuildRepository)

    void setup() {
        this.deploymentCallbackInteractor = new DeploymentCallbackInteractorImpl(new DeploymentService(deploymentRepository), new WebhookEventService(hermesService, new BuildService(buildRepository)))
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

        def currentDeployment = new Deployment(deploymentId, author, LocalDateTime.now(), null, DeploymentStatusEnum.DEPLOYING, circle,
                buildId, "be8fce55-c2cf-4213-865b-69cf89178008", null)

        def previousDeployment = new Deployment("44b87381-6616-462a-9437-27608246bc1b", author, LocalDateTime.now(), null, DeploymentStatusEnum.DEPLOYED, circle,
                "6ba1d6f1-d443-42d9-b9cc-89097d76ab70", "be8fce55-c2cf-4213-865b-69cf89178008", null)

        when:
        this.deploymentCallbackInteractor.execute(deploymentId, request)

        then:
        1 * this.deploymentRepository.findById(deploymentId) >> Optional.of(currentDeployment)

        1 * this.deploymentRepository.find(circle.id, DeploymentStatusEnum.DEPLOYED) >> Optional.of(previousDeployment)

        1 * this.deploymentRepository.updateStatus(previousDeployment.id, DeploymentStatusEnum.NOT_DEPLOYED)

        1 * this.buildRepository.findById(buildId) >> Optional.of(getBuild(DeploymentStatusEnum.DEPLOYED))

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

    def "when deployment exists and callback is success should update status of current and do not update previous deployment because is default circle"() {
        given:
        def request = new DeploymentCallbackRequest(DeploymentRequestStatus.SUCCEEDED)

        def circle = new Circle("9aec1a44-77e7-49db-9998-54835cb4aae8", "default", "8997c35d-7861-4198-9c9b-a2491bf08911", author,
                LocalDateTime.now(), MatcherTypeEnum.REGULAR, null, null, null, true, "1a58c78a-6acb-11ea-bc55-0242ac130003")

        def currentDeployment = new Deployment(deploymentId, author, LocalDateTime.now(), null, DeploymentStatusEnum.DEPLOYING, circle,
                buildId, workspaceId, null)

        def previousDeployment = new Deployment("44b87381-6616-462a-9437-27608246bc1b", author, LocalDateTime.now(), null, DeploymentStatusEnum.DEPLOYED, circle,
                "6ba1d6f1-d443-42d9-b9cc-89097d76ab70", workspaceId, null)
        when:
        this.deploymentCallbackInteractor.execute(deploymentId, request)

        then:
        1 * this.deploymentRepository.findById(deploymentId) >> Optional.of(currentDeployment)

        0 * this.deploymentRepository.find(circle.id, DeploymentStatusEnum.DEPLOYED) >> Optional.of(previousDeployment)

        0 * this.deploymentRepository.updateStatus(previousDeployment.id, DeploymentStatusEnum.NOT_DEPLOYED)

        1 * this.buildRepository.findById(buildId) >> Optional.of(getBuild(DeploymentStatusEnum.DEPLOYED))

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

        def currentDeployment = new Deployment(deploymentId, author, LocalDateTime.now(), null, DeploymentStatusEnum.DEPLOYING, circle,
                buildId, "be8fce55-c2cf-4213-865b-69cf89178008", null)

        def previousDeployment = new Deployment("44b87381-6616-462a-9437-27608246bc1b", author, LocalDateTime.now(), null, DeploymentStatusEnum.DEPLOYED, circle,
                "6ba1d6f1-d443-42d9-b9cc-89097d76ab70", "be8fce55-c2cf-4213-865b-69cf89178008", null)

        when:
        this.deploymentCallbackInteractor.execute(deploymentId, request)

        then:
        1 * this.deploymentRepository.findById(deploymentId) >> Optional.of(currentDeployment)

        0 * this.deploymentRepository.find(circle.id, DeploymentStatusEnum.DEPLOYED) >> Optional.of(previousDeployment)

        0 * this.deploymentRepository.updateStatus(previousDeployment.id, DeploymentStatusEnum.NOT_DEPLOYED)

        1 * this.buildRepository.findById(buildId) >> Optional.of(getBuild(DeploymentStatusEnum.DEPLOY_FAILED))

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

        def currentDeployment = new Deployment(deploymentId, author, LocalDateTime.now(), null, DeploymentStatusEnum.DEPLOYING, circle,
                buildId, "be8fce55-c2cf-4213-865b-69cf89178008", null)

        def previousDeployment = new Deployment("44b87381-6616-462a-9437-27608246bc1b", author, LocalDateTime.now(), null, DeploymentStatusEnum.DEPLOYED, circle,
                "6ba1d6f1-d443-42d9-b9cc-89097d76ab70", "be8fce55-c2cf-4213-865b-69cf89178008", null)

        when:
        this.deploymentCallbackInteractor.execute(deploymentId, request)

        then:
        1 * this.deploymentRepository.findById(deploymentId) >> Optional.of(currentDeployment)

        0 * this.deploymentRepository.find(circle.id, DeploymentStatusEnum.DEPLOYED) >> Optional.of(previousDeployment)

        0 * this.deploymentRepository.updateStatus(previousDeployment.id, DeploymentStatusEnum.NOT_DEPLOYED)

        1 * this.buildRepository.findById(buildId) >> Optional.of(getBuild(DeploymentStatusEnum.DEPLOY_FAILED))

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


        def currentDeployment = new Deployment(deploymentId, author, LocalDateTime.now(), LocalDateTime.now(), DeploymentStatusEnum.UNDEPLOYING, circle,
                buildId, "be8fce55-c2cf-4213-865b-69cf89178008", null)

        when:
        this.deploymentCallbackInteractor.execute(deploymentId, request)

        then:
        1 * this.deploymentRepository.findById(deploymentId) >> Optional.of(currentDeployment)

        0 * this.deploymentRepository.find(circle.id, DeploymentStatusEnum.DEPLOYED)

        0 * this.deploymentRepository.updateStatus(_ as String, _ as DeploymentStatusEnum)

        1 * this.buildRepository.findById(buildId) >> Optional.of(getBuild(DeploymentStatusEnum.DEPLOYED))

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

        def currentDeployment = new Deployment(deploymentId, author, LocalDateTime.now(), null, DeploymentStatusEnum.UNDEPLOYING, circle,
                buildId, workspaceId, null)

        when:
        this.deploymentCallbackInteractor.execute(deploymentId, request)

        then:
        1 * this.deploymentRepository.findById(deploymentId) >> Optional.of(currentDeployment)

        0 * this.deploymentRepository.find(circle.id, DeploymentStatusEnum.DEPLOYED)

        0 * this.deploymentRepository.updateStatus(_ as String, _ as DeploymentStatusEnum)

        1 * this.buildRepository.findById(buildId) >> Optional.of(getBuild(DeploymentStatusEnum.DEPLOYED))

        1 * this.hermesService.notifySubscriptionEvent(_)

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

    private static getCircle() {
        return new Circle("9aec1a44-77e7-49db-9998-54835cb4aae8", "default", "8997c35d-7861-4198-9c9b-a2491bf08911", author,
                LocalDateTime.now(), MatcherTypeEnum.REGULAR, null, null, null, false, workspaceId)

    }

    private static getBuild(DeploymentStatusEnum status) {
        return new Build(buildId, author, LocalDateTime.now(), listFeatureSnapshot(),
                'tag-name', '6181aaf1-10c4-47d8-963a-3b87186debbb', 'f53020d7-6c85-4191-9295-440a3e7c1307', BuildStatusEnum.BUILT,
                workspaceId, listDeployment(status))
    }

    private static listDeployment(DeploymentStatusEnum status) {
        def deployments = new ArrayList<Deployment>()

        def deployment = new Deployment(deploymentId, author, LocalDateTime.now(), null, status, circle,
                buildId, workspaceId, null)

        deployments.add(deployment)
        return deployments
    }

//    private static getCurrentDeployment() {
//        return new Deployment(deploymentId, author, LocalDateTime.now(), null, DeploymentStatusEnum.DEPLOYING, circle,
//                buildId, workspaceId, null)
//    }
//
//    private static getPreviousDeployment() {
//        return new Deployment("44b87381-6616-462a-9437-27608246bc1b", author, LocalDateTime.now(), null, DeploymentStatusEnum.DEPLOYED, circle,
//                "6ba1d6f1-d443-42d9-b9cc-89097d76ab70", workspaceId, null)
//
//    }
}
