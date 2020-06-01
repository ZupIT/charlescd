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
import io.charlescd.moove.domain.UserGroup
import io.charlescd.moove.domain.Workspace
import org.springframework.jdbc.core.ResultSetExtractor
import org.springframework.stereotype.Component
import java.sql.ResultSet

@Component
class WorkspaceExtractor(private val workspaceMapper: WorkspaceMapper) : ResultSetExtractor<Set<Workspace>> {

    override fun extractData(resultSet: ResultSet): Set<Workspace> {
        val workspaces = HashSet<Workspace>()
        val userGroups = HashMap<String, HashSet<UserGroup>>()
        val userGroupMembers = HashMap<String, HashSet<User>>()

        while (resultSet.next()) {
            workspaces.add(workspaceMapper.map(resultSet))
            createUserGroups(resultSet, userGroups)
            createUserGroupMembers(resultSet, userGroupMembers)
        }

        val userGroupsWithMembers = composeUserGroups(userGroups, userGroupMembers)
        return composeWorkspaces(workspaces, userGroupsWithMembers)
    }

    private fun composeWorkspaces(
        workspaces: HashSet<Workspace>,
        userGroupWithMembers: Map<String, HashSet<UserGroup>>
    ): Set<Workspace> {
        return workspaces.map { workspace ->
            workspace.copy(
                userGroups = userGroupWithMembers[workspace.id]?.toList() ?: emptyList()
            )
        }.sortedBy { it.name }.toSet()
    }

    private fun composeUserGroups(
        userGroups: HashMap<String, HashSet<UserGroup>>,
        userGroupMembers: HashMap<String, HashSet<User>>
    ): Map<String, HashSet<UserGroup>> {
        return userGroups.mapValues { entry ->
            entry.value.map { userGroup ->
                userGroup.copy(
                    users = userGroupMembers[userGroup.id]?.toList() ?: emptyList()
                )
            }.toHashSet()
        }
    }

    private fun createUserGroups(resultSet: ResultSet, userGroups: HashMap<String, HashSet<UserGroup>>) {
        if (resultSet.getString("workspace_user_group_id") != null) {
            userGroups[resultSet.getString("workspace_id")]?.add(mapUserGroup(resultSet))
                ?: userGroups.put(resultSet.getString("workspace_id"), hashSetOf(mapUserGroup(resultSet)))
        }
    }

    private fun mapUserGroup(resultSet: ResultSet): UserGroup {
        return UserGroup(
            id = resultSet.getString("workspace_user_group_id"),
            name = resultSet.getString("workspace_user_group_name"),
            author = mapUserGroupAuthor(resultSet),
            createdAt = resultSet.getTimestamp("workspace_user_group_created_at").toLocalDateTime(),
            users = listOf()
        )
    }

    private fun mapUserGroupAuthor(resultSet: ResultSet): User {
        return User(
            id = resultSet.getString("workspace_user_group_author_id"),
            name = resultSet.getString("workspace_user_group_author_name"),
            email = resultSet.getString("workspace_user_group_author_email"),
            photoUrl = resultSet.getString("workspace_user_group_author_photo_url"),
            createdAt = resultSet.getTimestamp("workspace_user_group_author_created_at").toLocalDateTime()
        )
    }

    private fun createUserGroupMembers(resultSet: ResultSet, userGroupMembers: HashMap<String, HashSet<User>>) {
        if (resultSet.getString("workspace_user_group_member_id") != null) {
            userGroupMembers[resultSet.getString("workspace_user_group_id")]?.add(mapMember(resultSet))
                ?: userGroupMembers.put(resultSet.getString("workspace_user_group_id"), hashSetOf(mapMember(resultSet)))
        }
    }

    private fun mapMember(resultSet: ResultSet): User {
        return User(
            id = resultSet.getString("workspace_user_group_member_id"),
            name = resultSet.getString("workspace_user_group_member_name"),
            email = resultSet.getString("workspace_user_group_member_email"),
            photoUrl = resultSet.getString("workspace_user_group_member_photo_url"),
            createdAt = resultSet.getTimestamp("workspace_user_group_member_created_at").toLocalDateTime()
        )
    }
}
