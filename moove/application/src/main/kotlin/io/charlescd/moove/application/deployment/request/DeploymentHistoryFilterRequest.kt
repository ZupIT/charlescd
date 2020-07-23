package io.charlescd.moove.application.deployment.request

import io.charlescd.moove.domain.DeploymentHistoryFilter
import io.charlescd.moove.domain.DeploymentStatusEnum
import io.charlescd.moove.domain.PeriodTypeEnum

class DeploymentHistoryFilterRequest(
    private val deploymentName: String?,
    private val period: PeriodTypeEnum?,
    private val circles: List<String>?,
    private val deploymentStatus: List<DeploymentStatusEnum>?
) {
    fun toDeploymentHistoryFilter() = DeploymentHistoryFilter(
        deploymentName = deploymentName,
        periodBefore = period?.numberOfDays,
        circlesIds = circles,
        deploymentStatus = deploymentStatus
    )
}
