package io.charlescd.moove.metrics.api.response

import com.fasterxml.jackson.annotation.JsonFormat
import java.time.LocalDate

data class DeploymentMetricsRepresentation(
    val successfulDeployments: Int,
    val failedDeployments: Int,
    val successfulDeploymentsAverageTime: Long,
    val successfulDeploymentsInPeriod: List<DeploymentStatsInPeriodRepresentation>,
    val failedDeploymentsInPeriod: List<DeploymentStatsInPeriodRepresentation>,
    val deploymentsAverageTimeInPeriod: List<DeploymentAverageTimeInPeriodRepresentation>

)

data class DeploymentStatsInPeriodRepresentation(
    val total: Int,
    val averageTime: Long,

    @JsonFormat(pattern = "MM-dd-yyyy")
    val period: LocalDate
)

data class DeploymentAverageTimeInPeriodRepresentation(
    val averageTime: Long,

    @JsonFormat(pattern = "MM-dd-yyyy")
    val period: LocalDate
)
