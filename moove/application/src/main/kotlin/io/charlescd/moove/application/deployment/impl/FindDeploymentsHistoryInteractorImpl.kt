package io.charlescd.moove.application.deployment.impl

import io.charlescd.moove.application.DeploymentService
import io.charlescd.moove.application.deployment.FindDeploymentsHistoryInteractor
import io.charlescd.moove.application.deployment.response.SummarizedDeploymentHistoryResponse
import io.charlescd.moove.domain.PageRequest
import io.charlescd.moove.domain.repository.ComponentRepository
import javax.inject.Named

@Named
class FindDeploymentsHistoryInteractorImpl(
    private val componentRepository: ComponentRepository,
    private val deploymentService: DeploymentService
) : FindDeploymentsHistoryInteractor {

    override fun execute(workspaceId: String, filters: Map<String, Any>, pageRequest: PageRequest): SummarizedDeploymentHistoryResponse {
        val pagedDeploymentsHistory = this.deploymentService.findDeploymentsHistory(workspaceId, filters, pageRequest)

        val componentsMap = when (pagedDeploymentsHistory.content.isNotEmpty()) {
            true -> this.componentRepository.findComponentsAtDeployments(workspaceId, pagedDeploymentsHistory.content.map { it.id })
                .groupBy { it.deploymentId }
            false -> emptyMap()
        }

        TODO("Not yet implemented")
    }
}
