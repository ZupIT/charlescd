/*
 * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package io.charlescd.moove.application.configuration.impl

import io.charlescd.moove.application.UserService
import io.charlescd.moove.application.WorkspaceService
import io.charlescd.moove.application.configuration.CreateDeploymentConfigurationInteractor
import io.charlescd.moove.application.configuration.request.CreateDeploymentConfigurationRequest
import io.charlescd.moove.application.configuration.response.DeploymentConfigurationResponse
import io.charlescd.moove.domain.DeploymentConfiguration
import io.charlescd.moove.domain.MooveErrorCode
import io.charlescd.moove.domain.User
import io.charlescd.moove.domain.exceptions.BusinessException
import io.charlescd.moove.domain.exceptions.ConflictException
import io.charlescd.moove.domain.repository.DeploymentConfigurationRepository
import io.charlescd.moove.infrastructure.service.DeployClientService
import javax.inject.Named
import org.springframework.dao.DuplicateKeyException

@Named
class CreateDeploymentConfigurationInteractorImpl(
    private val deploymentConfigurationRepository: DeploymentConfigurationRepository,
    private val userService: UserService,
    private val deployClientService: DeployClientService,
    private val workspaceService: WorkspaceService
) : CreateDeploymentConfigurationInteractor {

    override fun execute(request: CreateDeploymentConfigurationRequest, workspaceId: String, authorization: String): DeploymentConfigurationResponse {

        workspaceService.checkIfWorkspaceExists(workspaceId)

        validateButlerUrl(request.butlerUrl)

        val author = userService.findByAuthorizationToken(authorization)

        checkIfDeploymentConfigurationExistsOnWorkspace(workspaceId)

        val saved = saveDeploymentConfiguration(request, workspaceId, author)

        return DeploymentConfigurationResponse(saved.id, saved.name, saved.gitProvider)
    }

    private fun saveDeploymentConfiguration(request: CreateDeploymentConfigurationRequest, workspaceId: String, author: User): DeploymentConfiguration {
        return try {
            this.deploymentConfigurationRepository.save(request.toDeploymentConfiguration(workspaceId, author))
        } catch (duplicateKeyException: DuplicateKeyException) {
            throw ConflictException("Butler url '${request.butlerUrl}' already registered with namespace '${request.namespace}' in another workspace")
        }
    }

    private fun validateButlerUrl(butlerUrl: String) {
        try {
            this.deployClientService.healthCheck(butlerUrl)
        } catch (exception: Exception) {
            throw BusinessException.of(MooveErrorCode.INVALID_BUTLER_URL_ERROR)
        }
    }

    private fun checkIfDeploymentConfigurationExistsOnWorkspace(workspaceId: String) {
        if (deploymentConfigurationRepository.existsAnyByWorkspaceId(workspaceId)) {
            throw BusinessException.of(MooveErrorCode.DEPLOYMENT_CONFIGURATION_ALREADY_REGISTERED)
        }
    }
}
