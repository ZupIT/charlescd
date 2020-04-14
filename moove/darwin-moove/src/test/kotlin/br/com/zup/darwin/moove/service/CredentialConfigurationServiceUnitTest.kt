/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.moove.service

import br.com.zup.darwin.commons.extension.toRepresentation
import br.com.zup.darwin.commons.extension.toSimpleRepresentation
import br.com.zup.darwin.commons.representation.CredentialConfigurationRepresentation
import br.com.zup.darwin.entity.CredentialConfiguration
import br.com.zup.darwin.entity.CredentialConfigurationType
import br.com.zup.darwin.entity.User
import br.com.zup.darwin.moove.api.DeployApi
import br.com.zup.darwin.moove.api.response.CreateDeployCdConfigurationResponse
import br.com.zup.darwin.moove.api.response.GetDeployCdConfigurationsResponse
import br.com.zup.darwin.moove.request.configuration.*
import br.com.zup.darwin.moove.api.VillagerApi
import br.com.zup.darwin.moove.api.request.CreateVillagerRegistryConfigurationProvider
import br.com.zup.darwin.moove.api.request.CreateVillagerRegistryConfigurationRequest
import br.com.zup.darwin.moove.api.response.CreateVillagerRegistryConfigurationResponse
import br.com.zup.darwin.moove.api.response.GetVillagerRegistryConfigurationsResponse
import br.com.zup.darwin.repository.CredentialConfigurationRepository
import br.com.zup.darwin.repository.UserRepository
import br.com.zup.exception.handler.exception.NotFoundException
import io.mockk.every
import io.mockk.mockkClass
import org.junit.Test
import java.lang.IllegalArgumentException
import java.time.LocalDateTime
import java.util.*
import kotlin.test.assertEquals

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
        createdAt = LocalDateTime.now()
    )

    private val gitCredentialConfiguration = CredentialConfiguration(
        name = "credential configuration name",
        id = "fe00608c-17f4-43fd-86e5-68de8961cbf9",
        createdAt = LocalDateTime.now(),
        author = user,
        type = CredentialConfigurationType.GIT,
        applicationId = "applicationId"
    )

    private val registryCredentialConfiguration = CredentialConfiguration(
        name = "credential configuration name",
        id = "fe00608c-17f4-43fd-86e5-68de8961cbf9",
        createdAt = LocalDateTime.now(),
        author = user,
        type = CredentialConfigurationType.REGISTRY,
        applicationId = "applicationId"
    )

    @Test
    fun `when creating spinnaker cd configuration, method should return the correct CredentialConfigurationRepresentation`() {

        val createdAt = LocalDateTime.now()
        val incomingRequestConfigData = CreateSpinnakerCdConfigurationData("account", "namespace")
        val incomingRequest = CreateSpinnakerCdConfigurationRequest(incomingRequestConfigData, "name", "authorId")
        val deployRequest = incomingRequest.toDeployRequest()
        val deployResponse = CreateDeployCdConfigurationResponse("id", "name", "authorId", "applicationId", createdAt)
        val applicationId = "applicationId"
        val user = User(
            name = "userName",
            id = "authorId",
            email = "user@email.com.br",
            photoUrl = "www.google.com.br",
            createdAt = LocalDateTime.now()
        )
        val expectedResponse = CredentialConfigurationRepresentation("id", "name", user.toSimpleRepresentation())

        every {
            deployApi.createCdConfiguration(deployRequest, applicationId)
        } returns deployResponse

        every {
            userRepository.findById("authorId")
        } returns Optional.of(user)

        val credentialConfiguration = credentialConfigurationService.createCdConfig(incomingRequest, applicationId)

        assertEquals(expectedResponse, credentialConfiguration)
    }

    @Test
    fun `when creating octopipe cd configuration, method should return the correct CredentialConfigurationRepresentation`() {

        val createdAt = LocalDateTime.now()
        val incomingRequestConfigData = CreateOctopipeCdConfigurationData("git-user", "git-pass", "namespace")
        val incomingRequest = CreateOctopipeCdConfigurationRequest(incomingRequestConfigData, "name", "authorId")
        val deployRequest = incomingRequest.toDeployRequest()
        val deployResponse = CreateDeployCdConfigurationResponse("id", "name", "authorId", "applicationId", createdAt)
        val applicationId = "applicationId"
        val user = User(
            name = "userName",
            id = "authorId",
            email = "user@email.com.br",
            photoUrl = "www.google.com.br",
            createdAt = LocalDateTime.now()
        )
        val expectedResponse = CredentialConfigurationRepresentation("id", "name", user.toSimpleRepresentation())

        every {
            deployApi.createCdConfiguration(deployRequest, applicationId)
        } returns deployResponse

        every {
            userRepository.findById("authorId")
        } returns Optional.of(user)

        val credentialConfiguration = credentialConfigurationService.createCdConfig(incomingRequest, applicationId)

        assertEquals(expectedResponse, credentialConfiguration)
    }

    @Test
    fun `should correctly return cd configurations returned from charles-deploy`() {

        val createdAt = LocalDateTime.now()

        val applicationId = "applicationId"

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

        val deployResponse = listOf(GetDeployCdConfigurationsResponse(
            "k8s-id",
            "name",
            "authorId",
            "applicationId",
            createdAt
        ))
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
            credentialConfigurationRepository.findAllByApplicationId(applicationId)
        } returns listOf(gitCredentialConfiguration, registryCredentialConfiguration)

        every {
            villagerApi.getRegistryConfigurations(applicationId)
        } returns villagerResponse

        every {
            deployApi.getCdConfigurations(applicationId)
        } returns deployResponse

        every {
            userRepository.findById("authorId")
        } returns Optional.of(user)

        val credentialConfigurations: Map<String, List<CredentialConfigurationRepresentation>> =
            credentialConfigurationService.getConfigurationsByType(applicationId)

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

        val applicationId = "applicationId"
        val user = User(
            name = "userName",
            id = "authorId",
            email = "user@email.com.br",
            photoUrl = "www.google.com.br",
            createdAt = LocalDateTime.now()
        )
        val expectedResponse =
            CredentialConfigurationRepresentation("id", "name", user.toSimpleRepresentation())

        every {
            villagerApi.createRegistryConfiguration(villagerRequest, applicationId)
        } returns villagerResponse

        every {
            userRepository.findById("authorId")
        } returns Optional.of(user)

        val credentialConfiguration = credentialConfigurationService.createRegistryConfig(request, applicationId)

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

        val applicationId = "applicationId"
        val user = User(
            name = "userName",
            id = "authorId",
            email = "user@email.com.br",
            photoUrl = "www.google.com.br",
            createdAt = LocalDateTime.now()
        )
        val expectedResponse =
            CredentialConfigurationRepresentation("id", "name", user.toSimpleRepresentation())

        every {
            villagerApi.createRegistryConfiguration(villagerRequest, applicationId)
        } returns villagerResponse

        every {
            userRepository.findById("authorId")
        } returns Optional.of(user)

        val credentialConfiguration = credentialConfigurationService.createRegistryConfig(request, applicationId)

        assertEquals(expectedResponse.id, credentialConfiguration.id)
        assertEquals(expectedResponse.name, credentialConfiguration.name)
        assertEquals(expectedResponse.author, credentialConfiguration.author)

    }

    @Test(expected = NotFoundException::class)
    fun `when creating registry configuration, method should throw NotFoundException when user is not found`() {

        val request = CreateAWSRegistryConfigurationRequest(
            name = "name",
            address = "address",
            accessKey = "accessKey",
            secretKey = "secretKey",
            region = "region",
            authorId = "authorId"
        )

        val applicationId = "applicationId"

        every {
            userRepository.findById("authorId")
        } returns Optional.empty()

        credentialConfigurationService.createRegistryConfig(request, applicationId)

    }

    @Test
    fun `should correctly return registry configurations returned from charles-villager`() {

        val applicationId = "applicationId"

        val deployResponse = listOf(
            GetDeployCdConfigurationsResponse(
                "k8s-id",
                "name",
                "authorId",
                "applicationId",
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
            credentialConfigurationRepository.findAllByApplicationId(applicationId)
        } returns listOf(gitCredentialConfiguration)

        every {
            villagerApi.getRegistryConfigurations(applicationId)
        } returns villagerResponse

        every {
            deployApi.getCdConfigurations(applicationId)
        } returns deployResponse

        every {
            userRepository.findById("authorId")
        } returns Optional.of(user)

        val credentialConfigurations: Map<String, List<CredentialConfigurationRepresentation>> =
            credentialConfigurationService.getConfigurationsByType(applicationId)

        assertEquals(expectedResult, credentialConfigurations)
    }

    @Test(expected = IllegalArgumentException::class)
    fun `when creating cd configuration, method should throw illegal argument exception for invalid type`() {

        class CreateCustomCdConfigurationRequest: CreateCdConfigurationRequest(CdTypeEnum.OCTOPIPE, user.id)
        val incomingRequest = CreateCustomCdConfigurationRequest()

        every {
            userRepository.findById(user.id)
        } returns Optional.of(user)

        val applicationId = "applicationId"
        credentialConfigurationService.createCdConfig(incomingRequest, applicationId)
    }

}