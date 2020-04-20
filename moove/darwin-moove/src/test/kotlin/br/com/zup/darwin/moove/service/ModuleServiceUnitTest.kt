/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.moove.service

import br.com.zup.darwin.commons.extension.toRepresentation
import br.com.zup.darwin.commons.extension.toSimpleRepresentation
import br.com.zup.darwin.commons.representation.ModuleRepresentation
import br.com.zup.darwin.entity.*
import br.com.zup.darwin.moove.api.DeployApi
import br.com.zup.darwin.moove.api.VillagerApi
import br.com.zup.darwin.moove.api.request.CreateDeployModuleRequest
import br.com.zup.darwin.moove.api.response.CreateDeployComponentPipelineResponse
import br.com.zup.darwin.moove.api.response.CreateDeployComponentResponse
import br.com.zup.darwin.moove.api.response.CreateDeployModuleResponse
import br.com.zup.darwin.moove.request.module.CreateComponentRequest
import br.com.zup.darwin.moove.request.module.CreateModuleRequest
import br.com.zup.darwin.moove.request.module.UpdateComponentRequest
import br.com.zup.darwin.moove.request.module.UpdateModuleRequest
import br.com.zup.darwin.repository.*
import io.mockk.every
import io.mockk.mockkClass
import io.mockk.verify
import org.junit.Before
import org.junit.Test
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.Pageable
import java.time.LocalDateTime
import java.util.*
import kotlin.test.assertEquals
import kotlin.test.assertNotNull

class ModuleServiceUnitTest {

    private val cdConfigId = "cd-id"
    private val registryConfigId = "registry-id"
    private val applicationId = "applicationId"
    private val userRepository = mockkClass(UserRepository::class)
    private val moduleRepository = mockkClass(ModuleRepository::class)
    private val labelRepository = mockkClass(LabelRepository::class)
    private val componentRepository = mockkClass(ComponentRepository::class)
    private val gitConfigurationRepository = mockkClass(GitConfigurationRepository::class)
    private val villagerApi = mockkClass(VillagerApi::class)
    private val deployApi = mockkClass(DeployApi::class)
    private val helmRepository = "http://github.com"
    private lateinit var component: Component

    private val moduleService = ModuleService(
        userRepository,
        moduleRepository,
        labelRepository,
        componentRepository,
        gitConfigurationRepository,
        villagerApi,
        deployApi
    )

    private val user = User(
        name = "userName",
        id = "8dbf20d7-322c-46a6-a4da-f21192f5f6aa",
        email = "user@email.com.br",
        photoUrl = "www.google.com.br",
        createdAt = LocalDateTime.now()
    )

    private val gitCredentialConfiguration = getGitConfiguration()

    private val label = Label(
        id = "labelId",
        name = "labelName",
        createdAt = LocalDateTime.now(),
        author = user,
        hexColor = "hexColor"
    )

    private var module = Module(
        id = "UUID",
        name = "modules-name",
        gitRepositoryAddress = "gitRepositoryAddress",
        createdAt = LocalDateTime.now(),
        labels = listOf(label),
        components = emptyList(),
        author = user,
        helmRepository = helmRepository,
        applicationId = applicationId,
        gitConfiguration = gitCredentialConfiguration,
        cdConfigurationId = cdConfigId,
        registryConfigurationId = registryConfigId
    )

    private var module2 = Module(
        "module2",
        "repo2/owner2",
        "https://github.com/repo2/owner2",
        LocalDateTime.now(),
        helmRepository,
        user,
        listOf(label),
        emptyList(),
        applicationId,
        gitCredentialConfiguration,
        cdConfigId,
        registryConfigId
    )

    private val createComponentRequest = CreateComponentRequest(
            "comp-name",
            "contextPath",
            1000,
            "healthCheck"
    )

    private val createModuleRequest = CreateModuleRequest(
            "name",
            "gitAddress",
            "authorId",
            emptyList(),
            "gitConfigurationId",
            "registryConfigurationId",
            "k8sConfigurationId",
            "helmRepository",
            listOf(createComponentRequest)
    )

    private val updateComponentRequest = UpdateComponentRequest(
        "comp-id",
        "comp-name",
        "contextPath",
        1000,
        "healthCheck"
    )

    private val updateModuleRequest = UpdateModuleRequest(
        "name",
        "gitAddress",
        emptyList(),
        "gitConfigurationId",
        "registryConfigurationId",
        "k8sConfigurationId",
        listOf(updateComponentRequest)
    )

    private val pipelineOptions = CreateDeployComponentPipelineResponse(
            emptyList(),
            emptyList(),
            emptyList()
    )

    private val componentsDeployResponse = listOf(
            CreateDeployComponentResponse(
                    "componentId",
                    pipelineOptions,
                    LocalDateTime.now()
            )
    )

    private val createDeployModuleResponse = CreateDeployModuleResponse(
            "id",
            "k8sConfigId",
            LocalDateTime.now(),
            componentsDeployResponse
    )

    @Before
    fun setUp() {
        component = Component(
            id = "id",
            name = "component name",
            contextPath = "contextPath",
            port = 1234,
            healthCheck = "/health-check",
            createdAt = LocalDateTime.now(),
            module = module,
            applicationId = applicationId
        )
        module = module.copy(components = listOf(component))
        module2 = module2.copy(components = listOf(component))
    }

    @Test
    fun `when all modules filtering by name, if there are modules matching should return them`() {

        val name = "module"
        val pageable = mockkClass(Pageable::class)

        every {
            moduleRepository.findByNameAndApplicationIdIgnoreCaseContaining(name, applicationId, pageable)
        } returns PageImpl(listOf(module2))

        val moduleRepresentation = moduleService.getAllModules(name, applicationId, pageable)

        assertNotNull(moduleRepresentation)
        assertNotNull(moduleRepresentation.content)
        assertEquals(module2.author.id, moduleRepresentation.content[0].author.id)
        assertEquals(module2.author.email, moduleRepresentation.content[0].author.email)
        assertEquals(module2.author.photoUrl, moduleRepresentation.content[0].author.photoUrl)
        assertEquals(module2.author.name, moduleRepresentation.content[0].author.name)
        assertNotNull(moduleRepresentation.content[0].components)
        assertEquals(module2.gitRepositoryAddress, moduleRepresentation.content[0].gitRepositoryAddress)
        assertEquals(module2.id, moduleRepresentation.content[0].id)
        assertEquals(module2.labels[0].id, moduleRepresentation.content[0].labels[0].id)
        assertEquals(module2.labels[0].hexColor, moduleRepresentation.content[0].labels[0].hexColor)
        assertEquals(module2.labels[0].name, moduleRepresentation.content[0].labels[0].name)
        assertEquals(module2.name, moduleRepresentation.content[0].name)

        verify(exactly = 1) {
            moduleRepository.findByNameAndApplicationIdIgnoreCaseContaining(
                name,
                applicationId,
                pageable
            )
        }
        verify(exactly = 0) { moduleRepository.findAll(pageable) }

    }

    @Test
    fun `when finding all modules filtering by name, if there is no module matching should return empty list`() {

        val name = "module"
        val pageable = mockkClass(Pageable::class)

        every {
            moduleRepository.findByNameAndApplicationIdIgnoreCaseContaining(name, applicationId, pageable)
        } returns PageImpl(emptyList())

        val moduleRepresentation = moduleService.getAllModules(name, applicationId, pageable)

        assertNotNull(moduleRepresentation)
        assertEquals(0, moduleRepresentation.content.size)

        verify(exactly = 1) {
            moduleRepository.findByNameAndApplicationIdIgnoreCaseContaining(
                name,
                applicationId,
                pageable
            )
        }
        verify(exactly = 0) { moduleRepository.findAll(pageable) }

    }

    @Test
    fun `when finding all modules without filtering by name, if there are modules should return them`() {
        val name = "module"
        val pageable = mockkClass(Pageable::class)

        every {
            moduleRepository.findAllByApplicationId(applicationId, pageable)
        } returns PageImpl(listOf(module2))

        val moduleRepresentation = moduleService.getAllModules(pageable = pageable, applicationId = applicationId)

        assertNotNull(moduleRepresentation)
        assertNotNull(moduleRepresentation.content)
        assertEquals(module2.author.id, moduleRepresentation.content[0].author.id)
        assertEquals(module2.author.email, moduleRepresentation.content[0].author.email)
        assertEquals(module2.author.photoUrl, moduleRepresentation.content[0].author.photoUrl)
        assertEquals(module2.author.name, moduleRepresentation.content[0].author.name)
        assertNotNull(moduleRepresentation.content[0].components)
        assertEquals(module2.gitRepositoryAddress, moduleRepresentation.content[0].gitRepositoryAddress)
        assertEquals(module2.id, moduleRepresentation.content[0].id)
        assertEquals(module2.labels[0].id, moduleRepresentation.content[0].labels[0].id)
        assertEquals(module2.labels[0].hexColor, moduleRepresentation.content[0].labels[0].hexColor)
        assertEquals(module2.labels[0].name, moduleRepresentation.content[0].labels[0].name)
        assertEquals(module2.name, moduleRepresentation.content[0].name)

        verify(exactly = 0) {
            moduleRepository.findByNameAndApplicationIdIgnoreCaseContaining(
                name,
                applicationId,
                pageable
            )
        }
        verify(exactly = 1) { moduleRepository.findAllByApplicationId(applicationId, pageable) }

    }

    @Test
    fun `when finding all modules without filtering by name, if there is no module should return empty list`() {

        val name = "module"
        val pageable = mockkClass(Pageable::class)

        every {
            moduleRepository.findAllByApplicationId(applicationId, pageable)
        } returns PageImpl(emptyList())

        val moduleRepresentation = moduleService.getAllModules(pageable = pageable, applicationId = applicationId)

        assertNotNull(moduleRepresentation)
        assertEquals(0, moduleRepresentation.content.size)

        verify(exactly = 0) {
            moduleRepository.findByNameAndApplicationIdIgnoreCaseContaining(
                name,
                applicationId,
                pageable
            )
        }
        verify(exactly = 1) { moduleRepository.findAllByApplicationId(applicationId, pageable) }

    }

    @Test
    fun `should correcly create module and call deploy module`() {

        val expectedResult = ModuleRepresentation(
            id = module.id,
            name = module.name,
            gitRepositoryAddress = module.gitRepositoryAddress,
            helmRepository = module.helmRepository,
            gitConfigurationId = gitCredentialConfiguration.id,
            registryConfigurationId = module.registryConfigurationId,
            cdConfigurationId = module.cdConfigurationId,
            createdAt = module.createdAt,
            author = module.author.toSimpleRepresentation(),
            labels = module.labels.map { label -> label.toRepresentation() },
            components = module.components.map { component -> component.toRepresentation() }
        )

        every {
            moduleRepository.save(any() as Module)
        } returns module

        every {
            componentRepository.save(any() as Component)
        } returns component

        every {
            componentRepository.findById(any() as String)
        } returns Optional.of(component)

        every {
            userRepository.findById(any() as String)
        } returns Optional.of(user)

        every {
            labelRepository.findAllById(any() as List<String>)
        } returns emptyList()

        every {
            deployApi.createModule(any() as CreateDeployModuleRequest)
        } returns createDeployModuleResponse

        every {
            gitConfigurationRepository.findById(any() as String)
        } returns Optional.of(gitCredentialConfiguration)

        val moduleRepresentation = moduleService.createModule(createModuleRequest, "applicationId")

        assertEquals(moduleRepresentation, expectedResult)
        verify(exactly = 1) { deployApi.createModule(any()) }
    }

    @Test
    fun `should correctly update module and return representation`() {

        val expectedResult = ModuleRepresentation(
            id = module.id,
            name = module.name,
            gitRepositoryAddress = module.gitRepositoryAddress,
            helmRepository = module.helmRepository,
            gitConfigurationId = gitCredentialConfiguration.id,
            registryConfigurationId = module.registryConfigurationId,
            cdConfigurationId = module.cdConfigurationId,
            createdAt = module.createdAt,
            author = module.author.toSimpleRepresentation(),
            labels = module.labels.map { label -> label.toRepresentation() },
            components = module.components.map { component -> component.toRepresentation() }
        )

        every {
            moduleRepository.save(any() as Module)
        } returns module

        every {
            moduleRepository.findByIdAndApplicationId(any(), any())
        } returns Optional.of(module)

        every {
            labelRepository.findAllById(any() as List<String>)
        } returns emptyList()

        every {
            componentRepository.save(any() as Component)
        } returns component

        every {
            componentRepository.findById(any() as String)
        } returns Optional.of(component)

        every {
            gitConfigurationRepository.findById(any() as String)
        } returns Optional.of(gitCredentialConfiguration)

        val moduleRepresentation = moduleService.updateModuleById("id", updateModuleRequest, "applicationId")

        assertEquals(moduleRepresentation, expectedResult)
    }

    private fun getGitConfiguration(): GitConfiguration = GitConfiguration(
        "ID", "Git Credential Name", LocalDateTime.now(), user, "applicationId",
        GitCredentials(
            "address", "username", "password", null,
            GitServiceProvider.GITHUB
        )
    )
}