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

import io.charlescd.moove.domain.CircleHistory
import io.charlescd.moove.domain.CircleStatusEnum
import org.springframework.jdbc.core.ResultSetExtractor
import org.springframework.stereotype.Component
import java.sql.ResultSet
import java.time.Duration

@Component
class CircleHistoryExtractor : ResultSetExtractor<Set<CircleHistory>> {

    override fun extractData(resultSet: ResultSet): Set<CircleHistory>? {
        val circles = HashSet<CircleHistory>()

        while (resultSet.next()) {
            circles.add(mapCircle(resultSet))
        }

        return circles
    }

    private fun mapCircle(resultSet: ResultSet) = CircleHistory(
        id = resultSet.getString("circle_id"),
        name = resultSet.getString("circle_name"),
        status = CircleStatusEnum.valueOf(resultSet.getString("circle_status")),
        lastUpdatedAt = resultSet.getTimestamp("last_updated_at").toLocalDateTime(),
        lifeTime = Duration.ofSeconds(resultSet.getLong("circle_life_time"))
    )
}
