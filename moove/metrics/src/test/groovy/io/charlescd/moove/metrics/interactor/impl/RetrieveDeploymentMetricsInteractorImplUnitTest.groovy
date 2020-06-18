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

package io.charlescd.moove.metrics.interactor.impl

import io.charlescd.moove.domain.DeploymentStats
import io.charlescd.moove.domain.DeploymentStatusEnum
import io.charlescd.moove.domain.repository.DeploymentRepository
import io.charlescd.moove.metrics.api.PeriodType
import spock.lang.Specification
import spock.lang.Unroll

import java.time.Duration

class RetrieveDeploymentMetricsInteractorImplUnitTest extends Specification {

    def deploymentRepository = Mock(DeploymentRepository)
    def retrieveDeploymentMetricsInteractorImpl = new RetrieveDeploymentsMetricsInteractorImpl(deploymentRepository)

    def workspaceId = "workspace-id"
    def period = PeriodType.ONE_MONTH

    def 'when failed deployment not found should return default value'() {
        given:
        def successfulDeployStats = new DeploymentStats(30, DeploymentStatusEnum.DEPLOYED, Duration.ofSeconds(300))

        when:
        def result = retrieveDeploymentMetricsInteractorImpl.execute(workspaceId, period, ["circle-id"])

        then:
        1 * deploymentRepository.countByWorkspaceIdBetweenTodayAndDaysPastGroupingByStatus(workspaceId, ["circle-id"], period.numberOfDays) >> [successfulDeployStats]
        0 * _

        result.failedDeployments == 0
        result.successfulDeployments == 30
        result.successfulDeploymentsAverageTime == 300
    }

    def 'when success deployment not found should return default value'() {
        given:
        def failedDeployStats = new DeploymentStats(5, DeploymentStatusEnum.DEPLOY_FAILED, Duration.ofSeconds(0))

        when:
        def result = retrieveDeploymentMetricsInteractorImpl.execute(workspaceId, period, ["circle-id"])

        then:
        1 * deploymentRepository.countByWorkspaceIdBetweenTodayAndDaysPastGroupingByStatus(workspaceId, ["circle-id"], period.numberOfDays) >> [failedDeployStats]
        0 * _

        result.failedDeployments == 5
        result.successfulDeployments == 0
        result.successfulDeploymentsAverageTime == 0
    }

    def 'when circles id list is null should pass an empty list forward'() {
        given:
        def failedDeployStats = new DeploymentStats(5, DeploymentStatusEnum.DEPLOY_FAILED, Duration.ofSeconds(0))
        def successfulDeployStats = new DeploymentStats(30, DeploymentStatusEnum.DEPLOYED, Duration.ofSeconds(300))

        when:
        def result = retrieveDeploymentMetricsInteractorImpl.execute(workspaceId, period, null)

        then:
        1 * deploymentRepository.countByWorkspaceIdBetweenTodayAndDaysPastGroupingByStatus(workspaceId, [], period.numberOfDays) >> [failedDeployStats, successfulDeployStats]
        0 * _

        result.failedDeployments == 5
        result.successfulDeployments == 30
        result.successfulDeploymentsAverageTime == 300
    }

    @Unroll
    def 'when period is #searchPeriod should search for #numberOfDays ago'() {
        given:
        def failedDeployStats = new DeploymentStats(5, DeploymentStatusEnum.DEPLOY_FAILED, Duration.ofSeconds(0))
        def successfulDeployStats = new DeploymentStats(30, DeploymentStatusEnum.DEPLOYED, Duration.ofSeconds(300))

        when:
        def result = retrieveDeploymentMetricsInteractorImpl.execute(workspaceId, searchPeriod, null)

        then:
        1 * deploymentRepository.countByWorkspaceIdBetweenTodayAndDaysPastGroupingByStatus(workspaceId, [], numberOfDays) >> [failedDeployStats, successfulDeployStats]
        0 * _

        result.failedDeployments == 5
        result.successfulDeployments == 30
        result.successfulDeploymentsAverageTime == 300

        where:
        searchPeriod            | numberOfDays
        PeriodType.ONE_WEEK     | 7
        PeriodType.TWO_WEEKS    | 14
        PeriodType.ONE_MONTH    | 30
        PeriodType.THREE_MONTHS | 90
    }

}
