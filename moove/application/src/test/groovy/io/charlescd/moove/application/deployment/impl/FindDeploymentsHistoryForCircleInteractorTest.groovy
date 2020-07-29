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


import io.charlescd.moove.domain.*
import io.charlescd.moove.domain.repository.ComponentRepository
import io.charlescd.moove.domain.repository.DeploymentRepository
import spock.lang.Specification

import java.time.Duration
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.LocalTime

class FindDeploymentsHistoryForCircleInteractorTest extends Specification {

    def componentRepository = Mock(ComponentRepository)
    def deploymentRepository = Mock(DeploymentRepository)

    def findDeploymentHistoryIteractor = new FindDeploymentsHistoryForCircleInteractorImpl(deploymentRepository, componentRepository)

    def workspaceId = "workspaceId"
    def pageRequest = new PageRequest(0, 10)

    def 'should return not search for components when no deployment found'() {
        given:
        def circle = "circle-id-1"

        when:
        def result = findDeploymentHistoryIteractor.execute(workspaceId, circle, pageRequest)

        then:
        1 * deploymentRepository.findDeploymentsHistory(workspaceId, _ as DeploymentHistoryFilter, pageRequest) >> new Page<DeploymentHistory>([], 0, 10, 0)
        0 * componentRepository.findComponentsAtDeployments(workspaceId, _)
        0 * _

        result.content.isEmpty()
        result.page == 0
        result.size == 10
        result.totalPages == 1
        result.isLast
    }

    def 'should verify filter passed contains status and circle id'() {
        given:
        def circle = "circle-id-1"

        DeploymentHistoryFilter parameteres = null

        when:
        findDeploymentHistoryIteractor.execute(workspaceId, circle, pageRequest)

        then:
        1 * deploymentRepository.findDeploymentsHistory(workspaceId, _ as DeploymentHistoryFilter, pageRequest) >>
                { arguments ->
                    parameteres = (DeploymentHistoryFilter) arguments[1]
                    return new Page<DeploymentHistory>([], 0, 10, 0)
                }
        0 * componentRepository.findComponentsAtDeployments(workspaceId, _)
        0 * _

        parameteres.deploymentName == null
        parameteres.periodBefore == null
        parameteres.deploymentStatus == [DeploymentStatusEnum.DEPLOYED, DeploymentStatusEnum.NOT_DEPLOYED, DeploymentStatusEnum.DEPLOY_FAILED]
        parameteres.circlesIds == [circle]
    }

    def 'should return when deployments found'() {
        given:
        def circle = "circle-id-1"
        def firstDate = LocalDateTime.of(LocalDate.of(2020, 07, 16), LocalTime.now())
        def secondDate = LocalDateTime.of(LocalDate.of(2020, 07, 20), LocalTime.now())
        def deployments = [new DeploymentHistory("deployment-id-1", firstDate, DeploymentStatusEnum.DEPLOYED, "Fulano", "release-123",
                null, firstDate, Duration.ofSeconds(120), "abc123"),
                           new DeploymentHistory("deployment-id-2", secondDate, DeploymentStatusEnum.DEPLOYED, "Fulano", "release-123",
                                   null, secondDate, Duration.ofSeconds(120), "abc123")]

        def components = [new ComponentHistory("deployment-id-1", "component-1", "charles", "version 413"),
                          new ComponentHistory("deployment-id-1", "component-2", "charles", "version 413"),
                          new ComponentHistory("deployment-id-2", "component-1", "charles", "version 413")]

        when:
        def result = findDeploymentHistoryIteractor.execute(workspaceId, circle, pageRequest)

        then:
        1 * deploymentRepository.findDeploymentsHistory(workspaceId, _ as DeploymentHistoryFilter, pageRequest) >> new Page<DeploymentHistory>(deployments, 0, 10, 2)
        1 * componentRepository.findComponentsAtDeployments(workspaceId, ["deployment-id-1", "deployment-id-2"]) >> components
        0 * _

        result.content.size() == 2
        result.page == 0
        result.size == 10
        result.totalPages == 1
        result.isLast

        result.content[0].id == "deployment-id-2"
        result.content[0].components.size() == 1
        result.content[1].id == "deployment-id-1"
        result.content[1].components.size() == 2
    }
}
