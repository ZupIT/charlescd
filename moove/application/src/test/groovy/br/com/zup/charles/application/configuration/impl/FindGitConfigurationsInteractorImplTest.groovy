/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charles.application.configuration.impl

import br.com.zup.charles.application.configuration.FindGitConfigurationsInteractor
import br.com.zup.charles.domain.*
import br.com.zup.charles.domain.repository.GitConfigurationRepository
import spock.lang.Specification

import java.time.LocalDateTime

class FindGitConfigurationsInteractorImplTest extends Specification {

    private FindGitConfigurationsInteractor findGitConfigurationsInteractor

    private GitConfigurationRepository gitConfigurationRepository = Mock(GitConfigurationRepository)

    void setup() {
        this.findGitConfigurationsInteractor = new FindGitConfigurationsInteractorImpl(gitConfigurationRepository)
    }

    def "when git configurations does not exists should return an empty page"() {
        given:
        def applicationId = "0dbe9694-fc50-400c-ab3b-b176bbfbdf4d"
        def pageRequest = new PageRequest()
        def emptyPage = new Page([], 0, 20, 0)

        when:
        def response = this.findGitConfigurationsInteractor.execute(applicationId, pageRequest)

        then:
        1 * this.gitConfigurationRepository.findByApplicationId(_, _) >> { arguments ->
            def argApplicationId = arguments[0]
            def argPageRequest = arguments[1]

            assert argPageRequest instanceof PageRequest
            assert argApplicationId == applicationId

            return emptyPage
        }

        assert response != null
        assert response.page == 0
        assert response.size == 0
        assert response.content.size() == 0
        assert response.totalPages == 1
        assert response.isLast
    }

    def "should return a not empty page of git configurations"() {
        given:
        def applicationId = "0dbe9694-fc50-400c-ab3b-b176bbfbdf4d"
        def pageRequest = new PageRequest()
        def author = new User("0d2260ff-9a4c-425c-9402-c43cfda97b92", "charles", "charles@zup.com.br", "http://charles.com/dummy_photo.jpg", [], LocalDateTime.now())
        def gitCredentials = new GitCredentials("http://github.com.br", "zup", "zup@123", null, GitServiceProvider.GITHUB)
        def gitConfiguration = new GitConfiguration("b15627e4-d784-4c5c-9aea-c5d0f7627480", "dummy git configuration", gitCredentials, LocalDateTime.now(), author, applicationId)
        def page = new Page([gitConfiguration], 0, 20, 1)

        when:
        def response = this.findGitConfigurationsInteractor.execute(applicationId, pageRequest)

        then:
        1 * this.gitConfigurationRepository.findByApplicationId(_, _) >> { arguments ->
            def argApplicationId = arguments[0]
            def argPageRequest = arguments[1]

            assert argPageRequest instanceof PageRequest
            assert argApplicationId == applicationId

            return page
        }

        assert response != null
        assert response.page == 0
        assert response.size == 1
        assert response.content.size() == 1
        assert response.totalPages == 1
        assert response.isLast
    }
}
