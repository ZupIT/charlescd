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

import io.charlescd.moove.application.GitConfigurationService
import io.charlescd.moove.application.configuration.UpdateGitConfigurationInteractor
import io.charlescd.moove.application.configuration.request.GitCredentialsData
import io.charlescd.moove.application.configuration.request.UpdateGitConfigurationRequest
import io.charlescd.moove.domain.*
import io.charlescd.moove.domain.exceptions.NotFoundException
import io.charlescd.moove.domain.repository.GitConfigurationRepository
import spock.lang.Specification

import java.time.LocalDateTime

class UpdateGitConfigurationInteractorImplTest extends Specification {

    private UpdateGitConfigurationInteractor updateGitConfigurationInteractor

    private GitConfigurationRepository gitConfigurationRepository = Mock(GitConfigurationRepository)

    void setup() {
        this.updateGitConfigurationInteractor = new UpdateGitConfigurationInteractorImpl(new GitConfigurationService(gitConfigurationRepository))
    }

    def "when configuration Id  does not exist should throw an exception"() {

        given:
        def gitConfigurationId = "848f636a-64e3-4810-be63-5095e7c15428"
        def workspaceId = "8532fa35-a2fd-44f6-ac58-2dd6bf2eb5e7"
        def credentialsDataUpdate = new GitCredentialsData("http://github.com", "zup", "123@zup", null, GitServiceProvider.GITHUB)
        def updateGitConfigurationRequest = new UpdateGitConfigurationRequest("zuptest", credentialsDataUpdate)

        when:
        this.updateGitConfigurationInteractor.execute(gitConfigurationId, workspaceId, updateGitConfigurationRequest)

        then:
        1 * this.gitConfigurationRepository.find(gitConfigurationId) >> Optional.empty()

        def ex = thrown(NotFoundException)
        ex.resourceName == "gitConfigurationId"
        ex.id == gitConfigurationId

    }

    def "should update git configuration name"() {

        given:
        def gitConfigurationId = "848f636a-64e3-4810-be63-5095e7c15428"
        def workspaceId = "8532fa35-a2fd-44f6-ac58-2dd6bf2eb5e7"
        def author = getDummyUser()
        def gitConfigurationCredentials = new GitCredentials("http://gihub.com", "Zup-Older", "123@zup", null, GitServiceProvider.GITHUB)
        def gitConfiguration = new GitConfiguration(gitConfigurationId, "TestName", gitConfigurationCredentials, LocalDateTime.now(), author, workspaceId)
        def gitConfigurationCredentialsUpdated = new GitCredentialsData("http://github.com", "Zupper", "puz@123", null, GitServiceProvider.GITHUB)
        def updateGitConfigurationsRequest = new UpdateGitConfigurationRequest("ZUP-GIT", gitConfigurationCredentialsUpdated)

        when:
        def gitConfigurationUpdated = this.updateGitConfigurationInteractor.execute(gitConfigurationId, workspaceId, updateGitConfigurationsRequest)

        then:
        1 * this.gitConfigurationRepository.find(gitConfigurationId) >> Optional.of(gitConfiguration)
        1 * this.gitConfigurationRepository.update(_) >> { arguments ->

            def gitConfigurationArgument = arguments[0]
            assert gitConfigurationArgument instanceof GitConfiguration
            assert gitConfigurationArgument.name != null
            assert gitConfigurationArgument.name == updateGitConfigurationsRequest.name
            assert gitConfigurationArgument.id == gitConfigurationId

            return gitConfigurationArgument
        }

        assert gitConfigurationUpdated.id == gitConfiguration.id
        assert gitConfigurationUpdated.name == updateGitConfigurationsRequest.name

    }

    private static User getDummyUser() {
        new User('4e806b2a-557b-45c5-91be-1e1db909bef6', 'User name', 'user@email.com', 'user.photo.png',
                new ArrayList<Workspace>(), false, LocalDateTime.now())
    }
}
