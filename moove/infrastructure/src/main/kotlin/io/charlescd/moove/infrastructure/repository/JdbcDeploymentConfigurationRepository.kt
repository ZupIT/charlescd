/*
 * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package io.charlescd.moove.infrastructure.repository

import io.charlescd.moove.domain.DeploymentConfiguration
import io.charlescd.moove.domain.repository.DeploymentConfigurationRepository
import io.charlescd.moove.infrastructure.repository.mapper.DeploymentConfigurationExtractor
import java.util.*
import org.springframework.beans.factory.annotation.Value
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Repository

@Repository
class JdbcDeploymentConfigurationRepository(
    private val jdbcTemplate: JdbcTemplate,
    private val deploymentConfigurationExtractor: DeploymentConfigurationExtractor,
    @Value("\${encryption.key}")
    private val encryptionKey: String
) : DeploymentConfigurationRepository {

    companion object {
        const val BASE_QUERY_STATEMENT = """
                    SELECT deployment_configurations.id                                                        AS deployment_configuration_id,
                           deployment_configurations.name                                                      AS deployment_configuration_name,
                           deployment_configuration_user.id                                                    AS deployment_configuration_user_id,
                           deployment_configuration_user.name                                                  AS deployment_configuration_user_name,
                           deployment_configuration_user.photo_url                                             AS deployment_configuration_user_photo_url,
                           deployment_configuration_user.email                                                 AS deployment_configuration_user_email,
                           deployment_configuration_user.created_at                                            AS deployment_configuration_user_created_at,
                           deployment_configurations.created_at                                                AS deployment_configuration_created_at,
                           deployment_configurations.workspace_id                                              AS deployment_configuration_workspace_id,
                           deployment_configurations.butler_url                                                AS deployment_configuration_butler_url,
                           deployment_configurations.namespace                                                 AS deployment_configuration_namespace,
                           deployment_configurations.git_token                                                 AS deployment_configuration_git_token,
                           deployment_configurations.git_provider                                              AS deployment_configuration_git_provider
                    FROM deployment_configurations
                           INNER JOIN users deployment_configuration_user ON deployment_configurations.user_id = deployment_configuration_user.id
                    WHERE 1 = 1
                """

        const val BASE_COUNT_QUERY_STATEMENT = """
                    SELECT count(*) AS total
                    FROM deployment_configurations
                    WHERE deployment_configurations.workspace_id = ?
                """
    }

    override fun save(deploymentConfiguration: DeploymentConfiguration): DeploymentConfiguration {
        createConfiguration(deploymentConfiguration)
        return find(deploymentConfiguration.id).get()
    }

    private fun createConfiguration(deploymentConfiguration: DeploymentConfiguration) {
        val statement = StringBuilder(
            """
                INSERT INTO deployment_configurations(id,
                               name,
                               user_id,
                               workspace_id,
                               created_at,
                               butler_url,
                               namespace,
                               git_token,
                               git_provider)
                VALUES (?, ?, ?, ?, ?, ?, ?, ENCODE(ARMOR(PGP_SYM_ENCRYPT(?, ?, 'cipher-algo=aes256'))::bytea, 'base64'), ?)
                """
        )

        this.jdbcTemplate.update(
            statement.toString(),
            deploymentConfiguration.id,
            deploymentConfiguration.name,
            deploymentConfiguration.author.id,
            deploymentConfiguration.workspaceId,
            deploymentConfiguration.createdAt,
            deploymentConfiguration.butlerUrl,
            deploymentConfiguration.namespace,
            deploymentConfiguration.gitToken,
            encryptionKey,
            deploymentConfiguration.gitProvider.toString()
        )
    }

    override fun find(id: String): Optional<DeploymentConfiguration> {
        return findDeploymentConfigurationById(id)
    }

    private fun findDeploymentConfigurationById(id: String): Optional<DeploymentConfiguration> {
        val statement = StringBuilder(BASE_QUERY_STATEMENT)
            .appendln("AND deployment_configurations.id = ?")

        return Optional.ofNullable(
            this.jdbcTemplate.query(statement.toString(), arrayOf(id), deploymentConfigurationExtractor)
                ?.firstOrNull()
        )
    }

    override fun exists(workspaceId: String, id: String): Boolean {
        return checkIfDeploymentConfigurationExistsByWorkspaceId(workspaceId, id)
    }

    override fun existsAnyByWorkspaceId(workspaceId: String): Boolean {
        return checkIfAnyDeploymentConfigurationExistsByWorkspaceId(workspaceId)
    }

    override fun delete(id: String) {
        deleteDeploymentConfigurationById(id)
    }

    private fun checkIfDeploymentConfigurationExistsByWorkspaceId(workspaceId: String, id: String): Boolean {
        val countStatement = StringBuilder(BASE_COUNT_QUERY_STATEMENT)
            .appendln("AND deployment_configurations.id = ?")
            .toString()

        return applyCountQuery(
            countStatement, arrayOf(workspaceId, id))
    }

    private fun checkIfAnyDeploymentConfigurationExistsByWorkspaceId(workspaceId: String): Boolean {
        return applyCountQuery(
            BASE_COUNT_QUERY_STATEMENT, arrayOf(workspaceId))
    }

    private fun applyCountQuery(statement: String, params: Array<String>): Boolean {
        val count = this.jdbcTemplate.queryForObject(
            statement,
            params
        ) { rs, _ -> rs.getInt(1) }
        return count != null && count >= 1
    }

    private fun deleteDeploymentConfigurationById(id: String) {
        val statement = """
               DELETE
                FROM deployment_configurations
                WHERE id = ?
            """

        this.jdbcTemplate.update(statement, id)
    }
}
