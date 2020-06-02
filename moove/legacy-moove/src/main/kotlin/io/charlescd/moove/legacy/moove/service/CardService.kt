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
import io.charlescd.moove.commons.constants.MooveErrorCodeLegacy
import io.charlescd.moove.commons.exceptions.BusinessExceptionLegacy
import io.charlescd.moove.commons.exceptions.NotFoundExceptionLegacy
import io.charlescd.moove.commons.extension.toRepresentation
import io.charlescd.moove.commons.integration.git.mapper.GitServiceMapperLegacy
import io.charlescd.moove.commons.representation.CardRepresentation
import io.charlescd.moove.commons.request.comment.AddCommentRequest
import io.charlescd.moove.commons.request.member.AddMemberRequest
import io.charlescd.moove.legacy.moove.request.card.CreateCardRequest
import io.charlescd.moove.legacy.moove.request.card.UpdateCardRequest
import io.charlescd.moove.legacy.moove.request.git.FindBranchParam
import io.charlescd.moove.legacy.repository.*
import io.charlescd.moove.legacy.repository.entity.*
import java.time.LocalDateTime
import java.util.*
import javax.transaction.Transactional
import org.hibernate.Hibernate
import org.slf4j.LoggerFactory
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service

@Service
class CardService(
    private val cardRepository: CardRepository,
    private val cardColumnRepository: CardColumnRepository,
    private val userRepository: UserRepository,
    private val featureRepository: FeatureRepository,
    private val labelRepository: LabelRepository,
    private val commentRepository: CommentRepository,
    private val hypothesisRepository: HypothesisRepository,
    private val moduleRepository: ModuleRepository,
    private val gitServiceMapperLegacy: GitServiceMapperLegacy,
    private val gitConfigurationRepository: GitConfigurationRepository,
    private val charlesNotificationService: CharlesNotificationService
) {
    private val log = LoggerFactory.getLogger(this.javaClass)

    @Transactional
    fun create(createCardRequest: CreateCardRequest, workspaceId: String): CardRepresentation {
        return createCardRequest.toEntity(workspaceId)
            .let { this.cardRepository.save(it) }
            .apply { createNewFeatureBranches(card = this) }
            .toRepresentation()
    }

    fun findAll(pageable: Pageable, workspaceId: String): Page<CardRepresentation> {
        return cardRepository.findAllByWorkspaceId(workspaceId, pageable)
            .map { it.toRepresentation() }
    }

    fun findById(id: String, workspaceId: String): CardRepresentation {
        return cardRepository.findByIdAndWorkspaceId(id, workspaceId)
            .map { it.toRepresentation() }
            .orElseThrow { NotFoundExceptionLegacy("card", id) }
    }

    @Transactional
    fun update(id: String, updateCardRequest: UpdateCardRequest, workspaceId: String): CardRepresentation {
        return cardRepository.findByIdAndWorkspaceId(id, workspaceId)
            .orElseThrow { NotFoundExceptionLegacy("card", id) }
            .fetchCardCommentsAndMembers()
            .let { saveUpdatedCard(updateCardRequest, it) }
            .toRepresentation()
    }

    @Transactional
    fun delete(id: String, workspaceId: String) {
        return cardRepository.findByIdAndWorkspaceId(id, workspaceId)
            .orElseThrow { NotFoundExceptionLegacy("card", id) }
            .also { deleteCardRelationships(it) }
            .also { this.cardRepository.delete(it) }
            .let { deleteFeatureBranches(it) }
    }

    @Transactional
    fun addComment(id: String, addCommentRequest: AddCommentRequest, workspaceId: String): CardRepresentation {
        return cardRepository.findByIdAndWorkspaceId(id, workspaceId)
            .orElseThrow { NotFoundExceptionLegacy("card", id) }
            .let { addCommentToCard(it, addCommentRequest) }
            .let { cardRepository.save(it) }
            .toRepresentation()
    }

    @Transactional
    fun addMembers(id: String, addMemberRequest: AddMemberRequest, workspaceId: String): CardRepresentation {
        return cardRepository.findByIdAndWorkspaceId(id, workspaceId)
            .orElseThrow { NotFoundExceptionLegacy("card", id) }
            .let { addMemberToCard(it, addMemberRequest) }
            .let { cardRepository.save(it) }
            .also { notificationAddMemberToCard(it, addMemberRequest) }
            .toRepresentation()
    }

    @Transactional
    fun removeMember(id: String, memberId: String, workspaceId: String): CardRepresentation {
        return cardRepository.findByIdAndWorkspaceId(id, workspaceId)
            .orElseThrow { NotFoundExceptionLegacy("card", id) }
            .let { it.removeMember(memberId) }
            .let { cardRepository.save(it) }
            .toRepresentation()
    }

    fun deleteCardRelationships(card: Card) {
        card.also { this.cardRepository.deleteMembersRelationship(card.id) }
    }

    fun findBranches(findBranchParam: FindBranchParam, workspaceId: String): Map<String, String> {
        val repositoryBranchMap = mutableMapOf<String, String>()
        moduleRepository.findAllByIdAndWorkspaceId(findBranchParam.moduleIds, workspaceId).forEach { module ->
            validateWorkspace(module.workspace)
            searchBranch(
                fetchCredentials(module.workspace.gitConfigurationId!!),
                module.name, findBranchParam.branchName
            ).ifPresent {
                repositoryBranchMap[module.name] = it
            }
        }
        return repositoryBranchMap
    }

    @Transactional
    fun archiveCard(cardId: String, workspaceId: String) {
        this.cardRepository.findByIdAndWorkspaceId(cardId, workspaceId)
            .orElseThrow { NotFoundExceptionLegacy("card", cardId) }
            .let { it.copyToArchive() }
            .let { this.cardRepository.save(it) }
    }

    private fun deleteFeatureBranches(card: Card) {
        if (card is SoftwareCard) {
            card.feature.modules.forEach { module ->
                validateWorkspace(module.workspace)
                deleteBranch(
                    fetchCredentials(module.workspace.gitConfigurationId!!),
                    module.name, card.feature.branchName
                )
            }
        }
    }

    private fun deleteBranch(gitCredentials: GitCredentials, repository: String, branchName: String) {
        try {
            gitServiceMapperLegacy.getByType(gitCredentials.serviceProvider)
                .deleteBranch(gitCredentials, repository, branchName)
        } catch (e: Exception) {
            log.error("failed to delete branch: $branchName with error: $e")
        }
    }

    private fun createNewFeatureBranches(card: Card) {
        if (card is SoftwareCard) {
            val branchModuleMap = mutableMapOf<String, Module>()
            try {
                card.feature.modules.forEach { module ->

                    validateWorkspace(module.workspace)

                    val credentials =
                        fetchCredentials(module.workspace.gitConfigurationId!!)

                    searchBranch(credentials, module.name, card.feature.branchName)
                        .takeUnless { it.isPresent }
                        ?.let { createNewBranch(credentials, module, card) }
                        ?.takeIf { it.isPresent }
                        ?.let { branchModuleMap[it.get()] = module }
                }
            } catch (e: Exception) {
                log.error("error attempting to create new branches")
                rollbackCreatedBranches(branchModuleMap.toMap())
                throw e
            }
        }
    }

    private fun validateWorkspace(workspace: Workspace) {
        workspace.gitConfigurationId
            ?: throw BusinessExceptionLegacy.of(MooveErrorCodeLegacy.WORKSPACE_GIT_CONFIGURATION_IS_MISSING)
    }

    private fun createNewBranch(
        credentials: GitCredentials,
        module: Module,
        card: SoftwareCard
    ): Optional<String> {
        return gitServiceMapperLegacy.getByType(credentials.serviceProvider).createBranch(
            credentials,
            module.name,
            card.feature.branchName
        )
    }

    private fun rollbackCreatedBranches(branchModuleMap: Map<String, Module>) {
        log.info("performing rollback on created branches: $branchModuleMap")
        branchModuleMap.forEach { (branch, module) ->
            deleteBranch(
                fetchCredentials(module.workspace.gitConfigurationId!!),
                module.name, branch
            )
        }
    }

    private fun fetchCredentials(gitConfigurationId: String): GitCredentials {
        return gitConfigurationRepository.findById(gitConfigurationId)
            .orElseThrow { NotFoundExceptionLegacy("gitConfiguration", gitConfigurationId) }.credentials
    }

    private fun searchBranch(
        gitCredentials: GitCredentials,
        repository: String,
        branchName: String
    ): Optional<String> {
        return try {
            gitServiceMapperLegacy.getByType(gitCredentials.serviceProvider)
                .findBranch(gitCredentials, repository, branchName)
        } catch (e: Exception) {
            return Optional.empty()
        }
    }

    private fun AddCommentRequest.toEntity() = Comment(
        comment = this.comment,
        author = findUserById(this.authorId),
        createdAt = LocalDateTime.now(),
        id = UUID.randomUUID().toString()
    )

    private fun addCommentToCard(card: Card, addCommentRequest: AddCommentRequest): Card {
        return addCommentRequest.toEntity()
            .let { commentRepository.save(it) }
            .also { notificationAddCommentMemberToCard(card, it) }
            .let { card.addComment(it) }
    }

    private fun AddMemberRequest.toEntity(): Set<User> =
        this.memberIds.map {
            userRepository.findById(it)
                .orElseThrow { NotFoundExceptionLegacy("user", it) }
        }.toSet()

    private fun addMemberToCard(card: Card, addMemberRequest: AddMemberRequest): Card {
        return addMemberRequest.toEntity()
            .let { card.addUsers(it) }
    }

    private fun saveUpdatedCard(updateCardRequest: UpdateCardRequest, card: Card): Card {
        return when (updateCardRequest.type) {
            ActionCardType.ACTION.name -> card.updateActionCard(updateCardRequest)
            SoftwareCardType.FEATURE.name,
            SoftwareCardType.ENHANCEMENT.name,
            SoftwareCardType.HOT_FIX.name -> card.updateSoftwareCard(updateCardRequest)
            else -> throw IllegalArgumentException("Invalid card type")
        }
    }

    private fun Card.updateActionCard(updateCardRequest: UpdateCardRequest): ActionCard {
        return when (this) {
            is SoftwareCard -> this.buildUpdatedActionCard(updateCardRequest)
                .also { cardRepository.deleteById(it.id) }
                .also { cardRepository.save(it) }
                .also { deleteFeatureBranches(this) }
            is ActionCard -> this.buildUpdatedActionCard(updateCardRequest)
                .let { cardRepository.save(it) }
            else -> throw IllegalArgumentException("Invalid card type")
        }
    }

    private fun Card.updateSoftwareCard(updateCardRequest: UpdateCardRequest): SoftwareCard {
        return when (this) {
            is ActionCard -> this.toSoftwareCard(updateCardRequest)
                .also { cardRepository.deleteById(it.id) }
                .let { cardRepository.save(it) }
                .also(::createNewFeatureBranches)
            is SoftwareCard -> this.buildUpdatedSoftwareCard(updateCardRequest)
                .let { cardRepository.save(it) }
                .also(::createNewFeatureBranches)
            else -> throw IllegalArgumentException("Invalid card type")
        }
    }

    private fun Card.fetchCardCommentsAndMembers(): Card {
        Hibernate.initialize(this.members)
        Hibernate.initialize(this.comments)
        if (this is SoftwareCard) {
            Hibernate.initialize(this.feature.modules)
        }
        return this
    }

    private fun Card.toSoftwareCard(updateCardRequest: UpdateCardRequest): SoftwareCard =
        SoftwareCard(
            id = this.id,
            name = updateCardRequest.name,
            description = updateCardRequest.description,
            column = this.column,
            labels = findLabels(updateCardRequest.labels),
            members = this.members,
            comments = this.comments,
            hypothesis = this.hypothesis,
            author = this.author,
            type = SoftwareCardType.valueOf(updateCardRequest.type),
            feature = createCardFeature(
                this.name,
                this.author.id,
                updateCardRequest.modules,
                updateCardRequest.branchName,
                this.workspaceId
            ),
            createdAt = this.createdAt,
            index = this.index,
            workspaceId = this.workspaceId
        )

    private fun Card.buildUpdatedActionCard(updateCardRequest: UpdateCardRequest): ActionCard =
        ActionCard(
            id = this.id,
            name = updateCardRequest.name,
            description = updateCardRequest.description,
            column = this.column,
            labels = findLabels(updateCardRequest.labels),
            members = this.members,
            comments = this.comments,
            hypothesis = this.hypothesis,
            type = ActionCardType.ACTION,
            author = this.author,
            status = this.status,
            createdAt = this.createdAt,
            index = this.index,
            workspaceId = this.workspaceId
        )

    private fun SoftwareCard.buildUpdatedSoftwareCard(updateCardRequest: UpdateCardRequest): SoftwareCard =
        SoftwareCard(
            id = this.id,
            name = updateCardRequest.name,
            description = updateCardRequest.description,
            column = this.column,
            members = this.members,
            comments = this.comments,
            labels = findLabels(updateCardRequest.labels),
            hypothesis = this.hypothesis,
            author = this.author,
            type = this.type,
            feature = this.feature
                .updateFeatureBranchNameIfNecessary(updateCardRequest.branchName)
                .updateFeatureModules(updateCardRequest.modules),
            createdAt = this.createdAt,
            index = this.index,
            workspaceId = this.workspaceId
        )

    private fun Feature.updateFeatureBranchNameIfNecessary(branchName: String): Feature {
        return this.takeIf { branchName.isBlank() } ?: this.copy(branchName = branchName)
    }

    private fun Feature.updateFeatureModules(modules: List<String>): Feature {
        return featureRepository.save(this.copy(modules = modules.map { findModuleById(it) }))
    }

    private fun findLabels(labels: List<String>): List<Label> =
        this.labelRepository.findAllById(labels)
            .takeIf { labels.size == it.size } ?: throw NotFoundExceptionLegacy(
            "labels",
            labels.joinToString(", ")
        )

    private fun findUserById(authorId: String): User {
        return userRepository.findById(authorId)
            .orElseThrow { NotFoundExceptionLegacy("user", authorId) }
    }

    private fun findHypothesisById(hypothesisId: String): Hypothesis {
        return hypothesisRepository.findById(hypothesisId)
            .orElseThrow { NotFoundExceptionLegacy("hypothesis", hypothesisId) }
    }

    private fun findModuleById(moduleId: String): Module {
        return moduleRepository.findById(moduleId)
            .orElseThrow { NotFoundExceptionLegacy("module", moduleId) }
    }

    private fun buildFeature(
        name: String,
        authorId: String,
        modules: List<String>,
        branchName: String,
        workspaceId: String
    ): Feature =
        Feature(
            id = UUID.randomUUID().toString(),
            name = name,
            branchName = branchName,
            author = findUserById(authorId),
            createdAt = LocalDateTime.now(),
            modules = modules.map { findModuleById(it) },
            workspaceId = workspaceId
        )

    private fun createCardFeature(
        name: String,
        authorId: String,
        modules: List<String>,
        branchName: String,
        workspaceId: String
    ): Feature {
        return buildFeature(name, authorId, modules, branchName, workspaceId)
            .let { this.featureRepository.save(it) }
    }

    private fun findCardColumnByNameAndHypothesis(name: String, hypothesis: Hypothesis): CardColumn {
        return cardColumnRepository.findByNameAndHypothesis(name, hypothesis)
            .orElseThrow { NotFoundExceptionLegacy("card_column", name) }
    }

    private fun CreateCardRequest.toEntity(workspaceId: String): Card {
        return when (this.type) {
            ActionCardType.ACTION.name -> buildActionCard(workspaceId).calculateIndex()
            SoftwareCardType.HOT_FIX.name, SoftwareCardType.ENHANCEMENT.name, SoftwareCardType.FEATURE.name -> buildSoftwareCard(
                workspaceId
            ).calculateIndex()
            else -> throw IllegalArgumentException("Card type not supported")
        }
    }

    private fun CreateCardRequest.buildActionCard(workspaceId: String) = ActionCard(
        id = UUID.randomUUID().toString(),
        name = this.name,
        description = this.description,
        type = ActionCardType.valueOf(this.type),
        column = findCardColumnByNameAndHypothesis(
            ColumnConstants.TO_DO_COLUMN_NAME,
            findHypothesisById(this.hypothesisId)
        ),
        labels = findLabels(this.labels),
        hypothesis = findHypothesisById(this.hypothesisId),
        status = CardStatus.ACTIVE,
        author = findUserById(this.authorId),
        createdAt = LocalDateTime.now(),
        workspaceId = workspaceId
    )

    private fun CreateCardRequest.buildSoftwareCard(workspaceId: String) = SoftwareCard(
        id = UUID.randomUUID().toString(),
        name = this.name,
        description = this.description,
        type = SoftwareCardType.valueOf(this.type),
        column = findCardColumnByNameAndHypothesis(
            ColumnConstants.TO_DO_COLUMN_NAME,
            findHypothesisById(this.hypothesisId)
        ),
        labels = findLabels(this.labels),
        hypothesis = findHypothesisById(this.hypothesisId),
        author = findUserById(this.authorId),
        feature = createCardFeature(this.name, this.authorId, this.modules, this.branchName, workspaceId),
        createdAt = LocalDateTime.now(),
        workspaceId = workspaceId
    )

    private fun Card.copyToArchive(): Card {
        return when (this) {
            is SoftwareCard -> this.copy(status = CardStatus.ARCHIVED)
            is ActionCard -> this.copy(status = CardStatus.ARCHIVED)
            else -> throw Exception("Could not determine card type")
        }
    }

    private fun notificationAddMemberToCard(card: Card, addMemberRequest: AddMemberRequest) {
        try {
            userRepository.findById(addMemberRequest.authorId)
                .orElseThrow { NotFoundExceptionLegacy("user", addMemberRequest.authorId) }
                .let { charlesNotificationService.addMembersCard(card, it, addMemberRequest.memberIds) }
        } catch (e: Exception) {
            log.error("error notification add member to card", e)
        }
    }

    private fun notificationAddCommentMemberToCard(card: Card, comment: Comment) {
        try {
            charlesNotificationService.addCommentCard(card, comment)
        } catch (e: Exception) {
            log.error("error notification add comment to card", e)
        }
    }
}
