/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charles.infrastructure.repository

import br.com.zup.charles.domain.Hypothesis
import br.com.zup.charles.domain.repository.HypothesisRepository
import br.com.zup.charles.infrastructure.repository.mapper.HypothesisExtractor
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
                select hypotheses.id                                                                   as hypothesis_id,
                       hypotheses.name                                                                 as hypothesis_name,
                       hypotheses.description                                                          as hypothesis_description,
                       hypotheses.created_at                                                           as hypothesis_created_at,
                       hypotheses.problem_id                                                           as hypothesis_problem_id,
                       hypotheses.application_id                                                       as hypothesis_application_id,
                       hypothesis_user.id                                                              as hypothesis_user_id,
                       hypothesis_user.name                                                            as hypothesis_user_name,
                       hypothesis_user.photo_url                                                       as hypothesis_user_photo_url,
                       hypothesis_user.email                                                           as hypothesis_user_email,
                       hypothesis_user.created_at                                                      as hypothesis_user_created_at,
                       card_columns.id                                                                 as column_id,
                       card_columns.name                                                               as column_name,
                       card_columns.hypothesis_id                                                      as column_hypothesis_id,
                       card_columns.application_id                                                     as column_application_id,
                       cards.id                                                                        as card_id,
                       cards.name                                                                      as card_name,
                       cards.description                                                               as card_description,
                       cards.card_column_id                                                            as card_column_id,
                       cards.created_at                                                                as card_created_at,
                       cards.index                                                                     as card_index,
                       cards.application_id                                                            as card_application_id,
                       cards.status                                                                    as card_status,
                       card_user.id                                                                    as card_user_id,
                       card_user.name                                                                  as card_user_name,
                       card_user.photo_url                                                             as card_user_photo_url,
                       card_user.email                                                                 as card_user_email,
                       card_user.created_at                                                            as card_user_created_at,
                       software_cards.type                                                             as software_card_type,
                       software_cards.feature_id                                                       as software_card_feature_id,
                       action_cards.type                                                               as action_card_type,
                       features.id                                                                     as feature_id,
                       features.name                                                                   as feature_name,
                       features.branch_name                                                            as feature_branch_name,
                       features.created_at                                                             as feature_created_at,
                       features.application_id                                                         as feature_application_id,
                       feature_user.id                                                                 as feature_user_id,
                       feature_user.name                                                               as feature_user_name,
                       feature_user.photo_url                                                          as feature_user_photo_url,
                       feature_user.email                                                              as feature_user_email,
                       feature_user.created_at                                                         as feature_user_created_at,
                       modules.id                                                                      as module_id,
                       modules.name                                                                    as module_name,
                       modules.git_repository_address                                                  as module_git_repository_address,
                       modules.created_at                                                              as module_created_at,
                       modules.helm_repository                                                         as module_helm_repository,
                       modules.application_id                                                          as module_application_id,
                       modules.cd_configuration_id                                                     as module_cd_configuration_id,
                       modules.registry_configuration_id                                               as module_registry_configuration_id,
                       modules.git_configuration_id                                                    as module_git_configuration_id,
                       module_user.id                                                                  as module_user_id,
                       module_user.name                                                                as module_user_name,
                       module_user.photo_url                                                           as module_user_photo_url,
                       module_user.email                                                               as module_user_email,
                       module_user.created_at                                                          as module_user_created_at,
                       components.id                                                                   as component_id,
                       components.module_id                                                            as component_module_id,
                       components.name                                                                 as component_name,
                       components.context_path                                                         as component_context_path,
                       components.port                                                                 as component_port,
                       components.health_check                                                         as component_health_check,
                       components.created_at                                                           as component_created_at,
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
                from hypotheses
                         inner join users hypothesis_user on hypotheses.author_id = hypothesis_user.id
                         left join card_columns on hypotheses.id = card_columns.hypothesis_id
                         left join cards on hypotheses.id = cards.hypothesis_id
                         left join software_cards on software_cards.id = cards.id
                         left join action_cards on action_cards.id = cards.id
                         left join users card_user on card_user.id = cards.user_id
                         left join features on features.id = software_cards.feature_id
                         left join users feature_user on feature_user.id = features.user_id
                         left join features_modules on features_modules.feature_id = features.id
                         left join modules on features_modules.module_id = modules.id
                         left join users module_user on module_user.id = modules.user_id
                         left join components on modules.id = components.module_id
                         left join git_configurations on modules.git_configuration_id = git_configurations.id
                         left join users git_configuration_user on git_configurations.user_id = git_configuration_user.id
                where 1 = 1
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
                insert into card_columns(
                 id,
                 name,
                 hypothesis_id,
                 application_id)
                 values(?,?,?,?)
            """
        )

        this.jdbcTemplate.batchUpdate(
            statement.toString(),
            hypothesis.columns.map {
                arrayOf(
                    it.id,
                    it.name,
                    it.hypothesisId,
                    it.applicationId
                )
            }
        )
    }

    private fun createHypothesis(hypothesis: Hypothesis) {
        val statement = StringBuilder(
            """
                insert into hypotheses(
                id,
                name,
                description,
                author_id,
                created_at,
                problem_id,
                application_id)
                values(?,?,?,?,?,?,?)
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
                hypothesis.problemId,
                hypothesis.applicationId
            )
        )
    }

    private fun findHypothesisById(id: String): Optional<Hypothesis> {
        val statement = StringBuilder(BASE_QUERY_STATEMENT)
            .appendln("and hypotheses.id = ?")

        return Optional.ofNullable(
            this.jdbcTemplate.query(
                statement.toString(),
                arrayOf(encryptionKey, id),
                hypothesisExtractor
            )?.firstOrNull()
        )
    }
}