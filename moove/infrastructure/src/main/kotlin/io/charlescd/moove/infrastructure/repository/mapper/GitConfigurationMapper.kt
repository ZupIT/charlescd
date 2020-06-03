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

package io.charlescd.moove.infrastructure.repository.mapper

import com.fasterxml.jackson.databind.ObjectMapper
import io.charlescd.moove.domain.GitConfiguration
import io.charlescd.moove.domain.GitCredentials
import io.charlescd.moove.domain.User
import java.sql.ResultSet
import org.springframework.stereotype.Component

@Component
class GitConfigurationMapper(private val objectMapper: ObjectMapper) {

    fun mapGitConfiguration(resultSet: ResultSet) = GitConfiguration(
        id = resultSet.getString("git_configuration_id"),
        name = resultSet.getString("git_configuration_name"),
        credentials = deserializeCredentials(resultSet),
        createdAt = resultSet.getTimestamp("git_configuration_created_at").toLocalDateTime(),
        workspaceId = resultSet.getString("git_configuration_workspace_id"),
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
        workspaces = emptyList(),
        createdAt = resultSet.getTimestamp("git_configuration_user_created_at").toLocalDateTime()
    )
}
