/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charles.infrastructure.repository.mapper

import br.com.zup.charles.domain.*
import org.springframework.jdbc.core.ResultSetExtractor
import java.sql.ResultSet
import org.springframework.stereotype.Component as SpringComponent

@SpringComponent
class HypothesisExtractor(private val moduleMapper: ModuleMapper) : ResultSetExtractor<Set<Hypothesis>> {

    override fun extractData(resultSet: ResultSet): Set<Hypothesis> {
        val hypotheses = HashSet<Hypothesis>()
        val columns = HashSet<Column>()
        val cards = HashSet<Card>()
        val modules = HashMap<String, HashSet<Module>>()
        val components = HashSet<Component>()

        while (resultSet.next()) {
            hypotheses.add(mapHypothesis(resultSet))
            createColumns(resultSet, columns)
            createCards(resultSet, cards)
            createModules(resultSet, modules)
            createComponents(resultSet, components)
        }

        val composedCards = composeCards(cards, modules, components)

        return composeHypotheses(
            hypotheses,
            composeColumns(columns, composedCards)
        )
    }

    fun createModules(
        resultSet: ResultSet,
        modules: HashMap<String, HashSet<Module>>
    ) {
        if (resultSet.getString("module_id") != null) {
            modules[resultSet.getString("feature_id")]
                ?.add(moduleMapper.mapModule(resultSet))
                ?: modules.put(
                    resultSet.getString("feature_id"),
                    hashSetOf(moduleMapper.mapModule(resultSet))
                )
        }
    }

    fun createComponents(
        resultSet: ResultSet,
        components: HashSet<Component>
    ) {
        if (resultSet.getString("component_id") != null) {
            components.add(moduleMapper.mapComponent(resultSet))
        }
    }

    private fun composeHypotheses(
        hypotheses: HashSet<Hypothesis>,
        columns: List<Column>
    ): HashSet<Hypothesis> {
        return hypotheses.map { hypothesis ->
            hypothesis.copy(columns = columns)
        }.toHashSet()
    }

    private fun composeColumns(
        columns: HashSet<Column>,
        cards: HashSet<Card>
    ): List<Column> {
        return columns.map { column ->
            column.copy(cards = cards.filter { card ->
                card.columnId == column.id
            })
        }
    }

    private fun composeCards(
        cards: HashSet<Card>,
        modules: HashMap<String, HashSet<Module>>,
        components: HashSet<Component>
    ): HashSet<Card> {
        return cards.map { card ->
            when (card) {
                is SoftwareCard -> composeSoftwareCard(card, modules, components)
                else -> card as ActionCard
            }
        }.toHashSet()
    }

    private fun composeSoftwareCard(
        card: SoftwareCard,
        modules: HashMap<String, HashSet<Module>>,
        components: HashSet<Component>
    ): SoftwareCard {
        return card.copy(
            feature = card.feature.copy(
                modules = composeModules(card, modules, components)
            )
        )
    }

    private fun composeModules(
        card: SoftwareCard,
        modulesMap: HashMap<String, HashSet<Module>>,
        components: HashSet<Component>
    ): List<Module> {
        val modules = modulesMap[card.feature.id]?.toList() ?: emptyList()
        return modules.map { module ->
            module.copy(
                components = components.filter { component ->
                    component.moduleId == module.id
                }
            )
        }
    }

    private fun createCards(
        resultSet: ResultSet,
        cards: HashSet<Card>
    ) {
        if (resultSet.getString("card_id") != null) {
            cards.add(mapCards(resultSet))
        }
    }

    private fun createColumns(
        resultSet: ResultSet,
        columns: HashSet<Column>
    ) {
        if (resultSet.getString("column_id") != null) {
            columns.add(mapColumns(resultSet))
        }
    }

    private fun mapHypothesis(resultSet: ResultSet) = Hypothesis(
        id = resultSet.getString("hypothesis_id"),
        name = resultSet.getString("hypothesis_name"),
        description = resultSet.getString("hypothesis_description"),
        createdAt = resultSet.getTimestamp("hypothesis_created_at").toLocalDateTime(),
        problemId = resultSet.getString("hypothesis_problem_id"),
        applicationId = resultSet.getString("hypothesis_application_id"),
        columns = emptyList(),
        author = mapHypothesisUser(resultSet)
    )

    private fun mapHypothesisUser(resultSet: ResultSet) = User(
        id = resultSet.getString("hypothesis_user_id"),
        name = resultSet.getString("hypothesis_user_name"),
        email = resultSet.getString("hypothesis_user_email"),
        photoUrl = resultSet.getString("hypothesis_user_photo_url"),
        applications = emptyList(),
        createdAt = resultSet.getTimestamp("hypothesis_user_created_at").toLocalDateTime()
    )

    private fun mapColumns(resultSet: ResultSet) = Column(
        id = resultSet.getString("column_id"),
        name = resultSet.getString("column_name"),
        hypothesisId = resultSet.getString("column_hypothesis_id"),
        applicationId = resultSet.getString("column_application_id"),
        cards = emptyList()
    )

    private fun mapCards(resultSet: ResultSet): Card {
        if (resultSet.getString("software_card_type") != null) {
            return mapSoftwareCard(resultSet)
        }

        return mapActionCard(resultSet)
    }

    private fun mapActionCard(resultSet: ResultSet) = ActionCard(
        id = resultSet.getString("card_id"),
        name = resultSet.getString("card_name"),
        description = resultSet.getString("card_description"),
        columnId = resultSet.getString("card_column_id"),
        createdAt = resultSet.getTimestamp("card_created_at").toLocalDateTime(),
        index = resultSet.getInt("card_index"),
        applicationId = resultSet.getString("card_application_id"),
        status = CardStatusEnum.valueOf(resultSet.getString("card_status")),
        type = ActionCardTypeEnum.valueOf(resultSet.getString("action_card_type")),
        author = mapCardUser(resultSet)
    )

    private fun mapSoftwareCard(resultSet: ResultSet) = SoftwareCard(
        id = resultSet.getString("card_id"),
        name = resultSet.getString("card_name"),
        description = resultSet.getString("card_description"),
        columnId = resultSet.getString("card_column_id"),
        createdAt = resultSet.getTimestamp("card_created_at").toLocalDateTime(),
        index = resultSet.getInt("card_index"),
        applicationId = resultSet.getString("card_application_id"),
        status = CardStatusEnum.valueOf(resultSet.getString("card_status")),
        type = SoftwareCardTypeEnum.valueOf(resultSet.getString("software_card_type")),
        author = mapCardUser(resultSet),
        feature = mapFeature(resultSet)
    )

    private fun mapCardUser(resultSet: ResultSet) = User(
        id = resultSet.getString("card_user_id"),
        name = resultSet.getString("card_user_name"),
        email = resultSet.getString("card_user_email"),
        photoUrl = resultSet.getString("card_user_photo_url"),
        applications = emptyList(),
        createdAt = resultSet.getTimestamp("card_user_created_at").toLocalDateTime()
    )

    private fun mapFeature(resultSet: ResultSet) = Feature(
        id = resultSet.getString("feature_id"),
        name = resultSet.getString("feature_name"),
        branchName = resultSet.getString("feature_branch_name"),
        createdAt = resultSet.getTimestamp("feature_created_at").toLocalDateTime(),
        modules = emptyList(),
        applicationId = resultSet.getString("feature_application_id"),
        author = mapFeatureUser(resultSet)
    )

    private fun mapFeatureUser(resultSet: ResultSet) = User(
        id = resultSet.getString("feature_user_id"),
        name = resultSet.getString("feature_user_name"),
        email = resultSet.getString("feature_user_email"),
        photoUrl = resultSet.getString("feature_user_photo_url"),
        applications = emptyList(),
        createdAt = resultSet.getTimestamp("feature_user_created_at").toLocalDateTime()
    )
}