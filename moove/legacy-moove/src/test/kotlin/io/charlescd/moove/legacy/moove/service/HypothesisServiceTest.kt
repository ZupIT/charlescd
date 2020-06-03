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
import io.charlescd.moove.commons.exceptions.NotFoundExceptionLegacy
import io.charlescd.moove.legacy.moove.request.hypothesis.CreateHypothesisRequest
import io.charlescd.moove.legacy.moove.request.hypothesis.UpdateHypothesisRequest
import io.charlescd.moove.legacy.repository.*
import io.charlescd.moove.legacy.repository.entity.*
import io.mockk.every
import io.mockk.mockkClass
import io.mockk.verify
import java.time.LocalDateTime
import java.util.*
import kotlin.test.assertEquals
import kotlin.test.assertNotEquals
import kotlin.test.assertNotNull
import org.junit.Test
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.PageRequest

class HypothesisServiceTest {

    private val todoColumnId = "todo-column-id"
    private val doingColumnId = "doing-column-id"
    private val readyToGoColumnId = "ready-to-go-column-id"
    private val buildsColumnId = "builds-column-id"
    private val deployedReleasesColumnId = "deployed-releases-column-id"
    private val workspaceId = "workspaceId"

    private val user = User("userId", "username", "email", "url", false, LocalDateTime.now())

    private val helmRepository = "http://github.com"

    private val hypothesis = Hypothesis(
        id = "id",
        name = "name",
        description = "description",
        author = user,
        createdAt = LocalDateTime.now(),
        builds = emptyList(),
        workspaceId = workspaceId
    )

    private val cardColumnToDo = CardColumn(
        id = todoColumnId,
        name = ColumnConstants.TO_DO_COLUMN_NAME,
        hypothesis = hypothesis,
        workspaceId = workspaceId
    )
    private val cardColumnDoing = CardColumn(
        id = doingColumnId,
        name = ColumnConstants.DOING_COLUMN_NAME,
        hypothesis = hypothesis,
        workspaceId = workspaceId
    )
    private val cardColumnReadyToGo = CardColumn(
        id = readyToGoColumnId,
        name = ColumnConstants.READY_TO_GO_COLUMN_NAME,
        hypothesis = hypothesis,
        workspaceId = workspaceId
    )
    private val cardColumnBuilds = CardColumn(
        id = buildsColumnId,
        name = ColumnConstants.BUILDS_COLUMN_NAME,
        hypothesis = hypothesis,
        workspaceId = workspaceId
    )
    private val cardColumnDeployedReleases = CardColumn(
        id = deployedReleasesColumnId,
        name = ColumnConstants.DEPLOYED_RELEASES_COLUMN_NAME,
        hypothesis = hypothesis,
        workspaceId = workspaceId
    )

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
        Workspace(
            "worksapceId",
            "workspace",
            LocalDateTime.now(),
            mutableListOf(),
            user,
            "894cbe3a-ff7a-437a-b648-96b2c5c5557b",
            "142ba1ba-3d82-4a02-a31a-e993e08bde93",
            "4fc77750-cca9-4e70-bf35-cbf48e460faa",
            "ae366287-0fd3-4c91-bd3e-debe455cd2cb"
        )
    )

    private val component2 = Component(
        id = "teste", name = "teste", createdAt = LocalDateTime.now(), module = module1,
        workspaceId = workspaceId, errorThreshold = 10, latencyThreshold = 10
    )

    private val module2 = Module(
        id = "ModuleTest", name = "ModuleTest", gitRepositoryAddress = "test", helmRepository = "Test",
        createdAt = LocalDateTime.now(), author = user, labels = emptyList(),
        components = listOf(component2), workspace = Workspace(
            "applicationId",
            "application",
            LocalDateTime.now(),
            mutableListOf(),
            user,
            "894cbe3a-ff7a-437a-b648-96b2c5c5557b",
            "142ba1ba-3d82-4a02-a31a-e993e08bde93",
            "4fc77750-cca9-4e70-bf35-cbf48e460faa",
            "ae366287-0fd3-4c91-bd3e-debe455cd2cb"
        )
    )

    private val feature = Feature(
        "featureId", "featureName", "featureBranch",
        user, LocalDateTime.now(), listOf(module2), workspaceId
    )

    private val circle = Circle(
        id = "circleId_1", name = "circleName", author = user, createdAt = LocalDateTime.now(),
        matcherType = MatcherType.SIMPLE_KV, reference = "Reference"
    )

    private val actionCard = ActionCard(
        id = "cardId",
        name = "Card Name",
        description = "Description",
        column = cardColumnToDo,
        author = user,
        createdAt = LocalDateTime.now(),
        labels = listOf(label),
        hypothesis = hypothesis,
        status = CardStatus.ACTIVE,
        type = ActionCardType.ACTION,
        workspaceId = workspaceId
    )

    private val hypothesisRepository: HypothesisRepository = mockkClass(
        HypothesisRepository::class)
    private val labelRepository: LabelRepository = mockkClass(
        LabelRepository::class)
    private val userRepository: UserRepository = mockkClass(
        UserRepository::class)
    private val cardColumnRepository: CardColumnRepository = mockkClass(
        CardColumnRepository::class)
    private val cardRepository: CardRepository = mockkClass(
        CardRepository::class)

    private val hypothesisService: HypothesisServiceLegacy = HypothesisServiceLegacy(
        hypothesisRepository,
        labelRepository,
        userRepository,
        cardColumnRepository,
        cardRepository
    )

    @Test(expected = NotFoundExceptionLegacy::class)
    fun `when trying to find validated builds by hypothesis id, if there is no hypothesis should throw exception`() {
        val hypothesisId = "id"

        every { hypothesisRepository.findByIdAndWorkspaceId(hypothesisId, workspaceId) } returns Optional.empty()

        hypothesisService.findValidatedBuildsByHypothesisId(hypothesisId, workspaceId)
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
            workspaceId = workspaceId
        )

        val hypothesis = Hypothesis(
            id = "hypothesisId", name = "name", description = "description",
            author = user, createdAt = LocalDateTime.now(), builds = listOf(build),
            workspaceId = workspaceId
        )

        every { hypothesisRepository.findByIdAndWorkspaceId(hypothesis.id, workspaceId) } returns Optional.of(
            hypothesis
        )

        val listOfSimpleBuildRepresentation =
            hypothesisService.findValidatedBuildsByHypothesisId(hypothesis.id, workspaceId)

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
            workspaceId = workspaceId
        )
        val pageRequest = PageRequest.of(0, 10)

        val hypothesis = Hypothesis(
            id = "hypothesisId",
            name = "name",
            description = "description",
            author = user,
            createdAt = LocalDateTime.now(),
            builds = listOf(build),
            workspaceId = workspaceId
        )

        val hypothesis2 = Hypothesis(
            id = "hypothesisId", name = "teste", description = "Teste", author = user,
            createdAt = LocalDateTime.now(), builds = listOf(build), workspaceId = workspaceId
        )

        val page = PageImpl<Hypothesis>(listOf(hypothesis, hypothesis2), pageRequest, 1)

        every { hypothesisRepository.findAllByWorkspaceId(workspaceId, pageRequest) } returns page

        val listOfAll = hypothesisService.findAll(workspaceId, pageRequest)

        verify(exactly = 1) { hypothesisRepository.findAllByWorkspaceId(workspaceId, pageRequest) }

        assertNotNull(listOfAll)
        assertEquals(2, listOfAll.content.size)
        assertEquals(hypothesis.id, listOfAll.content[0].id)
        assertEquals(hypothesis2.name, listOfAll.content[1].name)
    }

    @Test
    fun `when listing all hypothesis, if there is no one should return empty list`() {

        val pageRequest = PageRequest.of(0, 10)
        val page = PageImpl<Hypothesis>(listOf(), pageRequest, 1)

        every { hypothesisRepository.findAllByWorkspaceId(workspaceId, pageRequest) } returns page

        val listOfAll = hypothesisService.findAll(workspaceId, pageRequest)

        verify(exactly = 1) { hypothesisRepository.findAllByWorkspaceId(workspaceId, pageRequest) }

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
            cards = emptyList(),
            labels = emptyList(),
            builds = emptyList(),
            workspaceId = "8c64099f-cc6c-45bd-ba4a-41cbe64c36ac"
        )

        every {
            hypothesisRepository.findByIdAndWorkspaceId(
                hypothesis.id,
                hypothesis.workspaceId
            )
        } returns Optional.of(hypothesis)

        val resultHypothesisFindById = hypothesisService.findHypothesisById(hypothesis.id, hypothesis.workspaceId)

        assertNotNull(resultHypothesisFindById)
        assertEquals(hypothesis.id, resultHypothesisFindById.id)
        verify(exactly = 1) { hypothesisRepository.findByIdAndWorkspaceId(hypothesis.id, hypothesis.workspaceId) }
    }

    @Test(expected = NotFoundExceptionLegacy::class)
    fun `when trying to find hypothesis by id, if id does not exist on the database should throw exception`() {
        val hypothesis = Hypothesis(
            id = "f8b723f0-2208-44ba-965b-eb5d5354b18a",
            name = "name",
            description = "description",
            author = user,
            createdAt = LocalDateTime.now(),
            cards = emptyList(),
            labels = emptyList(),
            builds = emptyList(),
            workspaceId = "8c64099f-cc6c-45bd-ba4a-41cbe64c36ac"
        )

        every {
            hypothesisRepository.findByIdAndWorkspaceId(
                hypothesis.id,
                hypothesis.workspaceId
            )
        } returns Optional.empty()

        hypothesisService.findHypothesisById(hypothesis.id, hypothesis.workspaceId)
        verify(exactly = 1) { hypothesisRepository.findByIdAndWorkspaceId(hypothesis.id, hypothesis.workspaceId) }
    }

    @Test
    fun `when trying to update hypothesis, if it exists on the database should do and return it`() {
        val hypothesis = Hypothesis(
            id = "f8b723f0-2208-44ba-965b-eb5d5354b18a",
            name = "name",
            description = "description",
            author = user,
            createdAt = LocalDateTime.now(),
            cards = emptyList(),
            labels = emptyList(),
            builds = emptyList(),
            workspaceId = "8c64099f-cc6c-45bd-ba4a-41cbe64c36ac"
        )

        val updatedHypothesis = Hypothesis(
            id = "f8b723f0-2208-44ba-965b-eb5d5354b18a",
            name = "nameUpdate",
            description = "descriptionUpdate",
            author = user,
            createdAt = LocalDateTime.now(),
            cards = emptyList(),
            labels = emptyList(),
            builds = emptyList(),
            workspaceId = "8c64099f-cc6c-45bd-ba4a-41cbe64c36ac"
        )
        val updateHypothesisRequest = UpdateHypothesisRequest(updatedHypothesis.name, updatedHypothesis.description)

        every {
            hypothesisRepository.findByIdAndWorkspaceId(
                hypothesis.id,
                hypothesis.workspaceId
            )
        } returns Optional.of(updatedHypothesis)
        every { hypothesisRepository.save(updatedHypothesis) } returns updatedHypothesis

        val testOfUpdateHypotese =
            hypothesisService.update(hypothesis.id, updateHypothesisRequest, hypothesis.workspaceId)

        verify(exactly = 1) { hypothesisRepository.findByIdAndWorkspaceId(hypothesis.id, hypothesis.workspaceId) }
        verify(exactly = 1) { hypothesisRepository.save(updatedHypothesis) }
        assertNotNull(testOfUpdateHypotese)
        assertNotEquals(hypothesis.name, testOfUpdateHypotese.name)
    }

    @Test(expected = NotFoundExceptionLegacy::class)
    fun `when trying to update hypothesis, if id does not exist on the database should throw exception`() {
        val hypothesis = Hypothesis(
            id = "f8b723f0-2208-44ba-965b-eb5d5354b18a",
            name = "name",
            description = "description",
            author = user,
            createdAt = LocalDateTime.now(),
            cards = emptyList(),
            labels = emptyList(),
            builds = emptyList(),
            workspaceId = "8c64099f-cc6c-45bd-ba4a-41cbe64c36ac"
        )

        val updatedHypothesis = Hypothesis(
            id = "f8b723f0-2208-44ba-965b-eb5d5354b18a",
            name = "nameUpdate",
            description = "descriptionUpdate",
            author = user,
            createdAt = LocalDateTime.now(),
            cards = emptyList(),
            labels = emptyList(),
            builds = emptyList(),
            workspaceId = "8c64099f-cc6c-45bd-ba4a-41cbe64c36ac"
        )
        val updateHypothesisRequest = UpdateHypothesisRequest(updatedHypothesis.name, updatedHypothesis.description)

        every {
            hypothesisRepository.findByIdAndWorkspaceId(
                hypothesis.id,
                hypothesis.workspaceId
            )
        } returns Optional.empty()

        hypothesisService.update(hypothesis.id, updateHypothesisRequest, hypothesis.workspaceId)

        verify(exactly = 1) {
            hypothesisRepository.findByIdAndWorkspaceId(
                hypothesis.id,
                hypothesis.workspaceId
            )
        }
    }

    @Test
    fun `when trying to find validated builds by hypothesis id, if there is no build should return empty list`() {
        every { hypothesisRepository.findByIdAndWorkspaceId(hypothesis.id, workspaceId) } returns Optional.of(
            hypothesis
        )

        val listOfSimpleBuildRepresentation =
            hypothesisService.findValidatedBuildsByHypothesisId(hypothesis.id, workspaceId)

        assertNotNull(listOfSimpleBuildRepresentation)
        assertEquals(0, listOfSimpleBuildRepresentation.size)
    }

    @Test
    fun `when trying to create a new hypothesis, should do it successfully`() {

        val name = "Test"
        val description = "Description Test"
        val authorId = "204a5dfa-0ea1-4a45-bc51-12933ef92d42"
        val labels: List<String> = emptyList()
        val testCreatedHypothesisRequest = CreateHypothesisRequest(name, description, authorId, labels)
        val workspaceId = "337da7e5-2ca4-410f-aa78-44c93b2cbb9d"

        val hypothesis = Hypothesis(
            "739562ae-5991-11ea-8e2d-0242ac130003", name, description, user, LocalDateTime.now(),
            emptyList(), emptyList(), emptyList(), workspaceId
        )

        every { userRepository.findById(authorId) } returns Optional.of(user)
        every { hypothesisRepository.save(any() as Hypothesis) } returns hypothesis
        every { cardColumnRepository.saveAll(any() as List<CardColumn>) } returns emptyList()

        val hypothesisCreated = hypothesisService.create(testCreatedHypothesisRequest, workspaceId)

        verify(exactly = 1) { userRepository.findById(authorId) }
        verify(exactly = 1) { hypothesisRepository.save(any() as Hypothesis) }
        verify(exactly = 1) { cardColumnRepository.saveAll(any() as List<CardColumn>) }

        assertNotNull(hypothesisCreated)
        assertEquals(hypothesis.id, hypothesisCreated.id)
    }

    @Test(expected = NotFoundExceptionLegacy::class)
    fun `when trying to create a new hypothesis, if user id does not exist on the database should throw exception`() {
        val name = "Test"
        val description = "Description Test"
        val authorId = "204a5dfa-0ea1-4a45-bc51-12933ef92d42"
        val labels: List<String> = emptyList()
        val testCreatedHypothesisRequest = CreateHypothesisRequest(name, description, authorId, labels)
        val workspaceId = "337da7e5-2ca4-410f-aa78-44c93b2cbb9d"
        val hypothesis = Hypothesis(
            "739562ae-5991-11ea-8e2d-0242ac130003", name, description, user, LocalDateTime.now(),
            emptyList(), emptyList(), emptyList(), workspaceId
        )
        every { userRepository.findById(authorId) } returns Optional.empty()
        every { hypothesisRepository.save(any() as Hypothesis) } returns hypothesis

        hypothesisService.create(testCreatedHypothesisRequest, workspaceId)
        verify(exactly = 1) { userRepository.findById(authorId) }
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
            cards = emptyList(),
            labels = emptyList(),
            builds = emptyList(),
            workspaceId = "8c64099f-cc6c-45bd-ba4a-41cbe64c36ac"
        )

        every {
            hypothesisRepository.findByIdAndWorkspaceId(
                hypothesis.id,
                hypothesis.workspaceId
            )
        } returns Optional.of(hypothesis)
        every { hypothesisRepository.delete(hypothesis) } answers {}

        val deletedAnswer = hypothesisService.delete(hypothesis.id, hypothesis.workspaceId)

        verify(exactly = 1) { hypothesisRepository.delete(hypothesis) }
        verify(exactly = 1) { hypothesisRepository.delete(hypothesis) }
        assertNotNull(deletedAnswer)
    }

    @Test(expected = NotFoundExceptionLegacy::class)
    fun `when trying to delete hypothesis, if it does not exist on the database it should throw exception`() {
        val hypothesis = Hypothesis(
            id = "f8b723f0-2208-44ba-965b-eb5d5354b18a",
            name = "name",
            description = "description",
            author = user,
            createdAt = LocalDateTime.now(),
            cards = emptyList(),
            labels = emptyList(),
            builds = emptyList(),
            workspaceId = "8c64099f-cc6c-45bd-ba4a-41cbe64c36ac"
        )

        every {
            hypothesisRepository.findByIdAndWorkspaceId(
                hypothesis.id,
                hypothesis.workspaceId
            )
        } returns Optional.empty()

        hypothesisService.delete(hypothesis.id, hypothesis.workspaceId)
        verify(exactly = 1) {
            hypothesisRepository.findByIdAndWorkspaceId(
                hypothesis.id,
                hypothesis.workspaceId
            )
        }
    }

    @Test(expected = NotFoundExceptionLegacy::class)
    fun `when getting board, should return only deployed deployments at column deployed release`() {
        every { hypothesisRepository.findByIdAndWorkspaceId(hypothesis.id, workspaceId) } returns Optional.empty()

        hypothesisService.getBoard(hypothesis.id, workspaceId)
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
            author = user, createdAt = LocalDateTime.now(),
            builds = listOf(buildWithoutDeploymentsDeployed, buildWithDeploymentsDeployed),
            cards = listOf(actionCard),
            workspaceId = workspaceId
        )

        every { hypothesisRepository.findByIdAndWorkspaceId(hypothesis.id, workspaceId) } returns Optional.of(
            hypothesis
        )
        every {
            cardColumnRepository.findAllByHypothesisIdAndWorkspaceId(
                hypothesis.id,
                workspaceId
            )
        } returns listOf(
            cardColumnToDo, cardColumnDoing, cardColumnReadyToGo,
            cardColumnBuilds, cardColumnDeployedReleases
        )

        val listOfSimpleBuildRepresentation = hypothesisService.getBoard(hypothesis.id, workspaceId)

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
            author = user, createdAt = LocalDateTime.now(),
            builds = listOf(buildWithoutDeploymentsDeployed, buildWithDeploymentsDeployed),
            cards = listOf(actionCard),
            workspaceId = workspaceId
        )

        every { hypothesisRepository.findByIdAndWorkspaceId(hypothesis.id, workspaceId) } returns Optional.of(
            hypothesis
        )

        every {
            cardColumnRepository.findAllByHypothesisIdAndWorkspaceId(
                hypothesis.id,
                workspaceId
            )
        } returns listOf(
            cardColumnToDo,
            cardColumnDoing,
            cardColumnReadyToGo,
            cardColumnBuilds,
            cardColumnDeployedReleases
        )

        val listOfSimpleBuildRepresentation = hypothesisService.getBoard(hypothesis.id, workspaceId)

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
            author = user, createdAt = LocalDateTime.now(),
            builds = listOf(buildWithoutDeploymentsDeployed, buildWithoutDeploymentsDeployed),
            cards = listOf(actionCard),
            workspaceId = workspaceId
        )

        every { hypothesisRepository.findByIdAndWorkspaceId(hypothesis.id, workspaceId) } returns Optional.of(
            hypothesis
        )
        every {
            cardColumnRepository.findAllByHypothesisIdAndWorkspaceId(
                hypothesis.id,
                workspaceId
            )
        } returns listOf(
            cardColumnToDo,
            cardColumnDoing,
            cardColumnReadyToGo,
            cardColumnBuilds,
            cardColumnDeployedReleases
        )

        val listOfSimpleBuildRepresentation = hypothesisService.getBoard(hypothesis.id, workspaceId)

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
            labels = listOf()
        )

        every { userRepository.findById(user.id) } returns Optional.of(user)
        every { hypothesisRepository.save(any() as Hypothesis) } returns hypothesis

        every { cardColumnRepository.saveAll(any() as List<CardColumn>) } returns listOf(
            cardColumnToDo,
            cardColumnDoing,
            cardColumnReadyToGo,
            cardColumnBuilds,
            cardColumnDeployedReleases
        )

        val response = hypothesisService.create(createHypothesisRequest, workspaceId)

        verify(exactly = 1) { userRepository.findById(user.id) }
        verify(exactly = 1) { hypothesisRepository.save(any() as Hypothesis) }
        verify(exactly = 1) { cardColumnRepository.saveAll(any() as List<CardColumn>) }

        assertNotNull(response)
        assertNotNull(response.author)
        assertNotNull(response.builds)
        assertNotNull(response.cards)
        assertNotNull(response.description)
        assertNotNull(response.name)
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
            workspaceId = workspaceId
        )

    private fun getDummyBuild(deployments: List<Deployment>, cardColumn: CardColumn, status: BuildStatus): Build {
        return Build(
            id = "buildId", author = user, createdAt = LocalDateTime.now(), features = listOf(feature),
            tag = "RC-1.0.0", hypothesis = hypothesis, column = cardColumn,
            status = status, deployments = deployments, workspaceId = workspaceId
        )
    }

    private fun getGitConfiguration(): GitConfiguration = GitConfiguration(
        "ID", "Git Credential Name", LocalDateTime.now(), user, "workspaceId",
        GitCredentials(
            "address", "username", "password", null,
            GitServiceProvider.GITHUB
        )
    )
}
