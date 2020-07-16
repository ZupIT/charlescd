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
import io.charlescd.moove.domain.User
import io.charlescd.moove.domain.repository.UserRepository
import io.charlescd.moove.infrastructure.repository.mapper.UserExtractor
import java.util.*
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Repository

@Repository
class JdbcUserRepository(private val jdbcTemplate: JdbcTemplate, private val userExtractor: UserExtractor) :
    UserRepository {

    companion object {
        const val BASE_QUERY_STATEMENT = """
            SELECT users.id,
                   users.name,
                   users.email,
                   users.photo_url,
                   users.is_root,
                   users.created_at,
                   workspaces.id                        AS workspace_id,
                   workspaces.name                      AS workspace_name,
                   workspaces.created_at                AS workspace_created_at,
                   workspaces.git_configuration_id      AS workspace_git_configuration_id,
                   workspaces.registry_configuration_id AS workspace_registry_configuration_id,
                   workspaces.cd_configuration_id       AS workspace_cd_configuration_id,
                   workspaces.status                    AS workspace_status,
                   workspaces.circle_matcher_url        AS workspace_circle_matcher_url,
                   workspaces.metric_configuration_id   AS workspace_metric_configuration_id,
                   workspace_user.id                    AS workspace_author_id,
                   workspace_user.name                  AS workspace_author_name,
                   workspace_user.created_at            AS workspace_author_created_at,
                   workspace_user.email                 AS workspace_author_email,
                   workspace_user.photo_url             AS workspace_author_photo_url
            FROM users
                     LEFT JOIN user_groups_users ON users.id = user_groups_users.user_id
                     LEFT JOIN user_groups ON user_groups_users.user_group_id = user_groups.id
                     LEFT JOIN workspaces_user_groups ON user_groups.id = workspaces_user_groups.user_group_id
                     LEFT JOIN workspaces ON workspaces_user_groups.workspace_id = workspaces.id AND
                                             (workspaces_user_groups.permissions @> '[{"name": "maintenance_write"}]'
                                                  AND workspaces.status IN ('INCOMPLETE', 'COMPLETE')
                                                 OR workspaces.status = 'COMPLETE')
                     LEFT JOIN users as workspace_user ON workspaces.user_id = workspace_user.id
            WHERE 1 = 1
        """
    }

    override fun findById(id: String): Optional<User> {
        return findUserById(id)
    }

    override fun findByEmail(email: String): Optional<User> {
        return findUserByEmail(email)
    }

    override fun findAll(name: String?, email: String?, page: PageRequest): Page<User> {
        return findAllUsers(name, email, page)
    }

    override fun findByWorkspace(
        workspaceId: String,
        name: String?,
        email: String?,
        pageRequest: PageRequest
    ): Page<User> {
        return findWorkspaceUsers(workspaceId, name, email, pageRequest)
    }

    private fun findWorkspaceUsers(workspaceId: String, name: String?, email: String?, page: PageRequest): Page<User> {
        val result = executeWorkspacePageQuery(createStatementWorkspaceUsers(name, email), workspaceId, name, email, page)
        return Page(
            result?.toList() ?: emptyList(),
            page.page,
            page.size,
            executeCountQuery(name, email) ?: 0
        )
    }

    private fun executeWorkspacePageQuery(
        statement: String,
        workspaceId: String,
        name: String?,
        email: String?,
        pageRequest: PageRequest
    ): Set<User>? {
        val parameters = mutableListOf<Any>()
        return appendParametersAndRunQuery(name, parameters, email, pageRequest, statement, workspaceId)
    }

    private fun findUserByEmail(email: String): Optional<User> {
        val statement = StringBuilder(BASE_QUERY_STATEMENT)
            .appendln("AND users.email = ?")

        return Optional.ofNullable(
            this.jdbcTemplate.query(statement.toString(), arrayOf(email), userExtractor)?.firstOrNull()
        )
    }

    private fun findUserById(id: String): Optional<User> {
        val statement = StringBuilder(BASE_QUERY_STATEMENT)
            .appendln("AND users.id = ?")

        return Optional.ofNullable(
            this.jdbcTemplate.query(statement.toString(), arrayOf(id), userExtractor)?.firstOrNull()
        )
    }

    private fun findAllUsers(name: String?, email: String?, page: PageRequest): Page<User> {
        val result = executePageQuery(createStatementSelectUsers(name, email), name, email, page)
        return Page(
            result?.toList() ?: emptyList(),
            page.page,
            page.size,
            executeCountQuery(name, email) ?: 0
        )
    }

    private fun executePageQuery(
        statement: String,
        name: String?,
        email: String?,
        pageRequest: PageRequest
    ): Set<User>? {
        val parameters = mutableListOf<Any>()
        return appendParametersAndRunQuery(name, parameters, email, pageRequest, statement, null)
    }

    private fun appendParametersAndRunQuery(
        name: String?,
        parameters: MutableList<Any>,
        email: String?,
        pageRequest: PageRequest,
        statement: String,
        workspaceId: String?
    ): Set<User>? {
        name?.let { parameters.add("%$it%") }
        email?.let { parameters.add("%$it%") }
        parameters.add(pageRequest.size)
        parameters.add(pageRequest.offset())
        workspaceId?.let { parameters.add(workspaceId) }

        return this.jdbcTemplate.query(
            statement,
            parameters.toTypedArray(),
            userExtractor
        )
    }

    private fun createStatementSelectUsers(name: String?, email: String?): String {
        val innerQueryStatement = createInnerQueryStatement(name, email)

        return """
        SELECT users.id,
               users.name,
               users.email,
               users.photo_url,
               users.is_root,
               users.created_at,
               workspaces.id                        AS workspace_id,
               workspaces.name                      AS workspace_name,
               workspaces.created_at                AS workspace_created_at,
               workspaces.git_configuration_id      AS workspace_git_configuration_id,
               workspaces.registry_configuration_id AS workspace_registry_configuration_id,
               workspaces.cd_configuration_id       AS workspace_cd_configuration_id,
               workspaces.status                    AS workspace_status,
               workspaces.circle_matcher_url        AS workspace_circle_matcher_url,
               workspaces.metric_configuration_id   AS workspace_metric_configuration_id,
               workspace_user.id                    AS workspace_author_id,
               workspace_user.name                  AS workspace_author_name,
               workspace_user.created_at            AS workspace_author_created_at,
               workspace_user.email                 AS workspace_author_email,
               workspace_user.photo_url             AS workspace_author_photo_url
        FROM ( $innerQueryStatement ) users
                 LEFT JOIN user_groups_users ON users.id = user_groups_users.user_id
                 LEFT JOIN user_groups ON user_groups_users.user_group_id = user_groups.id
                 LEFT JOIN workspaces_user_groups ON user_groups.id = workspaces_user_groups.user_group_id
                 LEFT JOIN workspaces ON workspaces_user_groups.workspace_id = workspaces.id AND
                                         (workspaces_user_groups.permissions @> '[{"name": "maintenance_write"}]'
                                              AND workspaces.status IN ('INCOMPLETE', 'COMPLETE')
                                             OR workspaces.status = 'COMPLETE')
                 LEFT JOIN users as workspace_user ON workspaces.user_id = workspace_user.id
        WHERE 1 = 1
        ORDER BY users.name ASC
        """
    }

    private fun createStatementWorkspaceUsers(name: String?, email: String?): String {
        val innerQueryStatement = createInnerQueryStatement(name, email)

        return """SELECT users.id,
                   users.name,
                   users.email,
                   users.photo_url,
                   users.is_root,
                   users.created_at,
                   workspaces.id                        AS workspace_id,
                   workspaces.name                      AS workspace_name,
                   workspaces.created_at                AS workspace_created_at,
                   workspaces.git_configuration_id      AS workspace_git_configuration_id,
                   workspaces.registry_configuration_id AS workspace_registry_configuration_id,
                   workspaces.cd_configuration_id       AS workspace_cd_configuration_id,
                   workspaces.status                    AS workspace_status,
                   workspaces.circle_matcher_url        AS workspace_circle_matcher_url,
                   workspaces.metric_configuration_id   AS workspace_metric_configuration_id,
                   workspace_user.id                    AS workspace_author_id,
                   workspace_user.name                  AS workspace_author_name,
                   workspace_user.created_at            AS workspace_author_created_at,
                   workspace_user.email                 AS workspace_author_email,
                   workspace_user.photo_url             AS workspace_author_photo_url
            FROM ( $innerQueryStatement ) users
                     LEFT JOIN user_groups_users ON users.id = user_groups_users.user_id
                     LEFT JOIN user_groups ON user_groups_users.user_group_id = user_groups.id
                     LEFT JOIN workspaces_user_groups ON user_groups.id = workspaces_user_groups.user_group_id
                     LEFT JOIN workspaces ON workspaces_user_groups.workspace_id = workspaces.id
                     LEFT JOIN users as workspace_user ON workspaces.user_id = workspace_user.id
            WHERE 1 = 1
            AND workspaces.id = ?
            ORDER BY users.name ASC"""
    }

    private fun createInnerQueryStatement(name: String?, email: String?): String {
        val innerQueryStatement = StringBuilder("SELECT * FROM users WHERE 1 = 1")
        name?.let { innerQueryStatement.appendln("AND users.name ILIKE ?") }
        email?.let { innerQueryStatement.appendln("AND users.email ILIKE ?") }
        innerQueryStatement.appendln("ORDER BY users.name ASC")
            .appendln("LIMIT ?")
            .appendln("OFFSET ?")

        return innerQueryStatement.toString()
    }

    private fun executeCountQuery(name: String?, email: String?): Int? {
        val countStatement = StringBuilder(
            """
               SELECT count(*) AS total
               FROM users
               WHERE 1 = 1
               """
        )

        val parameters = mutableListOf<String>()

        name?.let {
            parameters.add("%$it%")
            countStatement.appendln("AND users.name ILIKE ?")
        }
        email?.let {
            parameters.add("%$it%")
            countStatement.appendln("AND users.email ILIKE ?")
        }

        return this.jdbcTemplate.queryForObject(
            countStatement.toString(),
            parameters.toTypedArray()
        ) { resultSet, _ -> resultSet.getInt(1) }
    }
}
