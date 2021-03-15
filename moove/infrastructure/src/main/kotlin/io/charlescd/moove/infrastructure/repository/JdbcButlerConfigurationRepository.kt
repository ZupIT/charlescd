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

import io.charlescd.moove.domain.ButlerConfiguration
import io.charlescd.moove.domain.repository.ButlerConfigurationRepository
import io.charlescd.moove.infrastructure.repository.mapper.ButlerConfigurationExtractor
import java.util.*
import org.springframework.beans.factory.annotation.Value
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Repository

@Repository
class JdbcButlerConfigurationRepository(
    private val jdbcTemplate: JdbcTemplate,
    private val butlerConfigurationExtractor: ButlerConfigurationExtractor,
    @Value("\${encryption.key}")
    private val encryptionKey: String
) : ButlerConfigurationRepository {

    companion object {
        const val BASE_QUERY_STATEMENT = """
                    SELECT butler_configurations.id                                                        AS butler_configuration_id,
                           butler_configurations.name                                                      AS butler_configuration_name,
                           butler_configuration_user.id                                                    AS butler_configuration_user_id,
                           butler_configuration_user.name                                                  AS butler_configuration_user_name,
                           butler_configuration_user.photo_url                                             AS butler_configuration_user_photo_url,
                           butler_configuration_user.email                                                 AS butler_configuration_user_email,
                           butler_configuration_user.created_at                                            AS butler_configuration_user_created_at,
                           butler_configurations.created_at                                                AS butler_configuration_created_at,
                           butler_configurations.workspace_id                                              AS butler_configuration_workspace_id,
                           butler_configurations.butler_url                                                AS butler_configuration_butler_url,
                           butler_configurations.namespace                                                 AS butler_configuration_namespace,
                           butler_configurations.git_token                                                 AS butler_configuration_git_token,
                           butler_configurations.git_provider                                              AS butler_configuration_git_provider
                    FROM butler_configurations
                           INNER JOIN users butler_configuration_user ON butler_configurations.user_id = butler_configuration_user.id
                    WHERE 1 = 1
                """
    }

    override fun save(butlerConfiguration: ButlerConfiguration): ButlerConfiguration {
        createConfiguration(butlerConfiguration)
        return find(butlerConfiguration.id).get()
    }

    private fun createConfiguration(butlerConfiguration: ButlerConfiguration) {
        val statement = StringBuilder(
            """
                INSERT INTO butler_configurations(id,
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
            butlerConfiguration.id,
            butlerConfiguration.name,
            butlerConfiguration.author.id,
            butlerConfiguration.workspaceId,
            butlerConfiguration.createdAt,
            butlerConfiguration.butlerUrl,
            butlerConfiguration.namespace,
            butlerConfiguration.gitToken,
            encryptionKey,
            butlerConfiguration.gitProvider.toString()
        )
    }

    override fun find(id: String): Optional<ButlerConfiguration> {
        return findButlerConfigurationById(id)
    }

    private fun findButlerConfigurationById(id: String): Optional<ButlerConfiguration> {
        val statement = StringBuilder(BASE_QUERY_STATEMENT)
            .appendln("AND butler_configurations.id = ?")

        return Optional.ofNullable(
            this.jdbcTemplate.query(statement.toString(), arrayOf(id), butlerConfigurationExtractor)
                ?.firstOrNull()
        )
    }

    override fun exists(workspaceId: String, id: String): Boolean {
        return checkIfButlerConfigurationExistsByWorkspaceId(workspaceId, id)
    }

    private fun checkIfButlerConfigurationExistsByWorkspaceId(workspaceId: String, id: String): Boolean {
        val countStatement = StringBuilder(
            """
               SELECT count(*) AS total
               FROM butler_configurations 
               WHERE butler_configurations.id = ?
               AND butler_configurations.workspace_id = ?
               """
        )

        val count = this.jdbcTemplate.queryForObject(
            countStatement.toString(),
            arrayOf(id, workspaceId)
        ) { rs, _ -> rs.getInt(1) }

        return count != null && count >= 1
    }
}
