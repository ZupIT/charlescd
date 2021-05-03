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

package io.charlescd.moove.application.deployment.impl

import io.charlescd.moove.application.*
import io.charlescd.moove.domain.MooveErrorCode
import io.charlescd.moove.domain.exceptions.BusinessException
import io.charlescd.moove.domain.exceptions.NotFoundException
import io.charlescd.moove.domain.repository.DeploymentConfigurationRepository
import io.charlescd.moove.domain.repository.SystemTokenRepository
import io.charlescd.moove.domain.repository.UserRepository
import io.charlescd.moove.domain.repository.WorkspaceRepository
import io.charlescd.moove.domain.service.ManagementUserSecurityService
import io.charlescd.moove.infrastructure.service.client.DeployClient
import io.charlescd.moove.infrastructure.service.client.response.Log
import io.charlescd.moove.infrastructure.service.client.response.LogResponse
import spock.lang.Specification

import java.time.LocalDateTime

class FindDeploymentLogsInteractorTest extends Specification {
    def userRepository = Mock(UserRepository)
    def systemTokenRepository = Mock(SystemTokenRepository)
    private SystemTokenService systemTokenService = new SystemTokenService(systemTokenRepository)
    def workspaceRepository = Mock(WorkspaceRepository)
    def deploymentConfigurationRepository = Mock(DeploymentConfigurationRepository)
    def managementUserSecurityService = Mock(ManagementUserSecurityService)
    def userService = new UserService(userRepository, systemTokenService, managementUserSecurityService)
    def workspaceService = new WorkspaceService(workspaceRepository, userRepository)
    def deploymentConfigurationService = new DeploymentConfigurationService(deploymentConfigurationRepository)
    def deployClient = Mock(DeployClient)

    def findDeploymentLogsInteractor = new FindDeploymentLogsInteractorImpl(userService, workspaceService, deploymentConfigurationService, deployClient)


    def 'should return the correct log response using authorization'() {
        given:
        def workspaceId = TestUtils.workspaceId
        def authorization = TestUtils.authorization
        def author = TestUtils.user
        def deploymentId = TestUtils.deploymentId
        def workspace = TestUtils.workspace
        def deploymentConfiguration = TestUtils.deploymentConfig
        def log = new Log("INFO", "log title", "log details", LocalDateTime.now().toString())
        def logResponse = new LogResponse(
                [log]
        )

        when:
        def response = findDeploymentLogsInteractor.execute(workspaceId, authorization, null, deploymentId)
        then:
        1 * workspaceRepository.find(workspaceId) >> Optional.of(workspace)
        1 * deploymentConfigurationRepository.find(workspace.deploymentConfigurationId) >> Optional.of(deploymentConfiguration)
        1 * managementUserSecurityService.getUserEmail(authorization) >> author.email
        1 * userRepository.findByEmail(author.email) >> Optional.of(author)
        1 * deployClient.getDeploymentLogs(URI.create(deploymentConfiguration.butlerUrl), workspaceId, deploymentId) >> logResponse

        assert response.logs.size() == logResponse.logs.size()
        assert response.logs[0].title == logResponse.logs[0].title
        assert response.logs[0].details == logResponse.logs[0].details

    }

    def 'should return the correct log response using system token'() {
        given:
        def workspaceId = TestUtils.workspaceId
        def workspace = TestUtils.workspace
        def systemTokenValue = TestUtils.systemTokenValue
        def systemTokenId = TestUtils.systemTokenId
        def deploymentId = '083337ef-6177-4a24-b32e-f7429336ec20'
        def log = new Log("INFO", "log title", "log details", LocalDateTime.now().toString())
        def logResponse = new LogResponse(
                [log]
        )
        def deploymentConfiguration = TestUtils.deploymentConfig

        when:
        def response = findDeploymentLogsInteractor.execute(workspaceId, null, systemTokenValue, deploymentId)
        then:
        1 * workspaceRepository.find(workspaceId) >> Optional.of(workspace)
        1 * deploymentConfigurationRepository.find(workspace.deploymentConfigurationId) >> Optional.of(deploymentConfiguration)
        1 * systemTokenRepository.getIdByTokenValue(systemTokenValue) >> systemTokenId
        1 * userRepository.findBySystemTokenId(systemTokenId) >> Optional.of(TestUtils.user)
        1 * deployClient.getDeploymentLogs(URI.create(deploymentConfiguration.butlerUrl), workspaceId, deploymentId) >> logResponse
        assert response.logs.size() == logResponse.logs.size()
        assert response.logs[0].title == logResponse.logs[0].title
        assert response.logs[0].details == logResponse.logs[0].details

    }

    def "when workspace does not exist should throw not found exception"() {
        given:
        def workspaceId = TestUtils.workspaceId
        def authorization = TestUtils.authorization
        def deploymentId = TestUtils.deploymentId

        when:
        this.findDeploymentLogsInteractor.execute(workspaceId, authorization, null, deploymentId)

        then:
        1 * workspaceRepository.find(workspaceId) >> Optional.empty()

        def ex = thrown(NotFoundException)
        ex.resourceName == "workspace"
        ex.id == workspaceId
    }

    def "when workspace does not have deployment configuration should throw business exception"() {
        given:
        def workspaceId = TestUtils.workspaceId
        def authorization = TestUtils.authorization
        def deploymentId = TestUtils.deploymentId
        def workspace = TestUtils.workspaceWithoutDeploymentConfiguration

        when:
        this.findDeploymentLogsInteractor.execute(workspaceId, authorization, null, deploymentId)

        then:
        1 * workspaceRepository.find(workspaceId) >> Optional.of(workspace)

        def ex = thrown(BusinessException)
        ex.errorCode == MooveErrorCode.WORKSPACE_DEPLOYMENT_CONFIGURATION_IS_MISSING
    }

    def "when deployment configuration was not found should throw not found exception"() {
        given:
        def workspaceId = TestUtils.workspaceId
        def authorization = TestUtils.authorization
        def deploymentId = TestUtils.deploymentId
        def workspace = TestUtils.workspace

        when:
        this.findDeploymentLogsInteractor.execute(workspaceId, authorization, null, deploymentId)

        then:
        1 * workspaceRepository.find(workspaceId) >> Optional.of(workspace)
        1 * deploymentConfigurationRepository.find(workspace.deploymentConfigurationId) >> Optional.empty()

        def ex = thrown(NotFoundException)
        ex.resourceName == "deploymentConfiguration"
        ex.id == workspace.deploymentConfigurationId
    }

    def 'when user is not found by authorization token should throw exception'() {
        given:
        def author = TestUtils.user
        def workspaceId = TestUtils.workspaceId
        def authorization = TestUtils.authorization
        def deploymentId = TestUtils.deploymentId
        def workspace = TestUtils.workspace
        def deploymentConfiguration = TestUtils.deploymentConfig

        when:
        findDeploymentLogsInteractor.execute(workspaceId, authorization, null, deploymentId)

        then:
        1 * workspaceRepository.find(workspaceId) >> Optional.of(workspace)
        1 * deploymentConfigurationRepository.find(workspace.deploymentConfigurationId) >> Optional.of(deploymentConfiguration)
        1 * managementUserSecurityService.getUserEmail(authorization) >> author.email
        1 * userRepository.findByEmail(author.email) >> Optional.empty()
        0 * deployClient.getDeploymentLogs(workspaceId, deploymentId)

        def ex = thrown(NotFoundException)
        ex.resourceName == "user"
        ex.id == author.email
    }

}
