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
import com.fasterxml.jackson.module.kotlin.readValue
import io.charlescd.moove.domain.User
import io.charlescd.moove.domain.Workspace
import io.charlescd.moove.domain.WorkspacePermissions
import io.charlescd.moove.domain.WorkspaceStatusEnum
import java.sql.ResultSet
import org.springframework.stereotype.Component

@Component
class WorkspaceMapper(private val objectMapper: ObjectMapper) {

    fun map(resultSet: ResultSet) = Workspace(
        id = resultSet.getString("workspace_id"),
        name = resultSet.getString("workspace_name"),
        author = mapWorkspaceAuthor(resultSet),
        createdAt = resultSet.getTimestamp("workspace_created_at").toLocalDateTime(),
        status = WorkspaceStatusEnum.valueOf(resultSet.getString("workspace_status")),
        registryConfigurationId = resultSet.getString("workspace_registry_configuration_id"),
        gitConfigurationId = resultSet.getString("workspace_git_configuration_id"),
        cdConfigurationId = resultSet.getString("workspace_cd_configuration_id"),
        circleMatcherUrl = resultSet.getString("workspace_circle_matcher_url"),
        metricConfigurationId = resultSet.getString("workspace_metric_configuration_id")
    )

    fun mapWorkspacePermissions(resultSet: ResultSet) = WorkspacePermissions(
        id = resultSet.getString("workspace_id"),
        name = resultSet.getString("workspace_name"),
        permissions = objectMapper.readValue(resultSet.getString("workspace_user_group_permissions")),
        author = mapWorkspaceAuthor(resultSet),
        createdAt = resultSet.getTimestamp("workspace_created_at").toLocalDateTime(),
        status = WorkspaceStatusEnum.valueOf(resultSet.getString("workspace_status"))
    )

    private fun mapWorkspaceAuthor(resultSet: ResultSet) = User(
        id = resultSet.getString("workspace_author_id"),
        name = resultSet.getString("workspace_author_name"),
        email = resultSet.getString("workspace_author_email"),
        photoUrl = resultSet.getString("workspace_author_photo_url"),
        workspaces = emptyList(),
        createdAt = resultSet.getTimestamp("workspace_author_created_at").toLocalDateTime()
    )
}
