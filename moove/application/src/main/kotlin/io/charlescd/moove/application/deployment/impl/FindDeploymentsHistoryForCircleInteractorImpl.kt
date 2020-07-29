/*
 *
 *  Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

package io.charlescd.moove.application.deployment.impl

import io.charlescd.moove.application.ResourcePageResponse
import io.charlescd.moove.application.deployment.FindDeploymentsHistoryForCircleInteractor
import io.charlescd.moove.application.deployment.response.DeploymentHistoryResponse
import io.charlescd.moove.domain.DeploymentHistoryFilter
import io.charlescd.moove.domain.DeploymentStatusEnum
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
        val pagedDeploymentsHistory = this.deploymentRepository.findDeploymentsHistory(workspaceId, mountHistoryFilter(circle), pageRequest)

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

    private fun mountHistoryFilter(circleId: String) = DeploymentHistoryFilter(
        circlesIds = listOf(circleId),
        deploymentStatus = listOf(DeploymentStatusEnum.DEPLOYED, DeploymentStatusEnum.NOT_DEPLOYED, DeploymentStatusEnum.DEPLOY_FAILED)
    )
}
