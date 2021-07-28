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

import io.charlescd.moove.application.deployment.request.DeploymentHistoryFilterRequest
import io.charlescd.moove.domain.*
import io.charlescd.moove.domain.repository.ComponentRepository
import io.charlescd.moove.domain.repository.DeploymentRepository
import spock.lang.Specification

import java.time.Duration
import java.time.LocalDateTime

class FindDeploymentsHistoryInteractorTest extends Specification {

    def componentRepository = Mock(ComponentRepository)
    def deploymentRepository = Mock(DeploymentRepository)

    def findDeploymentHistoryIteractor = new FindDeploymentsHistoryInteractorImpl(componentRepository, deploymentRepository)

    def workspaceId = "workspace-id"
    def pageRequest = new PageRequest(0, 10)

    def 'should not call components search when no deployment found'() {
        given:
        def filter = new DeploymentHistoryFilterRequest("some-name", PeriodTypeEnum.ONE_MONTH, ["circle-1"], [DeploymentStatusEnum.DEPLOYED])

        when:
        def result = findDeploymentHistoryIteractor.execute(workspaceId, filter, pageRequest)

        then:
        1 * deploymentRepository.findDeploymentsHistory(workspaceId, _ as DeploymentHistoryFilter, pageRequest) >> new Page<DeploymentHistory>([], 0, 10, 0)
        0 * componentRepository.findComponentsAtDeployments(workspaceId, _ as List<String>)
        1 * deploymentRepository.countGroupedByStatus(workspaceId, _ as DeploymentHistoryFilter) >> []
        0 * _

        result.summary.deployed == 0
        result.summary.undeploying == 0
        result.summary.notDeployed == 0
        result.summary.deploying == 0
        result.summary.failed == 0
        result.page.page == 0
        result.page.size == 10
        result.page.isLast
        result.page.totalPages == 1
        result.page.content.isEmpty()
    }

    def 'should return ok when deployments found'() {
        given:
        def filter = new DeploymentHistoryFilterRequest(null, PeriodTypeEnum.ONE_WEEK, null, [DeploymentStatusEnum.DEPLOYED])

        def deployments = [new DeploymentHistory("abc-123", LocalDateTime.now(), DeploymentStatusEnum.DEPLOYED, "Fulano", "release-ayora",
                null, LocalDateTime.now(), Duration.ofSeconds(120), "circle-1"),
                           new DeploymentHistory("abc-456", LocalDateTime.now(), DeploymentStatusEnum.DEPLOYED, "Fulano", "release-ayora",
                                   null, LocalDateTime.now(), Duration.ofSeconds(120), "circle-2")]

        def components = [new ComponentHistory("abc-123", "component 1", "module-1", "version 18.09"),
                          new ComponentHistory("abc-456", "component 2", "module-1", "version 18.09")]

        when:
        def result = findDeploymentHistoryIteractor.execute(workspaceId, filter, pageRequest)

        then:
        1 * deploymentRepository.findDeploymentsHistory(workspaceId, _ as DeploymentHistoryFilter, pageRequest) >> new Page<DeploymentHistory>(deployments, 0, 10, 2)
        1 * componentRepository.findComponentsAtDeployments(workspaceId, ["abc-123", "abc-456"]) >> components
        1 * deploymentRepository.countGroupedByStatus(workspaceId, _ as DeploymentHistoryFilter) >> [new DeploymentCount(2, DeploymentStatusEnum.DEPLOYED)]
        0 * _

        result.summary.deployed == 2
        result.summary.undeploying == 0
        result.summary.notDeployed == 0
        result.summary.deploying == 0
        result.summary.failed == 0
        result.page.page == 0
        result.page.size == 10
        result.page.isLast
        result.page.totalPages == 1
        result.page.content.size() == 2
    }

    def 'should return deploy duration in seconds'() {
        given:
        def filter = new DeploymentHistoryFilterRequest(null, PeriodTypeEnum.ONE_WEEK, null, [DeploymentStatusEnum.DEPLOYED])

        def deployments = [new DeploymentHistory("abc-123", LocalDateTime.now(), DeploymentStatusEnum.DEPLOYED, "Fulano", "release-ayora",
                null, LocalDateTime.now(), Duration.ofMinutes(2), "circle-1")]

        def components = [new ComponentHistory("abc-123", "component 1", "module-1", "version 18.09")]

        when:
        def result = findDeploymentHistoryIteractor.execute(workspaceId, filter, pageRequest)

        then:
        1 * deploymentRepository.findDeploymentsHistory(workspaceId, _ as DeploymentHistoryFilter, pageRequest) >> new Page<DeploymentHistory>(deployments, 0, 10, 1)
        1 * componentRepository.findComponentsAtDeployments(workspaceId, ["abc-123"]) >> components
        1 * deploymentRepository.countGroupedByStatus(workspaceId, _ as DeploymentHistoryFilter) >> [new DeploymentCount(1, DeploymentStatusEnum.DEPLOYED)]
        0 * _

        result.summary.deployed == 1
        result.summary.undeploying == 0
        result.summary.notDeployed == 0
        result.summary.deploying == 0
        result.summary.failed == 0
        result.page.page == 0
        result.page.size == 10
        result.page.isLast
        result.page.totalPages == 1
        result.page.content.size() == 1
        result.page.content[0].deployDuration == 120
    }

    def 'should return summary with values when deployments found'() {
        given:
        def filter = new DeploymentHistoryFilterRequest(null, PeriodTypeEnum.ONE_WEEK, null, [DeploymentStatusEnum.DEPLOYED])

        def deployments = [new DeploymentHistory("abc-123", LocalDateTime.now(), DeploymentStatusEnum.DEPLOYED, "Fulano", "release-ayora",
                null, LocalDateTime.now(), Duration.ofSeconds(120), "circle-1"),
                           new DeploymentHistory("abc-456", LocalDateTime.now(), DeploymentStatusEnum.NOT_DEPLOYED, "Fulano", "release-ayora",
                                   null, LocalDateTime.now(), Duration.ofSeconds(120), "circle-1"),
                           new DeploymentHistory("abc-789", LocalDateTime.now(), DeploymentStatusEnum.DEPLOYING, "Fulano", "release-ayora",
                                   null, LocalDateTime.now(), Duration.ofSeconds(120), "circle-2"),
                           new DeploymentHistory("abc-098", LocalDateTime.now(), DeploymentStatusEnum.UNDEPLOYING, "Fulano", "release-ayora",
                                   null, LocalDateTime.now(), Duration.ofSeconds(120), "circle-3"),
                           new DeploymentHistory("abc-476", LocalDateTime.now(), DeploymentStatusEnum.DEPLOY_FAILED, "Fulano", "release-ayora",
                                   null, LocalDateTime.now(), Duration.ofSeconds(120), "circle-2")]

        def components = [new ComponentHistory("abc-123", "component 1", "module-1", "version 18.09"),
                          new ComponentHistory("abc-456", "component 1", "module-1", "version 18.09"),
                          new ComponentHistory("abc-789", "component 2", "module-1", "version 18.09"),
                          new ComponentHistory("abc-098", "component 3", "module-1", "version 18.09"),
                          new ComponentHistory("abc-476", "component 2", "module-1", "version 18.09")]

        def summary = [new DeploymentCount(1, DeploymentStatusEnum.DEPLOYED),
                       new DeploymentCount(1, DeploymentStatusEnum.UNDEPLOYING),
                       new DeploymentCount(1, DeploymentStatusEnum.NOT_DEPLOYED),
                       new DeploymentCount(1, DeploymentStatusEnum.DEPLOYING),
                       new DeploymentCount(1, DeploymentStatusEnum.DEPLOY_FAILED)]

        when:
        def result = findDeploymentHistoryIteractor.execute(workspaceId, filter, pageRequest)

        then:
        1 * deploymentRepository.findDeploymentsHistory(workspaceId, _ as DeploymentHistoryFilter, pageRequest) >> new Page<DeploymentHistory>(deployments, 0, 10, 5)
        1 * componentRepository.findComponentsAtDeployments(workspaceId, ['abc-123', 'abc-456', 'abc-789', 'abc-098', 'abc-476']) >> components
        1 * deploymentRepository.countGroupedByStatus(workspaceId, _ as DeploymentHistoryFilter) >> summary
        0 * _

        result.summary.deployed == 1
        result.summary.undeploying == 1
        result.summary.notDeployed == 1
        result.summary.deploying == 1
        result.summary.failed == 1
        result.page.page == 0
        result.page.size == 10
        result.page.isLast
        result.page.totalPages == 1
        result.page.content.size() == 5
    }

}
