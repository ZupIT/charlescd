/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charles.infrastructure.repository

import br.com.zup.charles.domain.Deployment
import br.com.zup.charles.domain.DeploymentStatusEnum
import br.com.zup.charles.domain.repository.DeploymentRepository
import br.com.zup.charles.infrastructure.repository.mapper.DeploymentExtractor
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Repository
import java.util.*

@Repository
class JdbcDeploymentRepository(private val jdbcTemplate: JdbcTemplate) : DeploymentRepository {

    companion object {
        const val BASE_QUERY_STATEMENT = """
                select deployments.id                           as deployment_id,
                       deployments.created_at                   as deployment_created_at,
                       deployments.deployed_at                  as deployment_deployed_at,
                       deployments.status                       as deployment_status,
                       deployments.circle_id                    as deployment_circle_id,
                       deployments.build_id                     as deployment_build_id,
                       deployments.application_id               as deployment_application_id,
                       deployment_user.id                       as deployment_user_id,
                       deployment_user.name                     as deployment_user_name,
                       deployment_user.email                    as deployment_user_email,
                       deployment_user.photo_url                as deployment_user_photo_url,
                       deployment_user.created_at               as deployment_user_created_at,
                       deployment_circle.id                     as deployment_circle_id,
                       deployment_circle.name                   as deployment_circle_name,
                       deployment_circle.reference              as deployment_circle_reference,
                       deployment_circle.created_at             as deployment_circle_created_at,
                       deployment_circle.matcher_type           as deployment_circle_matcher_type,
                       deployment_circle.rules                  as deployment_circle_rules,
                       deployment_circle.imported_kv_records    as deployment_circle_imported_kv_records,
                       deployment_circle.imported_at            as deployment_circle_imported_at,
                       deployment_circle_user.id                as deployment_circle_user_id,
                       deployment_circle_user.name              as deployment_circle_user_name,
                       deployment_circle_user.email             as deployment_circle_user_email,
                       deployment_circle_user.photo_url         as deployment_circle_user_photo_url,
                       deployment_circle_user.created_at        as deployment_circle_user_created_at
                from deployments
                       left join users deployment_user on deployments.user_id = deployment_user.id
                       left join circles deployment_circle on deployments.circle_id = deployment_circle.id
                       left join users deployment_circle_user on deployment_circle.user_id = deployment_circle_user.id
                where 1 = 1 
        """
    }

    override fun save(deployment: Deployment): Deployment {
        createDeployment(deployment)
        return find(deployment.id, deployment.applicationId).get()
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

    override fun find(id: String, applicationId: String): Optional<Deployment> {
        return findByIdAndApplicationId(id, applicationId)
    }

    override fun findByCircleIdAndApplicationId(circleId: String, applicationId: String): List<Deployment> {
        return findByCircleAndApplicationId(circleId, applicationId)
    }

    private fun updateDeploymentStatus(id: String, status: DeploymentStatusEnum) {
        val statement = "update deployments set status = ?  where id = ?"

        this.jdbcTemplate.update(
            statement,
            status.name,
            id
        )
    }

    private fun createDeployment(deployment: Deployment) {
        val statement = "insert into deployments(" +
                "id," +
                "user_id," +
                "created_at," +
                "deployed_at," +
                "status," +
                "circle_id," +
                "build_id," +
                "application_id) values (" +
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
            deployment.applicationId
        )
    }

    private fun updateDeployment(deployment: Deployment) {
        val statement = StringBuilder(
            """
             update deployments
                set user_id        = ?,
                    created_at     = ?,
                    circle_id      = ?,
                    build_id       = ?,
                    status         = ?,
                    deployed_at    = ?,
                    application_id = ?
                where id = ?
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
            deployment.applicationId,
            deployment.id
        )
    }

    private fun findDeploymentById(id: String): Optional<Deployment> {
        val statement = StringBuilder(BASE_QUERY_STATEMENT)
            .appendln("and deployments.id = ?")

        return Optional.ofNullable(
            this.jdbcTemplate.query(statement.toString(), arrayOf(id), DeploymentExtractor())
                ?.firstOrNull()
        )
    }

    private fun findByCircleIdAndStatus(circleId: String, status: DeploymentStatusEnum): Optional<Deployment> {
        val statement = StringBuilder(BASE_QUERY_STATEMENT)
            .appendln("and deployments.status = ?")
            .appendln("and deployments.circle_id = ?")

        return Optional.ofNullable(
            this.jdbcTemplate.query(statement.toString(), arrayOf(status.name, circleId), DeploymentExtractor())
                ?.firstOrNull()
        )
    }

    private fun findByCircleAndApplicationId(circleId: String, applicationId: String): List<Deployment> {
        val statement = StringBuilder(BASE_QUERY_STATEMENT)
            .appendln("and deployments.application_id = ?")
            .appendln("and deployments.circle_id = ?")

        return this.jdbcTemplate.query(
            statement.toString(),
            arrayOf(applicationId, circleId),
            DeploymentExtractor()
        )?.toList() ?: emptyList()
    }

    private fun findByIdAndApplicationId(id: String, applicationId: String): Optional<Deployment> {
        val statement = StringBuilder(BASE_QUERY_STATEMENT)
            .appendln("and deployments.id = ?")
            .appendln("and deployments.application_id = ?")

        return Optional.ofNullable(
            this.jdbcTemplate.query(statement.toString(), arrayOf(id, applicationId), DeploymentExtractor())
                ?.firstOrNull()
        )
    }
}