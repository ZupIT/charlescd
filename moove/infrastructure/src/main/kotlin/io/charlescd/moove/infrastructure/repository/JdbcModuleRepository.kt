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

package io.charlescd.moove.infrastructure.repository

import io.charlescd.moove.domain.Component
import io.charlescd.moove.domain.Module
import io.charlescd.moove.domain.Page
import io.charlescd.moove.domain.PageRequest
import io.charlescd.moove.domain.repository.ModuleRepository
import io.charlescd.moove.infrastructure.repository.mapper.ModuleExtractor
import java.time.LocalDateTime
import java.util.*
import org.springframework.beans.factory.annotation.Value
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Repository

@Repository
class JdbcModuleRepository(
    private val jdbcTemplate: JdbcTemplate,
    private val moduleExtractor: ModuleExtractor,
    @Value("\${encryption.key}") private val encryptionKey: String
) : ModuleRepository {

    companion object {
        const val BASE_QUERY_STATEMENT = """
                    SELECT modules.id                                                                      AS module_id,
                           modules.name                                                                    AS module_name,
                           modules.created_at                                                              AS module_created_at,
                           modules.user_id                                                                 AS module_user_id,
                           modules.git_repository_address                                                  AS module_git_repository_address,
                           modules.helm_repository                                                         AS module_helm_repository,
                           modules.workspace_id                                                            AS module_workspace_id,
                           module_user.id                                                                  AS module_user_id,
                           module_user.name                                                                AS module_user_name,
                           module_user.photo_url                                                           AS module_user_photo_url,
                           module_user.email                                                               AS module_user_email,
                           module_user.created_at                                                          AS module_user_created_at,
                           components.id                                                                   AS component_id,
                           components.name                                                                 AS component_name,
                           components.module_id                                                            AS component_module_id,
                           components.created_at                                                           AS component_created_at,
                           components.workspace_id                                                         AS component_workspace_id,
                           components.error_threshold                                                      AS component_error_threshold,
                           components.latency_threshold                                                    AS component_latency_threshold,
                           git_configurations.id                                                           AS git_configuration_id,
                           git_configurations.name                                                         AS git_configuration_name,
                           PGP_SYM_DECRYPT(git_configurations.credentials::bytea, ?, 'cipher-algo=aes256') AS git_configuration_credentials,
                           git_configurations.created_at                                                   AS git_configuration_created_at,
                           git_configurations.workspace_id                                                 AS git_configuration_workspace_id,
                           git_configuration_user.id                                                       AS git_configuration_user_id,
                           git_configuration_user.name                                                     AS git_configuration_user_name,
                           git_configuration_user.photo_url                                                AS git_configuration_user_photo_url,
                           git_configuration_user.email                                                    AS git_configuration_user_email,
                           git_configuration_user.created_at                                               AS git_configuration_user_created_at
                    FROM modules
                           LEFT JOIN components ON modules.id = components.module_id
                           LEFT JOIN users module_user ON module_user.id = modules.user_id
                           LEFT JOIN workspaces ON modules.workspace_id = workspaces.id
                           LEFT JOIN git_configurations ON workspaces.git_configuration_id = git_configurations.id
                           LEFT JOIN users git_configuration_user ON git_configurations.user_id = git_configuration_user.id
                    WHERE 1 = 1
               """
    }

    override fun save(module: Module): Module {
        createModule(module)
        createComponents(module)
        return findModuleById(module.id).get()
    }

    override fun update(module: Module): Module {
        return updateModule(module)
    }

    override fun delete(id: String, workspaceId: String) {
        deleteModuleComponents(id, workspaceId)
        deleteModuleLabelsRelationship(id)
        deleteModule(id, workspaceId)
    }

    override fun addComponents(module: Module) {
        createComponents(module)
    }

    override fun removeComponents(module: Module) {
        removeModuleComponents(module)
    }

    override fun updateComponent(component: Component) {
        updateModuleComponent(component)
    }

    override fun find(id: String): Optional<Module> {
        return findModuleById(id)
    }

    override fun find(id: String, workspaceId: String): Optional<Module> {
        return findModuleByIdAndWorkspaceId(id, workspaceId)
    }

    override fun findByWorkspaceId(workspaceId: String, name: String?, pageRequest: PageRequest): Page<Module> {
        return findAllModulesByWorkspaceId(workspaceId, name, pageRequest)
    }

    override fun findByIds(ids: List<String>): List<Module> {
        return findModulesByIdList(ids)
    }

    private fun deleteModule(id: String, workspaceId: String) {
        val statement = "DELETE FROM modules WHERE id = ? AND workspace_id = ?"

        this.jdbcTemplate.update(
            statement,
            id,
            workspaceId
        )
    }

    private fun deleteModuleComponents(id: String, workspaceId: String) {
        val statement = "DELETE FROM components WHERE module_id = ? AND workspace_id = ?"

        this.jdbcTemplate.update(
            statement,
            id,
            workspaceId
        )
    }

    private fun deleteModuleLabelsRelationship(id: String) {
        val statement = "DELETE FROM modules_labels WHERE module_id = ?"

        this.jdbcTemplate.update(
            statement,
            id
        )
    }

    private fun executeCountQuery(workspaceId: String): Int? {
        val statement = "SELECT COUNT(*) FROM modules WHERE workspace_id = ?"

        return this.jdbcTemplate.queryForObject(
            statement,
            arrayOf(workspaceId)
        ) { rs, _ ->
            rs.getInt(1)
        }
    }

    private fun findModuleById(id: String): Optional<Module> {
        val statement = StringBuilder(BASE_QUERY_STATEMENT)
            .appendln("AND modules.id = ?")

        return Optional.ofNullable(
            this.jdbcTemplate.query(statement.toString(), arrayOf(encryptionKey, id), moduleExtractor)?.firstOrNull()
        )
    }

    private fun removeModuleComponents(module: Module) {
        val statement = "DELETE FROM components WHERE id = ? AND module_id = ?"

        this.jdbcTemplate.batchUpdate(
            statement,
            module.components.map { arrayOf(it.id, module.id) }
        )
    }

    private fun updateModuleComponent(component: Component) {
        val statement = """
            UPDATE components
            SET name              = ?,
                error_threshold   = ?,
                latency_threshold = ?
            WHERE id = ?
        """

        this.jdbcTemplate.update(
            statement,
            component.name,
            component.errorThreshold,
            component.latencyThreshold,
            component.id
        )
    }

    private fun findModuleByIdAndWorkspaceId(id: String, workspaceId: String): Optional<Module> {
        val statement = StringBuilder(BASE_QUERY_STATEMENT)
            .appendln("AND modules.id = ?")
            .appendln("AND modules.workspace_id = ?")

        return Optional.ofNullable(
            this.jdbcTemplate.query(statement.toString(), arrayOf(encryptionKey, id, workspaceId), moduleExtractor)
                ?.firstOrNull()
        )
    }

    private fun createModule(module: Module) {
        val statement = """
                INSERT INTO modules(id,
                        name,
                        git_repository_address,
                        created_at,
                        user_id,
                        helm_repository,
                        workspace_id)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """

        this.jdbcTemplate.update(
            statement,
            module.id,
            module.name,
            module.gitRepositoryAddress,
            module.createdAt,
            module.author.id,
            module.helmRepository,
            module.workspaceId
        )
    }

    private fun updateModule(module: Module): Module {
        val statement = """
                 UPDATE modules
                    SET name                   = ?,
                        git_repository_address = ?,
                        helm_repository        = ?
                    WHERE id = ?
            """

        this.jdbcTemplate.update(
            statement,
            module.name,
            module.gitRepositoryAddress,
            module.helmRepository,
            module.id
        )

        return findModuleById(module.id).get()
    }

    private fun createComponents(module: Module) {
        val statement = """
                INSERT INTO components(id,
                           name,
                           module_id,
                           workspace_id,
                           error_threshold,
                           latency_threshold,
                           created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """

        this.jdbcTemplate.batchUpdate(
            statement,
            module.components.map {
                arrayOf(
                    it.id,
                    it.name,
                    module.id,
                    it.workspaceId,
                    it.errorThreshold,
                    it.latencyThreshold,
                    LocalDateTime.now()
                )
            })
    }

    private fun findModulesByIdList(ids: List<String>): List<Module> {
        val statement = StringBuilder(BASE_QUERY_STATEMENT)

        appendParameters(statement, ids)

        return this.jdbcTemplate.query(
            statement.toString(),
            arrayOf(encryptionKey),
            moduleExtractor
        )?.toList() ?: emptyList()
    }

    private fun findAllModulesByWorkspaceId(
        workspaceId: String,
        name: String?,
        pageRequest: PageRequest
    ): Page<Module> {
        val statement = StringBuilder(BASE_QUERY_STATEMENT)

        val result = executePageQuery(createStatement(statement, name), encryptionKey, workspaceId, name, pageRequest)

        return Page(
            result?.toList() ?: emptyList(),
            pageRequest.page,
            pageRequest.size,
            executeCountQuery(workspaceId) ?: 0
        )
    }

    private fun createStatement(statement: StringBuilder, name: String?): StringBuilder {
        statement.appendln("AND modules.workspace_id = ?")
        name?.let { statement.appendln("AND modules.name ILIKE ?") }
        return statement.appendln("LIMIT ?")
            .appendln("OFFSET ?")
    }

    private fun executePageQuery(
        statement: StringBuilder,
        encryptionKey: String,
        workspaceId: String,
        name: String?,
        pageRequest: PageRequest
    ): Set<Module>? {
        val parameters = mutableListOf<Any>()
        return appendParametersAndRunQuery(parameters, encryptionKey, workspaceId, name, pageRequest, statement)
    }

    private fun appendParametersAndRunQuery(
        parameters: MutableList<Any>,
        encryptionKey: String,
        workspaceId: String,
        name: String?,
        pageRequest: PageRequest,
        statement: StringBuilder
    ): Set<Module>? {
        parameters.add(encryptionKey)
        parameters.add(workspaceId)
        name?.let { parameters.add("%$it%") }
        parameters.add(pageRequest.size)
        parameters.add(pageRequest.offset())

        return this.jdbcTemplate.query(
            statement.toString(),
            parameters.toTypedArray(),
            moduleExtractor
        )
    }

    private fun appendParameters(statement: StringBuilder, ids: List<String>) {
        statement.appendln(
            "AND modules.id IN(${ids.joinToString(separator = ",") { "'$it'" }})"
        )
    }
}
