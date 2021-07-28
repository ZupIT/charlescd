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

package io.charlescd.moove.infrastructure.repository.mapper

import io.charlescd.moove.domain.DeploymentConfiguration
import io.charlescd.moove.domain.GitProviderEnum
import io.charlescd.moove.domain.User
import java.sql.ResultSet
import org.springframework.stereotype.Component

@Component
class DeploymentConfigurationMapper() {

    fun mapDeploymentConfiguration(resultSet: ResultSet): DeploymentConfiguration? {
        resultSet.getString("deployment_configuration_id")
        return if (!resultSet.wasNull()) {
            DeploymentConfiguration(
                id = resultSet.getString("deployment_configuration_id"),
                name = resultSet.getString("deployment_configuration_name"),
                author = mapCredentialUser(resultSet),
                createdAt = resultSet.getTimestamp("deployment_configuration_created_at").toLocalDateTime(),
                workspaceId = resultSet.getString("deployment_configuration_workspace_id"),
                butlerUrl = resultSet.getString("deployment_configuration_butler_url"),
                namespace = resultSet.getString("deployment_configuration_namespace"),
                gitToken = resultSet.getString("deployment_configuration_git_token"),
                gitProvider = GitProviderEnum.valueOf(
                    resultSet.getString("deployment_configuration_git_provider")
                )
            )
        } else null
    }

    private fun mapCredentialUser(resultSet: ResultSet) = User(
        id = resultSet.getString("deployment_configuration_user_id"),
        name = resultSet.getString("deployment_configuration_user_name"),
        email = resultSet.getString("deployment_configuration_user_email"),
        photoUrl = resultSet.getString("deployment_configuration_user_photo_url"),
        workspaces = emptyList(),
        createdAt = resultSet.getTimestamp("deployment_configuration_user_created_at").toLocalDateTime()
    )
}
