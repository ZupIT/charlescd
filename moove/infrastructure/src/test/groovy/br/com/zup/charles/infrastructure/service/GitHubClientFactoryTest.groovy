/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charles.infrastructure.service

import br.com.zup.charles.domain.GitCredentials
import br.com.zup.charles.domain.GitServiceProvider
import br.com.zup.charles.infrastructure.service.GitHubClientFactory
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
