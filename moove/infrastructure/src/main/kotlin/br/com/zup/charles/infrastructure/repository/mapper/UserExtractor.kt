/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charles.infrastructure.repository.mapper

import br.com.zup.charles.domain.User
import org.springframework.jdbc.core.ResultSetExtractor
import org.springframework.stereotype.Component
import java.sql.ResultSet

@Component
class UserExtractor(private val userMapper: UserMapper) : ResultSetExtractor<Set<User>> {

    override fun extractData(resultSet: ResultSet): Set<User> {
        val users = HashSet<User>()

        while (resultSet.next()) {
            users.add(userMapper.mapUser(resultSet))
        }

        return users
    }
}

@Component
class UserMapper {
    fun mapUser(resultSet: ResultSet) = User(
        id = resultSet.getString("id"),
        name = resultSet.getString("name"),
        email = resultSet.getString("email"),
        photoUrl = resultSet.getString("photo_url"),
        applications = emptyList(),
        createdAt = resultSet.getTimestamp("created_at").toLocalDateTime()
    )
}