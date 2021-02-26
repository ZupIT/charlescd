package io.charlescd.moove.infrastructure.repository

import com.fasterxml.jackson.databind.ObjectMapper
import io.charlescd.moove.domain.ButlerConfiguration
import io.charlescd.moove.domain.GitConfiguration
import io.charlescd.moove.domain.repository.ButlerConfigurationRepository
import io.charlescd.moove.infrastructure.repository.mapper.GitConfigurationExtractor
import org.springframework.beans.factory.annotation.Value
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Repository

@Repository
class JdbcButlerConfigurationRepository(
    private val jdbcTemplate: JdbcTemplate,
    private val objectMapper: ObjectMapper,
    @Value("\${encryption.key}")
    private val encryptionKey: String
) : ButlerConfigurationRepository {

    override fun save(butlerConfiguration: ButlerConfiguration): ButlerConfiguration {
        createConfiguration(butlerConfiguration)
        // return find(gitConfiguration.id).get()
    }

    private fun createConfiguration(gitConfiguration: GitConfiguration) {
        val statement = StringBuilder(
            """
                INSERT INTO butler_configurations(id,
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
}
