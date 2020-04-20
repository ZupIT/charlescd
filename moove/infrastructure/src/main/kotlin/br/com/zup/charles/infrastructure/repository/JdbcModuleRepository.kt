/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charles.infrastructure.repository

import br.com.zup.charles.domain.Module
import br.com.zup.charles.domain.repository.ModuleRepository
import br.com.zup.charles.infrastructure.repository.mapper.ModuleExtractor
import org.springframework.beans.factory.annotation.Value
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Repository

@Repository
class JdbcModuleRepository(
    private val jdbcTemplate: JdbcTemplate,
    private val moduleExtractor: ModuleExtractor,
    @Value("\${encryption.key}") private val encryptionKey: String
) :
    ModuleRepository {

    override fun findByIds(ids: List<String>): List<Module> {
        return findModulesByIdList(ids)
    }

    private fun findModulesByIdList(ids: List<String>): List<Module> {
        val statement = StringBuilder(
            """
                    select modules.id                                                                      as module_id,
                           modules.name                                                                    as module_name,
                           modules.created_at                                                              as module_created_at,
                           modules.user_id                                                                 as module_user_id,
                           modules.git_repository_address                                                  as module_git_repository_address,
                           modules.helm_repository                                                         as module_helm_repository,
                           modules.application_id                                                          as module_application_id,
                           modules.registry_configuration_id                                               as module_registry_configuration_id,
                           modules.cd_configuration_id                                                     as module_cd_configuration_id,
                           module_user.id                                                                  as module_user_id,
                           module_user.name                                                                as module_user_name,
                           module_user.photo_url                                                           as module_user_photo_url,
                           module_user.email                                                               as module_user_email,
                           module_user.created_at                                                          as module_user_created_at,
                           components.id                                                                   as component_id,
                           components.name                                                                 as component_name,
                           components.module_id                                                            as component_module_id,
                           components.created_at                                                           as component_created_at,
                           components.context_path                                                         as component_context_path,
                           components.health_check                                                         as component_health_check,
                           components.port                                                                 as component_port,
                           components.application_id                                                       as component_application_id,
                           git_configurations.id                                                           as git_configuration_id,
                           git_configurations.name                                                         as git_configuration_name,
                           PGP_SYM_DECRYPT(git_configurations.credentials::bytea, ?, 'cipher-algo=aes256') as git_configuration_credentials,
                           git_configurations.created_at                                                   as git_configuration_created_at,
                           git_configurations.application_id                                               as git_configuration_application_id,
                           git_configuration_user.id                                                       as git_configuration_user_id,
                           git_configuration_user.name                                                     as git_configuration_user_name,
                           git_configuration_user.photo_url                                                as git_configuration_user_photo_url,
                           git_configuration_user.email                                                    as git_configuration_user_email,
                           git_configuration_user.created_at                                               as git_configuration_user_created_at
                    from modules
                           left join components on modules.id = components.module_id
                           left join users module_user on module_user.id = modules.user_id
                           left join git_configurations on modules.git_configuration_id = git_configurations.id
                           left join users git_configuration_user on git_configurations.user_id = git_configuration_user.id
                    where 1 = 1
               """
        )

        appendParameters(statement, ids)

        return this.jdbcTemplate.query(
            statement.toString(),
            arrayOf(encryptionKey),
            moduleExtractor
        )?.toList() ?: emptyList()
    }

    private fun appendParameters(statement: StringBuilder, ids: List<String>) {
        statement.appendln(
            "and modules.id in(${ids.joinToString(separator = ",") { "'$it'" }})"
        )
    }
}