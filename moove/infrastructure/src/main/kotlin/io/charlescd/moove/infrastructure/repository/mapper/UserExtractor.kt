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

import io.charlescd.moove.domain.User
import io.charlescd.moove.domain.Workspace
import java.sql.ResultSet
import org.springframework.jdbc.core.ResultSetExtractor
import org.springframework.stereotype.Component

@Component
class UserExtractor(private val workspaceMapper: WorkspaceMapper) : ResultSetExtractor<Set<User>> {

    override fun extractData(resultSet: ResultSet): Set<User> {
        val users = HashSet<User>()
        val workspaceUserMap = HashMap<String, HashSet<Workspace>>()

        while (resultSet.next()) {
            users.add(mapUser(resultSet))
            if (resultSet.getString("workspace_id") != null) {
                mapWorkspaces(resultSet, workspaceUserMap)
            }
        }

        return users.map { it.copy(workspaces = workspaceUserMap[it.id]?.toList() ?: emptyList()) }
            .sortedBy { it.name }
            .toSet()
    }

    private fun mapWorkspaces(
        resultSet: ResultSet,
        workspaceUserMap: HashMap<String, HashSet<Workspace>>
    ) {
        val userId = resultSet.getString("id")

        if (workspaceUserMap.containsKey(userId)) {
            workspaceUserMap[userId]!!.add(workspaceMapper.map(resultSet))
        } else {
            workspaceUserMap[userId] = hashSetOf(workspaceMapper.map(resultSet))
        }
    }

    private fun mapUser(resultSet: ResultSet) = User(
        id = resultSet.getString("id"),
        name = resultSet.getString("name"),
        email = resultSet.getString("email"),
        photoUrl = resultSet.getString("photo_url"),
        workspaces = emptyList(),
        root = resultSet.getBoolean("is_root"),
        createdAt = resultSet.getTimestamp("created_at").toLocalDateTime()
    )
}
