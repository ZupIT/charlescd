/*
 *
 *  * Copyright 2020, 2021 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
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

import io.charlescd.moove.domain.SimpleCircle
import java.sql.ResultSet
import org.springframework.jdbc.core.ResultSetExtractor
import org.springframework.stereotype.Component

@Component
class CircleSimpleExtractor : ResultSetExtractor<Set<SimpleCircle>> {

    override fun extractData(resultSet: ResultSet): Set<SimpleCircle>? {
        val circles = HashSet<SimpleCircle>()

        while (resultSet.next()) {
            circles.add(mapCircle(resultSet))
        }

        return circles
    }

    private fun mapCircle(resultSet: ResultSet) = SimpleCircle(
        id = resultSet.getString("circle_id"),
        name = resultSet.getString("circle_name")
    )
}
