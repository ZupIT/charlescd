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

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import io.charlescd.moove.domain.Permission
import org.springframework.jdbc.core.ResultSetExtractor
import org.springframework.stereotype.Component
import java.sql.ResultSet
import java.util.*

@Component
class WorkspacePermissionsExtractor(private val objectMapper: ObjectMapper) : ResultSetExtractor<Map<String, List<Permission>>> {

    override fun extractData(resultSet: ResultSet): Map<String, List<Permission>> {
        val workspaceAndPermissions = HashMap<String, List<Permission>>()
        while (resultSet.next()) {
            workspaceAndPermissions[resultSet.getString("workspace_id")] = objectMapper.readValue(resultSet.getString("permissions"))
        }
        return workspaceAndPermissions
    }
}
