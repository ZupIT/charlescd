/*
 * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package io.charlescd.moove.application.deployment.response

import io.charlescd.moove.application.ResourcePageResponse
import io.charlescd.moove.domain.*

class SummarizedDeploymentHistoryResponse(
    val summary: DeploymentHistorySummary,
    val page: ResourcePageResponse<DeploymentHistoryResponse>
) {
    companion object {
        fun from(deploymentCount: List<DeploymentCount>, historyPage: Page<DeploymentHistory>, components: Map<String, List<ComponentHistory>>) =
            SummarizedDeploymentHistoryResponse(
                summary = summaryFrom(deploymentCount),
                page = ResourcePageResponse.from(
                    historyPage.content.map { DeploymentHistoryResponse.from(it, components.getValue(it.id)) }.sortedByDescending { it.createdAt },
                    historyPage.pageNumber,
                    historyPage.pageSize,
                    historyPage.isLast(),
                    historyPage.totalPages()
                )
            )

        private fun summaryFrom(deploymentCount: List<DeploymentCount>) = DeploymentHistorySummary(
            deployed = deploymentCount.find { it.status == DeploymentStatusEnum.DEPLOYED }?.total ?: 0,
            notDeployed = deploymentCount.find { it.status == DeploymentStatusEnum.NOT_DEPLOYED }?.total ?: 0,
            undeploying = deploymentCount.find { it.status == DeploymentStatusEnum.UNDEPLOYING }?.total ?: 0,
            deploying = deploymentCount.find { it.status == DeploymentStatusEnum.DEPLOYING }?.total ?: 0,
            failed = deploymentCount.find { it.status == DeploymentStatusEnum.DEPLOY_FAILED }?.total ?: 0
        )
    }
}
