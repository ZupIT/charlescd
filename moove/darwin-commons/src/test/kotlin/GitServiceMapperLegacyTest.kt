/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import br.com.zup.darwin.commons.constants.MooveErrorCode
import br.com.zup.darwin.commons.integration.git.factory.GitHubClientFactoryLegacy
import br.com.zup.darwin.commons.integration.git.factory.GitLabClientFactoryLegacy
import br.com.zup.darwin.commons.integration.git.mapper.GitServiceMapperLegacy
import br.com.zup.darwin.commons.integration.git.service.GitHubServiceLegacyLegacy
import br.com.zup.darwin.commons.integration.git.service.GitLabServiceLegacyLegacy
import br.com.zup.darwin.entity.GitServiceProvider
import br.com.zup.exception.handler.exception.BusinessException
import org.junit.Test
import kotlin.test.assertEquals
import kotlin.test.assertFailsWith

class GitServiceMapperLegacyTest {

    @Test
    fun `should return github service`() {
        val mapper = GitServiceMapperLegacy(listOf(GitLabServiceLegacyLegacy(GitLabClientFactoryLegacy()),
            GitHubServiceLegacyLegacy(GitHubClientFactoryLegacy())))

        val service = mapper.getByType(GitServiceProvider.GITHUB)
        assertEquals(GitServiceProvider.GITHUB, service.getProviderType())
    }

    @Test
    fun `should return gitlab service`() {
        val mapper = GitServiceMapperLegacy(listOf(GitLabServiceLegacyLegacy(GitLabClientFactoryLegacy()),
            GitHubServiceLegacyLegacy(GitHubClientFactoryLegacy())))

        val service = mapper.getByType(GitServiceProvider.GITLAB)
        assertEquals(GitServiceProvider.GITLAB, service.getProviderType())
    }

    @Test
    fun `should throw exception if requested service is not mapped`() {
        val mapper = GitServiceMapperLegacy(listOf())

        val e= assertFailsWith<BusinessException> {  mapper.getByType(GitServiceProvider.GITLAB) }
        assertEquals(MooveErrorCode.GIT_ERROR_PROVIDER_NOT_FOUND.toString(), e.errorCode.toString())
    }
}