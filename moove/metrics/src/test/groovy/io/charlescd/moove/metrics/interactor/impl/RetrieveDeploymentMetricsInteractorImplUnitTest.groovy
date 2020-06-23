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

import io.charlescd.moove.domain.DeploymentAverageTimeStats
import io.charlescd.moove.domain.DeploymentGeneralStats
import io.charlescd.moove.domain.DeploymentStats
import io.charlescd.moove.domain.DeploymentStatusEnum
import io.charlescd.moove.domain.repository.DeploymentRepository
import io.charlescd.moove.metrics.api.PeriodType
import spock.lang.Specification
import spock.lang.Unroll

import java.time.Duration
import java.time.LocalDate

class RetrieveDeploymentMetricsInteractorImplUnitTest extends Specification {

    def deploymentRepository = Mock(DeploymentRepository)
    def retrieveDeploymentMetricsInteractorImpl = new RetrieveDeploymentsMetricsInteractorImpl(deploymentRepository)

    def workspaceId = "workspace-id"
    def period = PeriodType.ONE_MONTH

    def 'when failed deployment not found should return default value'() {
        given:
        def successfulDeployStats = new DeploymentGeneralStats(30, DeploymentStatusEnum.DEPLOYED, Duration.ofSeconds(300))

        when:
        def result = retrieveDeploymentMetricsInteractorImpl.execute(workspaceId, period, ["circle-id"])

        then:
        1 * deploymentRepository.countByWorkspaceIdBetweenTodayAndDaysPastGroupingByStatus(workspaceId, ["circle-id"], period.numberOfDays) >> [successfulDeployStats]
        1 * deploymentRepository.countByWorkspaceIdBetweenTodayAndDaysPastGroupingByStatusAndCreationDate(workspaceId, ["circle-id"], period.numberOfDays) >> []
        1 * deploymentRepository.averageDeployTimeBetweenTodayAndDaysPastGroupingByCreationDate(workspaceId, ["circle-id"], period.numberOfDays) >> []
        0 * _

        result.failedDeployments == 0
        result.successfulDeployments == 30
        result.successfulDeploymentsAverageTime == 300
    }

    def 'when success deployment not found should return default value'() {
        given:
        def failedDeployStats = new DeploymentGeneralStats(5, DeploymentStatusEnum.DEPLOY_FAILED, Duration.ofSeconds(0))

        when:
        def result = retrieveDeploymentMetricsInteractorImpl.execute(workspaceId, period, ["circle-id"])

        then:
        1 * deploymentRepository.countByWorkspaceIdBetweenTodayAndDaysPastGroupingByStatus(workspaceId, ["circle-id"], period.numberOfDays) >> [failedDeployStats]
        1 * deploymentRepository.countByWorkspaceIdBetweenTodayAndDaysPastGroupingByStatusAndCreationDate(workspaceId, ["circle-id"], period.numberOfDays) >> []
        1 * deploymentRepository.averageDeployTimeBetweenTodayAndDaysPastGroupingByCreationDate(workspaceId, ["circle-id"], period.numberOfDays) >> []
        0 * _

        result.failedDeployments == 5
        result.successfulDeployments == 0
        result.successfulDeploymentsAverageTime == 0
    }

    def 'when circles id list is null should pass an empty list forward'() {
        given:
        def failedDeployStats = new DeploymentGeneralStats(5, DeploymentStatusEnum.DEPLOY_FAILED, Duration.ofSeconds(0))
        def successfulDeployStats = new DeploymentGeneralStats(30, DeploymentStatusEnum.DEPLOYED, Duration.ofSeconds(300))

        when:
        def result = retrieveDeploymentMetricsInteractorImpl.execute(workspaceId, period, null)

        then:
        1 * deploymentRepository.countByWorkspaceIdBetweenTodayAndDaysPastGroupingByStatus(workspaceId, [], period.numberOfDays) >> [failedDeployStats, successfulDeployStats]
        1 * deploymentRepository.countByWorkspaceIdBetweenTodayAndDaysPastGroupingByStatusAndCreationDate(workspaceId, [], period.numberOfDays) >> []
        1 * deploymentRepository.averageDeployTimeBetweenTodayAndDaysPastGroupingByCreationDate(workspaceId, [], period.numberOfDays) >> []
        0 * _

        result.failedDeployments == 5
        result.successfulDeployments == 30
        result.successfulDeploymentsAverageTime == 300
    }

    @Unroll
    def 'when period is #searchPeriod should search for stats in the past #numberOfDays days'() {
        given:
        def failedDeployStats = new DeploymentGeneralStats(5, DeploymentStatusEnum.DEPLOY_FAILED, Duration.ofSeconds(0))
        def successfulDeployStats = new DeploymentGeneralStats(30, DeploymentStatusEnum.DEPLOYED, Duration.ofSeconds(300))

        def deploymentsAverageTimeInPeriod = [new DeploymentAverageTimeStats(Duration.ofSeconds(200), LocalDate.of(2020, 06, 22)),
                                              new DeploymentAverageTimeStats(Duration.ofSeconds(175), LocalDate.of(2020, 06, 21)),
                                              new DeploymentAverageTimeStats(Duration.ofSeconds(230), LocalDate.of(2020, 06, 20))]

        def deploymentsStatsInPeriod = [new DeploymentStats(32, DeploymentStatusEnum.DEPLOYED, Duration.ofSeconds(155), LocalDate.of(2020, 06, 22)),
                                        new DeploymentStats(28, DeploymentStatusEnum.DEPLOYED, Duration.ofSeconds(235), LocalDate.of(2020, 06, 21)),
                                        new DeploymentStats(17, DeploymentStatusEnum.DEPLOYED, Duration.ofSeconds(200), LocalDate.of(2020, 06, 20)),
                                        new DeploymentStats(5, DeploymentStatusEnum.DEPLOY_FAILED, Duration.ofSeconds(0), LocalDate.of(2020, 06, 22)),
                                        new DeploymentStats(8, DeploymentStatusEnum.DEPLOY_FAILED, Duration.ofSeconds(0), LocalDate.of(2020, 06, 21))]

        when:
        def result = retrieveDeploymentMetricsInteractorImpl.execute(workspaceId, searchPeriod, null)

        then:
        1 * deploymentRepository.countByWorkspaceIdBetweenTodayAndDaysPastGroupingByStatus(workspaceId, [], numberOfDays) >> [failedDeployStats, successfulDeployStats]
        1 * deploymentRepository.countByWorkspaceIdBetweenTodayAndDaysPastGroupingByStatusAndCreationDate(workspaceId, [], numberOfDays) >> deploymentsStatsInPeriod
        1 * deploymentRepository.averageDeployTimeBetweenTodayAndDaysPastGroupingByCreationDate(workspaceId, [], numberOfDays) >> deploymentsAverageTimeInPeriod
        0 * _

        result.failedDeployments == 5
        result.successfulDeployments == 30
        result.successfulDeploymentsAverageTime == 300
        result.successfulDeploymentsInPeriod.size() == 3
        result.failedDeploymentsInPeriod.size() == 2
        result.deploymentsAverageTimeInPeriod.size() == 3

        where:
        searchPeriod            | numberOfDays
        PeriodType.ONE_WEEK     | 7
        PeriodType.TWO_WEEKS    | 14
        PeriodType.ONE_MONTH    | 30
        PeriodType.THREE_MONTHS | 90
    }

}
