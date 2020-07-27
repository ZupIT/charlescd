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

package io.charlescd.moove.infrastructure.repository.mapper

import io.charlescd.moove.domain.DeploymentHistory
import io.charlescd.moove.domain.DeploymentStatusEnum
import java.sql.ResultSet
import java.time.Duration
import org.springframework.jdbc.core.ResultSetExtractor
import org.springframework.stereotype.Component

@Component
class DeploymentHistoryExtractor : ResultSetExtractor<Set<DeploymentHistory>> {

    override fun extractData(resultSet: ResultSet): Set<DeploymentHistory> {
        val deploymentMetric = HashSet<DeploymentHistory>()

        while (resultSet.next()) {
            deploymentMetric.add(mapDeploymentStats(resultSet))
        }

        return deploymentMetric
    }

    private fun mapDeploymentStats(resultSet: ResultSet) = DeploymentHistory(
        id = resultSet.getString("deployment_id"),
        tag = resultSet.getString("deployment_version"),
        authorName = resultSet.getString("user_name"),
        status = DeploymentStatusEnum.valueOf(resultSet.getString("deployment_status")),
        deployedAt = resultSet.getTimestamp("deployed_at")?.toLocalDateTime(),
        undeployedAt = resultSet.getTimestamp("undeployed_at")?.toLocalDateTime(),
        deploymentDuration = Duration.ofSeconds(resultSet.getLong("deployment_average_time")),
        circleName = resultSet.getString("circle_name"),
        createdAt = resultSet.getTimestamp("deployment_created_at").toLocalDateTime()
    )
}
