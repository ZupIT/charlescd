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

import io.charlescd.moove.domain.GitCredentials
import io.charlescd.moove.domain.GitServiceProvider
import io.charlescd.moove.infrastructure.service.GitHubClientFactory
import org.gitlab4j.api.GitLabApiException
import spock.lang.Specification

class GitLabClientFactoryTest extends Specification {

    private GitLabClientFactory gitLabClientFactory

    void setup() {
        this.gitLabClientFactory = new GitLabClientFactory()
    }

    def "when using OAuth2Token credential should return GitHub client"() {

        given:
        def credentials = new GitCredentials("https://gitlab.com",
                null, null, "token", GitServiceProvider.GITLAB
        )

        when:
        def client = this.gitLabClientFactory.buildGitClient(credentials)

        then:
        assert client != null

    }

    def "when using user and password credentials invalid should throw exception"() {

        given:
        def credentials = new GitCredentials("https://gitlab.com",
                "username", "password", null, GitServiceProvider.GITLAB
        )

        when:
        this.gitLabClientFactory.buildGitClient(credentials)

        then:
        thrown(GitLabApiException.class)

    }

    def "should throw exception when credentials are not valid"() {

        given:
        def credentials = new GitCredentials("https://gitlab.com",
                null, null, null, GitServiceProvider.GITLAB
        )

        when:
        def client = this.gitLabClientFactory.buildGitClient(credentials)

        then:
        assert client == null
        thrown(IllegalArgumentException.class)

    }

}
