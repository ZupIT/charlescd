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
