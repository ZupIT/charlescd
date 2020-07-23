package io.charlescd.moove.domain

@Suppress("UNCHECKED_CAST")
class DeploymentHistoryFilterRequest(
    val deploymentName: String?,
    val periodBefore: Int?,
    val circlesIds: List<String>?,
    val deploymentStatus: DeploymentStatusEnum?
){
    companion object{
        fun filterBy(filters: Map<String, Any>) = DeploymentHistoryFilterRequest(
            deploymentName = filters["deploymentName"] as String,
            periodBefore = PeriodTypeEnum.valueOf(filters["deploymentName"] as String).numberOfDays,
            circlesIds = filters["circles"] as List<String>,
            deploymentStatus = DeploymentStatusEnum.valueOf(filters["deploymentName"] as String)
        )

        fun filterByCirclesIds(circles: List<String>) = DeploymentHistoryFilterRequest(
            deploymentName = null,
            periodBefore = null,
            circlesIds = circles,
            deploymentStatus = null
        )
    }
}
