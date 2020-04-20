/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charles.infrastructure.repository.mapper

import br.com.zup.charles.domain.Component
import br.com.zup.charles.domain.Module
import br.com.zup.charles.domain.User
import java.sql.ResultSet
import org.springframework.stereotype.Component as SpringComponent

@SpringComponent
class ModuleMapper(private val gitConfigurationMapper: GitConfigurationMapper) {

    fun mapModule(resultSet: ResultSet) = Module(
        id = resultSet.getString("module_id"),
        name = resultSet.getString("module_name"),
        gitRepositoryAddress = resultSet.getString("module_git_repository_address"),
        createdAt = resultSet.getTimestamp("module_created_at").toLocalDateTime(),
        helmRepository = resultSet.getString("module_helm_repository"),
        applicationId = resultSet.getString("module_application_id"),
        registryConfigurationId = resultSet.getString("module_registry_configuration_id"),
        cdConfigurationId = resultSet.getString("module_cd_configuration_id"),
        author = mapModuleUser(resultSet),
        gitConfiguration = gitConfigurationMapper.mapGitConfiguration(resultSet),
        labels = emptyList()
    )

    fun mapModuleUser(resultSet: ResultSet) = User(
        id = resultSet.getString("module_user_id"),
        name = resultSet.getString("module_user_name"),
        email = resultSet.getString("module_user_email"),
        photoUrl = resultSet.getString("module_user_photo_url"),
        applications = emptyList(),
        createdAt = resultSet.getTimestamp("module_user_created_at").toLocalDateTime()
    )

    fun mapComponent(resultSet: ResultSet) = Component(
        id = resultSet.getString("component_id"),
        moduleId = resultSet.getString("component_module_id"),
        name = resultSet.getString("component_name"),
        contextPath = resultSet.getString("component_context_path"),
        port = resultSet.getInt("component_port"),
        healthCheck = resultSet.getString("component_health_check"),
        createdAt = resultSet.getTimestamp("component_created_at").toLocalDateTime(),
        applicationId = resultSet.getString("component_application_id")
    )
}