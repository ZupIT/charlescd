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

package io.charlescd.moove.metrics.api.response

import com.fasterxml.jackson.annotation.JsonFormat
import io.charlescd.moove.domain.DeploymentAverageTimeStats
import io.charlescd.moove.domain.DeploymentGeneralStats
import io.charlescd.moove.domain.DeploymentStats
import java.time.LocalDate

data class DeploymentMetricsRepresentation(
    val successfulDeployments: Int,
    val failedDeployments: Int,
    val successfulDeploymentsAverageTime: Long,
    val successfulDeploymentsInPeriod: List<DeploymentStatsInPeriodRepresentation>,
    val failedDeploymentsInPeriod: List<DeploymentStatsInPeriodRepresentation>,
    val deploymentsAverageTimeInPeriod: List<DeploymentAverageTimeInPeriodRepresentation>

) {
    companion object {
        fun from(
            successfulDeploymentGeneralStats: DeploymentGeneralStats?,
            failedDeploymentGeneralStats: DeploymentGeneralStats?,
            successfulDeploymentsInPeriod: List<DeploymentStats>,
            failedDeploymentsInPeriod: List<DeploymentStats>,
            deploymentsAverageTimeInPeriod: List<DeploymentAverageTimeStats>
        ) = DeploymentMetricsRepresentation(
            successfulDeployments = successfulDeploymentGeneralStats?.total ?: 0,
            successfulDeploymentsAverageTime = successfulDeploymentGeneralStats?.averageTime?.seconds ?: 0,
            failedDeployments = failedDeploymentGeneralStats?.total ?: 0,
            deploymentsAverageTimeInPeriod = deploymentsAverageTimeInPeriod
                .map { DeploymentAverageTimeInPeriodRepresentation.from(it) }
                .sortedBy { it.period },
            successfulDeploymentsInPeriod = successfulDeploymentsInPeriod
                .map { DeploymentStatsInPeriodRepresentation.from(it) }
                .sortedBy { it.period },
            failedDeploymentsInPeriod = failedDeploymentsInPeriod
                .map { DeploymentStatsInPeriodRepresentation.from(it) }
                .sortedBy { it.period }
        )
    }
}

data class DeploymentStatsInPeriodRepresentation(
    val total: Int,
    val averageTime: Long,

    @JsonFormat(pattern = "yyyy-MM-dd")
    val period: LocalDate
) {
    companion object {
        fun from(deploymentStats: DeploymentStats) = DeploymentStatsInPeriodRepresentation(
            total = deploymentStats.total,
            averageTime = deploymentStats.averageTime.seconds,
            period = deploymentStats.date
        )
    }
}

data class DeploymentAverageTimeInPeriodRepresentation(
    val averageTime: Long,

    @JsonFormat(pattern = "yyyy-MM-dd")
    val period: LocalDate
) {
    companion object {
        fun from(deploymentAverageTimeStats: DeploymentAverageTimeStats) = DeploymentAverageTimeInPeriodRepresentation(
            averageTime = deploymentAverageTimeStats.averageTime.seconds,
            period = deploymentAverageTimeStats.date
        )
    }
}
