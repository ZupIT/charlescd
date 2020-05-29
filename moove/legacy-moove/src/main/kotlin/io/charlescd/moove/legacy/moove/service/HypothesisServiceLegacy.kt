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

package io.charlescd.moove.legacy.moove.service

import io.charlescd.moove.commons.constants.ColumnConstants
import io.charlescd.moove.commons.constants.MooveConstants
import io.charlescd.moove.commons.exceptions.NotFoundExceptionLegacy
import io.charlescd.moove.commons.extension.toRepresentation
import io.charlescd.moove.commons.extension.toSimpleRepresentation
import io.charlescd.moove.commons.representation.*
import io.charlescd.moove.legacy.moove.request.hypothesis.*
import io.charlescd.moove.legacy.repository.*
import io.charlescd.moove.legacy.repository.entity.*
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import java.util.*
import javax.transaction.Transactional

@Service
class HypothesisServiceLegacy(
    private val hypothesisRepository: HypothesisRepository,
    private val labelRepository: LabelRepository,
    private val userRepository: UserRepository,
    private val cardColumnRepository: CardColumnRepository,
    private val cardRepository: CardRepository
) {
    fun findValidatedBuildsByHypothesisId(id: String, workspaceId: String): List<SimpleBuildRepresentation> {
        return this.hypothesisRepository.findByIdAndWorkspaceId(id, workspaceId)
            .orElseThrow { NotFoundExceptionLegacy("hypothesis", id) }
            .builds.filter { b -> b.status == BuildStatus.VALIDATED }
            .map { build -> build.toSimpleRepresentation() }
    }

    fun findAll(workspaceId: String, pageable: Pageable): Page<HypothesisRepresentation> =
        hypothesisRepository.findAllByWorkspaceId(workspaceId, pageable)
            .map { it.toRepresentation() }

    fun findHypothesisById(id: String, workspaceId: String): HypothesisRepresentation =
        hypothesisRepository.findByIdAndWorkspaceId(id, workspaceId)
            .map { it.toRepresentation() }
            .orElseThrow { NotFoundExceptionLegacy("hypothesis", id) }

    @Transactional
    fun create(request: CreateHypothesisRequest, workspaceId: String): HypothesisRepresentation =
        request
            .toEntity(workspaceId)
            .let(hypothesisRepository::save)
            .also { createHypothesisCardColumns(it, workspaceId) }
            .toRepresentation()

    @Transactional
    fun update(id: String, request: UpdateHypothesisRequest, workspaceId: String): HypothesisRepresentation =
        this.hypothesisRepository.findByIdAndWorkspaceId(id, workspaceId)
            .orElseThrow { NotFoundExceptionLegacy("hypothesis", id) }
            .let { request.toEntity(it) }
            .let(this.hypothesisRepository::save)
            .toRepresentation()

    @Transactional
    fun delete(id: String, workspaceId: String): HypothesisRepresentation =
        this.hypothesisRepository.findByIdAndWorkspaceId(id, workspaceId)
            .orElseThrow { NotFoundExceptionLegacy("hypothesis", id) }
            .also(hypothesisRepository::delete)
            .toRepresentation()

    @Transactional
    fun addLabels(id: String, labelIds: List<String>, workspaceId: String): HypothesisRepresentation =
        this.hypothesisRepository.findByIdAndWorkspaceId(id, workspaceId)
            .orElseThrow { NotFoundExceptionLegacy("hypothesis", id) }
            .let(this.addLabels(labelIds))
            .let(this.hypothesisRepository::save)
            .toRepresentation()

    @Transactional
    fun removeLabel(id: String, labelId: String, workspaceId: String) {
        this.hypothesisRepository.findByIdAndWorkspaceId(id, workspaceId)
            .orElseThrow { NotFoundExceptionLegacy("hypothesis", id) }
            .let { hypothesis -> hypothesis.copy(labels = hypothesis.labels.filter { it.id != labelId }) }
            .let(hypothesisRepository::save)
    }

    fun getBoard(id: String, workspaceId: String): HypothesisBoardRepresentation {
        return hypothesisRepository.findByIdAndWorkspaceId(id, workspaceId)
            .orElseThrow { NotFoundExceptionLegacy("hypothesis", id) }
            .let { hypothesis ->
                HypothesisBoardRepresentation(
                    board = getHypothesisCardsByColumns(hypothesis, getCardColumns(id, workspaceId))
                )
            }
    }

    fun getBoardActiveEvents(id: String, workspaceId: String): BoardEventsRepresentation {
        return hypothesisRepository.findByIdAndWorkspaceId(id, workspaceId)
            .orElseThrow { NotFoundExceptionLegacy("hypothesis", id) }
            .let { createEventsRepresentation(it) }
    }

    @Transactional
    fun orderCardsInColumn(
        id: String,
        request: OrderCardInColumnRequest,
        workspaceId: String
    ): List<CardsByColumnsRepresentation> {
        return hypothesisRepository.findByIdAndWorkspaceId(id, workspaceId)
            .orElseThrow { NotFoundExceptionLegacy("hypothesis", id) }
            .let { it.orderHypothesisCards(request) }
            .let { hypothesis -> getHypothesisCardsByColumns(hypothesis, getCardColumns(hypothesis.id, workspaceId)) }
    }

    @Transactional
    fun updateCardColumn(
        id: String,
        cardId: String,
        request: UpdateCardColumnRequest,
        workspaceId: String
    ): List<CardsByColumnsRepresentation> {
        return cardColumnRepository.findByIdAndWorkspaceId(request.destination.id, workspaceId)
            .orElseThrow { NotFoundExceptionLegacy("card_column", request.destination.id) }
            .let { validateUpdateColumnInput(it) }
            .let { saveCardWithUpdatedColumn(cardId, it, workspaceId) }
            .let { hypothesisRepository.findByIdAndWorkspaceId(id, workspaceId) }
            .orElseThrow { NotFoundExceptionLegacy("hypothesis", id) }
            .let { it.updateHypothesisCards(request) }
            .let { hypothesis -> getHypothesisCardsByColumns(hypothesis, getCardColumns(hypothesis.id, workspaceId)) }
    }

    @Transactional
    fun saveCardWithUpdatedColumn(id: String, cardColumn: CardColumn, workspaceId: String): Card {
        return cardRepository.findByIdAndWorkspaceId(id, workspaceId)
            .orElseThrow { NotFoundExceptionLegacy("card", id) }
            .let { it.updateColumn(cardColumn) }
            .let { cardRepository.save(it) }
    }

    @Transactional
    fun Hypothesis.updateHypothesisCards(request: UpdateCardColumnRequest): Hypothesis {
        return this.saveHypothesisWithUpdatedCardsIndex(request.source.cards)
            .saveHypothesisWithUpdatedCardsIndex(request.destination.cards)
    }

    @Transactional
    fun Hypothesis.orderHypothesisCards(request: OrderCardInColumnRequest): Hypothesis {
        return cardColumnRepository.findById(request.id)
            .orElseThrow { NotFoundExceptionLegacy("card_column", request.id) }
            .let { this.saveHypothesisWithUpdatedCardsIndex(request.cards) }
    }

    @Transactional
    fun Hypothesis.saveHypothesisWithUpdatedCardsIndex(updatedCards: List<CardRequest>): Hypothesis {
        return this.copy(
            cards = updateCardsIndex(cards, updatedCards)
        ).let(hypothesisRepository::save)
    }

    private fun createHypothesisCardColumns(hypothesis: Hypothesis, workspaceId: String) {

        val todoCardColumn = CardColumn(
            UUID.randomUUID().toString(),
            ColumnConstants.TO_DO_COLUMN_NAME,
            hypothesis,
            workspaceId
        )

        val doingCardColumn = CardColumn(
            UUID.randomUUID().toString(),
            ColumnConstants.DOING_COLUMN_NAME,
            hypothesis,
            workspaceId
        )

        val readyToGoCardColumn = CardColumn(
            UUID.randomUUID().toString(),
            ColumnConstants.READY_TO_GO_COLUMN_NAME,
            hypothesis,
            workspaceId
        )

        val buildsCardColumn = CardColumn(
            UUID.randomUUID().toString(),
            ColumnConstants.BUILDS_COLUMN_NAME,
            hypothesis,
            workspaceId
        )

        val deployedReleasesCardColumn = CardColumn(
            UUID.randomUUID().toString(),
            ColumnConstants.DEPLOYED_RELEASES_COLUMN_NAME,
            hypothesis,
            workspaceId
        )

        val cardColumns = listOf(
            todoCardColumn,
            doingCardColumn,
            readyToGoCardColumn,
            buildsCardColumn,
            deployedReleasesCardColumn
        )

        cardColumnRepository.saveAll(cardColumns)
    }

    private fun Card.updateIndex(newIndex: Int): Card {
        return this.apply {
            this.index = newIndex.takeIf { it >= 0 } ?: this.index
        }
    }

    private fun updateCardsIndex(hypothesisCards: List<Card>, updatedCards: List<CardRequest>): List<Card> {
        return hypothesisCards.map { card ->
            card.updateIndex(updatedCards.indexOfFirst { it.id == card.id })
        }
    }

    private fun getHypothesisCardsAccordingToCardColumn(
        hypothesis: Hypothesis,
        cardColumn: CardsByColumnsRepresentation
    ): CardsByColumnsRepresentation {
        return if (isItDeployedReleasesColumn(cardColumn)) {
            getCardsWithValidDeployments(cardColumn, hypothesis)
        } else {
            return cardColumn.copy(
                id = cardColumn.id,
                name = cardColumn.name,
                cards = hypothesis.cards.filter { it.column.id == cardColumn.id && it.status == CardStatus.ACTIVE }
                    .sortedBy { it.index }
                    .map { it.toSimpleRepresentation() },
                builds = hypothesis.builds.filter { it.column?.id == cardColumn.id && it.status != BuildStatus.ARCHIVED }
                    .orderDeploymentsByDate()
                    .sortedByDescending { it.createdAt }
                    .map { it.toSimpleRepresentation() }
            )
        }
    }

    private fun isItDeployedReleasesColumn(cardColumn: CardsByColumnsRepresentation) =
        cardColumn.name == ColumnConstants.DEPLOYED_RELEASES_COLUMN_NAME

    private fun getCardsWithValidDeployments(
        cardColumn: CardsByColumnsRepresentation,
        hypothesis: Hypothesis
    ): CardsByColumnsRepresentation {
        return cardColumn.copy(
            id = cardColumn.id,
            name = cardColumn.name,
            builds = getBuildsAccordingToDeployedReleasesColumnRules(hypothesis)
                .filterDeploymentsWithDeployedStatus()
                .orderDeploymentsByDate()
                .sortedByDescending { it.createdAt }.map { it.toSimpleRepresentation() })
    }

    private fun getBuildsAccordingToDeployedReleasesColumnRules(hypothesis: Hypothesis): List<Build> {
        return hypothesis.builds.filter { build ->
            (build.status == BuildStatus.BUILT || build.status == BuildStatus.VALIDATED)
                    && !build.deployments.isNullOrEmpty()
                    && checkIfBuildContainsDeploymentsWithDeployedStatus(build)
        }
    }

    private fun checkIfBuildContainsDeploymentsWithDeployedStatus(build: Build) =
        build.deployments.count { deployment -> deployment.status == DeploymentStatus.DEPLOYED } > 0

    private fun List<Build>.filterDeploymentsWithDeployedStatus(): List<Build> {
        return this.map { build ->
            build.copy(deployments = build.deployments.filter { deployment -> deployment.status == DeploymentStatus.DEPLOYED })
        }
    }

    private fun getHypothesisCardsByColumns(
        hypothesis: Hypothesis,
        cardsByColumns: List<CardsByColumnsRepresentation>
    ): List<CardsByColumnsRepresentation> {
        return cardsByColumns.map { cardColumn -> getHypothesisCardsAccordingToCardColumn(hypothesis, cardColumn) }
    }

    private fun getCardColumns(id: String, workspaceId: String): List<CardsByColumnsRepresentation> {
        return cardColumnRepository.findAllByHypothesisIdAndWorkspaceId(id, workspaceId).map { cardColumn ->
            CardsByColumnsRepresentation(
                id = cardColumn.id,
                name = cardColumn.name
            )
        }
    }

    private fun List<Build>.orderDeploymentsByDate(): List<Build> {
        return this.also {
            it.forEach { build -> build.deployments.sortedByDescending { deployment -> deployment.createdAt } }
        }
    }

    private fun addLabels(labels: List<String>): (Hypothesis) -> Hypothesis = { hypothesis ->
        findLabelsByIds(labels)
            .let { hypothesis.copy(labels = hypothesis.labels + it) }
    }

    private fun UpdateHypothesisRequest.toEntity(hypothesis: Hypothesis) =
        hypothesis.copy(
            name = this.name,
            description = this.description
        )

    private fun CreateHypothesisRequest.toEntity(workspaceId: String) = Hypothesis(
        id = UUID.randomUUID().toString(),
        name = this.name,
        author = findUserById(this.authorId),
        description = this.description,
        createdAt = LocalDateTime.now(),
        labels = findLabelsByIds(this.labels),
        workspaceId = workspaceId
    )

    private fun findUserById(id: String): User =
        userRepository.findById(id)
            .orElseThrow { NotFoundExceptionLegacy("user", id) }

    private fun findLabelsByIds(ids: List<String>): List<Label> =
        ids.takeIf { it.isNotEmpty() }
            ?.let { labelRepository.findAllByIdIn(ids) }
            ?.validateAllIdsFound(ids)
            ?: emptyList()

    private fun List<Label>.validateAllIdsFound(ids: List<String>): List<Label> {
        return ids.toSet()
            .minus(this.map { it.id })
            .takeIf { it.isNotEmpty() }
            ?.let { throw NotFoundExceptionLegacy("label", it.joinToString(", ")) }
            ?: this
    }

    private fun createEventsRepresentation(hypothesis: Hypothesis): BoardEventsRepresentation {
        return BoardEventsRepresentation(
            getActiveBuilds(hypothesis)
                .union(getActiveDeployments(hypothesis))
        )
    }

    private fun getActiveDeployments(hypothesis: Hypothesis): List<EventStatusRepresentation> {
        return hypothesis.builds
            .map { build -> getDevCircleActiveDeployments(build) }
            .flatten()
            .map { deployment ->
                EventStatusRepresentation(
                    deployment.id,
                    deployment.status.name,
                    EventType.DEPLOYMENT
                )
            }
    }

    private fun getActiveBuilds(hypothesis: Hypothesis): List<EventStatusRepresentation> {
        return hypothesis.builds
            .filter { build -> build.status == BuildStatus.BUILDING }
            .map { build -> EventStatusRepresentation(build.id, build.status.name, EventType.BUILD) }
    }

    private fun getDevCircleActiveDeployments(build: Build): List<Deployment> {
        return build.deployments
            .filter { deployment ->
                deployment.status == DeploymentStatus.DEPLOYING &&
                        deployment.circle.name == MooveConstants.MOOVE_DEVELOPER_CIRCLE_NAME
            }
    }

    private fun validateUpdateColumnInput(boardColumn: CardColumn): CardColumn {
        return boardColumn.takeUnless {
            it.name == ColumnConstants.BUILDS_COLUMN_NAME ||
                    it.name == ColumnConstants.DEPLOYED_RELEASES_COLUMN_NAME
        } ?: throw RuntimeException("Invalid column")
    }
}
