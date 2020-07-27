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
import io.charlescd.moove.metrics.domain.service.MetricService
import spock.lang.Specification
import spock.lang.Unroll

import java.time.Duration
import java.time.LocalDate

class RetrieveDeploymentMetricsInteractorImplUnitTest extends Specification {

    def deploymentRepository = Mock(DeploymentRepository)
    def metricService = Mock(MetricService)
    def retrieveDeploymentMetricsInteractorImpl = new RetrieveDeploymentsMetricsInteractorImpl(deploymentRepository, metricService)

    def workspaceId = "workspace-id"
    def period = PeriodType.ONE_MONTH

    def 'when failed deployment not found should return default value'() {
        given:
        def todayDate = LocalDate.now()
        def successfulDeployStats = new DeploymentGeneralStats(3, DeploymentStatusEnum.DEPLOYED, Duration.ofSeconds(300))

        def deploymentsAverageTimeInPeriod = [new DeploymentAverageTimeStats(Duration.ofSeconds(300), todayDate.minusDays(4)),
                                              new DeploymentAverageTimeStats(Duration.ofSeconds(300), todayDate.minusDays(2)),
                                              new DeploymentAverageTimeStats(Duration.ofSeconds(300), todayDate.minusDays(3))]

        def deploymentsStatsInPeriod = [new DeploymentStats(32, DeploymentStatusEnum.DEPLOYED, todayDate.minusDays(4)),
                                        new DeploymentStats(28, DeploymentStatusEnum.DEPLOYED, todayDate.minusDays(2)),
                                        new DeploymentStats(17, DeploymentStatusEnum.DEPLOYED, todayDate.minusDays(3))]

        when:
        def result = retrieveDeploymentMetricsInteractorImpl.execute(workspaceId, period, ["circle-id"])

        then:
        1 * deploymentRepository.countBetweenTodayAndDaysPastGroupingByStatus(workspaceId, ["circle-id"], period.numberOfDays) >> [successfulDeployStats]
        1 * deploymentRepository.countBetweenTodayAndDaysPastGroupingByStatusAndCreationDate(workspaceId, ["circle-id"], period.numberOfDays) >> deploymentsStatsInPeriod
        1 * deploymentRepository.averageDeployTimeBetweenTodayAndDaysPastGroupingByCreationDate(workspaceId, ["circle-id"], period.numberOfDays) >> deploymentsAverageTimeInPeriod
        2 * metricService.fillMissingDates(_ as Set<String>, period) >> []
        0 * _

        result.failedDeployments == 0
        result.successfulDeployments == 3
        result.successfulDeploymentsAverageTime == 300
        result.failedDeploymentsInPeriod.size() == 0
    }

    def 'when success deployment not found should return default value'() {
        given:
        def todayDate = LocalDate.now()
        def failedDeployStats = new DeploymentGeneralStats(2, DeploymentStatusEnum.DEPLOY_FAILED, Duration.ofSeconds(0))
        def deploymentsStatsInPeriod = [new DeploymentStats(5, DeploymentStatusEnum.DEPLOY_FAILED, todayDate.minusDays(4)),
                                        new DeploymentStats(8, DeploymentStatusEnum.DEPLOY_FAILED, todayDate.minusDays(2))]

        when:
        def result = retrieveDeploymentMetricsInteractorImpl.execute(workspaceId, period, ["circle-id"])


        then:
        1 * deploymentRepository.countBetweenTodayAndDaysPastGroupingByStatus(workspaceId, ["circle-id"], period.numberOfDays) >> [failedDeployStats]
        1 * deploymentRepository.countBetweenTodayAndDaysPastGroupingByStatusAndCreationDate(workspaceId, ["circle-id"], period.numberOfDays) >> deploymentsStatsInPeriod
        1 * deploymentRepository.averageDeployTimeBetweenTodayAndDaysPastGroupingByCreationDate(workspaceId, ["circle-id"], period.numberOfDays) >> []
        1 * metricService.fillMissingDates(_ as Set<String>, period) >> []
        0 * _

        result.failedDeployments == 2
        result.successfulDeployments == 0
        result.successfulDeploymentsAverageTime == 0
        result.successfulDeploymentsInPeriod.size() == 0
    }

    @Unroll
    def 'when period is #searchPeriod should search for stats in the past #numberOfDays days'() {
        given:
        def todayDate = LocalDate.now()
        def failedDeployStats = new DeploymentGeneralStats(2, DeploymentStatusEnum.DEPLOY_FAILED, Duration.ofSeconds(0))
        def successfulDeployStats = new DeploymentGeneralStats(3, DeploymentStatusEnum.DEPLOYED, Duration.ofSeconds(300))

        def filledDates = []
        for (int i = 0; i <= numberOfDays; i++){
            filledDates.add(todayDate.minusDays(numberOfDays - i))
        }

        def deploymentsAverageTimeInPeriod = [new DeploymentAverageTimeStats(Duration.ofSeconds(200), todayDate.minusDays(4)),
                                              new DeploymentAverageTimeStats(Duration.ofSeconds(175), todayDate.minusDays(2)),
                                              new DeploymentAverageTimeStats(Duration.ofSeconds(230), todayDate.minusDays(3))]

        def deploymentsStatsInPeriod = [new DeploymentStats(32, DeploymentStatusEnum.DEPLOYED, todayDate.minusDays(4)),
                                        new DeploymentStats(28, DeploymentStatusEnum.DEPLOYED, todayDate.minusDays(2)),
                                        new DeploymentStats(17, DeploymentStatusEnum.DEPLOYED, todayDate.minusDays(3)),
                                        new DeploymentStats(5, DeploymentStatusEnum.DEPLOY_FAILED, todayDate.minusDays(4)),
                                        new DeploymentStats(8, DeploymentStatusEnum.DEPLOY_FAILED, todayDate.minusDays(2))]

        when:
        def result = retrieveDeploymentMetricsInteractorImpl.execute(workspaceId, searchPeriod, null)

        then:
        1 * deploymentRepository.countBetweenTodayAndDaysPastGroupingByStatus(workspaceId, [], numberOfDays) >> [failedDeployStats, successfulDeployStats]
        1 * deploymentRepository.countBetweenTodayAndDaysPastGroupingByStatusAndCreationDate(workspaceId, [], numberOfDays) >> deploymentsStatsInPeriod
        1 * deploymentRepository.averageDeployTimeBetweenTodayAndDaysPastGroupingByCreationDate(workspaceId, [], numberOfDays) >> deploymentsAverageTimeInPeriod
        3 * metricService.fillMissingDates(_ as Set<String>, searchPeriod) >> filledDates
        0 * _

        result.failedDeployments == 2
        result.successfulDeployments == 3
        result.successfulDeploymentsAverageTime == 300
        result.successfulDeploymentsInPeriod.size() == numberOfDays + 1
        result.failedDeploymentsInPeriod.size() == numberOfDays + 1
        result.deploymentsAverageTimeInPeriod.size() == numberOfDays + 1

        where:
        searchPeriod            | numberOfDays
        PeriodType.ONE_WEEK     | 7
        PeriodType.TWO_WEEKS    | 14
        PeriodType.ONE_MONTH    | 30
        PeriodType.THREE_MONTHS | 90
    }

    def 'when returning items in deployments list, the list should be ordered by date and filled when no data at period'() {
        given:
        def todayDate = LocalDate.now()
        def period = PeriodType.ONE_WEEK
        def failedDeployStats = new DeploymentGeneralStats(5, DeploymentStatusEnum.DEPLOY_FAILED, Duration.ofSeconds(0))
        def successfulDeployStats = new DeploymentGeneralStats(30, DeploymentStatusEnum.DEPLOYED, Duration.ofSeconds(300))

        def deploymentsAverageTimeInPeriod = [new DeploymentAverageTimeStats(Duration.ofSeconds(200), todayDate.minusDays(4)),
                                              new DeploymentAverageTimeStats(Duration.ofSeconds(175), todayDate.minusDays(2)),
                                              new DeploymentAverageTimeStats(Duration.ofSeconds(230), todayDate.minusDays(3))]

        def deploymentsStatsInPeriod = [new DeploymentStats(32, DeploymentStatusEnum.DEPLOYED, todayDate.minusDays(4)),
                                        new DeploymentStats(28, DeploymentStatusEnum.DEPLOYED, todayDate.minusDays(2)),
                                        new DeploymentStats(17, DeploymentStatusEnum.DEPLOYED, todayDate.minusDays(3)),
                                        new DeploymentStats(5, DeploymentStatusEnum.DEPLOY_FAILED, todayDate.minusDays(4)),
                                        new DeploymentStats(8, DeploymentStatusEnum.DEPLOY_FAILED, todayDate.minusDays(2))]

        def filledDates = [todayDate.minusDays(7), todayDate.minusDays(6), todayDate.minusDays(5),
                           todayDate.minusDays(4), todayDate.minusDays(3), todayDate.minusDays(2),
                           todayDate.minusDays(1), todayDate]

        when:
        def result = retrieveDeploymentMetricsInteractorImpl.execute(workspaceId, period, null)

        then:
        1 * deploymentRepository.countBetweenTodayAndDaysPastGroupingByStatus(workspaceId, [], period.numberOfDays) >> [failedDeployStats, successfulDeployStats]
        1 * deploymentRepository.countBetweenTodayAndDaysPastGroupingByStatusAndCreationDate(workspaceId, [], period.numberOfDays) >> deploymentsStatsInPeriod
        1 * deploymentRepository.averageDeployTimeBetweenTodayAndDaysPastGroupingByCreationDate(workspaceId, [], period.numberOfDays) >> deploymentsAverageTimeInPeriod
        3 * metricService.fillMissingDates(_ as Set<String>, period) >> filledDates
        0 * _

        result.failedDeployments == 5
        result.successfulDeployments == 30
        result.successfulDeploymentsAverageTime == 300

        result.successfulDeploymentsInPeriod.size() == 8
        result.successfulDeploymentsInPeriod[0].period == todayDate.minusDays(7)
        result.successfulDeploymentsInPeriod[1].period == todayDate.minusDays(6)
        result.successfulDeploymentsInPeriod[2].period == todayDate.minusDays(5)
        result.successfulDeploymentsInPeriod[3].period == todayDate.minusDays(4)
        result.successfulDeploymentsInPeriod[4].period == todayDate.minusDays(3)
        result.successfulDeploymentsInPeriod[5].period == todayDate.minusDays(2)
        result.successfulDeploymentsInPeriod[6].period == todayDate.minusDays(1)
        result.successfulDeploymentsInPeriod[7].period == todayDate

        result.failedDeploymentsInPeriod.size() == 8
        result.failedDeploymentsInPeriod[0].period == todayDate.minusDays(7)
        result.failedDeploymentsInPeriod[1].period == todayDate.minusDays(6)
        result.failedDeploymentsInPeriod[2].period == todayDate.minusDays(5)
        result.failedDeploymentsInPeriod[3].period == todayDate.minusDays(4)
        result.failedDeploymentsInPeriod[4].period == todayDate.minusDays(3)
        result.failedDeploymentsInPeriod[5].period == todayDate.minusDays(2)
        result.failedDeploymentsInPeriod[6].period == todayDate.minusDays(1)
        result.failedDeploymentsInPeriod[7].period == todayDate

        result.deploymentsAverageTimeInPeriod.size() == 8
        result.deploymentsAverageTimeInPeriod[0].period == todayDate.minusDays(7)
        result.deploymentsAverageTimeInPeriod[0].averageTime == 0
        result.deploymentsAverageTimeInPeriod[1].period == todayDate.minusDays(6)
        result.deploymentsAverageTimeInPeriod[1].averageTime == 0
        result.deploymentsAverageTimeInPeriod[2].period == todayDate.minusDays(5)
        result.deploymentsAverageTimeInPeriod[2].averageTime == 0
        result.deploymentsAverageTimeInPeriod[3].period == todayDate.minusDays(4)
        result.deploymentsAverageTimeInPeriod[3].averageTime == 200
        result.deploymentsAverageTimeInPeriod[4].period == todayDate.minusDays(3)
        result.deploymentsAverageTimeInPeriod[4].averageTime == 230
        result.deploymentsAverageTimeInPeriod[5].period == todayDate.minusDays(2)
        result.deploymentsAverageTimeInPeriod[5].averageTime == 175
        result.deploymentsAverageTimeInPeriod[6].period == todayDate.minusDays(1)
        result.deploymentsAverageTimeInPeriod[6].averageTime == 0
        result.deploymentsAverageTimeInPeriod[7].period == todayDate
        result.deploymentsAverageTimeInPeriod[7].averageTime == 0
    }

}
