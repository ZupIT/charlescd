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

import io.charlescd.moove.application.configuration.FindGitConfigurationsInteractor
import io.charlescd.moove.domain.*
import io.charlescd.moove.domain.repository.GitConfigurationRepository
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
        def workspaceId = "0dbe9694-fc50-400c-ab3b-b176bbfbdf4d"
        def pageRequest = new PageRequest()
        def emptyPage = new Page([], 0, 20, 0)

        when:
        def response = this.findGitConfigurationsInteractor.execute(workspaceId, pageRequest)

        then:
        1 * this.gitConfigurationRepository.findByWorkspaceId(_, _) >> { arguments ->
            def argWorkspaceId = arguments[0]
            def argPageRequest = arguments[1]

            assert argPageRequest instanceof PageRequest
            assert argWorkspaceId == workspaceId

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
        def workspaceId = "0dbe9694-fc50-400c-ab3b-b176bbfbdf4d"
        def pageRequest = new PageRequest()
        def author = new User("0d2260ff-9a4c-425c-9402-c43cfda97b92", "charles", "charles@zup.com.br", "http://charles.com/dummy_photo.jpg", [], false, LocalDateTime.now())
        def gitCredentials = new GitCredentials("http://github.com.br", "zup", "zup@123", null, GitServiceProvider.GITHUB)
        def gitConfiguration = new GitConfiguration("b15627e4-d784-4c5c-9aea-c5d0f7627480", "dummy git configuration", gitCredentials, LocalDateTime.now(), author, workspaceId)
        def page = new Page([gitConfiguration], 0, 20, 1)

        when:
        def response = this.findGitConfigurationsInteractor.execute(workspaceId, pageRequest)

        then:
        1 * this.gitConfigurationRepository.findByWorkspaceId(_, _) >> { arguments ->
            def argWorkspaceId = arguments[0]
            def argPageRequest = arguments[1]

            assert argPageRequest instanceof PageRequest
            assert argWorkspaceId == workspaceId

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
