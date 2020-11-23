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

package io.charlescd.moove.infrastructure.repository

import io.charlescd.moove.domain.Page
import io.charlescd.moove.domain.PageRequest
import io.charlescd.moove.domain.Role
import io.charlescd.moove.domain.repository.RoleRepository
import io.charlescd.moove.infrastructure.repository.mapper.RoleExtractor
import java.util.*
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Repository

@Repository
class JdbcRoleRepository(
    private val jdbcTemplate: JdbcTemplate,
    private val roleExtractor: RoleExtractor
) : RoleRepository {

    companion object {
        const val BASE_QUERY_STATEMENT = """
            SELECT roles.id               AS role_id,
                   roles.name             AS role_name,
                   roles.description      AS role_description,
                   roles.created_at       AS role_created_at,
                   permissions.id         AS role_permission_id,
                   permissions.name       AS role_permission_name,
                   permissions.created_at AS role_permission_created_at
            FROM roles
                     LEFT JOIN roles_permissions ON roles_permissions.role_id = roles.id
                     LEFT JOIN permissions ON roles_permissions.permission_id = permissions.id
            WHERE 1 = 1
        """

        const val FIND_ALL_PAGED_QUERY_STATEMENT = """
            SELECT roles.*,
                   permissions.id         AS role_permission_id,
                   permissions.name       AS role_permission_name,
                   permissions.created_at AS role_permission_created_at
            FROM (SELECT roles.id          AS role_id,
                         roles.name        AS role_name,
                         roles.description AS role_description,
                         roles.created_at  AS role_created_at
                  FROM roles
                  LIMIT ? OFFSET ?
                 ) roles
                     LEFT JOIN roles_permissions ON roles_permissions.role_id = roles.role_id
                     LEFT JOIN permissions ON roles_permissions.permission_id = permissions.id
        """
    }

    override fun find(page: PageRequest): Page<Role> {
        return findPage(page)
    }

    override fun findByIds(ids: List<String>): List<Role> {
        return findRolesByIds(ids)
    }

    override fun findById(id: String): Optional<Role> {
        return findRoleById(id)
    }

    private fun findRoleById(id: String): Optional<Role> {
        val statement = StringBuilder(BASE_QUERY_STATEMENT)
            .appendln("AND roles.id = ?")

        return Optional.ofNullable(
            this.jdbcTemplate.query(statement.toString(), arrayOf(id), roleExtractor)?.firstOrNull()
        )
    }

    private fun findPage(page: PageRequest): Page<Role> {
        val result = executePageQuery(StringBuilder(FIND_ALL_PAGED_QUERY_STATEMENT), page)

        return Page(
            result?.toList() ?: emptyList(),
            page.page,
            page.size,
            executeCountQuery() ?: 0
        )
    }

    private fun executePageQuery(
        statement: StringBuilder,
        pageRequest: PageRequest
    ): Set<Role>? {
        return this.jdbcTemplate.query(
            statement.toString(),
            arrayOf(pageRequest.size, pageRequest.offset()),
            roleExtractor
        )
    }

    private fun executeCountQuery(): Int? {
        val countStatement = StringBuilder(
            """
               SELECT count(*) AS total
               FROM roles 
               """
        )

        return this.jdbcTemplate.queryForObject(countStatement.toString()) { resultSet, _ -> resultSet.getInt(1) }
    }

    private fun findRolesByIds(ids: List<String>): List<Role> {
        val queryStatement = appendParameters(StringBuilder(BASE_QUERY_STATEMENT), ids)

        return this.jdbcTemplate.query(
            queryStatement.toString(),
            roleExtractor
        )?.toList() ?: emptyList()
    }

    private fun appendParameters(statement: StringBuilder, ids: List<String>): StringBuilder {
        return statement
            .appendln("AND roles.id IN(${ids.joinToString(separator = ",") { "'$it'" }})")
    }
}
