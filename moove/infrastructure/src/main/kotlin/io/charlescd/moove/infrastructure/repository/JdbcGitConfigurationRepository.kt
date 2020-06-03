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

import com.fasterxml.jackson.databind.ObjectMapper
import io.charlescd.moove.domain.GitConfiguration
import io.charlescd.moove.domain.GitCredentials
import io.charlescd.moove.domain.Page
import io.charlescd.moove.domain.PageRequest
import io.charlescd.moove.domain.repository.GitConfigurationRepository
import io.charlescd.moove.infrastructure.repository.mapper.GitConfigurationExtractor
import java.util.*
import org.springframework.beans.factory.annotation.Value
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Repository

@Repository
class JdbcGitConfigurationRepository(
    private val jdbcTemplate: JdbcTemplate,
    private val objectMapper: ObjectMapper,
    private val gitConfigurationExtractor: GitConfigurationExtractor,
    @Value("\${encryption.key}")
    private val encryptionKey: String
) : GitConfigurationRepository {

    companion object {
        const val BASE_QUERY_STATEMENT = """
                    SELECT git_configurations.id                                                          AS git_configuration_id,
                           git_configurations.name                                                        AS git_configuration_name,
                           PGP_SYM_DECRYPT(git_configurations.credentials::bytea, ?,'cipher-algo=aes256') AS git_configuration_credentials,
                           git_configurations.created_at                                                  AS git_configuration_created_at,
                           git_configurations.workspace_id                                                AS git_configuration_workspace_id,
                           git_configuration_user.id                                                      AS git_configuration_user_id,
                           git_configuration_user.name                                                    AS git_configuration_user_name,
                           git_configuration_user.photo_url                                               AS git_configuration_user_photo_url,
                           git_configuration_user.email                                                   AS git_configuration_user_email,
                           git_configuration_user.created_at                                              AS git_configuration_user_created_at
                    FROM git_configurations
                           INNER JOIN users git_configuration_user ON git_configurations.user_id = git_configuration_user.id
                    WHERE 1 = 1
                """
    }

    override fun save(gitConfiguration: GitConfiguration): GitConfiguration {
        createConfiguration(gitConfiguration)
        return find(gitConfiguration.id).get()
    }

    override fun find(id: String): Optional<GitConfiguration> {
        return findGitConfigurationById(id)
    }

    override fun findByWorkspaceId(workspaceId: String, pageRequest: PageRequest): Page<GitConfiguration> {
        return findPageByWorkspaceId(workspaceId, pageRequest)
    }

    override fun exists(workspaceId: String, id: String): Boolean {
        return checkIfGitConfigurationExistsByWorkspaceId(workspaceId, id)
    }

    override fun delete(id: String) {
        deleteGitConfigurationById(id)
    }

    private fun deleteGitConfigurationById(id: String) {
        val statement = """
               DELETE
                FROM git_configurations
                WHERE id = ?
            """

        this.jdbcTemplate.update(statement, id)
    }

    private fun createConfiguration(gitConfiguration: GitConfiguration) {
        val statement = StringBuilder(
            """
                INSERT INTO git_configurations(id,
                               name,
                               created_at,
                               credentials,
                               user_id,
                               workspace_id)
                VALUES (?, ?, ?, PGP_SYM_ENCRYPT(?, ?, 'cipher-algo=aes256'), ?, ?)
                """
        )

        this.jdbcTemplate.update(
            statement.toString(),
            gitConfiguration.id,
            gitConfiguration.name,
            gitConfiguration.createdAt,
            toJsonString(gitConfiguration.credentials),
            encryptionKey,
            gitConfiguration.author.id,
            gitConfiguration.workspaceId
        )
    }

    override fun update(gitConfiguration: GitConfiguration): GitConfiguration {
        return updateGitConfiguration(gitConfiguration)
    }

    private fun updateGitConfiguration(gitConfiguration: GitConfiguration): GitConfiguration {
        val statement = StringBuilder(
            """
                    UPDATE  git_configurations
                                    set name = ?,
                                    created_at = ?,
                                    credentials = PGP_SYM_ENCRYPT(?,?,'cipher-algo=aes256'),
                                    user_id = ?,
                                    workspace_id = ? 
                    WHERE id = ?
                    
                """
        )
        this.jdbcTemplate.update(
            statement.toString(),
            gitConfiguration.name,
            gitConfiguration.createdAt,
            toJsonString(gitConfiguration.credentials),
            encryptionKey,
            gitConfiguration.author.id,
            gitConfiguration.workspaceId,
            gitConfiguration.id
        )

        return findGitConfigurationById(gitConfiguration.id).get()
    }

    private fun findGitConfigurationById(id: String): Optional<GitConfiguration> {
        val statement = StringBuilder(BASE_QUERY_STATEMENT)
            .appendln("AND git_configurations.id = ?")

        return Optional.ofNullable(
            this.jdbcTemplate.query(statement.toString(), arrayOf(encryptionKey, id), gitConfigurationExtractor)
                ?.firstOrNull()
        )
    }

    private fun findPageByWorkspaceId(workspaceId: String, pageRequest: PageRequest): Page<GitConfiguration> {

        val result = executePageQuery(createStatement(), workspaceId, pageRequest)

        return Page(
            result?.toList() ?: emptyList(),
            pageRequest.page,
            pageRequest.size,
            countConfigurationsByWorkspaceId(workspaceId) ?: 0
        )
    }

    private fun executePageQuery(
        statement: java.lang.StringBuilder?,
        workspaceId: String,
        pageRequest: PageRequest
    ): Set<GitConfiguration>? {
        return this.jdbcTemplate.query(
            statement.toString(),
            arrayOf(encryptionKey, workspaceId, pageRequest.size, pageRequest.offset()),
            gitConfigurationExtractor
        )
    }

    private fun createStatement(): java.lang.StringBuilder? {
        return StringBuilder(BASE_QUERY_STATEMENT)
            .appendln("AND git_configurations.workspace_id = ?")
            .appendln("LIMIT ?")
            .appendln("OFFSET ?")
    }

    private fun countConfigurationsByWorkspaceId(workspaceId: String): Int? {
        val countStatement = StringBuilder(
            """
               SELECT count(*) AS total
               FROM git_configurations 
               WHERE git_configurations.workspace_id = ?
               """
        )

        return this.jdbcTemplate.queryForObject(
            countStatement.toString(),
            arrayOf(workspaceId)
        ) { rs, _ -> rs.getInt(1) }
    }

    private fun checkIfGitConfigurationExistsByWorkspaceId(workspaceId: String, id: String): Boolean {
        val countStatement = StringBuilder(
            """
               SELECT count(*) AS total
               FROM git_configurations 
               WHERE git_configurations.id = ?
               AND git_configurations.workspace_id = ?
               """
        )

        val count = this.jdbcTemplate.queryForObject(
            countStatement.toString(),
            arrayOf(id, workspaceId)
        ) { rs, _ -> rs.getInt(1) }

        return count != null && count >= 1
    }

    private fun toJsonString(credentials: GitCredentials): String {
        return objectMapper.writeValueAsString(credentials)
    }
}
