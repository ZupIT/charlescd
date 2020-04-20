/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charles.infrastructure.service

import br.com.zup.charles.domain.GitServiceProvider
import br.com.zup.charles.infrastructure.mapper.GitServiceMapper
import br.com.zup.charles.infrastructure.service.GitHubClientFactory
import br.com.zup.charles.infrastructure.service.GitHubService
import br.com.zup.exception.handler.exception.BusinessException
import spock.lang.Specification

class GitServiceMapperTest extends Specification {

    private GitHubClientFactory gitHubClientFactory = new GitHubClientFactory()
    private GitHubService gitHubService = new GitHubService(gitHubClientFactory)
    private GitServiceMapper gitServiceMapper = new GitServiceMapper([gitHubService])

    def "should return GitHubService when provider is GitHub"(){

        when:
        def service = gitServiceMapper.getByType(GitServiceProvider.GITHUB)

        then:
        assert service != null
        assert service instanceof GitHubService
    }

    def "should throw Business Exception when provider is invalid"(){

        when:
        def service = gitServiceMapper.getByType(GitServiceProvider.GITLAB)

        then:
        assert service == null
        thrown(BusinessException)
    }

    def "should throw Illegal Argument Exception when enum is invalid"(){

        when:
        def service = gitServiceMapper.getByType(GitServiceProvider.valueOf("RANDOM_PROVIDER"))

        then:
        assert service == null
        thrown(IllegalArgumentException)

    }
}
