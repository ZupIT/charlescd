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

import io.charlescd.moove.application.SystemTokenService
import io.charlescd.moove.application.TestUtils
import io.charlescd.moove.application.UserService
import io.charlescd.moove.application.WorkspaceService
import io.charlescd.moove.application.configuration.CreateGitConfigurationInteractor
import io.charlescd.moove.application.configuration.request.CreateGitConfigurationRequest
import io.charlescd.moove.application.configuration.request.GitCredentialsData
import io.charlescd.moove.domain.GitConfiguration
import io.charlescd.moove.domain.GitServiceProvider
import io.charlescd.moove.domain.exceptions.NotFoundException
import io.charlescd.moove.domain.repository.GitConfigurationRepository
import io.charlescd.moove.domain.repository.SystemTokenRepository
import io.charlescd.moove.domain.repository.UserRepository
import io.charlescd.moove.domain.repository.WorkspaceRepository
import io.charlescd.moove.domain.service.ManagementUserSecurityService
import spock.lang.Specification

class CreateGitConfigurationInteractorImplTest extends Specification {

    private CreateGitConfigurationInteractor createGitConfigurationInteractor

    private GitConfigurationRepository gitConfigurationRepository = Mock(GitConfigurationRepository)
    private WorkspaceRepository workspaceRepository = Mock(WorkspaceRepository)
    private UserRepository userRepository = Mock(UserRepository)
    private SystemTokenService systemTokenService = new SystemTokenService(Mock(SystemTokenRepository))
    private ManagementUserSecurityService managementUserSecurityService = Mock(ManagementUserSecurityService)

    void setup() {
        this.createGitConfigurationInteractor = new CreateGitConfigurationInteractorImpl(gitConfigurationRepository,
                new UserService(userRepository, systemTokenService, managementUserSecurityService), new WorkspaceService(workspaceRepository, userRepository))
    }

    def "when workspace does not exist should throw exception"() {
        given:
        def workspaceId = TestUtils.workspaceId
        def authorization = TestUtils.authorization
        def credentialsPart = new GitCredentialsData("http://github.com", "zup", "123@zup", null, GitServiceProvider.GITHUB)
        def createGitConfigurationRequest = new CreateGitConfigurationRequest("github-zup", credentialsPart)

        when:
        this.createGitConfigurationInteractor.execute(createGitConfigurationRequest, workspaceId, authorization, null)

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
        def credentialsPart = new GitCredentialsData("http://github.com", "zup", "123@zup", null, GitServiceProvider.GITHUB)
        def createGitConfigurationRequest = new CreateGitConfigurationRequest("github-zup", credentialsPart)

        when:
        this.createGitConfigurationInteractor.execute(createGitConfigurationRequest, workspaceId, authorization, null)

        then:
        1 * this.workspaceRepository.exists(workspaceId) >> true
        1 * managementUserSecurityService.getUserEmail(authorization) >> author.email
        1 * userRepository.findByEmail(author.email) >> Optional.empty()
        def ex = thrown(NotFoundException)
        ex.resourceName == "user"
    }

    def "should return git configuration response"() {
        given:
        def author = TestUtils.user
        def workspaceId = TestUtils.workspaceId
        def authorId = TestUtils.authorId
        def authorization = TestUtils.authorization

        def credentialsPart = new GitCredentialsData("http://github.com", "zup", "123@zup", null, GitServiceProvider.GITHUB)
        def createGitConfigurationRequest = new CreateGitConfigurationRequest("github-zup", credentialsPart)

        when:
        def gitConfigurationResponse = this.createGitConfigurationInteractor.execute(createGitConfigurationRequest, workspaceId, authorization, null)

        then:
        1 * this.workspaceRepository.exists(workspaceId) >> true
        1 * managementUserSecurityService.getUserEmail(authorization) >> author.email
        1 * userRepository.findByEmail(author.email) >> Optional.of(author)
        1 * this.gitConfigurationRepository.save(_) >> { argument ->
            def savedGitConfiguration = argument[0]
            assert savedGitConfiguration instanceof GitConfiguration
            assert savedGitConfiguration.id != null
            assert savedGitConfiguration.name == createGitConfigurationRequest.name
            assert savedGitConfiguration.createdAt != null
            assert savedGitConfiguration.author.id == author.id
            assert savedGitConfiguration.workspaceId == workspaceId
            assert savedGitConfiguration.credentials.username == credentialsPart.username
            assert savedGitConfiguration.credentials.password == credentialsPart.password
            assert savedGitConfiguration.credentials.address == credentialsPart.address
            assert savedGitConfiguration.credentials.accessToken == credentialsPart.accessToken
            assert savedGitConfiguration.credentials.serviceProvider == credentialsPart.serviceProvider

            return savedGitConfiguration
        }

        notThrown()

        assert gitConfigurationResponse != null
        assert gitConfigurationResponse.id != null
        assert gitConfigurationResponse.name == createGitConfigurationRequest.name
    }
}
