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
import io.charlescd.moove.domain.DeploymentStats
import io.charlescd.moove.domain.DeploymentStatusEnum
import io.charlescd.moove.domain.repository.DeploymentRepository
import io.charlescd.moove.metrics.api.PeriodType
import io.charlescd.moove.metrics.api.response.DeploymentMetricsRepresentation
import io.charlescd.moove.metrics.domain.service.MetricService
import io.charlescd.moove.metrics.interactor.RetrieveDeploymentsMetricsInteractor
import java.time.Duration
import org.springframework.stereotype.Component

@Component
class RetrieveDeploymentsMetricsInteractorImpl(
    private val deploymentRepository: DeploymentRepository,
    private val metricService: MetricService
) : RetrieveDeploymentsMetricsInteractor {

    override fun execute(workspaceId: String, period: PeriodType, circlesIds: List<String>?): DeploymentMetricsRepresentation {
        val deploymentGeneralStats = deploymentRepository
            .countBetweenTodayAndDaysPastGroupingByStatus(workspaceId, circlesIds ?: emptyList(), period.numberOfDays)
        val failedDeployments = deploymentGeneralStats.find { it.deploymentStatus == DeploymentStatusEnum.DEPLOY_FAILED }
        val successfulDeployments = deploymentGeneralStats.find { it.deploymentStatus == DeploymentStatusEnum.DEPLOYED }

        val deploymentsStats = deploymentRepository
            .countBetweenTodayAndDaysPastGroupingByStatusAndCreationDate(workspaceId, circlesIds ?: emptyList(), period.numberOfDays)
            .groupBy { it.deploymentStatus }

        var successDeploymentsInPeriod = deploymentsStats[DeploymentStatusEnum.DEPLOYED]
        if (!successDeploymentsInPeriod.isNullOrEmpty() && successDeploymentsInPeriod.size <= period.numberOfDays) {
            successDeploymentsInPeriod = fillDeploymentsWithZeroedValues(successDeploymentsInPeriod, period, DeploymentStatusEnum.DEPLOYED)
        }

        var failedDeploymentsInPeriod = deploymentsStats[DeploymentStatusEnum.DEPLOY_FAILED]
        if (!failedDeploymentsInPeriod.isNullOrEmpty() && failedDeploymentsInPeriod.size <= period.numberOfDays) {
            failedDeploymentsInPeriod = fillDeploymentsWithZeroedValues(failedDeploymentsInPeriod, period, DeploymentStatusEnum.DEPLOY_FAILED)
        }

        var deploymentsAverageTime = deploymentRepository
            .averageDeployTimeBetweenTodayAndDaysPastGroupingByCreationDate(workspaceId, circlesIds ?: emptyList(), period.numberOfDays)
        if (deploymentsAverageTime.isNotEmpty() && deploymentsAverageTime.size <= period.numberOfDays) {
            deploymentsAverageTime = fillDeploymentsAverageTimeWithZeroesdValues(deploymentsAverageTime, period)
        }

        return DeploymentMetricsRepresentation.from(
            successfulDeployments,
            failedDeployments,
            successDeploymentsInPeriod,
            failedDeploymentsInPeriod,
            deploymentsAverageTime
        )
    }

    private fun fillDeploymentsAverageTimeWithZeroesdValues(
        deploymentsAverageTime: List<DeploymentAverageTimeStats>,
        period: PeriodType
    ): List<DeploymentAverageTimeStats> {
        val dateMetricMap = deploymentsAverageTime.associateByTo(mutableMapOf()) { it.date }
        val completeDates = metricService.fillMissingDates(dateMetricMap.keys, period)

        completeDates.forEach { dateMetricMap.putIfAbsent(it, DeploymentAverageTimeStats(Duration.ZERO, it)) }

        return dateMetricMap.values.toList()
    }

    private fun fillDeploymentsWithZeroedValues(
        deploymentsStats: List<DeploymentStats>,
        period: PeriodType,
        deploymentStatus: DeploymentStatusEnum
    ): List<DeploymentStats> {
        val dateMetricMap = deploymentsStats.associateByTo(mutableMapOf()) { it.date }
        val completeDates = metricService.fillMissingDates(dateMetricMap.keys, period)

        completeDates.forEach { dateMetricMap.putIfAbsent(it, DeploymentStats(0, deploymentStatus, it)) }

        return dateMetricMap.values.toList()
    }
}
