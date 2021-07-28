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

package io.charlescd.moove.infrastructure.repository.mapper

import io.charlescd.moove.domain.Component
import io.charlescd.moove.domain.ComponentHistory
import java.sql.ResultSet
import org.springframework.jdbc.core.ResultSetExtractor

@org.springframework.stereotype.Component
class ComponentHistoryExtractor : ResultSetExtractor<Set<ComponentHistory>> {

    override fun extractData(resultSet: ResultSet): Set<ComponentHistory>? {
        val componentsResult = HashSet<ComponentHistory>()

        while (resultSet.next()) {
            componentsResult.add(mapComponent(resultSet))
        }

        return componentsResult
    }

    private fun mapComponent(resultSet: ResultSet) = ComponentHistory(
            deploymentId = resultSet.getString("deployment_id"),
            name = resultSet.getString("component_name"),
            moduleName = resultSet.getString("module_name"),
            version = resultSet.getString("artifact_version")
    )
}
