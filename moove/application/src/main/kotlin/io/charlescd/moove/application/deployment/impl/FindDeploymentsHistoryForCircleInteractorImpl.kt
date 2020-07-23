package io.charlescd.moove.application.deployment.impl

import io.charlescd.moove.application.ResourcePageResponse
import io.charlescd.moove.application.deployment.FindDeploymentsHistoryForCircleInteractor
import io.charlescd.moove.application.deployment.response.DeploymentHistoryResponse
import io.charlescd.moove.domain.DeploymentHistoryFilter
import io.charlescd.moove.domain.PageRequest
import io.charlescd.moove.domain.repository.ComponentRepository
import io.charlescd.moove.domain.repository.DeploymentRepository
import javax.inject.Named

@Named
class FindDeploymentsHistoryForCircleInteractorImpl(
    private val deploymentRepository: DeploymentRepository,
    private val componentRepository: ComponentRepository
) : FindDeploymentsHistoryForCircleInteractor {

    override fun execute(workspaceId: String, circle: String, pageRequest: PageRequest): ResourcePageResponse<DeploymentHistoryResponse> {
        val pagedDeploymentsHistory =
            this.deploymentRepository.findDeploymentsHistory(workspaceId, DeploymentHistoryFilter(circlesIds = listOf(circle)), pageRequest)

        val componentsMap = when (pagedDeploymentsHistory.content.isNotEmpty()) {
            true -> this.componentRepository.findComponentsAtDeployments(workspaceId, pagedDeploymentsHistory.content.map { it.id })
                .groupBy { it.deploymentId }
            false -> emptyMap()
        }

        return ResourcePageResponse.from(
            pagedDeploymentsHistory.content.map { DeploymentHistoryResponse.from(it, componentsMap.getValue(it.id)) }.sortedByDescending { it.deployedAt },
            pagedDeploymentsHistory.pageNumber,
            pagedDeploymentsHistory.pageSize,
            pagedDeploymentsHistory.isLast(),
            pagedDeploymentsHistory.totalPages()
        )
    }
}
