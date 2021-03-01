package io.charlescd.moove.infrastructure.repository.mapper

import io.charlescd.moove.domain.ButlerConfiguration
import io.charlescd.moove.domain.User
import org.springframework.stereotype.Component
import java.sql.ResultSet

@Component
class ButlerConfigurationMapper() {

    fun mapButlerConfiguration(resultSet: ResultSet): ButlerConfiguration? {
        resultSet.getString("butler_configuration_id")
        return if (!resultSet.wasNull()) {
            ButlerConfiguration(
                id = resultSet.getString("butler_configuration_id"),
                name = resultSet.getString("butler_configuration_name"),
                author = mapCredentialUser(resultSet),
                createdAt = resultSet.getTimestamp("butler_configuration_created_at").toLocalDateTime(),
                workspaceId = resultSet.getString("butler_configuration_workspace_id"),
                butlerUrl = resultSet.getString("butler_configuration_butler_url"),
                namespace = resultSet.getString("butler_configuration_namespace"),
                gitToken = resultSet.getString("butler_configuration_git_token")
            )
        } else null
    }

    private fun mapCredentialUser(resultSet: ResultSet) = User(
        id = resultSet.getString("butler_configuration_user_id"),
        name = resultSet.getString("butler_configuration_user_name"),
        email = resultSet.getString("butler_configuration_user_email"),
        photoUrl = resultSet.getString("butler_configuration_user_photo_url"),
        workspaces = emptyList(),
        createdAt = resultSet.getTimestamp("butler_configuration_user_created_at").toLocalDateTime()
    )
}
