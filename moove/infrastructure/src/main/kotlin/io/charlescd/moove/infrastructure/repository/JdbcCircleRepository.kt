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

import io.charlescd.moove.domain.Circle
import io.charlescd.moove.domain.Page
import io.charlescd.moove.domain.PageRequest
import io.charlescd.moove.domain.repository.CircleRepository
import io.charlescd.moove.infrastructure.repository.mapper.CircleExtractor
import java.sql.Types
import java.util.*
import kotlin.collections.ArrayList
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Repository

@Repository
class JdbcCircleRepository(private val jdbcTemplate: JdbcTemplate, private val circleExtractor: CircleExtractor) :
    CircleRepository {

    companion object {
        const val BASE_QUERY_STATEMENT = """
                SELECT circles.id                  AS circle_id,
                       circles.name                AS circle_name,
                       circles.reference           AS circle_reference,
                       circles.created_at          AS circle_created_at,
                       circles.matcher_type        AS circle_matcher_type,
                       circles.rules               AS circle_rules,
                       circles.imported_kv_records AS circle_imported_kv_records,
                       circles.imported_at         AS circle_imported_at,
                       circles.default_circle      AS circle_default,
                       circles.workspace_id        AS circle_workspace_id,
                       circle_user.id              AS circle_user_id,
                       circle_user.name            AS circle_user_name,
                       circle_user.email           AS circle_user_email,
                       circle_user.photo_url       AS circle_user_photo_url,
                       circle_user.created_at      AS circle_user_created_at
                FROM circles
                         LEFT JOIN users circle_user ON circles.user_id = circle_user.id
                WHERE 1 = 1
              """
    }

    override fun save(circle: Circle): Circle {
        createCircle(circle)
        return findById(circle.id).get()
    }

    override fun findById(id: String): Optional<Circle> {
        return findCircleById(id)
    }

    override fun find(id: String, workspaceId: String): Optional<Circle> {
        return findCircleByIdAndWorkspaceId(id, workspaceId)
    }

    override fun find(name: String?, active: Boolean, workspaceId: String, pageRequest: PageRequest): Page<Circle> {
        val count = executeCountQuery(name, active, workspaceId)

        val result = this.jdbcTemplate.query(
            createQuery(name, active),
            createParametersArray(name, active, workspaceId),
            circleExtractor
        )

        return Page(result?.toList() ?: emptyList(), pageRequest.page, pageRequest.size, count ?: 0)
    }

    override fun findDefaultByWorkspaceId(workspaceId: String): Optional<Circle> {
        val statement = StringBuilder(BASE_QUERY_STATEMENT)
            .appendln("AND circles.workspace_id = ?")
            .appendln("AND circles.default_circle = ?")

        return Optional.ofNullable(
            this.jdbcTemplate.query(statement.toString(), arrayOf(workspaceId, true), circleExtractor)?.firstOrNull()
        )
    }

    override fun update(circle: Circle): Circle {
        return updateCircle(circle)
    }

    override fun delete(id: String) {
        deleteCircleById(id)
    }

    private fun createParametersArray(name: String?, active: Boolean, workspaceId: String): Array<Any> {
        val parameters = ArrayList<Any>()
        if (!active) parameters.add(workspaceId)
        name?.let { parameters.add("%$name%") }
        parameters.add(workspaceId)

        return parameters.toTypedArray()
    }

    private fun executeCountQuery(name: String?, active: Boolean, workspaceId: String): Int? {
        return when (active) {
            true -> executeActiveCircleCountQuery(name, workspaceId)
            else -> executeInactiveCircleCountQuery(name, workspaceId)
        }
    }

    private fun createQuery(name: String?, active: Boolean): String {
        return when (active) {
            true -> createActiveCircleQuery(name)
            else -> createInactiveCircleQuery(name)
        }.toString()
    }

    private fun deleteCircleById(id: String) {
        val statement = "DELETE FROM circles WHERE id = ?"

        this.jdbcTemplate.update(statement, id)
    }

    private fun createCircle(circle: Circle) {
        val statement = StringBuilder(
            """
               INSERT INTO circles(id,
                        name,
                        reference,
                        created_at,
                        matcher_type,
                        rules,
                        imported_at,
                        imported_kv_records,
                        user_id,
                        default_circle,
                        workspace_id)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """
        )

        this.jdbcTemplate.update(statement.toString()) { ps ->
            ps.setString(1, circle.id)
            ps.setString(2, circle.name)
            ps.setString(3, circle.reference)
            ps.setObject(4, circle.createdAt)
            ps.setString(5, circle.matcherType.name)
            ps.setObject(6, circle.rules, Types.OTHER)
            ps.setObject(7, circle.importedAt)
            ps.setObject(8, circle.importedKvRecords)
            ps.setString(9, circle.author?.id)
            ps.setBoolean(10, circle.defaultCircle)
            ps.setString(11, circle.workspaceId)
        }
    }

    private fun findCircleById(id: String): Optional<Circle> {
        val statement = StringBuilder(BASE_QUERY_STATEMENT)
            .appendln("AND circles.id = ?")

        return Optional.ofNullable(
            this.jdbcTemplate.query(statement.toString(), arrayOf(id), circleExtractor)?.firstOrNull()
        )
    }

    private fun findCircleByIdAndWorkspaceId(id: String, workspaceId: String): Optional<Circle> {
        val statement = StringBuilder(BASE_QUERY_STATEMENT)
            .appendln("AND circles.id = ?")
            .appendln("AND circles.workspace_id = ?")

        return Optional.ofNullable(
            this.jdbcTemplate.query(statement.toString(), arrayOf(id, workspaceId), circleExtractor)?.firstOrNull()
        )
    }

    private fun updateCircle(circle: Circle): Circle {
        val statement = StringBuilder(
            """
                    UPDATE circles
                    SET name                = ?,
                        reference           = ?,
                        matcher_type        = ?,
                        rules               = ?,
                        imported_at         = ?,
                        imported_kv_records = ?
                    WHERE id = ?
                """
        )

        this.jdbcTemplate.update(statement.toString()) { ps ->
            ps.setString(1, circle.name)
            ps.setString(2, circle.reference)
            ps.setString(3, circle.matcherType.name)
            ps.setObject(4, circle.rules, Types.OTHER)
            ps.setObject(5, circle.importedAt)
            ps.setObject(6, circle.importedKvRecords)
            ps.setObject(7, circle.id)
        }

        return findById(circle.id).get()
    }

    private fun executeActiveCircleCountQuery(name: String?, workspaceId: String): Int? {
        val statement = StringBuilder(
            """
                    SELECT DISTINCT COUNT(*)
                    FROM circles c
                             INNER JOIN deployments d ON c.id = d.circle_id
                    WHERE 1 = 1
                    AND d.status NOT IN ('NOT_DEPLOYED', 'DEPLOY_FAILED')
                   """
        )

        name?.let { statement.appendln("AND c.name ILIKE ?") }
        statement.appendln("AND c.workspace_id = ?")

        return this.jdbcTemplate.queryForObject(
            statement.toString(),
            createParametersArray(name,true,workspaceId)
        ) { rs, _ ->
            rs.getInt(1)
        }
    }

    private fun executeInactiveCircleCountQuery(name: String?, workspaceId: String): Int? {
        val statement = StringBuilder(
            """
                SELECT DISTINCT COUNT(*)
                FROM circles c
                         LEFT JOIN deployments d ON c.id = d.circle_id
                WHERE 1 = 1
                    AND d.circle_id IS NULL
                    OR  c.id NOT IN
                    (
                        SELECT DISTINCT d.circle_id
                        FROM deployments d
                        WHERE d.status IN ('DEPLOYING', 'DEPLOYED', 'UNDEPLOYING')
                        AND d.workspace_id = ?
                    )
                """
        )

        name?.let { statement.appendln("AND c.name ILIKE ?") }
        statement.appendln("AND c.workspace_id = ?")

        return this.jdbcTemplate.queryForObject(
            statement.toString(),
            createParametersArray(name,false,workspaceId)
        ) { rs, _ ->
            rs.getInt(1)
        }
    }

    private fun createActiveCircleQuery(name: String?): StringBuilder {
        val statement = StringBuilder(
            """
                    SELECT circles.id                  AS circle_id,
                           circles.name                AS circle_name,
                           circles.reference           AS circle_reference,
                           circles.created_at          AS circle_created_at,
                           circles.matcher_type        AS circle_matcher_type,
                           circles.rules               AS circle_rules,
                           circles.imported_kv_records AS circle_imported_kv_records,
                           circles.imported_at         AS circle_imported_at,
                           circles.default_circle      AS circle_default,
                           circles.workspace_id        AS circle_workspace_id,
                           circle_user.id              AS circle_user_id,
                           circle_user.name            AS circle_user_name,
                           circle_user.email           AS circle_user_email,
                           circle_user.photo_url       AS circle_user_photo_url,
                           circle_user.created_at      AS circle_user_created_at
                    FROM circles
                             LEFT JOIN users circle_user ON circles.user_id = circle_user.id
                             INNER JOIN deployments ON circles.id = deployments.circle_id
                    WHERE 1 = 1
                            AND deployments.status NOT IN ('NOT_DEPLOYED', 'DEPLOY_FAILED')
                """
        )

        name?.let { statement.appendln("AND circles.name ILIKE ?") }
        statement.appendln("AND circles.workspace_id = ?")

        return statement
    }

    private fun createInactiveCircleQuery(name: String?): StringBuilder {
        val statement = StringBuilder(
            """
                    SELECT circles.id                  AS circle_id,
                           circles.name                AS circle_name,
                           circles.reference           AS circle_reference,
                           circles.created_at          AS circle_created_at,
                           circles.matcher_type        AS circle_matcher_type,
                           circles.rules               AS circle_rules,
                           circles.imported_kv_records AS circle_imported_kv_records,
                           circles.imported_at         AS circle_imported_at,
                           circles.default_circle      AS circle_default,
                           circles.workspace_id        AS circle_workspace_id,
                           circle_user.id              AS circle_user_id,
                           circle_user.name            AS circle_user_name,
                           circle_user.email           AS circle_user_email,
                           circle_user.photo_url       AS circle_user_photo_url,
                           circle_user.created_at      AS circle_user_created_at
                    FROM circles
                             LEFT JOIN users circle_user ON circles.user_id = circle_user.id
                             LEFT JOIN deployments ON circles.id = deployments.circle_id
                    WHERE 1 = 1
                           AND (deployments.circle_id IS NULL
                           OR  circles.id NOT IN
                           (
                               SELECT DISTINCT d.circle_id
                               FROM deployments d
                               WHERE d.status IN ('DEPLOYING', 'DEPLOYED', 'UNDEPLOYING')
                               AND d.workspace_id = ?
                           ))
                """
        )

        name?.let { statement.appendln("AND circles.name ILIKE ?") }
        statement.appendln("AND circles.workspace_id = ?")

        return statement
    }
}
