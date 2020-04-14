/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.moove.service

import br.com.zup.darwin.commons.constants.ColumnConstants
import br.com.zup.darwin.commons.constants.MooveErrorCode
import br.com.zup.darwin.commons.integration.git.mapper.GitServiceMapperLegacy
import br.com.zup.darwin.commons.integration.git.service.GitServiceLegacy
import br.com.zup.darwin.commons.request.comment.AddCommentRequest
import br.com.zup.darwin.commons.request.member.AddMemberRequest
import br.com.zup.darwin.entity.*
import br.com.zup.darwin.moove.request.card.CreateCardRequest
import br.com.zup.darwin.moove.request.card.UpdateCardRequest
import br.com.zup.darwin.moove.request.git.FindBranchParam
import br.com.zup.darwin.repository.*
import br.com.zup.exception.handler.exception.BusinessException
import br.com.zup.exception.handler.exception.NotFoundException
import io.mockk.every
import io.mockk.mockkClass
import io.mockk.verify
import org.junit.Before
import org.junit.Test
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.Pageable
import java.time.LocalDateTime
import java.util.*
import kotlin.test.assertEquals
import kotlin.test.assertFailsWith
import kotlin.test.assertNotNull
import kotlin.test.assertNull

class CardServiceUnitTest {

    private val applicationId = "applicationId"
    private val cardName = "name"
    private val cardDescription = "card description"
    private val authorId = "authorId"
    private val labels = listOf("labelId")
    private val hypothesisId = "hypeId"
    private val branchName = "branch-name"
    private val modules = listOf("module1", "module2")
    private val helmRepository = "http://github.com"

    private val user = User(authorId, "username", "email", "url", listOf(), LocalDateTime.now())
    private val gitCredential = buildGitCredential(GitServiceProvider.GITHUB)
    private val gitConfiguration1 = buildGitConfiguration("id1")
    private val gitConfiguration2 = buildGitConfiguration("id2")
    private val problem = mockkClass(Problem::class)
    private val hypothesis = buildHypothesis()
    private val cardColumn = CardColumn("ColumnId", "TO DO", hypothesis, applicationId)
    private val label = Label("labeId", "LABEL", LocalDateTime.now(), user, "BAADD")
    private val module1 =
        Module(
            "module1", "repo1/owner1", "https://github.com/repo1/owner1",
            LocalDateTime.now(), helmRepository, user, listOf(label), listOf(), applicationId, gitConfiguration1,
            "k8s-id1", "registry-id1"
        )
    private val module2 =
        Module(
            "module2", "repo2/owner2", "https://github.com/repo2/owner2",
            LocalDateTime.now(), helmRepository, user, listOf(label), listOf(), applicationId, gitConfiguration2,
            "k8s-id2", "registry-id2"
        )
    private val feature = createFeature()

    private val cardRepository = mockkClass(CardRepository::class)
    private val cardColumnRepository = mockkClass(CardColumnRepository::class)
    private val userRepository = mockkClass(UserRepository::class)
    private val featureRepository = mockkClass(FeatureRepository::class)
    private val labelRepository = mockkClass(LabelRepository::class)
    private val commentRepository = mockkClass(CommentRepository::class)
    private val hypothesisRepository = mockkClass(HypothesisRepository::class)
    private val moduleRepository = mockkClass(ModuleRepository::class)
    private val gitServiceMapper = mockkClass(GitServiceMapperLegacy::class)
    private val gitConfigurationRepository = mockkClass(GitConfigurationRepository::class)
    private val gitService = mockkClass(GitServiceLegacy::class)
    private val darwinNotificationService = mockkClass(DarwinNotificationService::class)

    private val cardService = CardService(
        cardRepository,
        cardColumnRepository,
        userRepository,
        featureRepository,
        labelRepository,
        commentRepository,
        hypothesisRepository,
        moduleRepository,
        gitServiceMapper,
        gitConfigurationRepository,
        darwinNotificationService
    )
    private val cardRequest = buildCreateCardRequest()
    private val updateCardRequest = buildUpdateCardRequest()

    @Before
    fun setup() {
        every {
            gitConfigurationRepository.findById(module1.gitConfiguration.id)
        } returns Optional.of(gitConfiguration1)
        every {
            gitConfigurationRepository.findById(module2.gitConfiguration.id)
        } returns Optional.of(gitConfiguration2)
        every { gitServiceMapper.getByType(GitServiceProvider.GITHUB) } returns gitService
    }

    @Test
    fun `should create a new software card`() {
        val card = buildSoftwareCard()

        every {
            cardColumnRepository.findByNameAndHypothesis(
                ColumnConstants.TO_DO_COLUMN_NAME,
                hypothesis
            )
        } returns Optional.of(cardColumn)
        every { labelRepository.findAllById(labels) } returns listOf(label)
        every { hypothesisRepository.findById(hypothesisId) } returns Optional.of(hypothesis)
        every { userRepository.findById(authorId) } returns Optional.of(user)
        every { moduleRepository.findById(modules[0]) } returns Optional.of(module1)
        every { moduleRepository.findById(modules[1]) } returns Optional.of(module2)
        every { featureRepository.save(any() as Feature) } returns feature
        every { cardRepository.save(any() as Card) } returns card
        every {
            gitService.createBranch(
                gitCredential,
                module1.name,
                feature.branchName
            )
        } returns Optional.of(feature.branchName)
        every {
            gitService.createBranch(
                gitCredential,
                module2.name,
                feature.branchName
            )
        } returns Optional.of(feature.branchName)
        every {
            gitService.findBranch(
                gitCredential,
                module1.name,
                feature.branchName
            )
        } returns Optional.of(feature.branchName)
        every {
            gitService.findBranch(
                gitCredential,
                module2.name,
                feature.branchName
            )
        } returns Optional.of(feature.branchName)


        val createdCard = cardService.create(cardRequest, applicationId)

        verify(exactly = 1) {
            cardColumnRepository.findByNameAndHypothesis(
                ColumnConstants.TO_DO_COLUMN_NAME,
                hypothesis
            )
        }
        verify(exactly = 1) { labelRepository.findAllById(labels) }
        verify(exactly = 2) { hypothesisRepository.findById(hypothesisId) }
        verify(exactly = 2) { userRepository.findById(authorId) }
        verify(exactly = 1) { moduleRepository.findById(modules[0]) }
        verify(exactly = 1) { moduleRepository.findById(modules[1]) }
        verify(exactly = 1) { featureRepository.save(any() as Feature) }
        verify(exactly = 1) { cardRepository.save(any() as Card) }
        verify(exactly = 1) {
            gitConfigurationRepository.findById(module1.gitConfiguration.id)
        }
        verify(exactly = 1) {
            gitConfigurationRepository.findById(module2.gitConfiguration.id)
        }
        verify(exactly = 2) { gitServiceMapper.getByType(GitServiceProvider.GITHUB) }
        verify(exactly = 0) { gitService.createBranch(gitCredential, module1.name, feature.branchName) }
        verify(exactly = 0) { gitService.createBranch(gitCredential, module2.name, feature.branchName) }

        assertNotNull(createdCard.id)
        assertEquals(cardRequest.name, createdCard.name)
        assertEquals(cardRequest.description, createdCard.description)
        assertEquals(cardColumn.id, createdCard.column.id)
        assertEquals(cardColumn.name, createdCard.column.name)
        assertEquals(cardRequest.authorId, createdCard.author.id)
        assertNotNull(createdCard.createdAt)
        assertEquals(cardRequest.labels.size, createdCard.labels.size)
        assertEquals(label.name, createdCard.labels[0].name)
        assertEquals(cardRequest.type, createdCard.type)
        assertNotNull(createdCard.feature)
        assertEquals(0, createdCard.comments.size)
        assertEquals(hypothesisId, createdCard.hypothesisId)
        assertEquals(0, createdCard.members.size)
        assertEquals(0, createdCard.index)
    }

    @Test
    fun `should create a new action card`() {
        val card = buildActionCard()

        every {
            cardColumnRepository.findByNameAndHypothesis(
                ColumnConstants.TO_DO_COLUMN_NAME,
                hypothesis
            )
        } returns Optional.of(cardColumn)
        every { labelRepository.findAllById(labels) } returns listOf(label)
        every { hypothesisRepository.findById(hypothesisId) } returns Optional.of(hypothesis)
        every { userRepository.findById(authorId) } returns Optional.of(user)
        every { cardRepository.save(any() as Card) } returns card

        val cardType = "ACTION"
        val createCardRequest = this.cardRequest.copy(type = cardType)
        val createdCard = cardService.create(createCardRequest, applicationId)

        verify(exactly = 1) {
            cardColumnRepository.findByNameAndHypothesis(
                ColumnConstants.TO_DO_COLUMN_NAME,
                hypothesis
            )
        }
        verify(exactly = 1) { labelRepository.findAllById(labels) }
        verify(exactly = 2) { hypothesisRepository.findById(hypothesisId) }
        verify(exactly = 1) { userRepository.findById(authorId) }
        verify(exactly = 1) { cardRepository.save(any() as Card) }

        assertNotNull(createdCard.id)
        assertEquals(cardRequest.name, createdCard.name)
        assertEquals(cardRequest.description, createdCard.description)
        assertEquals(cardColumn.id, createdCard.column.id)
        assertEquals(cardColumn.name, createdCard.column.name)
        assertEquals(cardRequest.authorId, createdCard.author.id)
        assertNotNull(createdCard.createdAt)
        assertEquals(cardRequest.labels.size, createdCard.labels.size)
        assertEquals(label.name, createdCard.labels[0].name)
        assertEquals(createCardRequest.type, createdCard.type)
        assertNull(createdCard.feature)
        assertEquals(0, createdCard.comments.size)
        assertEquals(hypothesisId, createdCard.hypothesisId)
        assertEquals(0, createdCard.members.size)
        assertEquals(0, createdCard.index)
    }

    @Test
    fun `should rollback created branches on error while creating new card`() {
        val card = buildSoftwareCard()

        every {
            cardColumnRepository.findByNameAndHypothesis(
                ColumnConstants.TO_DO_COLUMN_NAME,
                hypothesis
            )
        } returns Optional.of(cardColumn)
        every { labelRepository.findAllById(labels) } returns listOf(label)
        every { hypothesisRepository.findById(hypothesisId) } returns Optional.of(hypothesis)
        every { userRepository.findById(authorId) } returns Optional.of(user)
        every { moduleRepository.findById(modules[0]) } returns Optional.of(module1)
        every { moduleRepository.findById(modules[1]) } returns Optional.of(module2)
        every { featureRepository.save(any() as Feature) } returns feature
        every { cardRepository.save(any() as Card) } returns card

        every { gitServiceMapper.getByType(GitServiceProvider.GITHUB) } returns gitService

        every {
            gitService.findBranch(
                gitCredential,
                module1.name,
                feature.branchName
            )
        } returns Optional.ofNullable(null)
        every {
            gitService.findBranch(
                gitCredential,
                module2.name,
                feature.branchName
            )
        } returns Optional.ofNullable(null)

        every {
            gitService.createBranch(
                gitCredential,
                module1.name,
                feature.branchName
            )
        } returns Optional.of(feature.branchName)
        every { gitService.createBranch(gitCredential, module2.name, feature.branchName) } throws BusinessException.of(
            MooveErrorCode.GIT_ERROR_DUPLICATED_BRANCH
        )
        every { gitService.deleteBranch(gitCredential, module1.name, feature.branchName) } answers {}


        val e = assertFailsWith<BusinessException> { cardService.create(cardRequest, applicationId) }

        verify(exactly = 1) {
            cardColumnRepository.findByNameAndHypothesis(
                ColumnConstants.TO_DO_COLUMN_NAME,
                hypothesis
            )
        }
        verify(exactly = 1) { labelRepository.findAllById(labels) }
        verify(exactly = 2) { hypothesisRepository.findById(hypothesisId) }
        verify(exactly = 2) { userRepository.findById(authorId) }
        verify(exactly = 1) { moduleRepository.findById(modules[0]) }
        verify(exactly = 1) { moduleRepository.findById(modules[1]) }
        verify(exactly = 1) { featureRepository.save(any() as Feature) }
        verify(exactly = 1) { cardRepository.save(any() as Card) }
        verify(exactly = 2) {
            gitConfigurationRepository.findById(module1.gitConfiguration.id)
        }
        verify(exactly = 1) {
            gitConfigurationRepository.findById(module2.gitConfiguration.id)
        }
        verify(exactly = 5) { gitServiceMapper.getByType(GitServiceProvider.GITHUB) }
        verify(exactly = 1) { gitService.createBranch(gitCredential, module1.name, feature.branchName) }
        verify(exactly = 1) { gitService.createBranch(gitCredential, module2.name, feature.branchName) }
        verify(exactly = 1) { gitService.deleteBranch(gitCredential, module1.name, feature.branchName) }

        assertEquals(MooveErrorCode.GIT_ERROR_DUPLICATED_BRANCH.toString(), e.errorCode.toString())
    }

    @Test
    fun `should return repositories and branches map`() {
        val findBranchParam = FindBranchParam(listOf(module1.id, module2.id), branchName)

        every {
            moduleRepository.findAllByIdAndApplicationId(
                listOf(module1.id, module2.id),
                applicationId
            )
        } returns listOf(module1, module2)
        every { gitService.findBranch(gitCredential, module1.name, branchName) } returns
                Optional.of(branchName)
        every { gitService.findBranch(gitCredential, module2.name, branchName) } returns
                Optional.of(branchName)

        val repositoryBranchMap = cardService.findBranches(findBranchParam, applicationId)

        assertEquals(2, repositoryBranchMap.size)
        assertEquals(branchName, repositoryBranchMap[module1.name])
        assertEquals(branchName, repositoryBranchMap[module2.name])
    }

    @Test
    fun `should return empty map if branch does not exist in the repositories`() {
        val findBranchParam = FindBranchParam(listOf(module1.id, module2.id), branchName)

        every {
            moduleRepository.findAllByIdAndApplicationId(
                listOf(module1.id, module2.id),
                applicationId
            )
        } returns listOf(module1, module2)
        every { gitService.findBranch(gitCredential, module1.name, branchName) } throws
                BusinessException.of(MooveErrorCode.GIT_ERROR_BRANCH_NOT_FOUND)
        every { gitService.findBranch(gitCredential, module2.name, branchName) } throws
                BusinessException.of(MooveErrorCode.GIT_ERROR_BRANCH_NOT_FOUND)

        val repositoryBranchMap = cardService.findBranches(findBranchParam, applicationId)

        assertEquals(0, repositoryBranchMap.size)
    }

    @Test
    fun `should delete a card`() {
        val card = buildSoftwareCard()

        every { cardRepository.findByIdAndApplicationId(card.id, applicationId) } returns Optional.of(card)
        every { cardRepository.deleteLabelsRelationship(any()) } answers {}
        every { cardRepository.deleteMembersRelationship(any()) } answers {}
        every { cardRepository.delete(card) } answers {}
        every { gitService.deleteBranch(gitCredential, module1.name, card.feature.branchName) } answers {}
        every { gitService.deleteBranch(gitCredential, module2.name, card.feature.branchName) } answers {}

        cardService.delete(card.id, applicationId)

        verify(exactly = 1) { cardRepository.findByIdAndApplicationId(card.id, applicationId) }
        verify(exactly = 1) { cardRepository.delete(card) }
        verify(exactly = 1) { gitService.deleteBranch(gitCredential, module1.name, card.feature.branchName) }
        verify(exactly = 1) { gitService.deleteBranch(gitCredential, module2.name, card.feature.branchName) }
        verify(exactly = 1) {
            gitConfigurationRepository.findById(module1.gitConfiguration.id)
        }
        verify(exactly = 1) {
            gitConfigurationRepository.findById(module2.gitConfiguration.id)
        }
    }

    @Test
    fun `should not delete not found card`() {
        val card = buildSoftwareCard()

        every { cardRepository.findByIdAndApplicationId(card.id, applicationId) } returns Optional.empty()

        val e = assertFailsWith<NotFoundException> { cardService.delete(card.id, applicationId) }

        verify(exactly = 1) { cardRepository.findByIdAndApplicationId(card.id, applicationId) }
        verify(exactly = 0) { cardRepository.delete(card) }
        verify(exactly = 0) { gitService.deleteBranch(gitCredential, module1.name, card.feature.branchName) }
        verify(exactly = 0) { gitService.deleteBranch(gitCredential, module2.name, card.feature.branchName) }
        verify(exactly = 0) {
            gitConfigurationRepository.findById(module1.gitConfiguration.id)
        }
        verify(exactly = 0) {
            gitConfigurationRepository.findById(module2.gitConfiguration.id)
        }

        assertEquals(e.resource.resource, "card")
        assertEquals(e.resource.value, card.id)
    }

    @Test
    fun `should proceed card deletion on branch deletion errors`() {
        val card = buildSoftwareCard()

        every { cardRepository.findByIdAndApplicationId(card.id, applicationId) } returns Optional.of(card)
        every { cardRepository.deleteLabelsRelationship(any()) } answers {}
        every { cardRepository.deleteMembersRelationship(any()) } answers {}
        every { cardRepository.delete(card) } answers {}
        every { gitService.deleteBranch(gitCredential, module1.name, card.feature.branchName) } throws
                BusinessException.of(MooveErrorCode.GIT_ERROR_BRANCH_NOT_FOUND)
        every { gitService.deleteBranch(gitCredential, module2.name, card.feature.branchName) } answers {}

        cardService.delete(card.id, applicationId)

        verify(exactly = 1) { cardRepository.findByIdAndApplicationId(card.id, applicationId) }
        verify(exactly = 1) { cardRepository.delete(card) }
        verify(exactly = 1) { gitService.deleteBranch(gitCredential, module1.name, card.feature.branchName) }
        verify(exactly = 1) { gitService.deleteBranch(gitCredential, module2.name, card.feature.branchName) }
        verify(exactly = 1) {
            gitConfigurationRepository.findById(module1.gitConfiguration.id)
        }
        verify(exactly = 1) {
            gitConfigurationRepository.findById(module2.gitConfiguration.id)
        }
    }

    @Test
    fun `should update action card to feature card`() {
        val actionCard = buildActionCard()
        val softwareCard = buildSoftwareCard().copy(id = actionCard.id)

        every { cardRepository.findByIdAndApplicationId(actionCard.id, applicationId) } returns Optional.of(actionCard)
        every { labelRepository.findAllById(labels) } returns listOf(label)
        every { userRepository.findById(authorId) } returns Optional.of(user)
        every { moduleRepository.findByIdAndApplicationId(modules[0], applicationId) } returns Optional.of(module1)
        every { moduleRepository.findById(modules[0]) } returns Optional.of(module1)
        every { moduleRepository.findById(modules[1]) } returns Optional.of(module2)
        every { moduleRepository.findByIdAndApplicationId(modules[1], applicationId) } returns Optional.of(module2)
        every { featureRepository.save(any() as Feature) } returns feature
        every { cardRepository.save(any() as Card) } returns softwareCard
        every { cardRepository.deleteById(actionCard.id) } answers {}
        every {
            gitService.createBranch(
                gitCredential,
                module1.name,
                feature.branchName
            )
        } returns Optional.of(feature.branchName)
        every {
            gitService.createBranch(
                gitCredential,
                module2.name,
                feature.branchName
            )
        } returns Optional.of(feature.branchName)
        every {
            gitService.findBranch(
                gitCredential,
                module1.name,
                feature.branchName
            )
        } returns Optional.of(feature.branchName)
        every {
            gitService.findBranch(
                gitCredential,
                module2.name,
                feature.branchName
            )
        } returns Optional.of(feature.branchName)

        val updatedCard = cardService.update(actionCard.id, updateCardRequest, applicationId)

        verify(exactly = 1) { cardRepository.findByIdAndApplicationId(actionCard.id, applicationId) }
        verify(exactly = 1) { labelRepository.findAllById(labels) }
        verify(exactly = 1) { userRepository.findById(authorId) }
        verify(exactly = 1) { featureRepository.save(any() as Feature) }
        verify(exactly = 1) { cardRepository.save(any() as Card) }
        verify(exactly = 1) { cardRepository.deleteById(actionCard.id) }
        verify(exactly = 2) { gitServiceMapper.getByType(GitServiceProvider.GITHUB) }
        verify(exactly = 0) { gitService.createBranch(gitCredential, module1.name, feature.branchName) }
        verify(exactly = 0) { gitService.createBranch(gitCredential, module2.name, feature.branchName) }

        assertEquals(actionCard.id, updatedCard.id)
        assertEquals(updateCardRequest.name, updatedCard.name)
        assertEquals(updateCardRequest.description, updatedCard.description)
        assertEquals(cardColumn.id, updatedCard.column.id)
        assertEquals(cardColumn.name, updatedCard.column.name)
        assertEquals(cardRequest.authorId, updatedCard.author.id)
        assertNotNull(updatedCard.createdAt)
        assertEquals(cardRequest.labels.size, updatedCard.labels.size)
        assertEquals(label.name, updatedCard.labels[0].name)
        assertEquals(updateCardRequest.type, updatedCard.type)
        assertNotNull(updatedCard.feature)
        assertEquals(0, updatedCard.comments.size)
        assertEquals(hypothesisId, updatedCard.hypothesisId)
        assertEquals(0, updatedCard.members.size)
        assertEquals(0, updatedCard.index)
    }

    @Test
    fun `should update feature card to action card`() {
        val softwareCard = buildSoftwareCard()
        val actionCard = buildActionCard().copy(id = softwareCard.id)

        every {
            cardRepository.findByIdAndApplicationId(
                actionCard.id,
                applicationId
            )
        } returns Optional.of(softwareCard)
        every { labelRepository.findAllById(labels) } returns listOf(label)
        every { userRepository.findById(authorId) } returns Optional.of(user)
        every { moduleRepository.findByIdAndApplicationId(modules[0], applicationId) } returns Optional.of(module1)
        every { moduleRepository.findByIdAndApplicationId(modules[1], applicationId) } returns Optional.of(module2)
        every { cardRepository.save(any() as Card) } returns actionCard
        every { cardRepository.deleteById(softwareCard.id) } answers {}
        every {
            gitService.deleteBranch(
                gitCredential,
                module1.name,
                feature.branchName
            )
        } answers {}
        every {
            gitService.deleteBranch(
                gitCredential,
                module2.name,
                feature.branchName
            )
        } answers {}

        val updateRequest = updateCardRequest.copy(type = "ACTION")

        val updatedCard = cardService.update(softwareCard.id, updateRequest, applicationId)

        verify(exactly = 1) { cardRepository.findByIdAndApplicationId(softwareCard.id, applicationId) }
        verify(exactly = 1) { labelRepository.findAllById(labels) }
        verify(exactly = 1) { cardRepository.save(any() as Card) }
        verify(exactly = 1) { cardRepository.deleteById(softwareCard.id) }
        verify(exactly = 2) { gitServiceMapper.getByType(GitServiceProvider.GITHUB) }
        verify(exactly = 1) { gitService.deleteBranch(gitCredential, module1.name, feature.branchName) }
        verify(exactly = 1) { gitService.deleteBranch(gitCredential, module2.name, feature.branchName) }

        assertEquals(actionCard.id, updatedCard.id)
        assertEquals(updateCardRequest.name, updatedCard.name)
        assertEquals(updateCardRequest.description, updatedCard.description)
        assertEquals(cardColumn.id, updatedCard.column.id)
        assertEquals(cardColumn.name, updatedCard.column.name)
        assertEquals(cardRequest.authorId, updatedCard.author.id)
        assertNotNull(updatedCard.createdAt)
        assertEquals(cardRequest.labels.size, updatedCard.labels.size)
        assertEquals(label.name, updatedCard.labels[0].name)
        assertEquals(updateRequest.type, updatedCard.type)
        assertNull(updatedCard.feature)
        assertEquals(0, updatedCard.comments.size)
        assertEquals(hypothesisId, updatedCard.hypothesisId)
        assertEquals(0, updatedCard.members.size)
        assertEquals(0, updatedCard.index)
    }

    @Test
    fun `should update action card fields`() {
        val card = buildActionCard()

        every { cardRepository.findByIdAndApplicationId(card.id, applicationId) } returns Optional.of(card)
        every { labelRepository.findAllById(labels) } returns listOf(label)
        every { cardRepository.save(any() as Card) } returns card

        val updateCardName = "name"
        val updateCardDescription = "card description"
        val updateCardType = "ACTION"
        val updateCardRequest = this.updateCardRequest.copy(
            name = updateCardName,
            description = updateCardDescription,
            type = updateCardType
        )
        val updatedCard = cardService.update(card.id, updateCardRequest, applicationId)

        verify(exactly = 1) { cardRepository.findByIdAndApplicationId(card.id, applicationId) }
        verify(exactly = 1) { labelRepository.findAllById(labels) }
        verify(exactly = 1) { cardRepository.save(any() as Card) }

        assertEquals(card.id, updatedCard.id)
        assertEquals(updateCardRequest.name, updatedCard.name)
        assertEquals(updateCardRequest.description, updatedCard.description)
        assertEquals(cardColumn.id, updatedCard.column.id)
        assertEquals(cardColumn.name, updatedCard.column.name)
        assertEquals(cardRequest.authorId, updatedCard.author.id)
        assertNotNull(updatedCard.createdAt)
        assertEquals(cardRequest.labels.size, updatedCard.labels.size)
        assertEquals(label.name, updatedCard.labels[0].name)
        assertEquals(updateCardRequest.type, updatedCard.type)
        assertNull(updatedCard.feature)
        assertEquals(0, updatedCard.comments.size)
        assertEquals(hypothesisId, updatedCard.hypothesisId)
        assertEquals(0, updatedCard.members.size)
        assertEquals(0, updatedCard.index)

    }

    @Test
    fun `should update feature card fields`() {
        val card = buildSoftwareCard()

        every { cardRepository.findByIdAndApplicationId(card.id, applicationId) } returns Optional.of(card)
        every { labelRepository.findAllById(labels) } returns listOf(label)
        every { cardRepository.save(any() as Card) } returns card.copy(name = "name2", description = "description2")
        every { featureRepository.save(any() as Feature) } returns feature
        every {
            moduleRepository.findByIdAndApplicationId(
                any() as String,
                any() as String
            )
        } returns Optional.ofNullable(module1)
        every { moduleRepository.findById(any() as String) } returns Optional.ofNullable(module1)
        every {
            gitService.createBranch(
                gitCredential,
                module1.name,
                feature.branchName
            )
        } returns Optional.of(feature.branchName)
        every {
            gitService.createBranch(
                gitCredential,
                module2.name,
                feature.branchName
            )
        } returns Optional.of(feature.branchName)
        every {
            gitService.findBranch(
                gitCredential,
                module1.name,
                feature.branchName
            )
        } returns Optional.of(feature.branchName)
        every {
            gitService.findBranch(
                gitCredential,
                module2.name,
                feature.branchName
            )
        } returns Optional.of(feature.branchName)

        val updateCardName = "name2"
        val updateCardDescription = "description2"
        val updateCardRequest = this.updateCardRequest.copy(name = updateCardName, description = updateCardDescription)
        val updatedCard = cardService.update(card.id, updateCardRequest, applicationId)

        verify(exactly = 1) { cardRepository.findByIdAndApplicationId(card.id, applicationId) }
        verify(exactly = 1) { labelRepository.findAllById(labels) }
        verify(exactly = 1) { cardRepository.save(any() as Card) }
        verify(exactly = 0) { gitService.createBranch(any(), any(), any()) }

        assertEquals(card.id, updatedCard.id)
        assertEquals(updateCardRequest.name, updatedCard.name)
        assertEquals(updateCardRequest.description, updatedCard.description)
        assertEquals(cardColumn.id, updatedCard.column.id)
        assertEquals(cardColumn.name, updatedCard.column.name)
        assertEquals(cardRequest.authorId, updatedCard.author.id)
        assertNotNull(updatedCard.createdAt)
        assertEquals(cardRequest.labels.size, updatedCard.labels.size)
        assertEquals(label.name, updatedCard.labels[0].name)
        assertEquals(updateCardRequest.type, updatedCard.type)
        assertNotNull(updatedCard.feature)
        assertEquals(0, updatedCard.comments.size)
        assertEquals(hypothesisId, updatedCard.hypothesisId)
        assertEquals(0, updatedCard.members.size)
        assertEquals(0, updatedCard.index)

    }

    @Test
    fun `should find card by id`() {
        val card = buildActionCard()

        every { cardRepository.findByIdAndApplicationId(card.id, applicationId) } returns Optional.of(card)

        val cardFound = cardService.findById(card.id, applicationId)

        verify(exactly = 1) { cardRepository.findByIdAndApplicationId(card.id, applicationId) }

        assertEquals(card.id, cardFound.id)
        assertEquals(card.name, cardFound.name)
        assertEquals(card.description, cardFound.description)
        assertEquals(card.column.id, cardFound.column.id)
        assertEquals(card.column.name, cardFound.column.name)
        assertEquals(card.author.id, cardFound.author.id)
        assertEquals(card.labels.size, cardFound.labels.size)
        assertEquals(label.name, cardFound.labels[0].name)
        assertEquals(card.type.name, cardFound.type)
        assertNull(cardFound.feature)
        assertEquals(hypothesisId, cardFound.hypothesisId)
        assertEquals(0, cardFound.comments.size)
        assertEquals(0, cardFound.members.size)
        assertEquals(0, cardFound.index)

    }

    @Test
    fun `should find all cards`() {
        val card1 = buildActionCard()
        val card2 = buildActionCard()
        val card3 = buildActionCard()

        val pageable = mockkClass(Pageable::class)
        val pagedCards: Page<Card> = PageImpl(listOf(card1, card2, card3))

        every { cardRepository.findAllByApplicationId(applicationId, pageable) } returns pagedCards

        val cards = cardService.findAll(pageable, applicationId)

        verify(exactly = 1) { cardRepository.findAllByApplicationId(applicationId, pageable) }

        assertEquals(3, cards.totalElements)
        assertEquals(3, cards.numberOfElements)
        assertEquals(3, cards.content.size)
        assertEquals(1, cards.totalPages)

        assertEquals(card1.id, cards.content[0].id)
        assertEquals(card1.name, cards.content[0].name)
        assertEquals(card1.description, cards.content[0].description)
        assertEquals(card1.type.name, cards.content[0].type)

        assertEquals(card2.id, cards.content[1].id)
        assertEquals(card2.name, cards.content[1].name)
        assertEquals(card2.description, cards.content[1].description)
        assertEquals(card2.type.name, cards.content[1].type)

        assertEquals(card3.id, cards.content[2].id)
        assertEquals(card3.name, cards.content[2].name)
        assertEquals(card3.description, cards.content[2].description)
        assertEquals(card3.type.name, cards.content[2].type)
    }

    @Test
    fun `should add comments to a card`() {
        val card = buildActionCard()
        val comment = buildComment()
        val addCommentRequest = buildAddCommentRequest()

        every { cardRepository.findByIdAndApplicationId(card.id, applicationId) } returns Optional.of(card)
        every { userRepository.findById(authorId) } returns Optional.of(user)
        every { commentRepository.save(any() as Comment) } returns comment
        every { cardRepository.save(any() as Card) } returns card

        val commentedCard = cardService.addComment(card.id, addCommentRequest, applicationId)

        verify(exactly = 1) { cardRepository.findByIdAndApplicationId(card.id, applicationId) }
        verify(exactly = 1) { userRepository.findById(authorId) }
        verify(exactly = 1) { commentRepository.save(any() as Comment) }
        verify(exactly = 1) { cardRepository.save(any() as Card) }

        assertEquals(card.id, commentedCard.id)
        assertEquals(card.name, commentedCard.name)
        assertEquals(card.description, commentedCard.description)
        assertEquals(card.type.name, commentedCard.type)
        assertNull(commentedCard.feature)
        assertEquals(1, commentedCard.comments.size)
        assertEquals("commentId", commentedCard.comments[0].id)
        assertEquals(user.id, commentedCard.comments[0].author.id)
        assertEquals(user.name, commentedCard.comments[0].author.name)
        assertEquals(user.email, commentedCard.comments[0].author.email)
        assertNotNull(commentedCard.comments[0].createdAt)
        assertEquals("comment", commentedCard.comments[0].comment)
        assertEquals(hypothesisId, commentedCard.hypothesisId)
        assertEquals(0, commentedCard.members.size)
        assertEquals(0, commentedCard.index)
    }

    @Test
    fun `should add members to a card`() {
        val card = buildActionCard()
        val addMemberRequest = buildAddMemberRequest()

        every { cardRepository.findByIdAndApplicationId(card.id, applicationId) } returns Optional.of(card)
        every { userRepository.findById(authorId) } returns Optional.of(user)
        every { userRepository.findById("fake-author-id") } returns Optional.of(
            user.copy(
                id = "fake-author-id",
                name = "add-member-author-name"
            )
        )
        every { cardRepository.save(any() as Card) } returns card

        val cardWithMember = cardService.addMembers(card.id, addMemberRequest, applicationId)

        verify(exactly = 1) { cardRepository.findByIdAndApplicationId(card.id, applicationId) }
        verify(exactly = 1) { userRepository.findById(authorId) }
        verify(exactly = 1) { cardRepository.save(any() as Card) }

        assertEquals(card.id, cardWithMember.id)
        assertEquals(card.name, cardWithMember.name)
        assertEquals(card.description, cardWithMember.description)
        assertEquals(card.type.name, cardWithMember.type)
        assertNull(cardWithMember.feature)
        assertEquals(0, cardWithMember.comments.size)
        assertEquals(hypothesisId, cardWithMember.hypothesisId)
        assertEquals(1, cardWithMember.members.size)
        assertEquals(user.id, cardWithMember.members[0].id)
        assertEquals(user.email, cardWithMember.members[0].email)
        assertEquals(user.name, cardWithMember.members[0].name)
        assertEquals(0, cardWithMember.index)
    }

    @Test
    fun `should remove member from card`() {
        val card = buildActionCard().copy(members = mutableListOf(user))
        val removeMemberId = user.id

        every { cardRepository.findByIdAndApplicationId(card.id, applicationId) } returns Optional.of(card)
        every { cardRepository.save(any() as Card) } returns card

        val cardWithMember = cardService.findById(card.id, applicationId)

        assertEquals(1, cardWithMember.members.size)
        assertEquals(user.id, cardWithMember.members[0].id)
        assertEquals(user.name, cardWithMember.members[0].name)
        assertEquals(user.email, cardWithMember.members[0].email)

        val cardWithoutMember = cardService.removeMember(card.id, removeMemberId, applicationId)

        verify(exactly = 2) { cardRepository.findByIdAndApplicationId(card.id, applicationId) }
        verify(exactly = 1) { cardRepository.save(any() as Card) }

        assertEquals(card.id, cardWithoutMember.id)
        assertEquals(card.name, cardWithoutMember.name)
        assertEquals(card.description, cardWithoutMember.description)
        assertEquals(card.type.name, cardWithoutMember.type)
        assertNull(cardWithoutMember.feature)
        assertEquals(0, cardWithoutMember.comments.size)
        assertEquals(hypothesisId, cardWithoutMember.hypothesisId)
        assertEquals(0, cardWithoutMember.members.size)
        assertEquals(0, cardWithoutMember.index)
    }

    @Test
    fun `should archive action card`() {
        val card = buildActionCard()

        every { cardRepository.findByIdAndApplicationId(card.id, applicationId) } returns Optional.of(card)
        every { cardRepository.save(any() as Card) } returns card.copy(status = CardStatus.ARCHIVED)

        cardService.archiveCard(card.id, applicationId)

        verify(exactly = 1) { cardRepository.findByIdAndApplicationId(card.id, applicationId) }
        verify(exactly = 1) { cardRepository.save(card.copy(status = CardStatus.ARCHIVED)) }
    }

    @Test
    fun `should archive software card`() {
        val card = buildSoftwareCard()

        every { cardRepository.findByIdAndApplicationId(card.id, applicationId) } returns Optional.of(card)
        every { cardRepository.save(any() as Card) } returns card.copy(status = CardStatus.ARCHIVED)

        cardService.archiveCard(card.id, applicationId)

        verify(exactly = 1) { cardRepository.findByIdAndApplicationId(card.id, applicationId) }
        verify(exactly = 1) { cardRepository.save(card.copy(status = CardStatus.ARCHIVED)) }
    }

    fun buildAddMemberRequest(): AddMemberRequest {
        return AddMemberRequest(authorId = "fake-author-id", memberIds = listOf(user.id))
    }

    fun buildComment(): Comment {
        return Comment(
            id = "commentId",
            author = user,
            createdAt = LocalDateTime.now(),
            comment = "comment"
        )
    }

    fun buildAddCommentRequest(): AddCommentRequest {
        return AddCommentRequest(
            authorId = authorId,
            comment = "comment"
        )
    }

    fun buildCreateCardRequest(): CreateCardRequest {
        return CreateCardRequest(
            cardName, cardDescription, authorId, "FEATURE",
            labels, hypothesisId, branchName, modules
        )
    }

    fun buildUpdateCardRequest(): UpdateCardRequest {
        return UpdateCardRequest(
            cardName, cardDescription, labels, "FEATURE", branchName, modules
        )
    }

    fun buildActionCard(): ActionCard =
        ActionCard(
            "id", cardName, cardDescription, ActionCardType.ACTION, cardColumn, user, LocalDateTime.now(),
            listOf(label), mutableListOf(), hypothesis, CardStatus.ACTIVE, mutableListOf(), 0, applicationId
        )

    fun buildSoftwareCard(): SoftwareCard =
        SoftwareCard(
            "id",
            cardName,
            cardDescription,
            cardColumn,
            SoftwareCardType.FEATURE,
            user,
            LocalDateTime.now(),
            createFeature(),
            listOf(label),
            mutableListOf(),
            hypothesis,
            CardStatus.ACTIVE,
            mutableListOf(),
            0,
            applicationId
        )


    private fun buildCredentialConfig(type: CredentialConfigurationType): CredentialConfiguration =
        CredentialConfiguration(UUID.randomUUID().toString(), "name", type, LocalDateTime.now(), user, applicationId)

    private fun createFeature(): Feature =
        Feature(
            "id",
            "featureName",
            "feature-branch",
            user,
            LocalDateTime.now(),
            listOf(module1, module2),
            applicationId
        )


    private fun buildGitConfiguration(gitConfigurationId: String): GitConfiguration =
        GitConfiguration(
            id = gitConfigurationId,
            name = "name",
            createdAt = LocalDateTime.now(),
            author = user,
            applicationId = applicationId,
            credentials = gitCredential
        )

    private fun buildGitCredential(provider: GitServiceProvider) =
        GitCredentials("address", "username", "password", null, provider)

    private fun buildHypothesis() =
        Hypothesis(
            hypothesisId,
            "HYPE",
            "desc",
            user,
            LocalDateTime.now(),
            problem,
            emptyList(),
            listOf(label),
            emptyList(),
            emptyList(),
            applicationId
        )

}
