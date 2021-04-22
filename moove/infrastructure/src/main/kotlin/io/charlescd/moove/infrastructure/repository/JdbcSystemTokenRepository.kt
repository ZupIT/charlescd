package io.charlescd.moove.infrastructure.repository

import io.charlescd.moove.domain.repository.SystemTokenRepository
import org.springframework.beans.factory.annotation.Value
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Repository

@Repository
class JdbcSystemTokenRepository(
    private val jdbcTemplate: JdbcTemplate,
    @Value("\${gate.encryption.key}")
    private val gateEncryptionKey: String
): SystemTokenRepository {

    companion object {
        const val BASE_QUERY_STATEMENT = """
                    SELECT system_tokens.id
                    FROM system_tokens
                    WHERE pgp_sym_decrypt(token, ?) = ?;
                """
    }

    override fun getIdByTokenValue(tokenValue: String): String? {
        return this.jdbcTemplate.queryForObject(BASE_QUERY_STATEMENT, arrayOf(gateEncryptionKey, tokenValue), String::class.java)
    }

}
