/*
 *
 *  Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

package io.charlescd.moove.infrastructure.repository

import io.charlescd.moove.domain.*
import io.charlescd.moove.domain.repository.DeploymentRepository
import io.charlescd.moove.infrastructure.repository.mapper.*
import java.util.*
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Repository

@Repository
class JdbcDeploymentRepository(
    private val jdbcTemplate: JdbcTemplate,
    private val deploymentExtractor: DeploymentExtractor,
    private val deploymentGeneralStatsExtractor: DeploymentGeneralStatsExtractor,
    private val deploymentStatsExtractor: DeploymentStatsExtractor,
    private val deploymentAverageTimeStatsExtractor: DeploymentAverageTimeStatsExtractor,
    private val deploymentHistoryExtractor: DeploymentHistoryExtractor

) : DeploymentRepository {

    companion object {
        const val BASE_QUERY_STATEMENT = """
                SELECT deployments.id                        AS deployment_id,
                       deployments.created_at                AS deployment_created_at,
                       deployments.deployed_at               AS deployment_deployed_at,
                       deployments.status                    AS deployment_status,
                       deployments.circle_id                 AS deployment_circle_id,
                       deployments.build_id                  AS deployment_build_id,
                       deployments.workspace_id              AS deployment_workspace_id,
                       deployments.undeployed_at             AS deployment_undeployed_at,
                       deployment_user.id                    AS deployment_user_id,
                       deployment_user.name                  AS deployment_user_name,
                       deployment_user.email                 AS deployment_user_email,
                       deployment_user.photo_url             AS deployment_user_photo_url,
                       deployment_user.created_at            AS deployment_user_created_at,
                       deployment_circle.id                  AS deployment_circle_id,
                       deployment_circle.name                AS deployment_circle_name,
                       deployment_circle.reference           AS deployment_circle_reference,
                       deployment_circle.created_at          AS deployment_circle_created_at,
                       deployment_circle.matcher_type        AS deployment_circle_matcher_type,
                       deployment_circle.rules               AS deployment_circle_rules,
                       deployment_circle.imported_kv_records AS deployment_circle_imported_kv_records,
                       deployment_circle.imported_at         AS deployment_circle_imported_at,
                       deployment_circle.default_circle      AS deployment_circle_default_circle,
                       deployment_circle.workspace_id        AS deployment_circle_workspace_id,
                       deployment_circle_user.id             AS deployment_circle_user_id,
                       deployment_circle_user.name           AS deployment_circle_user_name,
                       deployment_circle_user.email          AS deployment_circle_user_email,
                       deployment_circle_user.photo_url      AS deployment_circle_user_photo_url,
                       deployment_circle_user.created_at     AS deployment_circle_user_created_at
                FROM deployments
                         LEFT JOIN users deployment_user ON deployments.user_id = deployment_user.id
                         LEFT JOIN circles deployment_circle ON deployments.circle_id = deployment_circle.id
                         LEFT JOIN users deployment_circle_user ON deployment_circle.user_id = deployment_circle_user.id
                WHERE 1 = 1
        """
    }

    override fun save(deployment: Deployment): Deployment {
        createDeployment(deployment)
        return find(deployment.id, deployment.workspaceId).get()
    }

    override fun update(deployment: Deployment): Deployment {
        updateDeployment(deployment)
        return findDeploymentById(deployment.id).get()
    }

    override fun findById(id: String): Optional<Deployment> {
        return findDeploymentById(id)
    }

    override fun updateStatus(id: String, status: DeploymentStatusEnum) {
        updateDeploymentStatus(id, status)
    }

    override fun find(circleId: String, status: DeploymentStatusEnum): Optional<Deployment> {
        return findByCircleIdAndStatus(circleId, status)
    }

    override fun find(id: String, workspaceId: String): Optional<Deployment> {
        return findByIdAndWorkspaceId(id, workspaceId)
    }

    override fun deleteByCircleId(circleId: String) {
        deleteDeploymentsByCircleId(circleId)
    }

    override fun findByCircleIdAndWorkspaceId(circleId: String, workspaceId: String): List<Deployment> {
        return findByCircleAndWorkspaceId(circleId, workspaceId)
    }

    override fun findActiveByCircleId(circleId: String): List<Deployment> {
        return findActiveDeploymentsByCircleId(circleId)
    }

    private fun deleteDeploymentsByCircleId(circleId: String) {
        val statement = "DELETE FROM deployments WHERE deployments.circle_id = ?"

        this.jdbcTemplate.update(statement, circleId)
    }

    private fun updateDeploymentStatus(id: String, status: DeploymentStatusEnum) {
        val statement = "UPDATE deployments SET status = ?  WHERE id = ?"

        this.jdbcTemplate.update(
            statement,
            status.name,
            id
        )
    }

    private fun createDeployment(deployment: Deployment) {
        val statement = "INSERT INTO deployments(" +
                "id," +
                "user_id," +
                "created_at," +
                "deployed_at," +
                "status," +
                "circle_id," +
                "build_id," +
                "workspace_id) VALUES (" +
                "?,?,?,?,?,?,?,?)"

        this.jdbcTemplate.update(
            statement,
            deployment.id,
            deployment.author.id,
            deployment.createdAt,
            deployment.deployedAt,
            deployment.status.name,
            deployment.circle.id,
            deployment.buildId,
            deployment.workspaceId
        )
    }

    private fun updateDeployment(deployment: Deployment) {
        val statement = StringBuilder(
            """
             UPDATE deployments
                SET user_id        = ?,
                    created_at     = ?,
                    circle_id      = ?,
                    build_id       = ?,
                    status         = ?,
                    deployed_at    = ?,
                    workspace_id   = ?,
                    undeployed_at  = ?
                WHERE id = ?
            """
        )

        this.jdbcTemplate.update(
            statement.toString(),
            deployment.author.id,
            deployment.createdAt,
            deployment.circle.id,
            deployment.buildId,
            deployment.status.name,
            deployment.deployedAt,
            deployment.workspaceId,
            deployment.undeployedAt,
            deployment.id
        )
    }

    private fun findDeploymentById(id: String): Optional<Deployment> {
        val statement = StringBuilder(BASE_QUERY_STATEMENT)
            .appendln("AND deployments.id = ?")

        return Optional.ofNullable(
            this.jdbcTemplate.query(statement.toString(), arrayOf(id), deploymentExtractor)
                ?.firstOrNull()
        )
    }

    private fun findByCircleIdAndStatus(circleId: String, status: DeploymentStatusEnum): Optional<Deployment> {
        val statement = StringBuilder(BASE_QUERY_STATEMENT)
            .appendln("AND deployments.status = ?")
            .appendln("AND deployments.circle_id = ?")

        return Optional.ofNullable(
            this.jdbcTemplate.query(statement.toString(), arrayOf(status.name, circleId), deploymentExtractor)
                ?.firstOrNull()
        )
    }

    private fun findByCircleAndWorkspaceId(circleId: String, workspaceId: String): List<Deployment> {
        val statement = StringBuilder(BASE_QUERY_STATEMENT)
            .appendln("AND deployments.workspace_id = ?")
            .appendln("AND deployments.circle_id = ?")

        return this.jdbcTemplate.query(
            statement.toString(),
            arrayOf(workspaceId, circleId),
            deploymentExtractor
        )?.toList() ?: emptyList()
    }

    private fun findByIdAndWorkspaceId(id: String, workspaceId: String): Optional<Deployment> {
        val statement = StringBuilder(BASE_QUERY_STATEMENT)
            .appendln("AND deployments.id = ?")
            .appendln("AND deployments.workspace_id = ?")

        return Optional.ofNullable(
            this.jdbcTemplate.query(statement.toString(), arrayOf(id, workspaceId), deploymentExtractor)
                ?.firstOrNull()
        )
    }

    private fun findActiveDeploymentsByCircleId(circleId: String): List<Deployment> {
        val statement = StringBuilder(BASE_QUERY_STATEMENT)
            .appendln("AND deployments.circle_id = ?")
            .appendln("AND deployments.status not in ('NOT_DEPLOYED','DEPLOY_FAILED')")

        return this.jdbcTemplate.query(
            statement.toString(),
            arrayOf(circleId),
            deploymentExtractor
        )?.toList() ?: emptyList()
    }

    override fun countBetweenTodayAndDaysPastGroupingByStatus(
        workspaceId: String,
        circlesId: List<String>?,
        numberOfDays: Int
    ): List<DeploymentGeneralStats> {
        val parameters = mutableListOf<Any>(workspaceId, numberOfDays)
        var query = """
                SELECT  COUNT(id)                                               AS deployment_quantity,
                        COALESCE(AVG(deployed_at - created_at), '00:00:00')     AS deployment_average_time,
                        CASE status 
                            WHEN 'DEPLOY_FAILED' THEN 'DEPLOY_FAILED'
                            ELSE 'DEPLOYED'
                        END                                                     AS deployment_status
                FROM deployments 
                WHERE status NOT IN ('DEPLOYING', 'UNDEPLOYING')
                    AND workspace_id = ?
                    AND DATE_TRUNC('day', created_at) <= CURRENT_DATE
                    AND DATE_TRUNC('day', created_at) >= (CURRENT_DATE - ? * interval '1 days')
        """

        if (!circlesId.isNullOrEmpty()) {
            query += " AND ${mountCircleIdQuerySearch(circlesId)} "
            parameters.addAll(circlesId)
        }
        query += " GROUP BY deployment_status "

        return this.jdbcTemplate.query(
            query,
            parameters.toTypedArray(),
            deploymentGeneralStatsExtractor
        )?.toList()
            ?: emptyList()
    }

    override fun countBetweenTodayAndDaysPastGroupingByStatusAndCreationDate(
        workspaceId: String,
        circlesId: List<String>?,
        numberOfDays: Int
    ): List<DeploymentStats> {
        val parameters = mutableListOf<Any>(workspaceId, numberOfDays)
        var query = """
                SELECT  COUNT(id)                                               AS deployment_quantity,
                        COALESCE(AVG(deployed_at - created_at), '00:00:00')     AS deployment_average_time,
                        TO_CHAR(CREATED_AT, 'YYYY-MM-DD')                       AS deployment_date,
                        CASE status 
                            WHEN 'DEPLOY_FAILED' THEN 'DEPLOY_FAILED'
                            ELSE 'DEPLOYED'
                        END                                                     AS deployment_status
                FROM deployments
                WHERE status NOT IN ('DEPLOYING', 'UNDEPLOYING')
                    AND workspace_id = ?
                    AND DATE_TRUNC('day', created_at) <= CURRENT_DATE
                    AND DATE_TRUNC('day', created_at) >= (CURRENT_DATE - ? * interval '1 days')
        """

        if (!circlesId.isNullOrEmpty()) {
            query += " AND ${mountCircleIdQuerySearch(circlesId)} "
            parameters.addAll(circlesId)
        }
        query += " GROUP BY deployment_status, deployment_date "

        return this.jdbcTemplate.query(
            query,
            parameters.toTypedArray(),
            deploymentStatsExtractor
        )?.toList()
            ?: emptyList()
    }

    override fun averageDeployTimeBetweenTodayAndDaysPastGroupingByCreationDate(
        workspaceId: String,
        circlesId: List<String>?,
        numberOfDays: Int
    ): List<DeploymentAverageTimeStats> {
        val parameters = mutableListOf<Any>(workspaceId, numberOfDays)
        var query = """
                SELECT  COALESCE(AVG(deployed_at - created_at), '00:00:00')     AS deployment_average_time,
                        TO_CHAR(CREATED_AT, 'YYYY-MM-DD')                       AS deployment_date
                FROM deployments
                WHERE workspace_id = ?
                    AND DATE_TRUNC('day', created_at) <= CURRENT_DATE
                    AND DATE_TRUNC('day', created_at) >= (CURRENT_DATE - ? * interval '1 days')
        """

        if (!circlesId.isNullOrEmpty()) {
            query += " AND ${mountCircleIdQuerySearch(circlesId)} "
            parameters.addAll(circlesId)
        }
        query += " GROUP BY deployment_date "

        return this.jdbcTemplate.query(
            query,
            parameters.toTypedArray(),
            deploymentAverageTimeStatsExtractor
        )?.toList()
            ?: emptyList()
    }

    private fun mountCircleIdQuerySearch(circlesId: List<String>): String {
        return " circle_id IN (${circlesId.joinToString(separator = ",") { "?" }}) "
    }

    override fun findDeploymentsHistory(workspaceId: String, circles: List<String>?, pageRequest: PageRequest): Page<DeploymentHistory> {
        val totalItems = this.count(workspaceId, circles)
        val parameters = mutableListOf<Any>(workspaceId)

        val query = StringBuilder(
            """
                    SELECT  deployments.id              AS deployment_id,
	                        deployments.deployed_at     AS deployed_at,
                            deployments.undeployed_at   AS undeployed_at,
	                        users.name                  AS user_name,
	                        builds.tag                  AS deployment_version,
	                        deployments.status          AS deployment_status
                    FROM deployments deployments
                        INNER JOIN users users      ON users.id = deployments.user_id
                        INNER JOIN builds builds    ON builds.id = deployments.build_id
                    WHERE deployments.workspace_id = ? 
            """
        )

        if (!circles.isNullOrEmpty()) {
            query.appendln(" AND ${mountCircleIdQuerySearch(circles)} ")
            parameters.addAll(circles)
        }

        query.append(createPaginationAppend())
        parameters.add(pageRequest.size)
        parameters.add(pageRequest.size * pageRequest.page)

        val result = this.jdbcTemplate.query(
            query.toString(),
            parameters.toTypedArray(),
            deploymentHistoryExtractor
        )?.toList()
            ?: emptyList()

        return Page(result, pageRequest.page, pageRequest.size, totalItems)
    }

    private fun createPaginationAppend(): String {
        return """  
                    LIMIT ?
                    OFFSET ? 
                """
    }

    override fun count(workspaceId: String): Int {
        return this.count(workspaceId, null)
    }

    override fun count(workspaceId: String, circles: List<String>?): Int {
        val parameters = mutableListOf<Any>(workspaceId)
        val query = StringBuilder(
            """
                    SELECT  count (deployments.id)              
                    FROM deployments deployments
                    WHERE deployments.workspace_id = ? 
            """
        )

        if (!circles.isNullOrEmpty()) {
            query.appendln(" AND ${mountCircleIdQuerySearch(circles)} ")
            parameters.addAll(circles)
        }

        return this.jdbcTemplate.queryForObject(
            query.toString(),
            parameters.toTypedArray()
        ) { rs, _ ->
            rs.getInt(1)
        } ?: 0
    }
}
