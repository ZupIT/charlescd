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

import io.charlescd.moove.domain.SimpleUserGroup
import io.charlescd.moove.domain.User
import io.charlescd.moove.domain.WorkspacePermissions
import java.sql.ResultSet
import org.springframework.jdbc.core.ResultSetExtractor
import org.springframework.stereotype.Component

@Component
class UserExtractor(private val workspaceMapper: WorkspaceMapper) : ResultSetExtractor<Set<User>> {

    override fun extractData(resultSet: ResultSet): Set<User> {
        val users = HashSet<User>()
        val workspacePermissions = HashMap<String, HashSet<WorkspacePermissions>>()
        val userGroups = HashMap<String, HashSet<SimpleUserGroup>>()

        while (resultSet.next()) {
            createUsers(resultSet, users)
            createWorkspacePermissions(resultSet, workspacePermissions)
            createUserGroups(resultSet, userGroups)
        }

        return users
            .map { it.copy(workspaces = workspacePermissions[it.id]?.toList() ?: emptyList(), userGroups = userGroups[it.id]?.toList() ?: emptyList()) }
            .sortedBy { it.name }
            .toSet()
    }

    private fun createUsers(resultSet: ResultSet, users: java.util.HashSet<User>) {
        users.add(mapUser(resultSet))
    }

    private fun createWorkspacePermissions(resultSet: ResultSet, workspacePermissions: HashMap<String, HashSet<WorkspacePermissions>>) {
        if (resultSet.getString("workspace_id") != null) {
            mapWorkspacesPermissions(resultSet, workspacePermissions)
        }
    }

    private fun createUserGroups(resultSet: ResultSet, userGroups: HashMap<String, HashSet<SimpleUserGroup>>) {
        if (resultSet.getString("user_group_id") != null) {
            mapUserGroup(resultSet, userGroups)
        }
    }

    private fun mapUserGroup(resultSet: ResultSet, userGroups: java.util.HashMap<String, java.util.HashSet<SimpleUserGroup>>) {
        val userId = resultSet.getString("id")

        if (userGroups.containsKey(userId)) {
            userGroups[userId]!!.add(mapSimpleUserGroup(resultSet))
        } else {
            userGroups[userId] = hashSetOf(mapSimpleUserGroup(resultSet))
        }
    }

    private fun mapWorkspacesPermissions(
        resultSet: ResultSet,
        workspaceUserMap: HashMap<String, HashSet<WorkspacePermissions>>
    ) {
        val userId = resultSet.getString("id")

        if (workspaceUserMap.containsKey(userId)) {
            workspaceUserMap[userId]!!.add(workspaceMapper.mapWorkspacePermissions(resultSet))
        } else {
            workspaceUserMap[userId] = hashSetOf(workspaceMapper.mapWorkspacePermissions(resultSet))
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

    private fun mapSimpleUserGroup(resultSet: ResultSet) = SimpleUserGroup(
        id = resultSet.getString("user_group_id"),
        name = resultSet.getString("user_group_name")
    )
}
