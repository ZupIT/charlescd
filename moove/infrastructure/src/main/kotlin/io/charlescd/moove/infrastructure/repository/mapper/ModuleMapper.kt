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

import io.charlescd.moove.domain.Component
import io.charlescd.moove.domain.Module
import io.charlescd.moove.domain.User
import java.sql.ResultSet
import org.springframework.stereotype.Component as SpringComponent

@SpringComponent
class ModuleMapper(private val gitConfigurationMapper: GitConfigurationMapper) {

    fun mapModule(resultSet: ResultSet) = Module(
        id = resultSet.getString("module_id"),
        name = resultSet.getString("module_name"),
        createdAt = resultSet.getTimestamp("module_created_at").toLocalDateTime(),
        gitRepositoryAddress = resultSet.getString("module_git_repository_address"),
        helmRepository = resultSet.getString("module_helm_repository"),
        workspaceId = resultSet.getString("module_workspace_id"),
        author = mapModuleUser(resultSet),
        gitConfiguration = gitConfigurationMapper.mapGitConfiguration(resultSet),
        labels = emptyList()
    )

    fun mapModuleUser(resultSet: ResultSet) = User(
        id = resultSet.getString("module_user_id"),
        name = resultSet.getString("module_user_name"),
        email = resultSet.getString("module_user_email"),
        photoUrl = resultSet.getString("module_user_photo_url"),
        workspaces = emptyList(),
        createdAt = resultSet.getTimestamp("module_user_created_at").toLocalDateTime()
    )

    fun mapComponent(resultSet: ResultSet) = Component(
        id = resultSet.getString("component_id"),
        moduleId = resultSet.getString("component_module_id"),
        name = resultSet.getString("component_name"),
        createdAt = resultSet.getTimestamp("component_created_at").toLocalDateTime(),
        workspaceId = resultSet.getString("component_workspace_id"),
        errorThreshold = resultSet.getInt("component_error_threshold"),
        latencyThreshold = resultSet.getInt("component_latency_threshold")
    )
}
