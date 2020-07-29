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

import com.fasterxml.jackson.databind.ObjectMapper
import io.charlescd.moove.domain.*
import java.sql.ResultSet
import org.springframework.jdbc.core.ResultSetExtractor
import org.springframework.stereotype.Component

@Component
class DeploymentExtractor(private val objectMapper: ObjectMapper) : ResultSetExtractor<Set<Deployment>> {

    override fun extractData(resultSet: ResultSet): Set<Deployment> {
        val deployments = HashSet<Deployment>()

        while (resultSet.next()) {
            deployments.add(mapDeployment(resultSet))
        }

        return deployments
    }

    private fun mapDeployment(resultSet: ResultSet) = Deployment(
        id = resultSet.getString("deployment_id"),
        author = mapDeploymentUser(resultSet),
        createdAt = resultSet.getTimestamp("deployment_created_at").toLocalDateTime(),
        deployedAt = resultSet.getTimestamp("deployment_deployed_at")?.toLocalDateTime(),
        status = DeploymentStatusEnum.valueOf(resultSet.getString("deployment_status")),
        circle = mapDeploymentCircle(resultSet),
        buildId = resultSet.getString("deployment_build_id"),
        workspaceId = resultSet.getString("deployment_workspace_id"),
        undeployedAt = resultSet.getTimestamp("deployment_undeployed_at")?.toLocalDateTime()
    )

    private fun mapDeploymentUser(resultSet: ResultSet) = User(
        id = resultSet.getString("deployment_user_id"),
        name = resultSet.getString("deployment_user_name"),
        email = resultSet.getString("deployment_user_email"),
        photoUrl = resultSet.getString("deployment_user_photo_url"),
        workspaces = emptyList(),
        createdAt = resultSet.getTimestamp("deployment_user_created_at").toLocalDateTime()
    )

    private fun mapDeploymentCircle(resultSet: ResultSet) = Circle(
        id = resultSet.getString("deployment_circle_id"),
        name = resultSet.getString("deployment_circle_name"),
        reference = resultSet.getString("deployment_circle_reference"),
        author = mapDeploymentCircleUser(resultSet),
        createdAt = resultSet.getTimestamp("deployment_circle_created_at").toLocalDateTime(),
        matcherType = MatcherTypeEnum.valueOf(resultSet.getString("deployment_circle_matcher_type")),
        rules = resultSet.getString("deployment_circle_rules")?.let { objectMapper.readTree(it) },
        importedKvRecords = resultSet.getInt("deployment_circle_imported_kv_records"),
        importedAt = resultSet.getTimestamp("deployment_circle_imported_at")?.toLocalDateTime(),
        defaultCircle = resultSet.getBoolean("deployment_circle_default_circle"),
        workspaceId = resultSet.getString("deployment_circle_workspace_id")
    )

    private fun mapDeploymentCircleUser(resultSet: ResultSet) = User(
        id = resultSet.getString("deployment_circle_user_id"),
        name = resultSet.getString("deployment_circle_user_name"),
        email = resultSet.getString("deployment_circle_user_email"),
        photoUrl = resultSet.getString("deployment_circle_user_photo_url"),
        workspaces = emptyList(),
        createdAt = resultSet.getTimestamp("deployment_circle_user_created_at").toLocalDateTime()
    )
}
