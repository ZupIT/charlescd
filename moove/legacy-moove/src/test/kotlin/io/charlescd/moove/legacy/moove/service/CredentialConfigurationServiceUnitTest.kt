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

import io.charlescd.moove.commons.exceptions.NotFoundExceptionLegacy
import io.charlescd.moove.commons.extension.toRepresentation
import io.charlescd.moove.commons.extension.toSimpleRepresentation
import io.charlescd.moove.commons.representation.CredentialConfigurationRepresentation
import io.charlescd.moove.legacy.moove.api.DeployApi
import io.charlescd.moove.legacy.moove.api.VillagerApi
import io.charlescd.moove.legacy.moove.api.request.CreateVillagerRegistryConfigurationProvider
import io.charlescd.moove.legacy.moove.api.request.CreateVillagerRegistryConfigurationRequest
import io.charlescd.moove.legacy.moove.api.request.GitProvidersEnum
import io.charlescd.moove.legacy.moove.api.request.K8sClusterProvidersEnum
import io.charlescd.moove.legacy.moove.api.response.CreateDeployCdConfigurationResponse
import io.charlescd.moove.legacy.moove.api.response.CreateVillagerRegistryConfigurationResponse
import io.charlescd.moove.legacy.moove.api.response.GetDeployCdConfigurationsResponse
import io.charlescd.moove.legacy.moove.api.response.GetVillagerRegistryConfigurationsResponse
import io.charlescd.moove.legacy.moove.request.configuration.*
import io.charlescd.moove.legacy.repository.CredentialConfigurationRepository
import io.charlescd.moove.legacy.repository.UserRepository
import io.charlescd.moove.legacy.repository.entity.CredentialConfiguration
import io.charlescd.moove.legacy.repository.entity.CredentialConfigurationType
import io.charlescd.moove.legacy.repository.entity.User
import io.mockk.every
import io.mockk.mockkClass
import io.mockk.verify
import java.time.LocalDateTime
import java.util.*
import kotlin.test.assertEquals
import org.junit.Test

class CredentialConfigurationServiceUnitTest {

    private val credentialConfigurationRepository = mockkClass(CredentialConfigurationRepository::class)
    private val userRepository = mockkClass(UserRepository::class)
    private val deployApi = mockkClass(DeployApi::class)
    private val villagerApi = mockkClass(VillagerApi::class)

    private val credentialConfigurationService = CredentialConfigurationService(
        credentialConfigurationRepository,
        userRepository,
        deployApi,
        villagerApi
    )

    private val user = User(
        name = "userName",
        id = "8dbf20d7-322c-46a6-a4da-f21192f5f6aa",
        email = "user@email.com.br",
        photoUrl = "www.google.com.br",
        isRoot = false,
        createdAt = LocalDateTime.now()
    )

    private val gitCredentialConfiguration = CredentialConfiguration(
        name = "credential configuration name",
        id = "fe00608c-17f4-43fd-86e5-68de8961cbf9",
        createdAt = LocalDateTime.now(),
        author = user,
        type = CredentialConfigurationType.GIT,
        workspaceId = "workspaceId"
    )

    private val registryCredentialConfiguration = CredentialConfiguration(
        name = "credential configuration name",
        id = "fe00608c-17f4-43fd-86e5-68de8961cbf9",
        createdAt = LocalDateTime.now(),
        author = user,
        type = CredentialConfigurationType.REGISTRY,
        workspaceId = "workspaceId"
    )

    @Test
    fun `when creating spinnaker cd configuration, method should return the correct CredentialConfigurationRepresentation`() {

        val createdAt = LocalDateTime.now()
        val incomingRequestConfigData =
            CreateSpinnakerCdConfigurationData("account", "git-account", "namespace", "http://my-spinnaker.com")
        val incomingRequest = CreateSpinnakerCdConfigurationRequest(incomingRequestConfigData, "name", "authorId")
        val deployRequest = incomingRequest.toDeployRequest()
        val deployResponse = CreateDeployCdConfigurationResponse("id", "name", "authorId", "workspaceId", createdAt)
        val workspaceId = "workspaceId"
        val user = User(
            name = "userName",
            id = "authorId",
            email = "user@email.com.br",
            photoUrl = "www.google.com.br",
            isRoot = false,
            createdAt = LocalDateTime.now()
        )
        val expectedResponse = CredentialConfigurationRepresentation("id", "name", user.toSimpleRepresentation())

        every {
            deployApi.createCdConfiguration(deployRequest, workspaceId)
        } returns deployResponse

        every {
            userRepository.findById("authorId")
        } returns Optional.of(user)

        val credentialConfiguration = credentialConfigurationService.createCdConfig(incomingRequest, workspaceId)

        assertEquals(expectedResponse, credentialConfiguration)
    }

    @Test
    fun `when creating octopipe cd configuration, method should return the correct CredentialConfigurationRepresentation`() {

        val createdAt = LocalDateTime.now()
        val incomingRequestConfigData = CreateOctopipeCdConfigurationData(
            gitProvider = GitProvidersEnum.GITHUB,
            gitToken = "github-token",
            provider = K8sClusterProvidersEnum.GENERIC,
            host = "https://k8s-cluster.com",
            clientCertificate = "client-cert-data,",
            clientKey = "client-key-data",
            namespace = "cluster-namespace"
        )
        val incomingRequest = CreateOctopipeCdConfigurationRequest(incomingRequestConfigData, "name", "authorId")
        val deployRequest = incomingRequest.toDeployRequest()
        val deployResponse = CreateDeployCdConfigurationResponse("id", "name", "authorId", "workspaceId", createdAt)
        val workspaceId = "workspaceId"
        val user = User(
            name = "userName",
            id = "authorId",
            email = "user@email.com.br",
            photoUrl = "www.google.com.br",
            isRoot = false,
            createdAt = LocalDateTime.now()
        )
        val expectedResponse = CredentialConfigurationRepresentation("id", "name", user.toSimpleRepresentation())

        every {
            deployApi.createCdConfiguration(deployRequest, workspaceId)
        } returns deployResponse

        every {
            userRepository.findById("authorId")
        } returns Optional.of(user)

        val credentialConfiguration = credentialConfigurationService.createCdConfig(incomingRequest, workspaceId)

        assertEquals(expectedResponse, credentialConfiguration)
    }

    @Test
    fun `should correctly return cd configurations returned from charles-deploy`() {

        val createdAt = LocalDateTime.now()

        val workspaceId = "workspaceId"

        val villagerResponse = listOf(
            GetVillagerRegistryConfigurationsResponse(
                "registry-id",
                "name",
                "authorId"
            )
        )

        val registryCredentialConfigurationRepresentation = CredentialConfigurationRepresentation(
            id = "registry-id",
            name = "name",
            author = user.toSimpleRepresentation()
        )

        val deployResponse = listOf(
            GetDeployCdConfigurationsResponse(
                "k8s-id",
                "name",
                "authorId",
                "workspaceId",
                createdAt
            )
        )

        val cdCredentialConfigurationRepresentation = CredentialConfigurationRepresentation(
            id = "k8s-id",
            name = "name",
            author = user.toSimpleRepresentation()
        )
        val expectedResult: Map<String, List<CredentialConfigurationRepresentation>> = mapOf(
            CredentialConfigurationService.GIT_SERVICE_NAME to listOf(gitCredentialConfiguration.toRepresentation()),
            CredentialConfigurationService.REGISTRY_SERVICE_NAME to listOf(registryCredentialConfigurationRepresentation),
            CredentialConfigurationService.CD_SERVICE_NAME to listOf(cdCredentialConfigurationRepresentation)
        )

        every {
            credentialConfigurationRepository.findAllByWorkspaceId(workspaceId)
        } returns listOf(gitCredentialConfiguration, registryCredentialConfiguration)

        every {
            villagerApi.getRegistryConfigurations(workspaceId)
        } returns villagerResponse

        every {
            deployApi.getCdConfigurations(workspaceId)
        } returns deployResponse

        every {
            userRepository.findById("authorId")
        } returns Optional.of(user)

        val credentialConfigurations: Map<String, List<CredentialConfigurationRepresentation>> =
            credentialConfigurationService.getConfigurationsByType(workspaceId)

        assertEquals(expectedResult, credentialConfigurations)
    }

    @Test
    fun `when creating azure configuration, method should return the correct CredentialConfigurationRepresentation`() {

        val request = CreateAzureRegistryConfigurationRequest(
            name = "name",
            address = "address",
            username = "username",
            password = "password",
            authorId = "authorId"
        )

        val villagerRequest = CreateVillagerRegistryConfigurationRequest(
            name = "name",
            address = "address",
            provider = CreateVillagerRegistryConfigurationProvider.Azure,
            username = "username",
            password = "password",
            authorId = "authorId"
        )

        val villagerResponse = CreateVillagerRegistryConfigurationResponse(
            id = "id"
        )

        val workspaceId = "workspaceId"
        val user = User(
            name = "userName",
            id = "authorId",
            email = "user@email.com.br",
            photoUrl = "www.google.com.br",
            isRoot = false,
            createdAt = LocalDateTime.now()
        )
        val expectedResponse =
            CredentialConfigurationRepresentation("id", "name", user.toSimpleRepresentation())

        every {
            villagerApi.createRegistryConfiguration(villagerRequest, workspaceId)
        } returns villagerResponse

        every {
            userRepository.findById("authorId")
        } returns Optional.of(user)

        val credentialConfiguration = credentialConfigurationService.createRegistryConfig(request, workspaceId)

        assertEquals(expectedResponse.id, credentialConfiguration.id)
        assertEquals(expectedResponse.name, credentialConfiguration.name)
        assertEquals(expectedResponse.author, credentialConfiguration.author)
    }

    @Test
    fun `when creating aws configuration, method should return the correct CredentialConfigurationRepresentation`() {

        val request = CreateAWSRegistryConfigurationRequest(
            name = "name",
            address = "address",
            accessKey = "accessKey",
            secretKey = "secretKey",
            region = "region",
            authorId = "authorId"
        )

        val villagerRequest = CreateVillagerRegistryConfigurationRequest(
            name = "name",
            address = "address",
            provider = CreateVillagerRegistryConfigurationProvider.AWS,
            accessKey = "accessKey",
            secretKey = "secretKey",
            region = "region",
            authorId = "authorId"
        )

        val villagerResponse = CreateVillagerRegistryConfigurationResponse(
            id = "id"
        )

        val workspaceId = "workspaceId"
        val user = User(
            name = "userName",
            id = "authorId",
            email = "user@email.com.br",
            photoUrl = "www.google.com.br",
            isRoot = false,
            createdAt = LocalDateTime.now()
        )
        val expectedResponse =
            CredentialConfigurationRepresentation("id", "name", user.toSimpleRepresentation())

        every {
            villagerApi.createRegistryConfiguration(villagerRequest, workspaceId)
        } returns villagerResponse

        every {
            userRepository.findById("authorId")
        } returns Optional.of(user)

        val credentialConfiguration = credentialConfigurationService.createRegistryConfig(request, workspaceId)

        assertEquals(expectedResponse.id, credentialConfiguration.id)
        assertEquals(expectedResponse.name, credentialConfiguration.name)
        assertEquals(expectedResponse.author, credentialConfiguration.author)
    }

    @Test
    fun `when creating GCP configuration, method should return the correct CredentialConfigurationRepresentation`() {

        val request = CreateGCPRegistryConfigurationRequest(
            name = "name",
            address = "address",
            organization = "organization",
            jsonKey = "jsonKey",
            authorId = "authorId"
        )

        val villagerRequest = CreateVillagerRegistryConfigurationRequest(
            name = "name",
            address = "address",
            provider = CreateVillagerRegistryConfigurationProvider.GCP,
            organization = "organization",
            username = "_json_key",
            jsonKey = "jsonKey",
            authorId = "authorId"
        )

        val villagerResponse = CreateVillagerRegistryConfigurationResponse(
            id = "id"
        )

        val workspaceId = "workspaceId"
        val user = User(
            name = "userName",
            id = "authorId",
            email = "user@email.com.br",
            photoUrl = "www.google.com.br",
            isRoot = false,
            createdAt = LocalDateTime.now()
        )
        val expectedResponse =
            CredentialConfigurationRepresentation("id", "name", user.toSimpleRepresentation())

        every {
            villagerApi.createRegistryConfiguration(villagerRequest, workspaceId)
        } returns villagerResponse

        every {
            userRepository.findById("authorId")
        } returns Optional.of(user)

        val credentialConfiguration = credentialConfigurationService.createRegistryConfig(request, workspaceId)

        assertEquals(expectedResponse.id, credentialConfiguration.id)
        assertEquals(expectedResponse.name, credentialConfiguration.name)
        assertEquals(expectedResponse.author, credentialConfiguration.author)
    }

    @Test(expected = NotFoundExceptionLegacy::class)
    fun `when creating registry configuration, method should throw NotFoundException when user is not found`() {

        val request = CreateAWSRegistryConfigurationRequest(
            name = "name",
            address = "address",
            accessKey = "accessKey",
            secretKey = "secretKey",
            region = "region",
            authorId = "authorId"
        )

        val workspaceId = "workspaceId"

        every {
            userRepository.findById("authorId")
        } returns Optional.empty()

        credentialConfigurationService.createRegistryConfig(request, workspaceId)
    }

    @Test
    fun `should correctly return registry configurations returned from charles-villager`() {

        val workspaceId = "workspaceId"

        val deployResponse = listOf(
            GetDeployCdConfigurationsResponse(
                "k8s-id",
                "name",
                "authorId",
                "workspaceId",
                LocalDateTime.now()
            )
        )

        val k8sCredentialConfigurationRepresentation = CredentialConfigurationRepresentation(
            id = "k8s-id",
            name = "name",
            author = user.toSimpleRepresentation()
        )

        val villagerResponse = listOf(
            GetVillagerRegistryConfigurationsResponse(
                "registry-id",
                "name",
                "authorId"
            )
        )

        val registryCredentialConfigurationRepresentation = CredentialConfigurationRepresentation(
            id = "registry-id",
            name = "name",
            author = user.toSimpleRepresentation()
        )

        val expectedResult: Map<String, List<CredentialConfigurationRepresentation>> = mapOf(
            CredentialConfigurationService.GIT_SERVICE_NAME to listOf(gitCredentialConfiguration.toRepresentation()),
            CredentialConfigurationService.REGISTRY_SERVICE_NAME to listOf(registryCredentialConfigurationRepresentation),
            CredentialConfigurationService.CD_SERVICE_NAME to listOf(k8sCredentialConfigurationRepresentation)
        )

        every {
            credentialConfigurationRepository.findAllByWorkspaceId(workspaceId)
        } returns listOf(gitCredentialConfiguration)

        every {
            villagerApi.getRegistryConfigurations(workspaceId)
        } returns villagerResponse

        every {
            deployApi.getCdConfigurations(workspaceId)
        } returns deployResponse

        every {
            userRepository.findById("authorId")
        } returns Optional.of(user)

        val credentialConfigurations: Map<String, List<CredentialConfigurationRepresentation>> =
            credentialConfigurationService.getConfigurationsByType(workspaceId)

        assertEquals(expectedResult, credentialConfigurations)
    }

    @Test(expected = IllegalArgumentException::class)
    fun `when creating cd configuration, method should throw illegal argument exception for invalid type`() {

        class CreateCustomCdConfigurationRequest : CreateCdConfigurationRequest(CdTypeEnum.OCTOPIPE, user.id)

        val incomingRequest = CreateCustomCdConfigurationRequest()

        every {
            userRepository.findById(user.id)
        } returns Optional.of(user)

        val workspaceId = "workspaceId"
        credentialConfigurationService.createCdConfig(incomingRequest, workspaceId)
    }

    @Test(expected = NotFoundExceptionLegacy::class)
    fun `when deleting cd configurations, if it does not exist should throw exception`() {
        val workspaceId = "385ffdc3-d0c5-4f43-8a16-36626976f15d"
        val cdConfigurationId = "06601bc0-04bc-46ec-8191-95f5b5b1cd21"
        val listOfCdConfigurations = listOf(
            GetDeployCdConfigurationsResponse(
                "id", "name", "authorId",
                workspaceId, LocalDateTime.now()
            )
        )

        every { deployApi.getCdConfigurations(workspaceId) } returns listOfCdConfigurations

        credentialConfigurationService.deleteCdConfigurationById(workspaceId, cdConfigurationId)

        verify(exactly = 1) { deployApi.getCdConfigurations(workspaceId) }
        verify(exactly = 0) { deployApi.deleteCdConfiguration(cdConfigurationId, workspaceId) }
    }

    @Test
    fun `when deleting cd configurations, if it exists should delete it`() {
        val workspaceId = "385ffdc3-d0c5-4f43-8a16-36626976f15d"
        val cdConfigurationId = "06601bc0-04bc-46ec-8191-95f5b5b1cd21"
        val listOfCdConfigurations = listOf(
            GetDeployCdConfigurationsResponse(
                cdConfigurationId, "name", "authorId",
                workspaceId, LocalDateTime.now()
            )
        )

        every { deployApi.getCdConfigurations(workspaceId) } returns listOfCdConfigurations
        every { deployApi.deleteCdConfiguration(cdConfigurationId, workspaceId) } answers {}

        credentialConfigurationService.deleteCdConfigurationById(workspaceId, cdConfigurationId)

        verify(exactly = 1) { deployApi.getCdConfigurations(workspaceId) }
        verify(exactly = 1) { deployApi.deleteCdConfiguration(cdConfigurationId, workspaceId) }
    }
}
