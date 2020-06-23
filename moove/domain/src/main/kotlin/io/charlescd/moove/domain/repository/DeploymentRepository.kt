/*
 *
 *  * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *  *
 *  * Licensed under the Apache License, Version 2.0 (the "License");
 *  * you may not use this file except in compliance with the License.
 *  * You may obtain a copy of the License at
 *  *
 *  *     http://www.apache.org/licenses/LICENSE-2.0
 *  *
 *  * Unless required by applicable law or agreed to in writing, software
 *  * distributed under the License is distributed on an "AS IS" BASIS,
 *  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  * See the License for the specific language governing permissions and
 *  * limitations under the License.
 *
 */

package io.charlescd.moove.domain.repository

import io.charlescd.moove.domain.*
import java.util.*

interface DeploymentRepository {

    fun save(deployment: Deployment): Deployment

    fun update(deployment: Deployment): Deployment

    fun findById(id: String): Optional<Deployment>

    fun updateStatus(id: String, status: DeploymentStatusEnum)

    fun findByCircleIdAndWorkspaceId(circleId: String, workspaceId: String): List<Deployment>

    fun findActiveByCircleId(circleId: String): List<Deployment>

    fun find(circleId: String, status: DeploymentStatusEnum): Optional<Deployment>

    fun find(id: String, workspaceId: String): Optional<Deployment>

    fun deleteByCircleId(circleId: String)

    fun countByWorkspaceIdBetweenTodayAndDaysPastGroupingByStatus(workspaceId: String, circlesId: List<String>, numberOfDays: Int): List<DeploymentGeneralStats>

    fun countByWorkspaceIdBetweenTodayAndDaysPastGroupingByStatusAndCreationDate(
        workspaceId: String,
        circlesId: List<String>,
        numberOfDays: Int
    ): List<DeploymentStats>

    fun averageDeployTimeBetweenTodayAndDaysPastGroupingByCreationDate(
        workspaceId: String,
        circlesId: List<String>,
        numberOfDays: Int
    ): List<DeploymentAverageTimeStats>
}
