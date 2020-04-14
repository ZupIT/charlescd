/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charles.infrastructure.repository

import br.com.zup.charles.domain.User
import br.com.zup.charles.domain.repository.UserRepository
import br.com.zup.charles.infrastructure.repository.mapper.UserExtractor
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Repository
import java.util.*

@Repository
class JdbcUserRepository(private val jdbcTemplate: JdbcTemplate, private val userExtractor: UserExtractor) :
    UserRepository {

    override fun findById(id: String): Optional<User> {
        return findUserById(id)
    }

    private fun findUserById(id: String): Optional<User> {
        val statement = StringBuilder(
            """
                    select users.id,
                           users.name,
                           users.email,
                           users.photo_url,
                           users.created_at
                    from users
                    where id = ?
                """
        )

        return Optional.ofNullable(
            this.jdbcTemplate.query(
                statement.toString(),
                arrayOf(id),
                userExtractor
            )?.firstOrNull()
        )
    }
}