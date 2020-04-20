/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charles.infrastructure.repository.mapper

import br.com.zup.charles.domain.GitConfiguration
import br.com.zup.charles.domain.GitCredentials
import br.com.zup.charles.domain.User
import com.fasterxml.jackson.databind.ObjectMapper
import org.springframework.stereotype.Component
import java.sql.ResultSet

@Component
class GitConfigurationMapper(private val objectMapper: ObjectMapper) {

    fun mapGitConfiguration(resultSet: ResultSet) = GitConfiguration(
        id = resultSet.getString("git_configuration_id"),
        name = resultSet.getString("git_configuration_name"),
        credentials = deserializeCredentials(resultSet),
        createdAt = resultSet.getTimestamp("git_configuration_created_at").toLocalDateTime(),
        applicationId = resultSet.getString("git_configuration_application_id"),
        author = mapCredentialUser(resultSet)
    )

    private fun deserializeCredentials(resultSet: ResultSet): GitCredentials {
        return objectMapper.readValue(
            resultSet.getString("git_configuration_credentials"),
            GitCredentials::class.java
        )
    }

    private fun mapCredentialUser(resultSet: ResultSet) = User(
        id = resultSet.getString("git_configuration_user_id"),
        name = resultSet.getString("git_configuration_user_name"),
        email = resultSet.getString("git_configuration_user_email"),
        photoUrl = resultSet.getString("git_configuration_user_photo_url"),
        applications = emptyList(),
        createdAt = resultSet.getTimestamp("git_configuration_user_created_at").toLocalDateTime()
    )
}