package io.charlescd.moove.domain

import java.time.Duration
import java.time.LocalDate

data class DeploymentAverageTimeStats(
    val averageTime: Duration,
    val date: LocalDate
)
