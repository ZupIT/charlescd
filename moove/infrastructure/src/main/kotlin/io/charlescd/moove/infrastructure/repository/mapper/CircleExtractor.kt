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
import io.charlescd.moove.domain.Circle
import io.charlescd.moove.domain.MatcherTypeEnum
import io.charlescd.moove.domain.User
import java.sql.ResultSet
import org.springframework.jdbc.core.ResultSetExtractor
import org.springframework.stereotype.Component

@Component
class CircleExtractor : ResultSetExtractor<Set<Circle>> {

    override fun extractData(resultSet: ResultSet): Set<Circle>? {
        val circles = HashSet<Circle>()

        while (resultSet.next()) {
            circles.add(mapCircle(resultSet))
        }

        return circles
    }

    private fun mapCircle(resultSet: ResultSet) = Circle(
        id = resultSet.getString("circle_id"),
        name = resultSet.getString("circle_name"),
        reference = resultSet.getString("circle_reference"),
        author = mapCircleUser(resultSet),
        createdAt = resultSet.getTimestamp("circle_created_at").toLocalDateTime(),
        matcherType = MatcherTypeEnum.valueOf(resultSet.getString("circle_matcher_type")),
        rules = resultSet.getString("circle_rules")?.let { ObjectMapper().readTree(it) },
        importedKvRecords = resultSet.getInt("circle_imported_kv_records"),
        importedAt = resultSet.getTimestamp("circle_imported_at")?.toLocalDateTime(),
        defaultCircle = resultSet.getBoolean("circle_default"),
        workspaceId = resultSet.getString("circle_workspace_id")
    )

    private fun mapCircleUser(resultSet: ResultSet): User? {
        return resultSet.getString("circle_user_id")?.let {
            User(
                id = resultSet.getString("circle_user_id"),
                name = resultSet.getString("circle_user_name"),
                email = resultSet.getString("circle_user_email"),
                photoUrl = resultSet.getString("circle_user_photo_url"),
                workspaces = emptyList(),
                createdAt = resultSet.getTimestamp("circle_user_created_at").toLocalDateTime()
            )
        }
    }
}
