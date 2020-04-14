/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.moove.service

import br.com.zup.darwin.commons.constants.ColumnConstants
import br.com.zup.darwin.commons.constants.MooveConstants
import br.com.zup.darwin.commons.extension.toRepresentation
import br.com.zup.darwin.commons.extension.toSimpleRepresentation
import br.com.zup.darwin.commons.representation.*
import br.com.zup.darwin.entity.*
import br.com.zup.darwin.moove.request.hypothesis.*
import br.com.zup.darwin.repository.*
import br.com.zup.exception.handler.exception.NotFoundException
import br.com.zup.exception.handler.to.ResourceValue
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import org.springframework.util.LinkedMultiValueMap
import org.springframework.util.MultiValueMap
import java.time.LocalDateTime
import java.util.*
import javax.transaction.Transactional

@Service
class HypothesisService(
    private val hypothesisRepository: HypothesisRepository,
    private val labelRepository: LabelRepository,
    private val userRepository: UserRepository,
    private val problemRepository: ProblemRepository,
    private val cardColumnRepository: CardColumnRepository,
    private val circleRepository: CircleRepository,
    private val cardRepository: CardRepository,
    private val deploymentRepository: DeploymentRepository
) {
    fun findValidatedBuildsByHypothesisId(id: String, applicationId: String): List<SimpleBuildRepresentation> {
        return this.hypothesisRepository.findByIdAndApplicationId(id, applicationId)
            .orElseThrow { NotFoundException(ResourceValue("hypothesis", id)) }
            .builds.filter { b -> b.status == BuildStatus.VALIDATED }
            .map { build -> build.toSimpleRepresentation() }
    }

    fun findAll(applicationId: String, pageable: Pageable): Page<HypothesisRepresentation> =
        hypothesisRepository.findAllByApplicationId(applicationId, pageable)
            .map { it.toRepresentation() }

    fun findHypothesisById(id: String, applicationId: String): HypothesisRepresentation =
        hypothesisRepository.findByIdAndApplicationId(id, applicationId)
            .map { it.toRepresentation() }
            .orElseThrow { NotFoundException(ResourceValue("hypothesis", id)) }

    @Transactional
    fun create(request: CreateHypothesisRequest, applicationId: String): HypothesisRepresentation =
        request
            .toEntity(applicationId)
            .let(hypothesisRepository::save)
            .also { createHypothesisCardColumns(it, applicationId) }
            .toRepresentation()

    @Transactional
    fun update(id: String, request: UpdateHypothesisRequest, applicationId: String): HypothesisRepresentation =
        this.hypothesisRepository.findByIdAndApplicationId(id, applicationId)
            .orElseThrow { NotFoundException(ResourceValue("hypothesis", id)) }
            .let { request.toEntity(it) }
            .let(this.hypothesisRepository::save)
            .toRepresentation()

    @Transactional
    fun delete(id: String, applicationId: String): HypothesisRepresentation =
        this.hypothesisRepository.findByIdAndApplicationId(id, applicationId)
            .orElseThrow { NotFoundException(ResourceValue("hypothesis", id)) }
            .also(hypothesisRepository::delete)
            .toRepresentation()

    @Transactional
    fun addLabels(id: String, labelIds: List<String>, applicationId: String): HypothesisRepresentation =
        this.hypothesisRepository.findByIdAndApplicationId(id, applicationId)
            .orElseThrow { NotFoundException(ResourceValue("hypothesis", id)) }
            .let(this.addLabels(labelIds))
            .let(this.hypothesisRepository::save)
            .toRepresentation()

    @Transactional
    fun removeLabel(id: String, labelId: String, applicationId: String) {
        this.hypothesisRepository.findByIdAndApplicationId(id, applicationId)
            .orElseThrow { NotFoundException(ResourceValue("hypothesis", id)) }
            .let { hypothesis -> hypothesis.copy(labels = hypothesis.labels.filter { it.id != labelId }) }
            .let(hypothesisRepository::save)
    }

    @Transactional
    fun addCircles(id: String, circleIds: List<String>, applicationId: String): HypothesisRepresentation =
        this.hypothesisRepository.findByIdAndApplicationId(id, applicationId)
            .orElseThrow { NotFoundException(ResourceValue("hypothesis", id)) }
            .let(this.addCircles(circleIds))
            .let(this.hypothesisRepository::save)
            .toRepresentation()

    @Transactional
    fun removeCircle(id: String, circleId: String, applicationId: String) {
        this.hypothesisRepository.findByIdAndApplicationId(id, applicationId)
            .orElseThrow { NotFoundException(ResourceValue("hypothesis", id)) }
            .let { hypothesis -> hypothesis.copy(circles = hypothesis.circles.filter { it.id != circleId }) }
            .let(hypothesisRepository::save)
    }

    fun getBoard(id: String, applicationId: String): HypothesisBoardRepresentation {
        return hypothesisRepository.findByIdAndApplicationId(id, applicationId)
            .orElseThrow { NotFoundException(ResourceValue("hypothesis", id)) }
            .let { hypothesis ->
                HypothesisBoardRepresentation(
                    board = getHypothesisCardsByColumns(hypothesis, getCardColumns(id, applicationId))
                )
            }
    }

    fun getBoardActiveEvents(id: String, applicationId: String): BoardEventsRepresentation {
        return hypothesisRepository.findByIdAndApplicationId(id, applicationId)
            .orElseThrow { NotFoundException(ResourceValue("hypothesis", id)) }
            .let { createEventsRepresentation(it) }
    }

    @Transactional
    fun orderCardsInColumn(
        id: String,
        request: OrderCardInColumnRequest,
        applicationId: String
    ): List<CardsByColumnsRepresentation> {
        return hypothesisRepository.findByIdAndApplicationId(id, applicationId)
            .orElseThrow { NotFoundException(ResourceValue("hypothesis", id)) }
            .let { it.orderHypothesisCards(request) }
            .let { hypothesis -> getHypothesisCardsByColumns(hypothesis, getCardColumns(hypothesis.id, applicationId)) }
    }

    @Transactional
    fun updateCardColumn(
        id: String,
        cardId: String,
        request: UpdateCardColumnRequest,
        applicationId: String
    ): List<CardsByColumnsRepresentation> {
        return cardColumnRepository.findByIdAndApplicationId(request.destination.id, applicationId)
            .orElseThrow { NotFoundException(ResourceValue("card_column", request.destination.id)) }
            .let { validateUpdateColumnInput(it) }
            .let { saveCardWithUpdatedColumn(cardId, it, applicationId) }
            .let { hypothesisRepository.findByIdAndApplicationId(id, applicationId) }
            .orElseThrow { NotFoundException(ResourceValue("hypothesis", id)) }
            .let { it.updateHypothesisCards(request) }
            .let { hypothesis -> getHypothesisCardsByColumns(hypothesis, getCardColumns(hypothesis.id, applicationId)) }
    }

    @Transactional
    fun saveCardWithUpdatedColumn(id: String, cardColumn: CardColumn, applicationId: String): Card {
        return cardRepository.findByIdAndApplicationId(id, applicationId)
            .orElseThrow { NotFoundException(ResourceValue("card", id)) }
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
            .orElseThrow { NotFoundException(ResourceValue("card_column", request.id)) }
            .let { this.saveHypothesisWithUpdatedCardsIndex(request.cards) }
    }

    @Transactional
    fun Hypothesis.saveHypothesisWithUpdatedCardsIndex(updatedCards: List<CardRequest>): Hypothesis {
        return this.copy(
            cards = updateCardsIndex(cards, updatedCards)
        ).let(hypothesisRepository::save)
    }

    fun findHypothesisDeploymentsPerCircle(id: String, applicationId: String): List<CircleDeploymentsRepresentation> {
        val circleDeploymentsList = mutableListOf<CircleDeploymentsRepresentation>()
        findDeployments(id, applicationId).forEach {
            circleDeploymentsList.add(
                CircleDeploymentsRepresentation(
                    it.key.id,
                    it.key.name,
                    it.value.toSimpleRepresentation()
                )
            )
        }
        return circleDeploymentsList.sortedBy { it.circleName }
    }

    private fun createHypothesisCardColumns(hypothesis: Hypothesis, applicationId: String) {

        val todoCardColumn = CardColumn(
            UUID.randomUUID().toString(),
            ColumnConstants.TO_DO_COLUMN_NAME,
            hypothesis,
            applicationId
        )

        val doingCardColumn = CardColumn(
            UUID.randomUUID().toString(),
            ColumnConstants.DOING_COLUMN_NAME,
            hypothesis,
            applicationId
        )

        val readyToGoCardColumn = CardColumn(
            UUID.randomUUID().toString(),
            ColumnConstants.READY_TO_GO_COLUMN_NAME,
            hypothesis,
            applicationId
        )

        val buildsCardColumn = CardColumn(
            UUID.randomUUID().toString(),
            ColumnConstants.BUILDS_COLUMN_NAME,
            hypothesis,
            applicationId
        )

        val deployedReleasesCardColumn = CardColumn(
            UUID.randomUUID().toString(),
            ColumnConstants.DEPLOYED_RELEASES_COLUMN_NAME,
            hypothesis,
            applicationId
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

    private fun findDeployments(id: String, applicationId: String): MultiValueMap<Circle, Deployment> {
        val circleDeploymentsMap = LinkedMultiValueMap<Circle, Deployment>()
        hypothesisRepository.findByIdAndApplicationId(id, applicationId).map { hypothesis ->
            hypothesis.circles.forEach {
                circleDeploymentsMap.putIfAbsent(it, deploymentRepository.findByCircleId(it.id).filter { deployment ->
                    deployment.status != DeploymentStatus.NOT_DEPLOYED
                })
            }
        }.orElseThrow { NotFoundException(ResourceValue("hypothesis", id)) }
        return circleDeploymentsMap
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
                builds = hypothesis.builds.filter { it.column?.id == cardColumn.id && it.status != BuildStatus.ARCHIVED }.orderDeploymentsByDate()
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

    private fun getCardColumns(id: String, applicationId: String): List<CardsByColumnsRepresentation> {
        return cardColumnRepository.findAllByHypothesisIdAndApplicationId(id, applicationId).map { cardColumn ->
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

    private fun addCircles(circles: List<String>): (Hypothesis) -> Hypothesis = { hypothesis ->
        findCirclesByIds(circles)
            .let { hypothesis.copy(circles = hypothesis.circles + it) }
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

    private fun CreateHypothesisRequest.toEntity(applicationId: String) = Hypothesis(
        id = UUID.randomUUID().toString(),
        name = this.name,
        author = findUserById(this.authorId),
        description = this.description,
        createdAt = LocalDateTime.now(),
        problem = findProblemById(this.problemId),
        labels = findLabelsByIds(this.labels),
        applicationId = applicationId
    )

    private fun findProblemById(id: String): Problem =
        problemRepository.findById(id)
            .orElseThrow { NotFoundException(ResourceValue("problem", id)) }

    private fun findUserById(id: String): User =
        userRepository.findById(id)
            .orElseThrow { NotFoundException(ResourceValue("user", id)) }

    private fun findLabelsByIds(ids: List<String>): List<Label> =
        ids.takeIf { it.isNotEmpty() }
            ?.let { labelRepository.findAllByIdIn(ids) }
            ?.validateAllIdsFound(ids)
            ?: emptyList()

    private fun findCirclesByIds(ids: List<String>): List<Circle> =
        ids.takeIf { it.isNotEmpty() }
            ?.let { circleRepository.findAllById(ids) }
            ?.takeIf { it.size == ids.size }
            ?: throw NotFoundException(ResourceValue("circle", ids.joinToString(", ")))

    private fun List<Label>.validateAllIdsFound(ids: List<String>): List<Label> {
        return ids.toSet()
            .minus(this.map { it.id })
            .takeIf { it.isNotEmpty() }
            ?.let { throw NotFoundException(ResourceValue("label", it.joinToString(", "))) }
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