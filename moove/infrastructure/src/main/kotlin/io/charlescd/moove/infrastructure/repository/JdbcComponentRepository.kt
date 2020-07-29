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

package io.charlescd.moove.infrastructure.repository

import io.charlescd.moove.domain.Component
import io.charlescd.moove.domain.ComponentHistory
import io.charlescd.moove.domain.repository.ComponentRepository
import io.charlescd.moove.infrastructure.repository.mapper.ComponentExtractor
import io.charlescd.moove.infrastructure.repository.mapper.ComponentHistoryExtractor
import java.util.*
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Repository

@Repository
class JdbcComponentRepository(
    private val jdbcTemplate: JdbcTemplate,
    private val componentExtractor: ComponentExtractor,
    private val componentHistoryExtractor: ComponentHistoryExtractor
) : ComponentRepository {

    override fun findById(componentId: String): Optional<Component> {
        val findByIdQuery = """
                SELECT  components.id                   AS component_id,
                        components.module_id            AS component_module_id,
                        components.name                 AS component_name,
                        components.created_at           AS component_created_at,
                        components.error_threshold      AS component_error_threshold,
                        components.latency_threshold    AS component_latency_threshold,
                        components.host_value           AS component_host_value,
                        components.gateway_name         AS component_gateway_name,
                        components.workspace_id         AS component_workspace_id
                FROM components
                WHERE components.id = ?
        """
        return Optional.ofNullable(
            this.jdbcTemplate.query(
                findByIdQuery,
                arrayOf(componentId),
                componentExtractor
            )?.firstOrNull()
        )
    }

    override fun findAllDeployedAtCircle(circleId: String, workspaceID: String): List<Component> {
        val findDeployedComponentsAtCircle = """
               SELECT   components.id                   AS components_id,
                        components.name                 AS components_name,
	                    components.module_id            AS components_module_id,
	                    components.created_at           AS components_created_at,
	                    components.workspace_id         AS components_workspace_id,
	                    components.error_threshold      AS components_error_threshold,
	                    components.latency_threshold    AS components_latency_threshold,
                        components.host_value           AS components_host_value,
                        components.gateway_name         AS components_gateway_name
                FROM components components
                    INNER JOIN component_snapshots component_snapshots  ON components.id = component_snapshots.component_id
                    INNER JOIN module_snapshots module_snapshots        ON module_snapshots.id = component_snapshots.module_snapshot_id
                    INNER JOIN feature_snapshots feature_snapshots      ON feature_snapshots.id = module_snapshots.feature_snapshot_id
                    INNER JOIN builds_features builds_features          ON builds_features.feature_id = feature_snapshots.feature_id
                    INNER JOIN deployments deployments                  ON deployments.build_id = builds_features.build_id
                WHERE deployments.circle_id = ?
	                AND deployments.workspace_id = ?
	                AND deployments.status = 'DEPLOYED';
        """
        return this.jdbcTemplate
            .query(
                findDeployedComponentsAtCircle,
                arrayOf(circleId, workspaceID),
                componentExtractor
            )?.toList()
                ?: emptyList()
    }

    override fun findComponentsAtDeployments(workspaceId: String, deployments: List<String>?): List<ComponentHistory> {
        val parameters = mutableListOf<Any>(workspaceId)
        val query = StringBuilder(
            """
                     SELECT deployments.id                  AS deployment_id,
	                        component_snapshots.name        AS component_name,
                            module_snapshots."name"         AS module_name,
	                        artifact_snapshots."version"    AS artifact_version
                    FROM component_snapshots component_snapshots
                        INNER JOIN module_snapshots module_snapshots        ON module_snapshots.id = component_snapshots.module_snapshot_id
                        INNER JOIN artifact_snapshots artifact_snapshots    ON artifact_snapshots.component_snapshot_id = component_snapshots.id
                        INNER JOIN feature_snapshots feature_snapshots      ON feature_snapshots.id = module_snapshots.feature_snapshot_id
                        INNER JOIN builds_features builds_features          ON builds_features.feature_id = feature_snapshots.feature_id
                        INNER JOIN deployments deployments                  ON deployments.build_id = builds_features.build_id
                    WHERE deployments.workspace_id = ?
            """
        )

        if (!deployments.isNullOrEmpty()) {
            query.appendln(" AND deployments.id IN (${deployments.joinToString(separator = ",") { "?" }}) ")
            parameters.addAll(deployments)
        }

        return this.jdbcTemplate.query(
            query.toString(),
            parameters.toTypedArray(),
            componentHistoryExtractor
        )?.toList()
            ?: emptyList()
    }
}
