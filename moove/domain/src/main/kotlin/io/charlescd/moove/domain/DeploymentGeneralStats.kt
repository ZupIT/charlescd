package io.charlescd.moove.domain

import java.time.Duration

data class DeploymentGeneralStats(
    val total: Int,
    val deploymentStatus: DeploymentStatusEnum,
    val averageTime: Duration
)
