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
import io.charlescd.moove.domain.DeploymentStatusEnum
import io.charlescd.moove.domain.repository.DeploymentRepository
import io.charlescd.moove.metrics.api.PeriodType
import io.charlescd.moove.metrics.api.response.DeploymentMetricsRepresentation
import io.charlescd.moove.metrics.interactor.RetrieveDeploymentsMetricsInteractor
import java.time.Duration
import java.time.LocalDate
import java.util.*
import org.springframework.stereotype.Component

@Component
class RetrieveDeploymentsMetricsInteractorImpl(val deploymentRepository: DeploymentRepository) : RetrieveDeploymentsMetricsInteractor {

    override fun execute(workspaceId: String, period: PeriodType, circlesIds: List<String>?): DeploymentMetricsRepresentation {
        val deploymentGeneralStats = deploymentRepository
            .countBetweenTodayAndDaysPastGroupingByStatus(workspaceId, circlesIds ?: emptyList(), period.numberOfDays)
        val failedDeployments = deploymentGeneralStats.find { it.deploymentStatus == DeploymentStatusEnum.DEPLOY_FAILED }
        val successfulDeployments = deploymentGeneralStats.find { it.deploymentStatus == DeploymentStatusEnum.DEPLOYED }

        val deploymentsStats = deploymentRepository
            .countBetweenTodayAndDaysPastGroupingByStatusAndCreationDate(workspaceId, circlesIds ?: emptyList(), period.numberOfDays)
        val successDeploymentsInPeriod = deploymentsStats.filter { it.deploymentStatus == DeploymentStatusEnum.DEPLOYED }
        val failedDeploymentsInPeriod = deploymentsStats.filter { it.deploymentStatus == DeploymentStatusEnum.DEPLOY_FAILED }

        var deploymentsAverageTime = deploymentRepository
            .averageDeployTimeBetweenTodayAndDaysPastGroupingByCreationDate(workspaceId, circlesIds ?: emptyList(), period.numberOfDays)

        if (deploymentsAverageTime.isNotEmpty() && deploymentsAverageTime.size <= period.numberOfDays) {
            deploymentsAverageTime = fillMissingItemsInAverageTimeList(deploymentsAverageTime, period)
        }

        return DeploymentMetricsRepresentation.from(
            successfulDeployments,
            failedDeployments,
            successDeploymentsInPeriod,
            failedDeploymentsInPeriod,
            deploymentsAverageTime
        )
    }

    private fun fillMissingItemsInAverageTimeList(
        deploymentsAverageTime: List<DeploymentAverageTimeStats>,
        period: PeriodType
    ): List<DeploymentAverageTimeStats> {

        val deploymentsStack = deploymentsAverageTime
            .sortedByDescending { it.date }
            .toCollection(Stack())

        val firstDay = LocalDate.now().minusDays(period.numberOfDays.toLong())
        val lastDay = LocalDate.now()

        val filledList = when (deploymentsStack.peek().date == firstDay) {
            true -> mutableListOf(deploymentsStack.pop())
            false -> mutableListOf(DeploymentAverageTimeStats(Duration.ZERO, firstDay))
        }

        var lastAddedItemDate = filledList.last().date
        while (lastAddedItemDate < lastDay) {
            if (deploymentsStack.isEmpty()) {
                filledList.addAll(getValuesUntilDate(lastAddedItemDate.plusDays(1), lastDay.plusDays(1)))
            } else {
                if (lastAddedItemDate.until(deploymentsStack.peek().date).days > 1) {
                    filledList.addAll(getValuesUntilDate(lastAddedItemDate.plusDays(1), deploymentsStack.peek().date))
                }

                filledList.add(deploymentsStack.pop())
            }
            lastAddedItemDate = filledList.last().date
        }

        return filledList
    }

    private fun getValuesUntilDate(fromDate: LocalDate, toDate: LocalDate): List<DeploymentAverageTimeStats> {
        val valuesUntilToday = mutableListOf<DeploymentAverageTimeStats>()
        var fromDay = fromDate
        while (fromDay < toDate) {
            valuesUntilToday.add(DeploymentAverageTimeStats(Duration.ZERO, fromDay))
            fromDay = fromDay.plusDays(1)
        }

        return valuesUntilToday
    }
}
