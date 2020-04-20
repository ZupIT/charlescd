/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.moove.service

import br.com.zup.darwin.commons.constants.ColumnConstants
import br.com.zup.darwin.entity.*
import br.com.zup.darwin.moove.request.hypothesis.CreateHypothesisRequest
import br.com.zup.darwin.moove.request.hypothesis.UpdateHypothesisRequest
import br.com.zup.darwin.repository.*
import br.com.zup.exception.handler.exception.NotFoundException
import io.mockk.every
import io.mockk.mockkClass
import io.mockk.verify
import org.junit.Test
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.PageRequest
import java.time.LocalDateTime
import java.util.*
import kotlin.test.assertEquals
import kotlin.test.assertNotEquals
import kotlin.test.assertNotNull

class HypothesisServiceTest {

    private val todoColumnId = "todo-column-id"
    private val doingColumnId = "doing-column-id"
    private val readyToGoColumnId = "ready-to-go-column-id"
    private val buildsColumnId = "builds-column-id"
    private val deployedReleasesColumnId = "deployed-releases-column-id"
    private val applicationId = "applicationId"

    private val user = User("userId", "username", "email", "url", listOf(), LocalDateTime.now())

    private val helmRepository = "http://github.com"

    private val problem = Problem(
        id = "problemId", name = "problemName", createdAt = LocalDateTime.now(), author = user,
        description = "problem description", applicationId = "application-id"
    )

    private val hypothesis = Hypothesis(
        id = "id",
        name = "name",
        description = "description",
        author = user,
        createdAt = LocalDateTime.now(),
        problem = problem,
        builds = emptyList(),
        applicationId = applicationId
    )

    private val cardColumnToDo = CardColumn(
        id = todoColumnId,
        name = ColumnConstants.TO_DO_COLUMN_NAME,
        hypothesis = hypothesis,
        applicationId = applicationId
    )
    private val cardColumnDoing = CardColumn(
        id = doingColumnId,
        name = ColumnConstants.DOING_COLUMN_NAME,
        hypothesis = hypothesis,
        applicationId = applicationId
    )
    private val cardColumnReadyToGo = CardColumn(
        id = readyToGoColumnId,
        name = ColumnConstants.READY_TO_GO_COLUMN_NAME,
        hypothesis = hypothesis,
        applicationId = applicationId
    )
    private val cardColumnBuilds = CardColumn(
        id = buildsColumnId,
        name = ColumnConstants.BUILDS_COLUMN_NAME,
        hypothesis = hypothesis,
        applicationId = applicationId
    )
    private val cardColumnDeployedReleases = CardColumn(
        id = deployedReleasesColumnId,
        name = ColumnConstants.DEPLOYED_RELEASES_COLUMN_NAME,
        hypothesis = hypothesis,
        applicationId = applicationId
    )

    private val gitConfiguration = getGitConfiguration()

    private val component = mockkClass(Component::class)
    private val label = Label("labelId", "Label Name", LocalDateTime.now(), user, "BAADD")

    private val module1 = Module(
        "name",
        "repo1/owner1",
        "https://github.com/repo1/owner1",
        LocalDateTime.now(),
        helmRepository,
        user,
        listOf(label),
        listOf(component),
        applicationId,
        gitConfiguration,
        "k8s-id1",
        "registry-id1"
    )

    private val component2 = Component(
        id = "teste", name = "teste", contextPath = "Teste", port = null,
        healthCheck = null, createdAt = LocalDateTime.now(), module = module1, artifacts = emptyList(),
        applicationId = applicationId
    )

    private val module2 = Module(
        id = "ModuleTest", name = "ModuleTest", gitRepositoryAddress = "test", helmRepository = "Test",
        createdAt = LocalDateTime.now(), author = user, labels = emptyList(), gitConfiguration = gitConfiguration,
        components = listOf(component2), applicationId = "applicationTest", cdConfigurationId = "k8s-id1",
        registryConfigurationId = "registry-id1"
    )

    private val feature = Feature(
        "featureId", "featureName", "featureBranch",
        user, LocalDateTime.now(), listOf(module2), applicationId
    )

    private val circle = Circle(
        id = "circleId_1", name = "circleName", author = user, createdAt = LocalDateTime.now(),
        matcherType = MatcherType.SIMPLE_KV, reference = "Reference"
    )

    private val actionCard = ActionCard(
        id = "cardId", name = "Card Name", description = "Description",
        column = cardColumnToDo, author = user,
        createdAt = LocalDateTime.now(), labels = listOf(label), hypothesis = hypothesis,
        status = CardStatus.ACTIVE, type = ActionCardType.ACTION, applicationId = applicationId
    )

    private val hypothesisRepository: HypothesisRepository = mockkClass(HypothesisRepository::class)
    private val labelRepository: LabelRepository = mockkClass(LabelRepository::class)
    private val userRepository: UserRepository = mockkClass(UserRepository::class)
    private val problemRepository: ProblemRepository = mockkClass(ProblemRepository::class)
    private val cardColumnRepository: CardColumnRepository = mockkClass(CardColumnRepository::class)
    private val circleRepository: CircleRepository = mockkClass(CircleRepository::class)
    private val cardRepository: CardRepository = mockkClass(CardRepository::class)
    private val deploymentRepository: DeploymentRepository = mockkClass(DeploymentRepository::class)

    private val hypothesisService: HypothesisService = HypothesisService(
        hypothesisRepository, labelRepository,
        userRepository, problemRepository, cardColumnRepository, circleRepository, cardRepository, deploymentRepository
    )

    @Test(expected = NotFoundException::class)
    fun `when trying to find validated builds by hypothesis id, if there is no hypothesis should throw exception`() {
        val hypothesisId = "id"

        every { hypothesisRepository.findByIdAndApplicationId(hypothesisId, applicationId) } returns Optional.empty()

        hypothesisService.findValidatedBuildsByHypothesisId(hypothesisId, applicationId)
    }

    @Test
    fun `when trying to find validated builds by hypothesis id, should return them`() {
        val build = Build(
            id = "75ce3e2d-d0fd-4ba1-8eda-a2d0c08df2b3",
            author = user,
            createdAt = LocalDateTime.now(),
            features = listOf(feature),
            tag = "TAG",
            status = BuildStatus.VALIDATED,
            applicationId = applicationId
        )

        val hypothesis = Hypothesis(
            id = "hypothesisId", name = "name", description = "description",
            author = user, createdAt = LocalDateTime.now(), problem = problem, builds = listOf(build),
            applicationId = applicationId
        )

        every { hypothesisRepository.findByIdAndApplicationId(hypothesis.id, applicationId) } returns Optional.of(
            hypothesis
        )

        val listOfSimpleBuildRepresentation =
            hypothesisService.findValidatedBuildsByHypothesisId(hypothesis.id, applicationId)

        assertNotNull(listOfSimpleBuildRepresentation)
        assertEquals(1, listOfSimpleBuildRepresentation.size)
        assertEquals(build.id, listOfSimpleBuildRepresentation[0].id)
        assertEquals(build.status.name, listOfSimpleBuildRepresentation[0].status)
    }

    @Test
    fun `when finding any hypothesis if there are hypotheses should return everything`() {

        val build = Build(
            id = "75ce3e2d-d0fd-4ba1-8eda-a2d0c08df2b3",
            author = user,
            createdAt = LocalDateTime.now(),
            features = listOf(feature),
            tag = "TAG",
            status = BuildStatus.VALIDATED,
            applicationId = applicationId
        )
        val pageRequest = PageRequest.of(0, 10)

        val hypothesis = Hypothesis(
            id = "hypothesisId",
            name = "name",
            description = "description",
            author = user,
            createdAt = LocalDateTime.now(),
            problem = problem,
            builds = listOf(build),
            applicationId = applicationId
        )

        val hypothesis2 = Hypothesis(
            id = "hypothesisId", name = "teste", description = "Teste", author = user,
            createdAt = LocalDateTime.now(), problem = problem, builds = listOf(build), applicationId = applicationId
        )

        val page = PageImpl<Hypothesis>(listOf(hypothesis, hypothesis2), pageRequest, 1)

        every { hypothesisRepository.findAllByApplicationId(applicationId, pageRequest) } returns page

        val listOfAll = hypothesisService.findAll(applicationId, pageRequest)

        verify(exactly = 1) { hypothesisRepository.findAllByApplicationId(applicationId, pageRequest) }

        assertNotNull(listOfAll)
        assertEquals(2, listOfAll.content.size)
        assertEquals(hypothesis.id, listOfAll.content[0].id)
        assertEquals(hypothesis2.name, listOfAll.content[1].name)

    }

    @Test
    fun `when listing all hypothesis, if there is no one should return empty list`() {

        val pageRequest = PageRequest.of(0, 10)
        val page = PageImpl<Hypothesis>(listOf(), pageRequest, 1)

        every { hypothesisRepository.findAllByApplicationId(applicationId, pageRequest) } returns page

        val listOfAll = hypothesisService.findAll(applicationId, pageRequest)

        verify(exactly = 1) { hypothesisRepository.findAllByApplicationId(applicationId, pageRequest) }

        assertNotNull(listOfAll)
        assertEquals(0, listOfAll.content.size)

    }

    @Test
    fun `when trying to find hypothesis by id, if it exists on the database should return it`() {

        val hypothesis = Hypothesis(
            id = "f8b723f0-2208-44ba-965b-eb5d5354b18a",
            name = "name",
            description = "description",
            author = user,
            createdAt = LocalDateTime.now(),
            problem = problem,
            cards = emptyList(),
            labels = emptyList(),
            builds = emptyList(),
            circles = emptyList(),
            applicationId = "8c64099f-cc6c-45bd-ba4a-41cbe64c36ac"

        )
        every {
            hypothesisRepository.findByIdAndApplicationId(
                hypothesis.id,
                hypothesis.applicationId
            )
        } returns Optional.of(hypothesis)

        val resultHypothesisFindById = hypothesisService.findHypothesisById(hypothesis.id, hypothesis.applicationId)

        assertNotNull(resultHypothesisFindById)
        assertEquals(hypothesis.id, resultHypothesisFindById.id)
        verify(exactly = 1) { hypothesisRepository.findByIdAndApplicationId(hypothesis.id, hypothesis.applicationId) }
    }

    @Test(expected = NotFoundException::class)
    fun `when trying to find hypothesis by id, if id does not exist on the database should throw exception`() {
        val hypothesis = Hypothesis(
            id = "f8b723f0-2208-44ba-965b-eb5d5354b18a",
            name = "name",
            description = "description",
            author = user,
            createdAt = LocalDateTime.now(),
            problem = problem,
            cards = emptyList(),
            labels = emptyList(),
            builds = emptyList(),
            circles = emptyList(),
            applicationId = "8c64099f-cc6c-45bd-ba4a-41cbe64c36ac"

        )

        every {
            hypothesisRepository.findByIdAndApplicationId(
                hypothesis.id,
                hypothesis.applicationId
            )
        } returns Optional.empty()

        hypothesisService.findHypothesisById(hypothesis.id, hypothesis.applicationId)
        verify(exactly = 1) { hypothesisRepository.findByIdAndApplicationId(hypothesis.id, hypothesis.applicationId) }
    }

    @Test
    fun `when trying to update hypothesis, if it exists on the database should do and return it`() {
        val hypothesis = Hypothesis(
            id = "f8b723f0-2208-44ba-965b-eb5d5354b18a",
            name = "name",
            description = "description",
            author = user,
            createdAt = LocalDateTime.now(),
            problem = problem,
            cards = emptyList(),
            labels = emptyList(),
            builds = emptyList(),
            circles = emptyList(),
            applicationId = "8c64099f-cc6c-45bd-ba4a-41cbe64c36ac"
        )

        val updatedHypothesis = Hypothesis(
            id = "f8b723f0-2208-44ba-965b-eb5d5354b18a",
            name = "nameUpdate",
            description = "descriptionUpdate",
            author = user,
            createdAt = LocalDateTime.now(),
            problem = problem,
            cards = emptyList(),
            labels = emptyList(),
            builds = emptyList(),
            circles = emptyList(),
            applicationId = "8c64099f-cc6c-45bd-ba4a-41cbe64c36ac"
        )
        val updateHypothesisRequest = UpdateHypothesisRequest(updatedHypothesis.name, updatedHypothesis.description)

        every {
            hypothesisRepository.findByIdAndApplicationId(
                hypothesis.id,
                hypothesis.applicationId
            )
        } returns Optional.of(updatedHypothesis)
        every { hypothesisRepository.save(updatedHypothesis) } returns updatedHypothesis

        val testOfUpdateHypotese =
            hypothesisService.update(hypothesis.id, updateHypothesisRequest, hypothesis.applicationId)

        verify(exactly = 1) { hypothesisRepository.findByIdAndApplicationId(hypothesis.id, hypothesis.applicationId) }
        verify(exactly = 1) { hypothesisRepository.save(updatedHypothesis) }
        assertNotNull(testOfUpdateHypotese)
        assertNotEquals(hypothesis.name, testOfUpdateHypotese.name)

    }

    @Test(expected = NotFoundException::class)
    fun `when trying to update hypothesis, if id does not exist on the database should throw exception`() {
        val hypothesis = Hypothesis(
            id = "f8b723f0-2208-44ba-965b-eb5d5354b18a",
            name = "name",
            description = "description",
            author = user,
            createdAt = LocalDateTime.now(),
            problem = problem,
            cards = emptyList(),
            labels = emptyList(),
            builds = emptyList(),
            circles = emptyList(),
            applicationId = "8c64099f-cc6c-45bd-ba4a-41cbe64c36ac"
        )

        val updatedHypothesis = Hypothesis(
            id = "f8b723f0-2208-44ba-965b-eb5d5354b18a",
            name = "nameUpdate",
            description = "descriptionUpdate",
            author = user,
            createdAt = LocalDateTime.now(),
            problem = problem,
            cards = emptyList(),
            labels = emptyList(),
            builds = emptyList(),
            circles = emptyList(),
            applicationId = "8c64099f-cc6c-45bd-ba4a-41cbe64c36ac"
        )
        val updateHypothesisRequest = UpdateHypothesisRequest(updatedHypothesis.name, updatedHypothesis.description)

        every {
            hypothesisRepository.findByIdAndApplicationId(
                hypothesis.id,
                hypothesis.applicationId
            )
        } returns Optional.empty()

        hypothesisService.update(hypothesis.id, updateHypothesisRequest, hypothesis.applicationId)

        verify(exactly = 1) {
            hypothesisRepository.findByIdAndApplicationId(
                hypothesis.id,
                hypothesis.applicationId
            )
        }

    }

    @Test
    fun `when trying to find validated builds by hypothesis id, if there is no build should return empty list`() {
        every { hypothesisRepository.findByIdAndApplicationId(hypothesis.id, applicationId) } returns Optional.of(
            hypothesis
        )

        val listOfSimpleBuildRepresentation =
            hypothesisService.findValidatedBuildsByHypothesisId(hypothesis.id, applicationId)

        assertNotNull(listOfSimpleBuildRepresentation)
        assertEquals(0, listOfSimpleBuildRepresentation.size)
    }

    @Test
    fun `when trying to create a new hypothesis, should do it successfully`() {

        val name = "Test"
        val description = "Description Test"
        val problemId = "f476799e-5a2c-11ea-82b4-0242ac130003"
        val authorId = "204a5dfa-0ea1-4a45-bc51-12933ef92d42"
        val labels: List<String> = emptyList()
        val testCreatedHypothesisRequest = CreateHypothesisRequest(name, description, authorId, problemId, labels)
        val applicationId = "337da7e5-2ca4-410f-aa78-44c93b2cbb9d"

        val hypothesis = Hypothesis(
            "739562ae-5991-11ea-8e2d-0242ac130003", name, description, user, LocalDateTime.now(), problem,
            emptyList(), emptyList(), emptyList(), emptyList(), applicationId
        )

        every { userRepository.findById(authorId) } returns Optional.of(user)
        every { problemRepository.findById(problemId) } returns Optional.of(problem)
        every { hypothesisRepository.save(any() as Hypothesis) } returns hypothesis
        every { cardColumnRepository.saveAll(any() as List<CardColumn>) } returns emptyList()

        val hypothesisCreated = hypothesisService.create(testCreatedHypothesisRequest, applicationId)

        verify(exactly = 1) { userRepository.findById(authorId) }
        verify(exactly = 1) { problemRepository.findById(problemId) }
        verify(exactly = 1) { hypothesisRepository.save(any() as Hypothesis) }
        verify(exactly = 1) { cardColumnRepository.saveAll(any() as List<CardColumn>) }

        assertNotNull(hypothesisCreated)
        assertEquals(hypothesis.id, hypothesisCreated.id)

    }

    @Test(expected = NotFoundException::class)
    fun `when trying to create a new hypothesis, if user id does not exist on the database should throw exception`() {
        val name = "Test"
        val description = "Description Test"
        val problemId = "f476799e-5a2c-11ea-82b4-0242ac130003"
        val authorId = "204a5dfa-0ea1-4a45-bc51-12933ef92d42"
        val labels: List<String> = emptyList()
        val testCreatedHypothesisRequest = CreateHypothesisRequest(name, description, authorId, problemId, labels)
        val applicationId = "337da7e5-2ca4-410f-aa78-44c93b2cbb9d"
        val hypothesis = Hypothesis(
            "739562ae-5991-11ea-8e2d-0242ac130003", name, description, user, LocalDateTime.now(), problem,
            emptyList(), emptyList(), emptyList(), emptyList(), applicationId
        )
        every { userRepository.findById(authorId) } returns Optional.empty()
        every { problemRepository.findById(problemId) } returns Optional.of(problem)
        every { hypothesisRepository.save(any() as Hypothesis) } returns hypothesis

        hypothesisService.create(testCreatedHypothesisRequest, applicationId)
        verify(exactly = 1) { userRepository.findById(authorId) }
        verify(exactly = 1) { problemRepository.findById(problemId) }
        verify(exactly = 1) { hypothesisRepository.save(any() as Hypothesis) }
    }

    @Test(expected = NotFoundException::class)
    fun `when trying to create a new hypothesis, if problem id does not exist on the database should throw exception`() {
        val name = "Test"
        val description = "Description Test"
        val problemId = "f476799e-5a2c-11ea-82b4-0242ac130003"
        val authorId = "204a5dfa-0ea1-4a45-bc51-12933ef92d42"
        val labels: List<String> = emptyList()
        val testCreatedHypothesisRequest = CreateHypothesisRequest(name, description, authorId, problemId, labels)
        val applicationId = "337da7e5-2ca4-410f-aa78-44c93b2cbb9d"
        val hypothesis = Hypothesis(
            "739562ae-5991-11ea-8e2d-0242ac130003", name, description, user, LocalDateTime.now(), problem,
            emptyList(), emptyList(), emptyList(), emptyList(), applicationId
        )
        every { userRepository.findById(authorId) } returns Optional.of(user)
        every { problemRepository.findById(problemId) } returns Optional.empty()
        every { hypothesisRepository.save(any() as Hypothesis) } returns hypothesis

        hypothesisService.create(testCreatedHypothesisRequest, applicationId)
        verify(exactly = 1) { userRepository.findById(authorId) }
        verify(exactly = 1) { problemRepository.findById(problemId) }
        verify(exactly = 1) { hypothesisRepository.save(any() as Hypothesis) }
    }

    @Test
    fun `when trying to delete hypothesis, if it exists on the database it should delete it`() {

        val hypothesis = Hypothesis(
            id = "f8b723f0-2208-44ba-965b-eb5d5354b18a",
            name = "name",
            description = "description",
            author = user,
            createdAt = LocalDateTime.now(),
            problem = problem,
            cards = emptyList(),
            labels = emptyList(),
            builds = emptyList(),
            circles = emptyList(),
            applicationId = "8c64099f-cc6c-45bd-ba4a-41cbe64c36ac"
        )

        every {
            hypothesisRepository.findByIdAndApplicationId(
                hypothesis.id,
                hypothesis.applicationId
            )
        } returns Optional.of(hypothesis)
        every { hypothesisRepository.delete(hypothesis) } answers {}

        val deletedAnswer = hypothesisService.delete(hypothesis.id, hypothesis.applicationId)

        verify(exactly = 1) { hypothesisRepository.delete(hypothesis) }
        verify(exactly = 1) { hypothesisRepository.delete(hypothesis) }
        assertNotNull(deletedAnswer)

    }

    @Test(expected = NotFoundException::class)
    fun `when trying to delete hypothesis, if it does not exist on the database it should throw exception`() {
        val hypothesis = Hypothesis(
            id = "f8b723f0-2208-44ba-965b-eb5d5354b18a",
            name = "name",
            description = "description",
            author = user,
            createdAt = LocalDateTime.now(),
            problem = problem,
            cards = emptyList(),
            labels = emptyList(),
            builds = emptyList(),
            circles = emptyList(),
            applicationId = "8c64099f-cc6c-45bd-ba4a-41cbe64c36ac"
        )

        every {
            hypothesisRepository.findByIdAndApplicationId(
                hypothesis.id,
                hypothesis.applicationId
            )
        } returns Optional.empty()

        hypothesisService.delete(hypothesis.id, hypothesis.applicationId)
        verify(exactly = 1) {
            hypothesisRepository.findByIdAndApplicationId(
                hypothesis.id,
                hypothesis.applicationId
            )
        }
    }

    @Test(expected = NotFoundException::class)
    fun `when getting board, should return only deployed deployments at column deployed release`() {
        every { hypothesisRepository.findByIdAndApplicationId(hypothesis.id, applicationId) } returns Optional.empty()

        hypothesisService.getBoard(hypothesis.id, applicationId)
    }

    @Test
    fun `when getting board, if hypothesis exists and contains deployments with status not_deployed should not return them (build built)`() {

        val buildMock = getDummyBuild(emptyList(), cardColumnToDo, BuildStatus.BUILT)

        val deploymentDeployed = getDummyDeployment(buildMock, DeploymentStatus.DEPLOYED)

        val deploymentNotDeployed = getDummyDeployment(buildMock, DeploymentStatus.NOT_DEPLOYED)

        val deploymentDeployFailed = getDummyDeployment(buildMock, DeploymentStatus.DEPLOY_FAILED)

        val buildWithDeploymentsDeployed = getDummyBuild(
            listOf(deploymentDeployed, deploymentNotDeployed),
            cardColumnDeployedReleases,
            BuildStatus.BUILT
        )

        val buildWithoutDeploymentsDeployed =
            getDummyBuild(listOf(deploymentDeployFailed), cardColumnDoing, BuildStatus.BUILT)

        val hypothesis = Hypothesis(
            id = "id", name = "name", description = "description",
            author = user, createdAt = LocalDateTime.now(), problem = problem,
            builds = listOf(buildWithoutDeploymentsDeployed, buildWithDeploymentsDeployed),
            cards = listOf(actionCard),
            applicationId = applicationId
        )

        every { hypothesisRepository.findByIdAndApplicationId(hypothesis.id, applicationId) } returns Optional.of(
            hypothesis
        )
        every {
            cardColumnRepository.findAllByHypothesisIdAndApplicationId(
                hypothesis.id,
                applicationId
            )
        } returns listOf(
            cardColumnToDo, cardColumnDoing, cardColumnReadyToGo,
            cardColumnBuilds, cardColumnDeployedReleases
        )

        val listOfSimpleBuildRepresentation = hypothesisService.getBoard(hypothesis.id, applicationId)

        assertNotNull(listOfSimpleBuildRepresentation)
        assertEquals(5, listOfSimpleBuildRepresentation.board.size)

        assertEquals(todoColumnId, listOfSimpleBuildRepresentation.board[0].id)
        assertEquals(doingColumnId, listOfSimpleBuildRepresentation.board[1].id)
        assertEquals(readyToGoColumnId, listOfSimpleBuildRepresentation.board[2].id)
        assertEquals(buildsColumnId, listOfSimpleBuildRepresentation.board[3].id)
        assertEquals(deployedReleasesColumnId, listOfSimpleBuildRepresentation.board[4].id)

        assertEquals(0, listOfSimpleBuildRepresentation.board[4].cards.size)
        assertEquals(1, listOfSimpleBuildRepresentation.board[4].builds.size)

        assertEquals(buildWithoutDeploymentsDeployed.id, listOfSimpleBuildRepresentation.board[4].builds[0].id)
        assertEquals(
            buildWithoutDeploymentsDeployed.deployments.size,
            listOfSimpleBuildRepresentation.board[4].builds[0].deployments.size
        )
        assertEquals(
            buildWithoutDeploymentsDeployed.deployments[0].id,
            listOfSimpleBuildRepresentation.board[4].builds[0].deployments[0].id
        )
        assertEquals(
            DeploymentStatus.DEPLOYED.name,
            listOfSimpleBuildRepresentation.board[4].builds[0].deployments[0].status
        )
    }

    @Test
    fun `when getting board, if hypothesis exists and contains deployments with status not_deployed should not return them (build validated)`() {

        val buildMock = getDummyBuild(emptyList(), cardColumnToDo, BuildStatus.VALIDATED)

        val deploymentDeployed = getDummyDeployment(buildMock, DeploymentStatus.DEPLOYED)

        val deploymentNotDeployed = getDummyDeployment(buildMock, DeploymentStatus.NOT_DEPLOYED)

        val deploymentDeployFailed = getDummyDeployment(buildMock, DeploymentStatus.DEPLOY_FAILED)

        val buildWithDeploymentsDeployed = getDummyBuild(
            listOf(deploymentDeployed, deploymentNotDeployed),
            cardColumnDeployedReleases,
            BuildStatus.BUILT
        )

        val buildWithoutDeploymentsDeployed =
            getDummyBuild(listOf(deploymentDeployFailed), cardColumnDoing, BuildStatus.BUILT)

        val hypothesis = Hypothesis(
            id = "id", name = "name", description = "description",
            author = user, createdAt = LocalDateTime.now(), problem = problem,
            builds = listOf(buildWithoutDeploymentsDeployed, buildWithDeploymentsDeployed),
            cards = listOf(actionCard),
            applicationId = applicationId
        )

        every { hypothesisRepository.findByIdAndApplicationId(hypothesis.id, applicationId) } returns Optional.of(
            hypothesis
        )

        every {
            cardColumnRepository.findAllByHypothesisIdAndApplicationId(
                hypothesis.id,
                applicationId
            )
        } returns listOf(
            cardColumnToDo,
            cardColumnDoing,
            cardColumnReadyToGo,
            cardColumnBuilds,
            cardColumnDeployedReleases
        )

        val listOfSimpleBuildRepresentation = hypothesisService.getBoard(hypothesis.id, applicationId)

        assertNotNull(listOfSimpleBuildRepresentation)
        assertEquals(5, listOfSimpleBuildRepresentation.board.size)

        assertEquals(todoColumnId, listOfSimpleBuildRepresentation.board[0].id)
        assertEquals(doingColumnId, listOfSimpleBuildRepresentation.board[1].id)
        assertEquals(readyToGoColumnId, listOfSimpleBuildRepresentation.board[2].id)
        assertEquals(buildsColumnId, listOfSimpleBuildRepresentation.board[3].id)
        assertEquals(deployedReleasesColumnId, listOfSimpleBuildRepresentation.board[4].id)

        assertEquals(0, listOfSimpleBuildRepresentation.board[4].cards.size)
        assertEquals(1, listOfSimpleBuildRepresentation.board[4].builds.size)

        assertEquals(buildWithoutDeploymentsDeployed.id, listOfSimpleBuildRepresentation.board[4].builds[0].id)
        assertEquals(
            buildWithoutDeploymentsDeployed.deployments.size,
            listOfSimpleBuildRepresentation.board[4].builds[0].deployments.size
        )
        assertEquals(
            buildWithoutDeploymentsDeployed.deployments[0].id,
            listOfSimpleBuildRepresentation.board[4].builds[0].deployments[0].id
        )
        assertEquals(
            DeploymentStatus.DEPLOYED.name,
            listOfSimpleBuildRepresentation.board[4].builds[0].deployments[0].status
        )
    }

    @Test
    fun `when getting board, if hypothesis exists and there is nothing to return at column deployed releases`() {

        val buildMock = getDummyBuild(emptyList(), cardColumnToDo, BuildStatus.BUILT)
        val deploymentNotDeployed = getDummyDeployment(buildMock, DeploymentStatus.NOT_DEPLOYED)
        val deploymentDeploying = getDummyDeployment(buildMock, DeploymentStatus.DEPLOYING)
        val buildWithoutDeploymentsDeployed =
            getDummyBuild(listOf(deploymentNotDeployed, deploymentDeploying), cardColumnDoing, BuildStatus.BUILT)

        val hypothesis = Hypothesis(
            id = "id", name = "name", description = "description",
            author = user, createdAt = LocalDateTime.now(), problem = problem,
            builds = listOf(buildWithoutDeploymentsDeployed, buildWithoutDeploymentsDeployed),
            cards = listOf(actionCard),
            applicationId = applicationId
        )

        every { hypothesisRepository.findByIdAndApplicationId(hypothesis.id, applicationId) } returns Optional.of(
            hypothesis
        )
        every {
            cardColumnRepository.findAllByHypothesisIdAndApplicationId(
                hypothesis.id,
                applicationId
            )
        } returns listOf(
            cardColumnToDo,
            cardColumnDoing,
            cardColumnReadyToGo,
            cardColumnBuilds,
            cardColumnDeployedReleases
        )

        val listOfSimpleBuildRepresentation = hypothesisService.getBoard(hypothesis.id, applicationId)

        assertNotNull(listOfSimpleBuildRepresentation)
        assertEquals(5, listOfSimpleBuildRepresentation.board.size)

        assertEquals(todoColumnId, listOfSimpleBuildRepresentation.board[0].id)
        assertEquals(doingColumnId, listOfSimpleBuildRepresentation.board[1].id)
        assertEquals(readyToGoColumnId, listOfSimpleBuildRepresentation.board[2].id)
        assertEquals(buildsColumnId, listOfSimpleBuildRepresentation.board[3].id)
        assertEquals(deployedReleasesColumnId, listOfSimpleBuildRepresentation.board[4].id)

        assertEquals(0, listOfSimpleBuildRepresentation.board[4].cards.size)
        assertEquals(0, listOfSimpleBuildRepresentation.board[4].builds.size)
    }

    @Test
    fun `should create a new hypothesis`() {

        val createHypothesisRequest = CreateHypothesisRequest(
            name = hypothesis.name,
            description = hypothesis.description,
            authorId = user.id,
            problemId = problem.id,
            labels = listOf()
        )

        every { problemRepository.findById(problem.id) } returns Optional.of(problem)
        every { userRepository.findById(user.id) } returns Optional.of(user)
        every { hypothesisRepository.save(any() as Hypothesis) } returns hypothesis

        every { cardColumnRepository.saveAll(any() as List<CardColumn>) } returns listOf(
            cardColumnToDo,
            cardColumnDoing,
            cardColumnReadyToGo,
            cardColumnBuilds,
            cardColumnDeployedReleases
        )

        val response = hypothesisService.create(createHypothesisRequest, applicationId)

        verify(exactly = 1) { problemRepository.findById(problem.id) }
        verify(exactly = 1) { userRepository.findById(user.id) }
        verify(exactly = 1) { hypothesisRepository.save(any() as Hypothesis) }
        verify(exactly = 1) { cardColumnRepository.saveAll(any() as List<CardColumn>) }

        assertNotNull(response)
        assertNotNull(response.author)
        assertNotNull(response.builds)
        assertNotNull(response.cards)
        assertNotNull(response.description)
        assertNotNull(response.name)
        assertNotNull(response.problem)
    }

    private fun getDummyDeployment(buildMock: Build, status: DeploymentStatus) =
        Deployment(
            id = "deploymentId_1",
            author = user,
            createdAt = LocalDateTime.now(),
            deployedAt = LocalDateTime.now(),
            status = status,
            circle = circle,
            build = buildMock,
            applicationId = applicationId
        )

    private fun getDummyBuild(deployments: List<Deployment>, cardColumn: CardColumn, status: BuildStatus): Build {
        return Build(
            id = "buildId", author = user, createdAt = LocalDateTime.now(), features = listOf(feature),
            tag = "RC-1.0.0", hypothesis = hypothesis, column = cardColumn,
            status = status, deployments = deployments, artifacts = emptyList(), applicationId = applicationId
        )
    }

    private fun getGitConfiguration(): GitConfiguration = GitConfiguration(
        "ID", "Git Credential Name", LocalDateTime.now(), user, "applicationId",
        GitCredentials(
            "address", "username", "password", null,
            GitServiceProvider.GITHUB
        )
    )
}

