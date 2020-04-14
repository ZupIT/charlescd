/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charles.infrastructure.repository.mapper

import br.com.zup.charles.domain.Circle
import br.com.zup.charles.domain.MatcherTypeEnum
import br.com.zup.charles.domain.User
import com.fasterxml.jackson.databind.ObjectMapper
import org.springframework.jdbc.core.ResultSetExtractor
import java.sql.ResultSet

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
        rules = ObjectMapper().readTree(resultSet.getString("circle_rules")),
        importedKvRecords = resultSet.getInt("circle_imported_kv_records"),
        importedAt = resultSet.getTimestamp("circle_imported_at")?.toLocalDateTime()
    )

    private fun mapCircleUser(resultSet: ResultSet): User? {
        return resultSet.getString("circle_user_id")?.let {
            User(
                id = resultSet.getString("circle_user_id"),
                name = resultSet.getString("circle_user_name"),
                email = resultSet.getString("circle_user_email"),
                photoUrl = resultSet.getString("circle_user_photo_url"),
                applications = emptyList(),
                createdAt = resultSet.getTimestamp("circle_user_created_at").toLocalDateTime()
            )
        }
    }
}