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
import br.com.zup.darwin.moove.api.VillagerApi
import br.com.zup.darwin.moove.api.request.CreateDeployCdConfigurationRequest
import br.com.zup.darwin.moove.api.request.CreateVillagerRegistryConfigurationProvider
import br.com.zup.darwin.moove.api.request.CreateVillagerRegistryConfigurationRequest
import br.com.zup.darwin.moove.api.response.CreateDeployCdConfigurationResponse
import br.com.zup.darwin.moove.api.response.CreateVillagerRegistryConfigurationResponse
import br.com.zup.darwin.moove.api.response.GetDeployCdConfigurationsResponse
import br.com.zup.darwin.moove.request.configuration.*
import br.com.zup.darwin.repository.CredentialConfigurationRepository
import br.com.zup.darwin.repository.UserRepository
import br.com.zup.exception.handler.exception.NotFoundException
import br.com.zup.exception.handler.to.ResourceValue
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import java.util.*

@Service
class CredentialConfigurationService(
    val credentialConfigurationRepository: CredentialConfigurationRepository,
    val userRepository: UserRepository,
    val deployApi: DeployApi,
    val villagerApi: VillagerApi
) {

    companion object {
        const val GIT_SERVICE_NAME = "git"
        const val REGISTRY_SERVICE_NAME = "registry"
        const val CD_SERVICE_NAME = "cd"
    }

    fun createRegistryConfig(
        createRegistryConfigRequest: CreateRegistryConfigurationRequest,
        applicationId: String
    ): CredentialConfigurationRepresentation {

        val user: User = findUser(createRegistryConfigRequest.authorId)

        val villagerRequest: CreateVillagerRegistryConfigurationRequest =
            buildVillagerRegistryConfigurationRequest(createRegistryConfigRequest)

        val villagerResponse: CreateVillagerRegistryConfigurationResponse =
            villagerApi.createRegistryConfiguration(villagerRequest, applicationId)

        return CredentialConfigurationRepresentation(
            villagerResponse.id,
            createRegistryConfigRequest.name,
            user.toSimpleRepresentation()
        )
    }

    fun createCdConfig(
        createCdConfigRequest: CreateCdConfigurationRequest,
        applicationId: String
    ): CredentialConfigurationRepresentation {

        val user: User = findUser(createCdConfigRequest.authorId)

        val deployRequest: CreateDeployCdConfigurationRequest =
            buildDeployCdConfigurationRequest(createCdConfigRequest)
        val deployResponse: CreateDeployCdConfigurationResponse =
            deployApi.createCdConfiguration(deployRequest, applicationId)

        return CredentialConfigurationRepresentation(
            deployResponse.id,
            deployResponse.name,
            user.toSimpleRepresentation()
        )
    }

    fun getConfigurationById(id: String, applicationId: String): CredentialConfigurationRepresentation {
        return credentialConfigurationRepository.findByIdAndApplicationId(id, applicationId)
            .orElseThrow { NotFoundException(ResourceValue("configuration", id)) }
            .toRepresentation()
    }

    fun getConfigurationsByType(applicationId: String): Map<String, List<CredentialConfigurationRepresentation>> {
        return mapOf(
            GIT_SERVICE_NAME to credentialConfigurationRepository.findAllByApplicationId(applicationId)
                .filterCredentialsByType(CredentialConfigurationType.GIT),
            REGISTRY_SERVICE_NAME to getVillagerRegistryConfigurations(applicationId),
            CD_SERVICE_NAME to getDeployCdConfigurations(applicationId)
        )
    }

    private fun List<CredentialConfiguration>.filterCredentialsByType(type: CredentialConfigurationType): List<CredentialConfigurationRepresentation> {
        return this.filter { it.type == type }.map { it.toRepresentation() }
    }

    private fun buildVillagerRegistryConfigurationRequest(
        createRegistryConfigRequest: CreateRegistryConfigurationRequest
    ): CreateVillagerRegistryConfigurationRequest {
        return when (createRegistryConfigRequest) {
            is CreateAzureRegistryConfigurationRequest -> buildAzureRegistryRequest(createRegistryConfigRequest)
            is CreateAWSRegistryConfigurationRequest -> buildAWSRegistryRequest(createRegistryConfigRequest)
            else -> throw IllegalArgumentException("Provider type not supported")
        }
    }

    private fun buildAWSRegistryRequest(createRegistryConfigRequest: CreateAWSRegistryConfigurationRequest): CreateVillagerRegistryConfigurationRequest {
        return CreateVillagerRegistryConfigurationRequest(
            name = createRegistryConfigRequest.name,
            address = createRegistryConfigRequest.address,
            provider = CreateVillagerRegistryConfigurationProvider.AWS,
            accessKey = createRegistryConfigRequest.accessKey,
            secretKey = createRegistryConfigRequest.secretKey,
            region = createRegistryConfigRequest.region,
            authorId = createRegistryConfigRequest.authorId
        )
    }

    private fun buildAzureRegistryRequest(createRegistryConfigRequest: CreateAzureRegistryConfigurationRequest): CreateVillagerRegistryConfigurationRequest {
        return CreateVillagerRegistryConfigurationRequest(
            name = createRegistryConfigRequest.name,
            address = createRegistryConfigRequest.address,
            provider = CreateVillagerRegistryConfigurationProvider.Azure,
            username = createRegistryConfigRequest.username,
            password = createRegistryConfigRequest.password,
            authorId = createRegistryConfigRequest.authorId
        )
    }

    private fun buildDeployCdConfigurationRequest(
        createCdConfigRequest: CreateCdConfigurationRequest
    ): CreateDeployCdConfigurationRequest {

        return when {
            createCdConfigRequest is CreateSpinnakerCdConfigurationRequest -> createCdConfigRequest.toDeployRequest()
            createCdConfigRequest is CreateOctopipeCdConfigurationRequest -> createCdConfigRequest.toDeployRequest()
            else -> throw IllegalArgumentException("Invalid cd configuration type")
        }
    }

    private fun getDeployCdConfigurations(applicationId: String): List<CredentialConfigurationRepresentation> {
        val deployCdConfigurations: List<GetDeployCdConfigurationsResponse> =
            deployApi.getCdConfigurations(applicationId)

        return deployCdConfigurations.map { configuration ->
            CredentialConfigurationRepresentation(
                configuration.id,
                configuration.name,
                findUser(configuration.authorId).toSimpleRepresentation()
            )
        }
    }

    private fun getVillagerRegistryConfigurations(applicationId: String): List<CredentialConfigurationRepresentation> {
        return this.villagerApi.getRegistryConfigurations(applicationId)
            .map { configuration ->
                CredentialConfigurationRepresentation(
                    configuration.id,
                    configuration.name,
                    findUser(configuration.authorId).toSimpleRepresentation()
                )
            }
    }

    private fun buildGitCredentialsWithToken(createGitConfigRequest: CreateGitConfigurationRequest): Map<String, Any> {
        return mapOf(
            "address" to createGitConfigRequest.address,
            "accessToken" to createGitConfigRequest.accessToken.orEmpty(),
            "serviceProvider" to createGitConfigRequest.serviceProvider.name
        )
    }

    private fun buildGitCredentialsWithLogin(createGitConfigRequest: CreateGitConfigurationRequest): Map<String, Any> {
        return mapOf(
            "address" to createGitConfigRequest.address,
            "username" to createGitConfigRequest.username.orEmpty(),
            "password" to createGitConfigRequest.password.orEmpty(),
            "serviceProvider" to createGitConfigRequest.serviceProvider.name
        )
    }

    private fun findUser(id: String): User =
        this.userRepository.findById(id)
            .orElseThrow { NotFoundException(ResourceValue("user", id)) }

    private fun CreateGitConfigurationRequest.toEntity(applicationId: String): CredentialConfiguration {
        return CredentialConfiguration(
            id = UUID.randomUUID().toString(),
            name = this.name,
            createdAt = LocalDateTime.now(),
            author = findUser(this.authorId),
            type = CredentialConfigurationType.GIT,
            applicationId = applicationId
        )
    }

}