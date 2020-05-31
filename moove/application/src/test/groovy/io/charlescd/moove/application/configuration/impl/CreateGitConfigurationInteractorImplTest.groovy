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
import io.charlescd.moove.application.configuration.CreateGitConfigurationInteractor
import io.charlescd.moove.application.configuration.request.CreateGitConfigurationRequest
import io.charlescd.moove.application.configuration.request.GitCredentialsData
import io.charlescd.moove.domain.GitConfiguration
import io.charlescd.moove.domain.GitServiceProvider
import io.charlescd.moove.domain.User
import io.charlescd.moove.domain.Workspace
import io.charlescd.moove.domain.exceptions.NotFoundException
import io.charlescd.moove.domain.repository.GitConfigurationRepository
import io.charlescd.moove.domain.repository.UserRepository
import io.charlescd.moove.domain.repository.WorkspaceRepository
import spock.lang.Specification

import java.time.LocalDateTime

class CreateGitConfigurationInteractorImplTest extends Specification {

    private CreateGitConfigurationInteractor createGitConfigurationInteractor

    private GitConfigurationRepository gitConfigurationRepository = Mock(GitConfigurationRepository)
    private WorkspaceRepository workspaceRepository = Mock(WorkspaceRepository)
    private UserRepository userRepository = Mock(UserRepository)

    void setup() {
        this.createGitConfigurationInteractor = new CreateGitConfigurationInteractorImpl(gitConfigurationRepository,
                new UserService(userRepository), new WorkspaceService(workspaceRepository, userRepository))
    }

    def "when workspace does not exist should throw exception"() {
        given:
        def authorId = "0a859e6c-3cdf-4b34-84d0-f9038576ac58"
        def workspaceId = "ec862e68-566e-43dc-be04-5018cb3bc8b3"
        def credentialsPart = new GitCredentialsData("http://github.com", "zup", "123@zup", null, GitServiceProvider.GITHUB)
        def createGitConfigurationRequest = new CreateGitConfigurationRequest("github-zup", authorId, credentialsPart)

        when:
        this.createGitConfigurationInteractor.execute(createGitConfigurationRequest, workspaceId)

        then:
        1 * workspaceRepository.exists(workspaceId) >> false

        def ex = thrown(NotFoundException)
        ex.resourceName == "workspace"
        ex.id == workspaceId
    }

    def "when user does not exist should throw an exception"() {
        given:
        def author = getDummyUser()
        def workspaceId = "ec862e68-566e-43dc-be04-5018cb3bc8b3"
        def credentialsPart = new GitCredentialsData("http://github.com", "zup", "123@zup", null, GitServiceProvider.GITHUB)
        def createGitConfigurationRequest = new CreateGitConfigurationRequest("github-zup", author.id, credentialsPart)

        when:
        this.createGitConfigurationInteractor.execute(createGitConfigurationRequest, workspaceId)

        then:
        1 * this.workspaceRepository.exists(workspaceId) >> true
        1 * this.userRepository.findById(author.id) >> Optional.empty()

        def ex = thrown(NotFoundException)
        ex.resourceName == "user"
        ex.id == author.id
    }

    def "should return git configuration response"() {
        given:
        def authorId = "0a859e6c-3cdf-4b34-84d0-f9038576ac58"
        def author = getDummyUser()
        def workspaceId = "ec862e68-566e-43dc-be04-5018cb3bc8b3"

        def credentialsPart = new GitCredentialsData("http://github.com", "zup", "123@zup", null, GitServiceProvider.GITHUB)
        def createGitConfigurationRequest = new CreateGitConfigurationRequest("github-zup", authorId, credentialsPart)

        when:
        def gitConfigurationResponse = this.createGitConfigurationInteractor.execute(createGitConfigurationRequest, workspaceId)

        then:
        1 * this.workspaceRepository.exists(workspaceId) >> true
        1 * this.userRepository.findById(authorId) >> Optional.of(author)
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

    private User getDummyUser() {
        new User('4e806b2a-557b-45c5-91be-1e1db909bef6', 'User name', 'user@email.com', 'user.photo.png',
                new ArrayList<Workspace>(), false, LocalDateTime.now())
    }
}
