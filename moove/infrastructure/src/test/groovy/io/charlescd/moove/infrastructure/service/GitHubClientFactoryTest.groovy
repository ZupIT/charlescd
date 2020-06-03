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
import spock.lang.Specification

class GitHubClientFactoryTest extends Specification {

    private GitHubClientFactory gitHubClientFactory

    void setup() {
        this.gitHubClientFactory = new GitHubClientFactory()
    }

    def "should return GitHub client with credentials set (user and password)"() {

        given:
        def credentials = new GitCredentials("https://github.com",
                "username", "password", null, GitServiceProvider.GITHUB
        )

        when:
        def client = this.gitHubClientFactory.buildGitClient(credentials)

        then:
        assert client != null
        assert client.user == credentials.username

    }

    def "should return GitHub client with credentials set (OAuth2Token)"() {

        given:
        def credentials = new GitCredentials("https://github.com",
                null, null, "token", GitServiceProvider.GITHUB
        )

        when:
        def client = this.gitHubClientFactory.buildGitClient(credentials)

        then:
        assert client != null
        assert client.user == null

    }

    def "should throw exception when credentials are not valid"() {

        given:
        def credentials = new GitCredentials("https://github.com",
                null, null, null, GitServiceProvider.GITHUB
        )

        when:
        def client = this.gitHubClientFactory.buildGitClient(credentials)

        then:
        assert client == null
        thrown(IllegalArgumentException.class)

    }

}
