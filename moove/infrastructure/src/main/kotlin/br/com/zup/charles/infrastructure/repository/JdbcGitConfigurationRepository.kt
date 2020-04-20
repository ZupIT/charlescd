/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charles.infrastructure.repository

import br.com.zup.charles.domain.GitConfiguration
import br.com.zup.charles.domain.GitCredentials
import br.com.zup.charles.domain.Page
import br.com.zup.charles.domain.PageRequest
import br.com.zup.charles.domain.repository.GitConfigurationRepository
import br.com.zup.charles.infrastructure.repository.mapper.GitConfigurationExtractor
import com.fasterxml.jackson.databind.ObjectMapper
import org.springframework.beans.factory.annotation.Value
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Repository
import java.util.*

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
                    select git_configurations.id                                                          as git_configuration_id,
                           git_configurations.name                                                        as git_configuration_name,
                           PGP_SYM_DECRYPT(git_configurations.credentials::bytea, ?,'cipher-algo=aes256') as git_configuration_credentials,
                           git_configurations.created_at                                                  as git_configuration_created_at,
                           git_configurations.application_id                                              as git_configuration_application_id,
                           git_configuration_user.id                                                      as git_configuration_user_id,
                           git_configuration_user.name                                                    as git_configuration_user_name,
                           git_configuration_user.photo_url                                               as git_configuration_user_photo_url,
                           git_configuration_user.email                                                   as git_configuration_user_email,
                           git_configuration_user.created_at                                              as git_configuration_user_created_at
                    from git_configurations
                           inner join users git_configuration_user on git_configurations.user_id = git_configuration_user.id
                    where 1 = 1
                """
    }

    override fun save(gitConfiguration: GitConfiguration): GitConfiguration {
        createConfiguration(gitConfiguration)
        return findById(gitConfiguration.id).get()
    }

    override fun findById(id: String): Optional<GitConfiguration> {
        return findGitConfigurationById(id)
    }

    override fun findByApplicationId(applicationId: String, pageRequest: PageRequest): Page<GitConfiguration> {
        return findPageByApplicationId(applicationId, pageRequest)
    }

    private fun createConfiguration(gitConfiguration: GitConfiguration) {
        val statement = StringBuilder(
            """
                insert into git_configurations(id,
                               name,
                               created_at,
                               credentials,
                               user_id,
                               application_id)
                values (?, ?, ?, PGP_SYM_ENCRYPT(?, ?, 'cipher-algo=aes256'), ?, ?)
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
            gitConfiguration.applicationId
        )
    }

    private fun findGitConfigurationById(id: String): Optional<GitConfiguration> {
        val statement = StringBuilder(BASE_QUERY_STATEMENT)
            .appendln("and git_configurations.id = ?")

        return Optional.ofNullable(
            this.jdbcTemplate.query(statement.toString(), arrayOf(encryptionKey, id), gitConfigurationExtractor)
                ?.firstOrNull()
        )
    }

    private fun findPageByApplicationId(applicationId: String, pageRequest: PageRequest): Page<GitConfiguration> {

        val result = executePageQuery(createStatement(), applicationId, pageRequest)

        return Page(
            result?.toList() ?: emptyList(),
            pageRequest.page,
            pageRequest.size,
            executeCountQuery(applicationId) ?: 0
        )
    }

    private fun executePageQuery(
        statement: java.lang.StringBuilder?,
        applicationId: String,
        pageRequest: PageRequest
    ): Set<GitConfiguration>? {
        return this.jdbcTemplate.query(
            statement.toString(),
            arrayOf(encryptionKey, applicationId, pageRequest.size, pageRequest.offset()),
            gitConfigurationExtractor
        )
    }

    private fun createStatement(): java.lang.StringBuilder? {
        return StringBuilder(BASE_QUERY_STATEMENT)
            .appendln("and git_configurations.application_id = ?")
            .appendln("limit ?")
            .appendln("offset ?")
    }

    private fun executeCountQuery(applicationId: String): Int? {
        val countStatement = StringBuilder(
            """
               select count(*) as total
               from git_configurations 
               where git_configurations.application_id = ?
               """
        )

        return this.jdbcTemplate.queryForObject(
            countStatement.toString(),
            arrayOf(applicationId)
        ) { rs, _ -> rs.getInt(1) }
    }

    private fun toJsonString(credentials: GitCredentials): String {
        return objectMapper.writeValueAsString(credentials)
    }
}