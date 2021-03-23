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

package io.charlescd.moove.application.deployment

import io.charlescd.moove.application.DeploymentService
import io.charlescd.moove.application.UserService
import io.charlescd.moove.domain.Circle
import io.charlescd.moove.domain.Deployment
import io.charlescd.moove.domain.DeploymentStatusEnum
import io.charlescd.moove.domain.MatcherTypeEnum
import io.charlescd.moove.domain.Page
import io.charlescd.moove.domain.PageRequest
import io.charlescd.moove.domain.User
import io.charlescd.moove.domain.exceptions.BusinessException
import io.charlescd.moove.domain.exceptions.NotFoundException
import io.charlescd.moove.domain.repository.DeploymentRepository
import io.charlescd.moove.domain.repository.UserRepository
import io.charlescd.moove.domain.service.ManagementUserSecurityService
import spock.lang.Specification

import java.time.LocalDateTime

class DeploymentServiceTest extends Specification {

    private DeploymentService deploymentService

    private DeploymentRepository deploymentRepository = Mock(DeploymentRepository)

    void setup() {
        this.deploymentService = new DeploymentService(deploymentRepository)
    }

    def "when create deployment should not throw"() {
        given:
        def deployment = getDummyDeployment()

        when:
        this.deploymentService.save(deployment)

        then:
        1 * this.deploymentRepository.save(deployment)

        notThrown()
    }

    def "when find a deployment by cirlcleId and workspaceId should not throw"() {
        given:
        def deployment = getDummyDeployment()
        def deploymentList = new ArrayList();
        deploymentList.add(deployment)

        when:
        this.deploymentService.findLastActive(deployment.circle.id, deployment.workspaceId)

        then:
        1 * this.deploymentRepository.findActiveByCircleIdAndWorkspaceId(deployment.circle.id, deployment.workspaceId) >> deploymentList
        notThrown()
    }

    def "when find last deployment active by cirlcleId and workspaceId should not throw"() {
        given:
        def deployment = getDummyDeployment()
        def deploymentList = new ArrayList();
        deploymentList.add(deployment)

        when:
        this.deploymentService.findLastActive(deployment.circle.id, deployment.workspaceId)

        then:
        1 * this.deploymentRepository.findActiveByCircleIdAndWorkspaceId(deployment.circle.id, deployment.workspaceId) >> deploymentList
        notThrown()
    }

    def "when find last deployment active by cirlcleId should not throw"() {
        given:
        def deployment = getDummyDeployment()
        def deploymentList = new ArrayList();
        deploymentList.add(deployment)

        when:
        this.deploymentService.findLastActive(deployment.circle.id)

        then:
        1 * this.deploymentRepository.findActiveByCircleId(deployment.circle.id) >> deploymentList
        notThrown()
    }

    def "when find active list deployment active by cirlcleId should not throw"() {
        given:
        def deployment = getDummyDeployment()
        def deploymentList = new ArrayList();
        deploymentList.add(deployment)

        when:
        this.deploymentService.findActiveList(deployment.circle.id)

        then:
        1 * this.deploymentRepository.findActiveByCircleId(deployment.circle.id) >> deploymentList
        notThrown()
    }

    def "when find active list deployment active by cirlcleId and workspaceId should not throw"() {
        given:
        def deployment = getDummyDeployment()
        def deploymentList = new ArrayList();
        deploymentList.add(deployment)

        when:
        this.deploymentService.findActiveList(deployment.circle.id, deployment.workspaceId)

        then:
        1 * this.deploymentRepository.findActiveByCircleIdAndWorkspaceId(deployment.circle.id, deployment.workspaceId) >> deploymentList
        notThrown()
    }

    def "when update deployment status should not throw"() {
        given:
        def deployment = getDummyDeployment()

        when:
        this.deploymentService.updateStatus(deployment.id, DeploymentStatusEnum.DEPLOYED)

        then:
        1 * this.deploymentRepository.updateStatus(deployment.id, DeploymentStatusEnum.DEPLOYED)
        notThrown()
    }

    def "when delete a deployment should not throw"() {

        when:
        this.deploymentService.updateStatus("deploymentId", DeploymentStatusEnum.DEPLOYED)

        then:
        1 * this.deploymentRepository.updateStatus("deploymentId", DeploymentStatusEnum.DEPLOYED)
        notThrown()
    }

    private User getDummyUser() {
        new User("qwerty-12345-asdf-98760", "charles", "email@email.com", "http://charles.com/dummy_photo.jpg", [], false, LocalDateTime.now())
    }
    private Circle getDummyCircle() {
        new Circle("qwerty-12345-asdf-98760", "charles", "reference", getDummyUser(),
                LocalDateTime.now(), MatcherTypeEnum.REGULAR, null, null, null, true, "worspaceId", false, null)
    }


    private Deployment getDummyDeployment() {
        new Deployment(
                "qwerty-12345-asdf-98760",
                getDummyUser(),
                LocalDateTime.now(),
                null,
                DeploymentStatusEnum.DEPLOYING, getDummyCircle(),  "buildId", "workspaceId", LocalDateTime.now())
    }

}
