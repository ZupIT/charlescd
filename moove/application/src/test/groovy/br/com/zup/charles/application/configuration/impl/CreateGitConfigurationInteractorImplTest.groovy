/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charles.application.configuration.impl

import br.com.zup.charles.application.configuration.CreateGitConfigurationInteractor
import br.com.zup.charles.application.configuration.request.CreateGitConfigurationRequest
import br.com.zup.charles.application.configuration.request.GitCredentialsPart
import br.com.zup.charles.domain.GitConfiguration
import br.com.zup.charles.domain.GitServiceProvider
import br.com.zup.charles.domain.User
import br.com.zup.charles.domain.repository.GitConfigurationRepository
import br.com.zup.charles.domain.repository.UserRepository
import br.com.zup.exception.handler.exception.NotFoundException
import spock.lang.Specification

import java.time.LocalDateTime

class CreateGitConfigurationInteractorImplTest extends Specification {

    private CreateGitConfigurationInteractor createGitConfigurationInteractor

    private GitConfigurationRepository gitConfigurationRepository = Mock(GitConfigurationRepository)
    private UserRepository userRepository = Mock(UserRepository)

    void setup() {
        this.createGitConfigurationInteractor = new CreateGitConfigurationInteractorImpl(gitConfigurationRepository, userRepository)
    }

    def "when user does not exists should throw an exception"() {
        given:
        def authorId = "0a859e6c-3cdf-4b34-84d0-f9038576ac58"
        def applicationId = "ec862e68-566e-43dc-be04-5018cb3bc8b3"
        def credentialsPart = new GitCredentialsPart("http://github.com", "zup", "123@zup", null, GitServiceProvider.GITHUB)
        def createGitConfigurationRequest = new CreateGitConfigurationRequest("github-zup", authorId, credentialsPart)

        when:
        this.createGitConfigurationInteractor.execute(createGitConfigurationRequest, applicationId)

        then:
        1 * this.userRepository.findById(authorId) >> Optional.empty()

        def ex = thrown(NotFoundException)
        ex.resource.resource == "user"
        ex.resource.value == authorId
    }

    def "should return git configuration response"() {
        given:
        def authorId = "0a859e6c-3cdf-4b34-84d0-f9038576ac58"

        def author = new User(authorId, "charles", "charles@zup.com.br", "http://charles.com/dummy_photo.jpg", [], LocalDateTime.now())

        def applicationId = "ec862e68-566e-43dc-be04-5018cb3bc8b3"
        def credentialsPart = new GitCredentialsPart("http://github.com", "zup", "123@zup", null, GitServiceProvider.GITHUB)
        def createGitConfigurationRequest = new CreateGitConfigurationRequest("github-zup", authorId, credentialsPart)

        when:
        def gitConfigurationResponse = this.createGitConfigurationInteractor.execute(createGitConfigurationRequest, applicationId)

        then:
        1 * this.userRepository.findById(authorId) >> Optional.of(author)
        1 * this.gitConfigurationRepository.save(_) >> { argument ->
            def savedGitConfiguration = argument[0]
            assert savedGitConfiguration instanceof GitConfiguration
            assert savedGitConfiguration.id != null
            assert savedGitConfiguration.name == createGitConfigurationRequest.name
            assert savedGitConfiguration.createdAt != null
            assert savedGitConfiguration.author.id == author.id
            assert savedGitConfiguration.applicationId == applicationId
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
