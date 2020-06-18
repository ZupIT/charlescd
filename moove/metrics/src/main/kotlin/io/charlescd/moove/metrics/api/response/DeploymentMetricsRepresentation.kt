package io.charlescd.moove.metrics.api.response

data class DeploymentMetricsRepresentation(
    val successfulDeployments: Int,
    val failedDeployments: Int,
    val successfulDeploymentsAverageTime: Long
)
