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

import io.charlescd.moove.application.TestUtils
import io.charlescd.moove.application.UserService
import io.charlescd.moove.application.WorkspaceService
import io.charlescd.moove.application.configuration.CreateDeploymentConfigurationInteractor
import io.charlescd.moove.application.configuration.request.CreateDeploymentConfigurationRequest
import io.charlescd.moove.domain.DeploymentConfiguration
import io.charlescd.moove.domain.GitProviderEnum
import io.charlescd.moove.domain.exceptions.BusinessException
import io.charlescd.moove.domain.exceptions.NotFoundException
import io.charlescd.moove.domain.repository.DeploymentConfigurationRepository
import io.charlescd.moove.domain.repository.UserRepository
import io.charlescd.moove.domain.repository.WorkspaceRepository
import io.charlescd.moove.domain.service.ManagementUserSecurityService
import io.charlescd.moove.infrastructure.service.client.response.GetDeployCdConfigurationsResponse
import spock.lang.Specification

import java.time.LocalDateTime

class CreateDeploymentConfigurationInteractorImplTest extends Specification {

    private CreateDeploymentConfigurationInteractor createDeploymentConfigurationInteractor

    private DeploymentConfigurationRepository deploymentConfigurationRepository = Mock(DeploymentConfigurationRepository)
    private WorkspaceRepository workspaceRepository = Mock(WorkspaceRepository)
    private UserRepository userRepository = Mock(UserRepository)
    private ManagementUserSecurityService managementUserSecurityService = Mock(ManagementUserSecurityService)


    void setup() {
        this.createDeploymentConfigurationInteractor = new CreateDeploymentConfigurationInteractorImpl(deploymentConfigurationRepository,
                new UserService(userRepository, managementUserSecurityService), new WorkspaceService(workspaceRepository, userRepository))
    }

    def "when workspace does not exist should throw exception"() {
        given:
        def workspaceId = TestUtils.workspaceId
        def authorization = TestUtils.authorization
        def createDeploymentConfigurationRequest =
                new CreateDeploymentConfigurationRequest("Test", "https://butler-url.com.br", "charlescd", "token", GitProviderEnum.GITHUB)

        when:
        this.createDeploymentConfigurationInteractor.execute(createDeploymentConfigurationRequest, workspaceId, authorization)

        then:
        1 * workspaceRepository.exists(workspaceId) >> false

        def ex = thrown(NotFoundException)
        ex.resourceName == "workspace"
        ex.id == workspaceId
    }


    def "when user does not exist should throw an exception"() {
        given:
        def author = TestUtils.user
        def workspaceId = TestUtils.workspaceId
        def authorization = TestUtils.authorization
        def createDeploymentConfigurationRequest =
                new CreateDeploymentConfigurationRequest("Test", "https://butler-url.com.br", "charlescd", "token", GitProviderEnum.GITHUB)


        when:
        this.createDeploymentConfigurationInteractor.execute(createDeploymentConfigurationRequest, workspaceId, authorization)

        then:
        1 * this.workspaceRepository.exists(workspaceId) >> true
        1 * managementUserSecurityService.getUserEmail(authorization) >> author.email
        1 * userRepository.findByEmail(author.email) >> Optional.empty()
        def ex = thrown(NotFoundException)
        ex.resourceName == "user"
    }


    def "when configuration already registered on workspace should throw an exception"() {
        given:
        def author = TestUtils.user
        def workspaceId = TestUtils.workspaceId
        def authorization = TestUtils.authorization
        def createDeploymentConfigurationRequest =
                new CreateDeploymentConfigurationRequest("Test", "https://butler-url.com.br", "charlescd", "token", GitProviderEnum.GITHUB)

        when:
        this.createDeploymentConfigurationInteractor.execute(createDeploymentConfigurationRequest, workspaceId, authorization)

        then:
        1 * this.workspaceRepository.exists(workspaceId) >> true
        1 * managementUserSecurityService.getUserEmail(authorization) >> author.email
        1 * userRepository.findByEmail(author.email) >> Optional.of(author)
        1 * deploymentConfigurationRepository.existsAnyByWorkspaceId(workspaceId) >> true
        thrown(BusinessException)
    }


    def "should return cd configuration response"() {
        given:
        def author = TestUtils.user
        def workspaceId = TestUtils.workspaceId
        def authorization = TestUtils.authorization
        def createDeploymentConfigurationRequest =
                new CreateDeploymentConfigurationRequest("Test", "https://butler-url.com.br", "charlescd", "token", GitProviderEnum.GITHUB)

        when:
        def cdConfigurationResponse = this.createDeploymentConfigurationInteractor.execute(createDeploymentConfigurationRequest, workspaceId, authorization)

        then:
        1 * this.workspaceRepository.exists(workspaceId) >> true
        1 * managementUserSecurityService.getUserEmail(authorization) >> author.email
        1 * userRepository.findByEmail(author.email) >> Optional.of(author)
        1 * deploymentConfigurationRepository.existsAnyByWorkspaceId(workspaceId) >> false
        1 * this.deploymentConfigurationRepository.save(_) >> { argument ->
            def savedCdConfiguration = argument[0]
            assert savedCdConfiguration instanceof DeploymentConfiguration
            assert savedCdConfiguration.id != null
            assert savedCdConfiguration.name == createDeploymentConfigurationRequest.name
            assert savedCdConfiguration.createdAt != null
            assert savedCdConfiguration.author.id == author.id
            assert savedCdConfiguration.workspaceId == workspaceId
            assert savedCdConfiguration.butlerUrl == createDeploymentConfigurationRequest.butlerUrl
            assert savedCdConfiguration.gitProvider == createDeploymentConfigurationRequest.gitProvider
            assert savedCdConfiguration.gitToken == createDeploymentConfigurationRequest.gitToken
            return savedCdConfiguration
        }

        notThrown()

        assert cdConfigurationResponse != null
        assert cdConfigurationResponse.id != null
        assert cdConfigurationResponse.name == createDeploymentConfigurationRequest.name
    }
}
