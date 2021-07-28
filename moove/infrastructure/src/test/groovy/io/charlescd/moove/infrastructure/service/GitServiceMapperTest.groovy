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

package io.charlescd.moove.infrastructure.service

import io.charlescd.moove.domain.GitServiceProvider
import io.charlescd.moove.domain.exceptions.BusinessException
import io.charlescd.moove.infrastructure.mapper.GitServiceMapper
import spock.lang.Specification

class GitServiceMapperTest extends Specification {

    private GitHubClientFactory gitHubClientFactory = new GitHubClientFactory()
    private GitHubService gitHubService = new GitHubService(gitHubClientFactory)
    private GitServiceMapper gitServiceMapper = new GitServiceMapper([gitHubService])

    def "should return GitHubService when provider is GitHub"() {

        when:
        def service = gitServiceMapper.getByType(GitServiceProvider.GITHUB)

        then:
        assert service != null
        assert service instanceof GitHubService
    }

    def "should throw Business Exception when provider is invalid"() {

        when:
        def service = gitServiceMapper.getByType(GitServiceProvider.GITLAB)

        then:
        assert service == null
        thrown(BusinessException)
    }

    def "should throw Illegal Argument Exception when enum is invalid"() {

        when:
        def service = gitServiceMapper.getByType(GitServiceProvider.valueOf("RANDOM_PROVIDER"))

        then:
        assert service == null
        thrown(IllegalArgumentException)

    }
}
