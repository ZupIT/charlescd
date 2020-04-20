/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charles.infrastructure.repository

import br.com.zup.charles.domain.Circle
import br.com.zup.charles.domain.repository.CircleRepository
import br.com.zup.charles.infrastructure.repository.mapper.CircleExtractor
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Repository
import java.util.*

@Repository
class JdbcCircleRepository(private val jdbcTemplate: JdbcTemplate) : CircleRepository {

    override fun findById(id: String): Optional<Circle> {
        return findCircleById(id)
    }

    private fun findCircleById(id: String): Optional<Circle> {

        val statement = StringBuilder(
            """
                select circles.id                  as circle_id,
                       circles.name                as circle_name,
                       circles.reference           as circle_reference,
                       circles.created_at          as circle_created_at,
                       circles.matcher_type        as circle_matcher_type,
                       circles.rules               as circle_rules,
                       circles.imported_kv_records as circle_imported_kv_records,
                       circles.imported_at         as circle_imported_at,
                       circle_user.id              as circle_user_id,
                       circle_user.name            as circle_user_name,
                       circle_user.email           as circle_user_email,
                       circle_user.photo_url       as circle_user_photo_url,
                       circle_user.created_at      as circle_user_created_at
                from circles
                         left join users circle_user on circles.user_id = circle_user.id
                where circles.id = ?
              """
        )

        return Optional.ofNullable(
            this.jdbcTemplate.query(statement.toString(), arrayOf(id), CircleExtractor())?.firstOrNull()
        )
    }
}