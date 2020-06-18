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

package io.charlescd.moove.metrics.interactor.impl

import io.charlescd.moove.domain.DeploymentStatusEnum
import io.charlescd.moove.domain.repository.DeploymentRepository
import io.charlescd.moove.metrics.api.PeriodType
import io.charlescd.moove.metrics.api.response.DeploymentMetricsRepresentation
import io.charlescd.moove.metrics.interactor.RetrieveDeploymentsMetricsInteractor
import org.springframework.stereotype.Component

@Component
class RetrieveDeploymentsMetricsInteractorImpl(val deploymentRepository: DeploymentRepository) : RetrieveDeploymentsMetricsInteractor {

    override fun execute(workspaceId: String, period: PeriodType, circlesId: List<String>?): DeploymentMetricsRepresentation {
        val deploymentStats = deploymentRepository
            .countByWorkspaceIdBetweenTodayAndDaysPastGroupingByStatus(workspaceId, circlesId ?: emptyList(), period.numberOfDays)

        val failedDeployments = deploymentStats.find { it.deploymentStatus == DeploymentStatusEnum.DEPLOY_FAILED }
        val successfulDeployments = deploymentStats.find { it.deploymentStatus == DeploymentStatusEnum.DEPLOYED }

        return DeploymentMetricsRepresentation(
            successfulDeployments = successfulDeployments?.total ?: 0,
            failedDeployments = failedDeployments?.total ?: 0,
            successfulDeploymentsAverageTime = successfulDeployments?.averageTime?.toSeconds() ?: 0
        )
    }
}
