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

import io.charlescd.moove.application.deployment.DeploymentCallbackInteractor
import io.charlescd.moove.application.deployment.request.DeploymentCallbackRequest
import io.charlescd.moove.application.deployment.request.DeploymentRequestStatus
import io.charlescd.moove.domain.*
import io.charlescd.moove.domain.exceptions.NotFoundException
import io.charlescd.moove.domain.repository.DeploymentRepository
import spock.lang.Specification

import java.time.LocalDateTime

class DeploymentCallbackInteractorImplTest extends Specification {

    private DeploymentCallbackInteractor deploymentCallbackInteractor

    private DeploymentRepository deploymentRepository = Mock(DeploymentRepository)

    void setup() {
        this.deploymentCallbackInteractor = new DeploymentCallbackInteractorImpl(deploymentRepository)
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

        def circle = new Circle("9aec1a44-77e7-49db-9998-54835cb4aae8", "default", "8997c35d-7861-4198-9c9b-a2491bf08911", author,
                LocalDateTime.now(), MatcherTypeEnum.REGULAR, null, null, null, false, "1a58c78a-6acb-11ea-bc55-0242ac130003")

        def currentDeployment = new Deployment(deploymentId, author, LocalDateTime.now(), null, DeploymentStatusEnum.DEPLOYING, circle,
                "97f508ad-cdbd-45df-969f-07781cc00513", "be8fce55-c2cf-4213-865b-69cf89178008")

        def previousDeployment = new Deployment("44b87381-6616-462a-9437-27608246bc1b", author, LocalDateTime.now(), null, DeploymentStatusEnum.DEPLOYED, circle,
                "6ba1d6f1-d443-42d9-b9cc-89097d76ab70", "be8fce55-c2cf-4213-865b-69cf89178008")

        when:
        this.deploymentCallbackInteractor.execute(deploymentId, request)

        then:
        1 * this.deploymentRepository.findById(deploymentId) >> Optional.of(currentDeployment)

        1 * this.deploymentRepository.find(circle.id, DeploymentStatusEnum.DEPLOYED) >> Optional.of(previousDeployment)

        1 * this.deploymentRepository.updateStatus(previousDeployment.id, DeploymentStatusEnum.NOT_DEPLOYED)

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
}
