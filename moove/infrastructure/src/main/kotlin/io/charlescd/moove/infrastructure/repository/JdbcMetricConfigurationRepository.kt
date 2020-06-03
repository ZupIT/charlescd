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

package io.charlescd.moove.infrastructure.repository

import io.charlescd.moove.domain.MetricConfiguration
import io.charlescd.moove.domain.repository.MetricConfigurationRepository
import io.charlescd.moove.infrastructure.repository.mapper.MetricConfigurationExtractor
import java.util.*
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Repository

@Repository
class JdbcMetricConfigurationRepository(
    private val jdbcTemplate: JdbcTemplate,
    private val metricConfigurationExtractor: MetricConfigurationExtractor
) : MetricConfigurationRepository {

    companion object {
        const val BASE_QUERY_STATEMENT = """
                SELECT metric_configurations.id                AS metric_configuration_id,
                       metric_configurations.provider          AS metric_configuration_provider,
                       metric_configurations.url               AS metric_configuration_url,
                       metric_configurations.created_at        AS metric_configuration_created_at,
                       metric_configurations.workspace_id      AS metric_configuration_workspace_id,
                       metric_configurations_author.id         AS metric_configuration_author_id,
                       metric_configurations_author.name       AS metric_configuration_author_name,
                       metric_configurations_author.email      AS metric_configuration_author_email,
                       metric_configurations_author.photo_url  AS metric_configuration_author_photo_url,
                       metric_configurations_author.created_at AS metric_configuration_author_created_at
                FROM metric_configurations
                         INNER JOIN users metric_configurations_author ON metric_configurations.user_id = metric_configurations_author.id
                WHERE metric_configurations.id = ?
            """
    }

    override fun save(metricConfiguration: MetricConfiguration): MetricConfiguration {
        createMetricConfiguration(metricConfiguration)
        return findById(metricConfiguration.id).get()
    }

    override fun find(metricConfigurationId: String, workspaceId: String): Optional<MetricConfiguration> {
        return findByIdAndWorkspaceId(metricConfigurationId, workspaceId)
    }

    override fun exists(metricConfigurationId: String, workspaceId: String): Boolean {
        return checkIfExistsByIdAndWorkspaceId(metricConfigurationId, workspaceId)
    }

    private fun checkIfExistsByIdAndWorkspaceId(id: String, workspaceId: String): Boolean {
        val countStatement = StringBuilder(
                """
               SELECT count(*) AS total
               FROM metric_configurations 
               WHERE metric_configurations.id = ?
               AND metric_configurations.workspace_id = ?
               """
        )

        val count = this.jdbcTemplate.queryForObject(
                countStatement.toString(),
                arrayOf(id, workspaceId)
        ) { rs, _ -> rs.getInt(1) }

        return count != null && count >= 1
    }

    private fun createMetricConfiguration(metricConfiguration: MetricConfiguration) {
        val statement = StringBuilder(
                """
                    INSERT INTO metric_configurations(id,
                                                      provider,
                                                      url,
                                                      user_id,
                                                      created_at,
                                                      workspace_id)
                    VALUES (?, ?, ?, ?, ?, ?)
                """
        )

        this.jdbcTemplate.update(
                statement.toString(),
                metricConfiguration.id,
                metricConfiguration.provider.name,
                metricConfiguration.url,
                metricConfiguration.author.id,
                metricConfiguration.createdAt,
                metricConfiguration.workspaceId
        )
    }

    private fun findById(metricConfigurationId: String): Optional<MetricConfiguration> {
        return Optional.ofNullable(
                this.jdbcTemplate.query(
                        BASE_QUERY_STATEMENT,
                        arrayOf(metricConfigurationId),
                        metricConfigurationExtractor
                )?.firstOrNull()
        )
    }

    private fun findByIdAndWorkspaceId(
        metricConfigurationId: String,
        workspaceId: String
    ): Optional<MetricConfiguration> {
        val statement = StringBuilder(BASE_QUERY_STATEMENT)
                .appendln("AND workspace_id = ?")

        return Optional.ofNullable(
                this.jdbcTemplate.query(
                        statement.toString(),
                        arrayOf(metricConfigurationId, workspaceId),
                        metricConfigurationExtractor
                )?.firstOrNull()
        )
    }

    override fun findByWorkspaceId(workspaceId: String): Optional<MetricConfiguration> {
        val query = """
            SELECT metric_configurations.id         AS metric_configuration_id,
            metric_configurations.provider          AS metric_configuration_provider,
            metric_configurations.url               AS metric_configuration_url,
            metric_configurations.created_at        AS metric_configuration_created_at,
            metric_configurations.workspace_id      AS metric_configuration_workspace_id,
            metric_configurations_author.id         AS metric_configuration_author_id,
            metric_configurations_author.name       AS metric_configuration_author_name,
            metric_configurations_author.email      AS metric_configuration_author_email,
            metric_configurations_author.photo_url  AS metric_configuration_author_photo_url,
            metric_configurations_author.created_at AS metric_configuration_author_created_at
            FROM metric_configurations
                INNER JOIN users metric_configurations_author ON metric_configurations.user_id = metric_configurations_author.id
            WHERE metric_configurations.workspace_id = ?
        """

        return Optional.ofNullable(
                this.jdbcTemplate.query(
                        query,
                        arrayOf(workspaceId),
                        metricConfigurationExtractor
                )?.maxBy { it.createdAt }
        )
    }
}
