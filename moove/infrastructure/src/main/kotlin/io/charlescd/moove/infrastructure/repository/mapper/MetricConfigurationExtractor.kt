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

import io.charlescd.moove.domain.MetricConfiguration
import io.charlescd.moove.domain.User
import java.sql.ResultSet
import org.springframework.jdbc.core.ResultSetExtractor
import org.springframework.stereotype.Component

@Component
class MetricConfigurationExtractor : ResultSetExtractor<Set<MetricConfiguration>> {

    override fun extractData(resultSet: ResultSet): Set<MetricConfiguration>? {
        val metricConfiguration = HashSet<MetricConfiguration>()

        while (resultSet.next()) {
            metricConfiguration.add(mapMetricConfiguration(resultSet))
        }

        return metricConfiguration
    }

    private fun mapMetricConfiguration(resultSet: ResultSet) = MetricConfiguration(
        id = resultSet.getString("metric_configuration_id"),
        provider = MetricConfiguration.ProviderEnum.valueOf(resultSet.getString("metric_configuration_provider")),
        url = resultSet.getString("metric_configuration_url"),
        createdAt = resultSet.getTimestamp("metric_configuration_created_at").toLocalDateTime(),
        workspaceId = resultSet.getString("metric_configuration_workspace_id"),
        author = mapAuthor(resultSet)
    )

    private fun mapAuthor(resultSet: ResultSet) = User(
        id = resultSet.getString("metric_configuration_author_id"),
        name = resultSet.getString("metric_configuration_author_name"),
        email = resultSet.getString("metric_configuration_author_email"),
        photoUrl = resultSet.getString("metric_configuration_author_photo_url"),
        workspaces = emptyList(),
        createdAt = resultSet.getTimestamp("metric_configuration_author_created_at").toLocalDateTime()
    )
}
