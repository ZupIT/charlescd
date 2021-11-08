/*
 *
 *  * Copyright 2020, 2021 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
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

import io.charlescd.moove.commons.constants.MooveErrorCodeLegacy
import io.charlescd.moove.commons.exceptions.IntegrationExceptionLegacy
import io.charlescd.moove.commons.exceptions.InvalidRegistryExceptionLegacy
import io.charlescd.moove.commons.exceptions.NotFoundExceptionLegacy
import io.charlescd.moove.commons.exceptions.ThirdPartyIntegrationExceptionLegacy
import io.charlescd.moove.commons.extension.toRepresentation
import io.charlescd.moove.commons.extension.toSimpleRepresentation
import io.charlescd.moove.commons.representation.CredentialConfigurationRepresentation
import io.charlescd.moove.legacy.moove.api.DeployApi
import io.charlescd.moove.legacy.moove.api.VillagerApi
import io.charlescd.moove.legacy.moove.api.request.*
import io.charlescd.moove.legacy.moove.api.response.CreateDeployCdConfigurationResponse
import io.charlescd.moove.legacy.moove.api.response.CreateVillagerRegistryConfigurationResponse
import io.charlescd.moove.legacy.moove.api.response.GetDeployCdConfigurationsResponse
import io.charlescd.moove.legacy.moove.api.response.GetVillagerRegistryConfigurationsResponse
import io.charlescd.moove.legacy.moove.request.configuration.*
import io.charlescd.moove.legacy.repository.CredentialConfigurationRepository
import io.charlescd.moove.legacy.repository.entity.CredentialConfiguration
import io.charlescd.moove.legacy.repository.entity.CredentialConfigurationType
import io.charlescd.moove.legacy.repository.entity.User
import io.mockk.every
import io.mockk.mockkClass
import io.mockk.verify
import org.junit.Test
import java.time.LocalDateTime
import kotlin.test.assertEquals

class CredentialConfigurationServiceUnitTest {

    private val credentialConfigurationRepository = mockkClass(CredentialConfigurationRepository::class)
    private val userServiceLegacy = mockkClass(UserServiceLegacy::class)
    private val deployApi = mockkClass(DeployApi::class)
    private val villagerApi = mockkClass(VillagerApi::class)

    private val credentialConfigurationService = CredentialConfigurationService(
        credentialConfigurationRepository,
        userServiceLegacy,
        deployApi,
        villagerApi
    )

    private val user = User(
        name = "userName",
        id = "8dbf20d7-322c-46a6-a4da-f21192f5f6aa",
        email = "user@email.com.br",
        photoUrl = "www.google.com.br",
        isRoot = false,
        systemTokenId = null,
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
        val incomingRequest = CreateSpinnakerCdConfigurationRequest(incomingRequestConfigData, "name")
        val deployResponse = CreateDeployCdConfigurationResponse("id", "name", "authorId", "workspaceId", createdAt)
        val workspaceId = "workspaceId"
        val user = User(
            name = "userName",
            id = "authorId",
            email = "user@email.com.br",
            photoUrl = "www.google.com.br",
            isRoot = false,
            systemTokenId = null,
            createdAt = LocalDateTime.now()
        )
        val deployRequest = incomingRequest.toDeployRequest(user)
        val expectedResponse = CredentialConfigurationRepresentation("id", "name", user.toSimpleRepresentation())

        every {
            deployApi.createCdConfiguration(deployRequest, workspaceId)
        } returns deployResponse

        every {
            userServiceLegacy.findFromAuthMethods(getAuthorization(), null)
        } returns user

        val credentialConfiguration = credentialConfigurationService.createCdConfig(incomingRequest, workspaceId, getAuthorization(), null)

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
        val incomingRequest = CreateOctopipeCdConfigurationRequest(incomingRequestConfigData, "name")
        val deployRequest = incomingRequest.toDeployRequest(user)
        val deployResponse = CreateDeployCdConfigurationResponse("id", "name", "authorId", "workspaceId", createdAt)
        val workspaceId = "workspaceId"
        val expectedResponse = CredentialConfigurationRepresentation("id", "name", user.toSimpleRepresentation())

        every {
            deployApi.createCdConfiguration(deployRequest, workspaceId)
        } returns deployResponse

        every {
            userServiceLegacy.findFromAuthMethods(getAuthorization(), null)
        } returns user

        val credentialConfiguration = credentialConfigurationService.createCdConfig(incomingRequest, workspaceId, getAuthorization(), null)

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
            userServiceLegacy.findUser("authorId")
        } returns user

        val credentialConfigurations: Map<String, List<CredentialConfigurationRepresentation>> =
            credentialConfigurationService.getConfigurationsByType(workspaceId)

        assertEquals(expectedResult, credentialConfigurations)
    }

    @Test(expected = IllegalArgumentException::class)
    fun `when creating any registry configuration with invalid address, method should throw InvalidArgumentException`() {

        val request = CreateAzureRegistryConfigurationRequest(
            name = "name",
            address = "address",
            username = "username",
            password = "password"
        )

        val villagerRequest = CreateVillagerRegistryConfigurationRequest(
            name = "name",
            address = "address",
            provider = CreateVillagerRegistryConfigurationProvider.Azure,
            username = "username",
            password = "password",
            authorId = "authorId"
        )

        val workspaceId = "workspaceId"

        val user = User(
            name = "userName",
            id = "authorId",
            email = "user@email.com.br",
            photoUrl = "www.google.com.br",
            isRoot = false,
            systemTokenId = null,
            createdAt = LocalDateTime.now()
        )
        val authorization = getAuthorization()

        every {
            villagerApi.createRegistryConfiguration(villagerRequest, workspaceId)
        } throws IllegalArgumentException("Invalid url address")

        every {
            userServiceLegacy.findFromAuthMethods(authorization, null)
        } returns user

        credentialConfigurationService.createRegistryConfig(request, workspaceId, authorization, null)
    }

    @Test
    fun `when creating azure configuration, method should return the correct CredentialConfigurationRepresentation`() {

        val request = CreateAzureRegistryConfigurationRequest(
            name = "name",
            address = "https://address",
            username = "username",
            password = "password"
        )

        val villagerRequest = CreateVillagerRegistryConfigurationRequest(
            name = "name",
            address = "https://address",
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
            systemTokenId = null,
            createdAt = LocalDateTime.now()
        )
        val expectedResponse =
            CredentialConfigurationRepresentation("id", "name", user.toSimpleRepresentation())

        every {
            villagerApi.createRegistryConfiguration(villagerRequest, workspaceId)
        } returns villagerResponse

        every {
            userServiceLegacy.findFromAuthMethods(getAuthorization(), null)
        } returns user

        val credentialConfiguration = credentialConfigurationService.createRegistryConfig(request, workspaceId, getAuthorization(), null)

        assertEquals(expectedResponse.id, credentialConfiguration.id)
        assertEquals(expectedResponse.name, credentialConfiguration.name)
        assertEquals(expectedResponse.author, credentialConfiguration.author)
    }

    @Test
    fun `when creating Harbor configuration, method should return the correct CredentialConfigurationRepresentation`() {

        val request = CreateHarborRegistryConfigurationRequest(
            name = "name",
            address = "https://address",
            username = "username",
            password = "password"
        )

        val villagerRequest = CreateVillagerRegistryConfigurationRequest(
            name = "name",
            address = "https://address",
            provider = CreateVillagerRegistryConfigurationProvider.HARBOR,
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
            systemTokenId = null,
            createdAt = LocalDateTime.now()
        )
        val expectedResponse =
            CredentialConfigurationRepresentation("id", "name", user.toSimpleRepresentation())

        every {
            villagerApi.createRegistryConfiguration(villagerRequest, workspaceId)
        } returns villagerResponse

        every {
            userServiceLegacy.findFromAuthMethods(getAuthorization(), null)
        } returns user

        val credentialConfiguration = credentialConfigurationService.createRegistryConfig(request, workspaceId, getAuthorization(), null)

        assertEquals(expectedResponse.id, credentialConfiguration.id)
        assertEquals(expectedResponse.name, credentialConfiguration.name)
        assertEquals(expectedResponse.author, credentialConfiguration.author)
    }

    @Test
    fun `when test new valid azure configuration, method should not throw nothing`() {

        val request = CreateAzureRegistryConfigurationRequest(
            name = "name",
            address = "https://address",
            username = "username",
            password = "password"
        )

        val villagerRequest = CreateVillagerRegistryConfigurationRequest(
            name = "name",
            address = "https://address",
            provider = CreateVillagerRegistryConfigurationProvider.Azure,
            username = "username",
            password = "password",
            authorId = user.id
        )

        val workspaceId = "workspaceId"

        every {
            villagerApi.testRegistryConfiguration(villagerRequest, workspaceId)
        } returns Unit

        every {
            userServiceLegacy.findFromAuthMethods(getAuthorization(), null)
        } returns user

        credentialConfigurationService.testRegistryConfiguration(workspaceId, request, getAuthorization(), null)
        verify(exactly = 1) { villagerApi.testRegistryConfiguration(villagerRequest, workspaceId) }
    }

    @Test(expected = IllegalArgumentException::class)
    fun `when test new any registry configuration, method should throw IllegalArgumentException`() {

        val request = CreateAzureRegistryConfigurationRequest(
            name = "name",
            address = "address",
            username = "username",
            password = "password"
        )

        val villagerRequest = CreateVillagerRegistryConfigurationRequest(
            name = "name",
            address = "address",
            provider = CreateVillagerRegistryConfigurationProvider.Azure,
            username = "username",
            password = "password",
            authorId = "authorId"
        )

        val workspaceId = "workspaceId"

        every {
            villagerApi.testRegistryConfiguration(villagerRequest, workspaceId)
        } throws IllegalArgumentException("Invalid url address")

        every {
            userServiceLegacy.findFromAuthMethods(getAuthorization(), null)
        } returns user

        credentialConfigurationService.testRegistryConfiguration(workspaceId, request, getAuthorization(), null)
        verify(exactly = 1) { villagerApi.testRegistryConfiguration(villagerRequest, workspaceId) }
    }

    @Test(expected = InvalidRegistryExceptionLegacy::class)
    fun `when test new invalid azure configuration, method should throw InvalidIntegrationRequestExceptionLegacy`() {

        val request = CreateAzureRegistryConfigurationRequest(
            name = "name",
            address = "https://address",
            username = "username",
            password = "password"
        )

        val villagerRequest = CreateVillagerRegistryConfigurationRequest(
            name = "name",
            address = "https://address",
            provider = CreateVillagerRegistryConfigurationProvider.Azure,
            username = "username",
            password = "password",
            authorId = user.id
        )

        val workspaceId = "workspaceId"

        every {
            villagerApi.testRegistryConfiguration(villagerRequest, workspaceId)
        } throws IllegalArgumentException("")

        every {
            userServiceLegacy.findFromAuthMethods(getAuthorization(), null)
        } returns user

        credentialConfigurationService.testRegistryConfiguration(workspaceId, request, getAuthorization(), null)
        verify(exactly = 1) { villagerApi.testRegistryConfiguration(villagerRequest, workspaceId) }
    }

    @Test(expected = IntegrationExceptionLegacy::class)
    fun `when test new azure configuration and villager not respond, method should throw IntegrationExceptionLegacy`() {

        val request = CreateAzureRegistryConfigurationRequest(
            name = "name",
            address = "https://address",
            username = "username",
            password = "password"
        )

        val villagerRequest = CreateVillagerRegistryConfigurationRequest(
            name = "name",
            address = "https://address",
            provider = CreateVillagerRegistryConfigurationProvider.Azure,
            username = "username",
            password = "password",
            authorId = user.id
        )

        val workspaceId = "workspaceId"

        every {
            villagerApi.testRegistryConfiguration(villagerRequest, workspaceId)
        } throws IntegrationExceptionLegacy.of(MooveErrorCodeLegacy.VILLAGER_REGISTRY_INTEGRATION_ERROR, "")

        every {
            userServiceLegacy.findFromAuthMethods(getAuthorization(), null)
        } returns user

        credentialConfigurationService.testRegistryConfiguration(workspaceId, request, getAuthorization(), null)
        verify(exactly = 1) { villagerApi.testRegistryConfiguration(villagerRequest, workspaceId) }
    }

    @Test(expected = ThirdPartyIntegrationExceptionLegacy::class)
    fun `when test new azure configuration and registry api not respond, method should throw IntegrationExceptionLegacy`() {

        val request = CreateAzureRegistryConfigurationRequest(
            name = "name",
            address = "https://address",
            username = "username",
            password = "password"
        )

        val villagerRequest = CreateVillagerRegistryConfigurationRequest(
            name = "name",
            address = "https://address",
            provider = CreateVillagerRegistryConfigurationProvider.Azure,
            username = "username",
            password = "password",
            authorId = user.id
        )

        val workspaceId = "workspaceId"

        every {
            villagerApi.testRegistryConfiguration(villagerRequest, workspaceId)
        } throws ThirdPartyIntegrationExceptionLegacy.of(MooveErrorCodeLegacy.REGISTRY_INTEGRATION_ERROR, "")

        every {
            userServiceLegacy.findFromAuthMethods(getAuthorization(), null)
        } returns user

        credentialConfigurationService.testRegistryConfiguration(workspaceId, request, getAuthorization(), null)
        verify(exactly = 1) { villagerApi.testRegistryConfiguration(villagerRequest, workspaceId) }
    }

    @Test(expected = Exception::class)
    fun `when test new azure configuration and unexpected errors happens, method should throw IntegrationExceptionLegacy`() {

        val request = CreateAzureRegistryConfigurationRequest(
            name = "name",
            address = "https://address",
            username = "username",
            password = "password"
        )

        val villagerRequest = CreateVillagerRegistryConfigurationRequest(
            name = "name",
            address = "https://address",
            provider = CreateVillagerRegistryConfigurationProvider.Azure,
            username = "username",
            password = "password",
            authorId = "authorId"
        )

        val workspaceId = "workspaceId"

        every {
            villagerApi.testRegistryConfiguration(villagerRequest, workspaceId)
        } throws Exception()

        every {
            userServiceLegacy.findFromAuthMethods(getAuthorization(), null)
        } returns user

        credentialConfigurationService.testRegistryConfiguration(workspaceId, request, getAuthorization(), null)
        verify(exactly = 1) { villagerApi.testRegistryConfiguration(villagerRequest, workspaceId) }
    }

    @Test
    fun `when creating aws configuration, method should return the correct CredentialConfigurationRepresentation`() {

        val request = CreateAWSRegistryConfigurationRequest(
            name = "name",
            address = "https://address",
            accessKey = "accessKey",
            secretKey = "secretKey",
            region = "region"
        )

        val villagerRequest = CreateVillagerRegistryConfigurationRequest(
            name = "name",
            address = "https://address",
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
            systemTokenId = null,
            createdAt = LocalDateTime.now()
        )
        val expectedResponse =
            CredentialConfigurationRepresentation("id", "name", user.toSimpleRepresentation())

        every {
            villagerApi.createRegistryConfiguration(villagerRequest, workspaceId)
        } returns villagerResponse

        every {
            userServiceLegacy.findFromAuthMethods(getAuthorization(), null)
        } returns user

        val credentialConfiguration = credentialConfigurationService.createRegistryConfig(request, workspaceId, getAuthorization(), null)

        assertEquals(expectedResponse.id, credentialConfiguration.id)
        assertEquals(expectedResponse.name, credentialConfiguration.name)
        assertEquals(expectedResponse.author, credentialConfiguration.author)
    }

    @Test
    fun `when test new valid aws configuration, method should not throw nothing`() {

        val request = CreateAWSRegistryConfigurationRequest(
            name = "name",
            address = "https://address",
            accessKey = "accessKey",
            secretKey = "secretKey",
            region = "region"
        )

        val villagerRequest = CreateVillagerRegistryConfigurationRequest(
            name = "name",
            address = "https://address",
            provider = CreateVillagerRegistryConfigurationProvider.AWS,
            accessKey = "accessKey",
            secretKey = "secretKey",
            region = "region",
            authorId = user.id
        )

        val workspaceId = "workspaceId"

        every {
            villagerApi.testRegistryConfiguration(villagerRequest, workspaceId)
        } returns Unit

        every {
            userServiceLegacy.findFromAuthMethods(getAuthorization(), null)
        } returns user

        credentialConfigurationService.testRegistryConfiguration(workspaceId, request, getAuthorization(), null)
        verify(exactly = 1) { villagerApi.testRegistryConfiguration(villagerRequest, workspaceId) }
    }

    @Test(expected = InvalidRegistryExceptionLegacy::class)
    fun `when test new invalid aws configuration, method should throw InvalidIntegrationRequestExceptionLegacy`() {

        val request = CreateAWSRegistryConfigurationRequest(
            name = "name",
            address = "https://address",
            accessKey = "accessKey",
            secretKey = "secretKey",
            region = "region"
        )

        val villagerRequest = CreateVillagerRegistryConfigurationRequest(
            name = "name",
            address = "https://address",
            provider = CreateVillagerRegistryConfigurationProvider.AWS,
            accessKey = "accessKey",
            secretKey = "secretKey",
            region = "region",
            authorId = user.id
        )

        val workspaceId = "workspaceId"

        every {
            villagerApi.testRegistryConfiguration(villagerRequest, workspaceId)
        } throws IllegalArgumentException()

        every {
            userServiceLegacy.findFromAuthMethods(getAuthorization(), null)
        } returns user

        credentialConfigurationService.testRegistryConfiguration(workspaceId, request, getAuthorization(), null)
        verify(exactly = 1) { villagerApi.testRegistryConfiguration(villagerRequest, workspaceId) }
    }

    @Test(expected = IntegrationExceptionLegacy::class)
    fun `when test new aws configuration and villager not respond, method should throw IntegrationExceptionLegacy`() {

        val request = CreateAWSRegistryConfigurationRequest(
            name = "name",
            address = "https://address",
            accessKey = "accessKey",
            secretKey = "secretKey",
            region = "region"
        )

        val villagerRequest = CreateVillagerRegistryConfigurationRequest(
            name = "name",
            address = "https://address",
            provider = CreateVillagerRegistryConfigurationProvider.AWS,
            accessKey = "accessKey",
            secretKey = "secretKey",
            region = "region",
            authorId = user.id
        )

        val workspaceId = "workspaceId"

        every {
            villagerApi.testRegistryConfiguration(villagerRequest, workspaceId)
        } throws IntegrationExceptionLegacy.of(MooveErrorCodeLegacy.VILLAGER_INTEGRATION_ERROR, "")

        every {
            userServiceLegacy.findFromAuthMethods(getAuthorization(), null)
        } returns user

        credentialConfigurationService.testRegistryConfiguration(workspaceId, request, getAuthorization(), null)
        verify(exactly = 1) { villagerApi.testRegistryConfiguration(villagerRequest, workspaceId) }
    }

    @Test(expected = ThirdPartyIntegrationExceptionLegacy::class)
    fun `when test new aws configuration and registry api not respond, method should throw IntegrationExceptionLegacy`() {

        val request = CreateAWSRegistryConfigurationRequest(
            name = "name",
            address = "https://address",
            accessKey = "accessKey",
            secretKey = "secretKey",
            region = "region"
        )

        val villagerRequest = CreateVillagerRegistryConfigurationRequest(
            name = "name",
            address = "https://address",
            provider = CreateVillagerRegistryConfigurationProvider.AWS,
            accessKey = "accessKey",
            secretKey = "secretKey",
            region = "region",
            authorId = user.id
        )

        val workspaceId = "workspaceId"

        every {
            villagerApi.testRegistryConfiguration(villagerRequest, workspaceId)
        } throws ThirdPartyIntegrationExceptionLegacy.of(MooveErrorCodeLegacy.REGISTRY_INTEGRATION_ERROR, "")

        every {
            userServiceLegacy.findFromAuthMethods(getAuthorization(), null)
        } returns user

        credentialConfigurationService.testRegistryConfiguration(workspaceId, request, getAuthorization(), null)
        verify(exactly = 1) { villagerApi.testRegistryConfiguration(villagerRequest, workspaceId) }
    }

    @Test(expected = Exception::class)
    fun `when test new aws configuration and unexpected errors happens, method should throw IntegrationExceptionLegacy`() {

        val request = CreateAWSRegistryConfigurationRequest(
            name = "name",
            address = "https://address",
            accessKey = "accessKey",
            secretKey = "secretKey",
            region = "region"
        )

        val villagerRequest = CreateVillagerRegistryConfigurationRequest(
            name = "name",
            address = "https://address",
            provider = CreateVillagerRegistryConfigurationProvider.AWS,
            accessKey = "accessKey",
            secretKey = "secretKey",
            region = "region",
            authorId = user.id
        )

        val workspaceId = "workspaceId"

        every {
            villagerApi.testRegistryConfiguration(villagerRequest, workspaceId)
        } throws Exception()

        every {
            userServiceLegacy.findFromAuthMethods(getAuthorization(), null)
        } returns user

        credentialConfigurationService.testRegistryConfiguration(workspaceId, request, getAuthorization(), null)
        verify(exactly = 1) { villagerApi.testRegistryConfiguration(villagerRequest, workspaceId) }
    }

    @Test
    fun `when creating gcp configuration, method should return the correct CredentialConfigurationRepresentation`() {

        val request = CreateGCPRegistryConfigurationRequest(
            name = "name",
            address = "https://address",
            organization = "organization",
            jsonKey = "jsonKey"
        )

        val villagerRequest = CreateVillagerRegistryConfigurationRequest(
            name = "name",
            address = "https://address",
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
            systemTokenId = null,
            createdAt = LocalDateTime.now()
        )

        val authorization = getAuthorization()

        val expectedResponse =
            CredentialConfigurationRepresentation("id", "name", user.toSimpleRepresentation())

        every {
            villagerApi.createRegistryConfiguration(villagerRequest, workspaceId)
        } returns villagerResponse

        every {
            userServiceLegacy.findFromAuthMethods(getAuthorization(), null)
        } returns user

        val credentialConfiguration = credentialConfigurationService.createRegistryConfig(request, workspaceId, authorization, null)

        assertEquals(expectedResponse.id, credentialConfiguration.id)
        assertEquals(expectedResponse.name, credentialConfiguration.name)
        assertEquals(expectedResponse.author, credentialConfiguration.author)
    }

    @Test
    fun `when test actual gcp configuration and is valid, method should not throw nothing`() {

        val request = TestRegistryConnectionRequest(
            configurationId = "configurationId"
        )

        val villagerRequest = TestVillagerRegistryConnectionRequest(
            configurationId = "configurationId"
        )

        val workspaceId = "workspaceId"

        every {
            villagerApi.testRegistryConnection(villagerRequest, workspaceId)
        } returns Unit

        credentialConfigurationService.testRegistryConnection(workspaceId, request)
        verify(exactly = 1) { villagerApi.testRegistryConnection(villagerRequest, workspaceId) }
    }

    @Test(expected = InvalidRegistryExceptionLegacy::class)
    fun `when test actual gcp configuration and is invalid, method should throw InvalidIntegrationRequestExceptionLegacy`() {

        val request = TestRegistryConnectionRequest(
            configurationId = "configurationId"
        )

        val villagerRequest = TestVillagerRegistryConnectionRequest(
            configurationId = "configurationId"
        )

        val workspaceId = "workspaceId"

        every {
            villagerApi.testRegistryConnection(villagerRequest, workspaceId)
        } throws IllegalArgumentException("")

        credentialConfigurationService.testRegistryConnection(workspaceId, request)
        verify(exactly = 1) { villagerApi.testRegistryConnection(villagerRequest, workspaceId) }
    }

    @Test(expected = IntegrationExceptionLegacy::class)
    fun `when test actual gcp configuration and  villager not respond, method should throw IntegrationExceptionLegacy`() {
        val request = TestRegistryConnectionRequest(
            configurationId = "configurationId"
        )

        val villagerRequest = TestVillagerRegistryConnectionRequest(
            configurationId = "configurationId"
        )

        val workspaceId = "workspaceId"

        every {
            villagerApi.testRegistryConnection(villagerRequest, workspaceId)
        } throws IntegrationExceptionLegacy.of(MooveErrorCodeLegacy.VILLAGER_INTEGRATION_ERROR, "")

        credentialConfigurationService.testRegistryConnection(workspaceId, request)
        verify(exactly = 1) { villagerApi.testRegistryConnection(villagerRequest, workspaceId) }
    }

    @Test(expected = IntegrationExceptionLegacy::class)
    fun `when test actual gcp configuration and unexpected error on villager happens, method should throw IntegrationExceptionLegacy`() {
        val request = TestRegistryConnectionRequest(
            configurationId = "configurationId"
        )

        val villagerRequest = TestVillagerRegistryConnectionRequest(
            configurationId = "configurationId"
        )

        val workspaceId = "workspaceId"

        every {
            villagerApi.testRegistryConnection(villagerRequest, workspaceId)
        } throws IntegrationExceptionLegacy.of(MooveErrorCodeLegacy.REGISTRY_GENERAL_ERROR, "")

        credentialConfigurationService.testRegistryConnection(workspaceId, request)
        verify(exactly = 1) { villagerApi.testRegistryConnection(villagerRequest, workspaceId) }
    }

    @Test(expected = ThirdPartyIntegrationExceptionLegacy::class)
    fun `when test actual gcp configuration and registry api not respond, method should throw ThirdPartyIntegrationExceptionLegacy`() {
        val request = TestRegistryConnectionRequest(
            configurationId = "configurationId"
        )

        val villagerRequest = TestVillagerRegistryConnectionRequest(
            configurationId = "configurationId"
        )

        val workspaceId = "workspaceId"

        every {
            villagerApi.testRegistryConnection(villagerRequest, workspaceId)
        } throws ThirdPartyIntegrationExceptionLegacy.of(MooveErrorCodeLegacy.REGISTRY_INTEGRATION_ERROR, "")

        credentialConfigurationService.testRegistryConnection(workspaceId, request)
        verify(exactly = 1) { villagerApi.testRegistryConnection(villagerRequest, workspaceId) }
    }

    @Test(expected = Exception::class)
    fun `when test actual gcp configuration and unexpected errors happens, method should throw Exception`() {
        val request = TestRegistryConnectionRequest(
            configurationId = "configurationId"
        )

        val villagerRequest = TestVillagerRegistryConnectionRequest(
            configurationId = "configurationId"
        )

        val workspaceId = "workspaceId"

        every {
            villagerApi.testRegistryConnection(villagerRequest, workspaceId)
        } throws Exception()

        credentialConfigurationService.testRegistryConnection(workspaceId, request)
        verify(exactly = 1) { villagerApi.testRegistryConnection(villagerRequest, workspaceId) }
    }

    @Test
    fun `when test new valid gcp configuration, method should not throw nothing`() {

        val request = CreateGCPRegistryConfigurationRequest(
            name = "name",
            address = "https://address",
            organization = "organization",
            jsonKey = "jsonKey"
        )

        val villagerRequest = CreateVillagerRegistryConfigurationRequest(
            name = "name",
            address = "https://address",
            provider = CreateVillagerRegistryConfigurationProvider.GCP,
            organization = "organization",
            username = "_json_key",
            jsonKey = "jsonKey",
            authorId = user.id
        )

        val workspaceId = "workspaceId"

        every {
            villagerApi.testRegistryConfiguration(villagerRequest, workspaceId)
        } returns Unit

        every {
            userServiceLegacy.findFromAuthMethods(getAuthorization(), null)
        } returns user

        credentialConfigurationService.testRegistryConfiguration(workspaceId, request, getAuthorization(), null)
        verify(exactly = 1) { villagerApi.testRegistryConfiguration(villagerRequest, workspaceId) }
    }

    @Test(expected = InvalidRegistryExceptionLegacy::class)
    fun `when test new invalid gcp configuration, method should throw InvalidIntegrationRequestExceptionLegacy`() {

        val request = CreateGCPRegistryConfigurationRequest(
            name = "name",
            address = "https://address",
            organization = "organization",
            jsonKey = "jsonKey"
        )

        val villagerRequest = CreateVillagerRegistryConfigurationRequest(
            name = "name",
            address = "https://address",
            provider = CreateVillagerRegistryConfigurationProvider.GCP,
            organization = "organization",
            username = "_json_key",
            jsonKey = "jsonKey",
            authorId = user.id
        )

        val workspaceId = "workspaceId"

        every {
            villagerApi.testRegistryConfiguration(villagerRequest, workspaceId)
        } throws IllegalArgumentException()

        every {
            userServiceLegacy.findFromAuthMethods(getAuthorization(), null)
        } returns user

        credentialConfigurationService.testRegistryConfiguration(workspaceId, request, getAuthorization(), null)
        verify(exactly = 1) { villagerApi.testRegistryConfiguration(villagerRequest, workspaceId) }
    }

    @Test(expected = IntegrationExceptionLegacy::class)
    fun `when test new gcp configuration and villager not respond, method should throw IntegrationExceptionLegacy`() {

        val request = CreateGCPRegistryConfigurationRequest(
            name = "name",
            address = "https://address",
            organization = "organization",
            jsonKey = "jsonKey"
        )

        val villagerRequest = CreateVillagerRegistryConfigurationRequest(
            name = "name",
            address = "https://address",
            provider = CreateVillagerRegistryConfigurationProvider.GCP,
            organization = "organization",
            username = "_json_key",
            jsonKey = "jsonKey",
            authorId = user.id
        )

        val workspaceId = "workspaceId"

        every {
            villagerApi.testRegistryConfiguration(villagerRequest, workspaceId)
        } throws IntegrationExceptionLegacy.of(MooveErrorCodeLegacy.VILLAGER_INTEGRATION_ERROR, "")

        every {
            userServiceLegacy.findFromAuthMethods(getAuthorization(), null)
        } returns user

        credentialConfigurationService.testRegistryConfiguration(workspaceId, request, getAuthorization(), null)
        verify(exactly = 1) { villagerApi.testRegistryConfiguration(villagerRequest, workspaceId) }
    }

    @Test(expected = IntegrationExceptionLegacy::class)
    fun `when test new gcp configuration  and unexpected error on villager happens, method should throw IntegrationExceptionLegacy`() {

        val request = CreateGCPRegistryConfigurationRequest(
            name = "name",
            address = "https://address",
            organization = "organization",
            jsonKey = "jsonKey"
        )

        val villagerRequest = CreateVillagerRegistryConfigurationRequest(
            name = "name",
            address = "https://address",
            provider = CreateVillagerRegistryConfigurationProvider.GCP,
            organization = "organization",
            username = "_json_key",
            jsonKey = "jsonKey",
            authorId = user.id
        )

        val workspaceId = "workspaceId"

        every {
            villagerApi.testRegistryConfiguration(villagerRequest, workspaceId)
        } throws IntegrationExceptionLegacy.of(MooveErrorCodeLegacy.VILLAGER_UNEXPECTED_ERROR, "")

        every {
            userServiceLegacy.findFromAuthMethods(getAuthorization(), null)
        } returns user

        credentialConfigurationService.testRegistryConfiguration(workspaceId, request, getAuthorization(), null)
        verify(exactly = 1) { villagerApi.testRegistryConfiguration(villagerRequest, workspaceId) }
    }

    @Test(expected = ThirdPartyIntegrationExceptionLegacy::class)
    fun `when test new gcp configuration and registry api not respond, method should throw IntegrationExceptionLegacy`() {

        val request = CreateGCPRegistryConfigurationRequest(
            name = "name",
            address = "https://address",
            organization = "organization",
            jsonKey = "jsonKey"
        )

        val villagerRequest = CreateVillagerRegistryConfigurationRequest(
            name = "name",
            address = "https://address",
            provider = CreateVillagerRegistryConfigurationProvider.GCP,
            organization = "organization",
            username = "_json_key",
            jsonKey = "jsonKey",
            authorId = user.id
        )

        val workspaceId = "workspaceId"

        every {
            villagerApi.testRegistryConfiguration(villagerRequest, workspaceId)
        } throws ThirdPartyIntegrationExceptionLegacy.of(MooveErrorCodeLegacy.REGISTRY_INTEGRATION_ERROR, "")

        every {
            userServiceLegacy.findFromAuthMethods(getAuthorization(), null)
        } returns user

        credentialConfigurationService.testRegistryConfiguration(workspaceId, request, getAuthorization(), null)
        verify(exactly = 1) { villagerApi.testRegistryConfiguration(villagerRequest, workspaceId) }
    }

    @Test(expected = Exception::class)
    fun `when test new gcp configuration and unexpected errors happens, method should throw IntegrationExceptionLegacy`() {

        val request = CreateGCPRegistryConfigurationRequest(
            name = "name",
            address = "https://address",
            organization = "organization",
            jsonKey = "jsonKey"
        )

        val villagerRequest = CreateVillagerRegistryConfigurationRequest(
            name = "name",
            address = "https://address",
            provider = CreateVillagerRegistryConfigurationProvider.GCP,
            organization = "organization",
            username = "_json_key",
            jsonKey = "jsonKey",
            authorId = user.id
        )

        val workspaceId = "workspaceId"

        every {
            villagerApi.testRegistryConfiguration(villagerRequest, workspaceId)
        } throws Exception()

        every {
            userServiceLegacy.findFromAuthMethods(getAuthorization(), null)
        } returns user

        credentialConfigurationService.testRegistryConfiguration(workspaceId, request, getAuthorization(), null)
        verify(exactly = 1) { villagerApi.testRegistryConfiguration(villagerRequest, workspaceId) }
    }

    @Test
    fun `when creating docker hub configuration, method should return the correct CredentialConfigurationRepresentation`() {

        val request = CreateDockerHubRegistryConfigurationRequest(
            name = "name",
            address = "https://address",
            username = "username",
            password = "password"
        )

        val villagerRequest = CreateVillagerRegistryConfigurationRequest(
            name = "name",
            address = "https://address",
            provider = CreateVillagerRegistryConfigurationProvider.DOCKER_HUB,
            organization = "username",
            username = "username",
            password = "password",
            authorId = "authorId"
        )

        val villagerResponse = CreateVillagerRegistryConfigurationResponse(
            id = "id"
        )

        val workspaceId = "workspaceId"

        val authorization = getAuthorization()

        val user = User(
            name = "userName",
            id = "authorId",
            email = "user@email.com.br",
            photoUrl = "www.google.com.br",
            isRoot = false,
            systemTokenId = null,
            createdAt = LocalDateTime.now()
        )
        val expectedResponse =
            CredentialConfigurationRepresentation("id", "name", user.toSimpleRepresentation())

        every {
            villagerApi.createRegistryConfiguration(villagerRequest, workspaceId)
        } returns villagerResponse

        every {
            userServiceLegacy.findFromAuthMethods(getAuthorization(), null)
        } returns user

        val credentialConfiguration = credentialConfigurationService.createRegistryConfig(request, workspaceId, authorization, null)

        assertEquals(expectedResponse.id, credentialConfiguration.id)
        assertEquals(expectedResponse.name, credentialConfiguration.name)
        assertEquals(expectedResponse.author, credentialConfiguration.author)
    }

    @Test
    fun `when test new valid docker hub configuration, method should not throw nothing`() {

        val request = CreateDockerHubRegistryConfigurationRequest(
            name = "name",
            address = "https://address",
            username = "username",
            password = "password"
        )

        val villagerRequest = CreateVillagerRegistryConfigurationRequest(
            name = "name",
            address = "https://address",
            provider = CreateVillagerRegistryConfigurationProvider.DOCKER_HUB,
            organization = "username",
            username = "username",
            password = "password",
            authorId = user.id
        )

        val workspaceId = "workspaceId"

        every {
            villagerApi.testRegistryConfiguration(villagerRequest, workspaceId)
        } returns Unit

        every {
            userServiceLegacy.findFromAuthMethods(getAuthorization(), null)
        } returns user

        credentialConfigurationService.testRegistryConfiguration(workspaceId, request, getAuthorization(), null)
        verify(exactly = 1) { villagerApi.testRegistryConfiguration(villagerRequest, workspaceId) }
    }

    @Test(expected = InvalidRegistryExceptionLegacy::class)
    fun `when test new invalid docker hub configuration, method should throw InvalidIntegrationRequestExceptionLegacy`() {

        val request = CreateDockerHubRegistryConfigurationRequest(
            name = "name",
            address = "https://address",
            username = "username",
            password = "password"
        )

        val villagerRequest = CreateVillagerRegistryConfigurationRequest(
            name = "name",
            address = "https://address",
            provider = CreateVillagerRegistryConfigurationProvider.DOCKER_HUB,
            organization = "username",
            username = "username",
            password = "password",
            authorId = user.id
        )

        val workspaceId = "workspaceId"

        every {
            villagerApi.testRegistryConfiguration(villagerRequest, workspaceId)
        } throws IllegalArgumentException()

        every {
            userServiceLegacy.findFromAuthMethods(getAuthorization(), null)
        } returns user

        credentialConfigurationService.testRegistryConfiguration(workspaceId, request, getAuthorization(), null)
        verify(exactly = 1) { villagerApi.testRegistryConfiguration(villagerRequest, workspaceId) }
    }

    @Test(expected = IntegrationExceptionLegacy::class)
    fun `when test new docker hub configuration and villager not respond, method should throw IntegrationExceptionLegacy`() {

        val request = CreateDockerHubRegistryConfigurationRequest(
            name = "name",
            address = "https://address",
            username = "username",
            password = "password"
        )

        val villagerRequest = CreateVillagerRegistryConfigurationRequest(
            name = "name",
            address = "https://address",
            provider = CreateVillagerRegistryConfigurationProvider.DOCKER_HUB,
            organization = "username",
            username = "username",
            password = "password",
            authorId = user.id
        )

        val workspaceId = "workspaceId"

        every {
            villagerApi.testRegistryConfiguration(villagerRequest, workspaceId)
        } throws IntegrationExceptionLegacy.of(MooveErrorCodeLegacy.VILLAGER_REGISTRY_INTEGRATION_ERROR, "")

        every {
            userServiceLegacy.findFromAuthMethods(getAuthorization(), null)
        } returns user

        credentialConfigurationService.testRegistryConfiguration(workspaceId, request, getAuthorization(), null)
        verify(exactly = 1) { villagerApi.testRegistryConfiguration(villagerRequest, workspaceId) }
    }

    @Test(expected = ThirdPartyIntegrationExceptionLegacy::class)
    fun `when test new docker hub configuration and registry api not respond, method should throw IntegrationExceptionLegacy`() {

        val request = CreateDockerHubRegistryConfigurationRequest(
            name = "name",
            address = "https://address",
            username = "username",
            password = "password"
        )

        val villagerRequest = CreateVillagerRegistryConfigurationRequest(
            name = "name",
            address = "https://address",
            provider = CreateVillagerRegistryConfigurationProvider.DOCKER_HUB,
            organization = "username",
            username = "username",
            password = "password",
            authorId = user.id
        )

        val workspaceId = "workspaceId"

        every {
            villagerApi.testRegistryConfiguration(villagerRequest, workspaceId)
        } throws ThirdPartyIntegrationExceptionLegacy.of(MooveErrorCodeLegacy.REGISTRY_INTEGRATION_ERROR, "")

        every {
            userServiceLegacy.findFromAuthMethods(getAuthorization(), null)
        } returns user

        credentialConfigurationService.testRegistryConfiguration(workspaceId, request, getAuthorization(), null)
        verify(exactly = 1) { villagerApi.testRegistryConfiguration(villagerRequest, workspaceId) }
    }

    @Test(expected = Exception::class)
    fun `when test new docker hub configuration and unexpected errors happens, method should throw IntegrationExceptionLegacy`() {

        val request = CreateDockerHubRegistryConfigurationRequest(
            name = "name",
            address = "https://address",
            username = "username",
            password = "password"
        )

        val villagerRequest = CreateVillagerRegistryConfigurationRequest(
            name = "name",
            address = "https://address",
            provider = CreateVillagerRegistryConfigurationProvider.DOCKER_HUB,
            organization = "username",
            username = "username",
            password = "password",
            authorId = user.id
        )

        val workspaceId = "workspaceId"

        every {
            villagerApi.testRegistryConfiguration(villagerRequest, workspaceId)
        } throws Exception()

        every {
            userServiceLegacy.findFromAuthMethods(getAuthorization(), null)
        } returns user

        credentialConfigurationService.testRegistryConfiguration(workspaceId, request, getAuthorization(), null)
        verify(exactly = 1) { villagerApi.testRegistryConfiguration(villagerRequest, workspaceId) }
    }

    @Test(expected = NotFoundExceptionLegacy::class)
    fun `when creating registry configuration, method should throw NotFoundException when user is not found`() {

        val request = CreateAWSRegistryConfigurationRequest(
            name = "name",
            address = "https://address",
            accessKey = "accessKey",
            secretKey = "secretKey",
            region = "region"
        )

        val workspaceId = "workspaceId"

        every {
            userServiceLegacy.findFromAuthMethods(getAuthorization(), null)
        }.throws(NotFoundExceptionLegacy("user", "authorID"))

        credentialConfigurationService.createRegistryConfig(request, workspaceId, getAuthorization(), null)
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
            userServiceLegacy.findUser("authorId")
        } returns user

        val credentialConfigurations: Map<String, List<CredentialConfigurationRepresentation>> =
            credentialConfigurationService.getConfigurationsByType(workspaceId)

        assertEquals(expectedResult, credentialConfigurations)
    }

    @Test(expected = IllegalArgumentException::class)
    fun `when creating cd configuration, method should throw illegal argument exception for invalid type`() {

        class CreateCustomCdConfigurationRequest : CreateCdConfigurationRequest(CdTypeEnum.OCTOPIPE)

        val incomingRequest = CreateCustomCdConfigurationRequest()

        every {
            userServiceLegacy.findFromAuthMethods(getAuthorization(), null)
        } returns user

        val workspaceId = "workspaceId"
        credentialConfigurationService.createCdConfig(incomingRequest, workspaceId, getAuthorization(), null)
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

    private fun getAuthorization(): String {
        return "Bearer eydGF0ZSI6ImE4OTZmOGFhLTIwZDUtNDI5Ny04YzM2LTdhZWJmZ_qq3"
    }
}
