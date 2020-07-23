package io.charlescd.moove.domain

class DeploymentHistoryFilter constructor(
    val deploymentName: String? = null,
    val periodBefore: Int? = null,
    val circlesIds: List<String>? = null,
    val deploymentStatus: List<DeploymentStatusEnum>? = null
)
