package io.charlescd.moove.domain

import java.time.Duration

data class DeploymentStats(
    val total: Int,
    val deploymentStatus: DeploymentStatusEnum,
    val averageTime: Duration
)
