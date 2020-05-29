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
import org.springframework.jdbc.core.ResultSetExtractor
import org.springframework.stereotype.Component
import java.sql.ResultSet

@Component
class UserGroupExtractor : ResultSetExtractor<Set<UserGroup>> {

    override fun extractData(resultSet: ResultSet): Set<UserGroup> {
        val userGroups = HashSet<UserGroup>()
        val members = HashMap<String, HashSet<User>>()

        while (resultSet.next()) {
            userGroups.add(mapUserGroup(resultSet))
            createMembers(resultSet, members)
        }

        return composeUserGroups(
            userGroups,
            members
        )
    }

    fun createMembers(
        resultSet: ResultSet,
        members: HashMap<String, HashSet<User>>
    ) {
        if (resultSet.getString("user_group_user_id") != null) {
            members[resultSet.getString("user_group_id")]?.add(mapMember(resultSet)) ?: members.put(
                resultSet.getString(
                    "user_group_id"
                ), hashSetOf(mapMember(resultSet))
            )
        }
    }

    private fun composeUserGroups(
        userGroups: HashSet<UserGroup>,
        members: HashMap<String, HashSet<User>>
    ): Set<UserGroup> {
        return userGroups.map { userGroup ->
            userGroup.copy(
                users = members[userGroup.id]?.toList() ?: emptyList()
            )
        }.sortedBy { it.name }.toSet()
    }

    private fun mapUserGroup(resultSet: ResultSet): UserGroup {
        return UserGroup(
            id = resultSet.getString("user_group_id"),
            name = resultSet.getString("user_group_name"),
            author = mapUserGroupAuthor(resultSet),
            createdAt = resultSet.getTimestamp("user_group_created_at").toLocalDateTime(),
            users = emptyList()
        )
    }

    private fun mapUserGroupAuthor(resultSet: ResultSet): User {
        return User(
            id = resultSet.getString("user_group_author_id"),
            name = resultSet.getString("user_group_author_name"),
            email = resultSet.getString("user_group_author_email"),
            photoUrl = resultSet.getString("user_group_author_photo_url"),
            workspaces = emptyList(),
            createdAt = resultSet.getTimestamp("user_group_author_created_at").toLocalDateTime()
        )
    }

    private fun mapMember(resultSet: ResultSet): User {
        return User(
            id = resultSet.getString("user_group_user_id"),
            name = resultSet.getString("user_group_user_name"),
            email = resultSet.getString("user_group_user_email"),
            photoUrl = resultSet.getString("user_group_user_photo_url"),
            root = resultSet.getBoolean("user_group_is_root"),
            workspaces = emptyList(),
            createdAt = resultSet.getTimestamp("user_group_user_created_at").toLocalDateTime()
        )
    }

}
