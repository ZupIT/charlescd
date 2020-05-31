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

import io.charlescd.moove.domain.Hypothesis
import io.charlescd.moove.domain.repository.HypothesisRepository
import io.charlescd.moove.infrastructure.repository.mapper.HypothesisExtractor
import org.springframework.beans.factory.annotation.Value
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Repository
import java.util.*

@Repository
class JdbcHypothesisRepository(
    private val jdbcTemplate: JdbcTemplate,
    private val hypothesisExtractor: HypothesisExtractor,
    @Value("\${encryption.key}") private val encryptionKey: String
) : HypothesisRepository {

    companion object {
        const val BASE_QUERY_STATEMENT = """
            SELECT hypotheses.id                                                                   AS hypothesis_id,
                   hypotheses.name                                                                 AS hypothesis_name,
                   hypotheses.description                                                          AS hypothesis_description,
                   hypotheses.created_at                                                           AS hypothesis_created_at,
                   hypotheses.workspace_id                                                         AS hypothesis_workspace_id,
                   hypothesis_user.id                                                              AS hypothesis_user_id,
                   hypothesis_user.name                                                            AS hypothesis_user_name,
                   hypothesis_user.photo_url                                                       AS hypothesis_user_photo_url,
                   hypothesis_user.email                                                           AS hypothesis_user_email,
                   hypothesis_user.created_at                                                      AS hypothesis_user_created_at,
                   card_columns.id                                                                 AS column_id,
                   card_columns.name                                                               AS column_name,
                   card_columns.hypothesis_id                                                      AS column_hypothesis_id,
                   card_columns.workspace_id                                                       AS column_workspace_id,
                   cards.id                                                                        AS card_id,
                   cards.name                                                                      AS card_name,
                   cards.description                                                               AS card_description,
                   cards.card_column_id                                                            AS card_column_id,
                   cards.created_at                                                                AS card_created_at,
                   cards.index                                                                     AS card_index,
                   cards.workspace_id                                                              AS card_workspace_id,
                   cards.status                                                                    AS card_status,
                   card_user.id                                                                    AS card_user_id,
                   card_user.name                                                                  AS card_user_name,
                   card_user.photo_url                                                             AS card_user_photo_url,
                   card_user.email                                                                 AS card_user_email,
                   card_user.created_at                                                            AS card_user_created_at,
                   software_cards.type                                                             AS software_card_type,
                   software_cards.feature_id                                                       AS software_card_feature_id,
                   action_cards.type                                                               AS action_card_type,
                   features.id                                                                     AS feature_id,
                   features.name                                                                   AS feature_name,
                   features.branch_name                                                            AS feature_branch_name,
                   features.created_at                                                             AS feature_created_at,
                   features.workspace_id                                                           AS feature_workspace_id,
                   feature_user.id                                                                 AS feature_user_id,
                   feature_user.name                                                               AS feature_user_name,
                   feature_user.photo_url                                                          AS feature_user_photo_url,
                   feature_user.email                                                              AS feature_user_email,
                   feature_user.created_at                                                         AS feature_user_created_at,
                   modules.id                                                                      AS module_id,
                   modules.name                                                                    AS module_name,
                   modules.git_repository_address                                                  AS module_git_repository_address,
                   modules.created_at                                                              AS module_created_at,
                   modules.helm_repository                                                         AS module_helm_repository,
                   modules.workspace_id                                                            AS module_workspace_id,
                   module_user.id                                                                  AS module_user_id,
                   module_user.name                                                                AS module_user_name,
                   module_user.photo_url                                                           AS module_user_photo_url,
                   module_user.email                                                               AS module_user_email,
                   module_user.created_at                                                          AS module_user_created_at,
                   components.id                                                                   AS component_id,
                   components.module_id                                                            AS component_module_id,
                   components.name                                                                 AS component_name,
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
            FROM hypotheses
                     INNER JOIN users hypothesis_user ON hypotheses.author_id = hypothesis_user.id
                     LEFT JOIN card_columns ON hypotheses.id = card_columns.hypothesis_id
                     LEFT JOIN cards ON hypotheses.id = cards.hypothesis_id
                     LEFT JOIN software_cards ON software_cards.id = cards.id
                     LEFT JOIN action_cards ON action_cards.id = cards.id
                     LEFT JOIN users card_user ON card_user.id = cards.user_id
                     LEFT JOIN features ON features.id = software_cards.feature_id
                     LEFT JOIN users feature_user ON feature_user.id = features.user_id
                     LEFT JOIN features_modules ON features_modules.feature_id = features.id
                     LEFT JOIN modules ON features_modules.module_id = modules.id
                     LEFT JOIN users module_user ON module_user.id = modules.user_id
                     LEFT JOIN components ON modules.id = components.module_id
                     LEFT JOIN workspaces ON modules.workspace_id = workspaces.id
                     LEFT JOIN git_configurations ON workspaces.git_configuration_id = git_configurations.id
                     LEFT JOIN users git_configuration_user ON git_configurations.user_id = git_configuration_user.id
            WHERE 1 = 1
             """
    }

    override fun save(hypothesis: Hypothesis): Hypothesis {
        createHypothesis(hypothesis)

        createCardColumns(hypothesis)

        return this.findById(hypothesis.id).get()
    }

    override fun findById(id: String): Optional<Hypothesis> {
        return findHypothesisById(id)
    }

    private fun createCardColumns(hypothesis: Hypothesis) {
        val statement = StringBuilder(
            """
                INSERT INTO card_columns(
                 id,
                 name,
                 hypothesis_id,
                 workspace_id)
                 VALUES(?,?,?,?)
            """
        )

        this.jdbcTemplate.batchUpdate(
            statement.toString(),
            hypothesis.columns.map {
                arrayOf(
                    it.id,
                    it.name,
                    it.hypothesisId,
                    it.workspaceId
                )
            }
        )
    }

    private fun createHypothesis(hypothesis: Hypothesis) {
        val statement = StringBuilder(
            """
                INSERT INTO hypotheses(
                id,
                name,
                description,
                author_id,
                created_at,
                workspace_id)
                VALUES(?,?,?,?,?,?)
            """
        )

        this.jdbcTemplate.update(
            statement.toString(),
            arrayOf(
                hypothesis.id,
                hypothesis.name,
                hypothesis.description,
                hypothesis.author.id,
                hypothesis.createdAt,
                hypothesis.workspaceId
            )
        )
    }

    private fun findHypothesisById(id: String): Optional<Hypothesis> {
        val statement = StringBuilder(BASE_QUERY_STATEMENT)
            .appendln("AND hypotheses.id = ?")

        return Optional.ofNullable(
            this.jdbcTemplate.query(
                statement.toString(),
                arrayOf(encryptionKey, id),
                hypothesisExtractor
            )?.firstOrNull()
        )
    }
}
