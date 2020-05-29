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

import io.charlescd.moove.domain.Permission
import io.charlescd.moove.domain.Role
import org.springframework.jdbc.core.ResultSetExtractor
import org.springframework.stereotype.Component
import java.sql.ResultSet

@Component
class RoleExtractor : ResultSetExtractor<Set<Role>> {

    override fun extractData(resultSet: ResultSet): Set<Role> {
        val roles = LinkedHashSet<Role>()
        val permissions = HashMap<String, HashSet<Permission>>()

        while (resultSet.next()) {
            roles.add(mapRole(resultSet))
            createPermissions(resultSet, permissions)
        }

        return composeRoles(roles, permissions)
    }

    private fun composeRoles(roles: HashSet<Role>, permissions: HashMap<String, HashSet<Permission>>): Set<Role> {
        return roles.map { role ->
            role.copy(permissions = permissions[role.id]?.toList() ?: emptyList())
        }.toSet()
    }

    private fun createPermissions(resultSet: ResultSet, permissions: HashMap<String, HashSet<Permission>>) {
        if (resultSet.getString("role_permission_id") != null) {
            permissions[resultSet.getString("role_id")]?.add(mapPermission(resultSet)) ?:
            permissions.put(resultSet.getString("role_id"), hashSetOf(mapPermission(resultSet)))
        }
    }

    private fun mapRole(resultSet: ResultSet): Role {
        return Role(
            id = resultSet.getString("role_id"),
            name = resultSet.getString("role_name"),
            description = resultSet.getString("role_description"),
            permissions = listOf(),
            createdAt = resultSet.getTimestamp("role_created_at").toLocalDateTime()
        )
    }

    private fun mapPermission(resultSet: ResultSet): Permission {
        return Permission(
            id = resultSet.getString("role_permission_id"),
            name = resultSet.getString("role_permission_name"),
            createdAt = resultSet.getTimestamp("role_permission_created_at").toLocalDateTime()
        )
    }

}
