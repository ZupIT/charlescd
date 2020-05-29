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

package io.charlescd.moove.commons

import io.charlescd.moove.commons.constants.MooveErrorCodeLegacy
import io.charlescd.moove.commons.exceptions.BusinessExceptionLegacy
import io.charlescd.moove.commons.integration.git.factory.GitHubClientFactoryLegacy
import io.charlescd.moove.commons.integration.git.factory.GitLabClientFactoryLegacy
import io.charlescd.moove.commons.integration.git.mapper.GitServiceMapperLegacy
import io.charlescd.moove.commons.integration.git.service.GitHubServiceLegacy
import io.charlescd.moove.commons.integration.git.service.GitLabServiceLegacy
import io.charlescd.moove.legacy.repository.entity.GitServiceProvider
import org.junit.Test
import kotlin.test.assertEquals
import kotlin.test.assertFailsWith

class GitServiceMapperLegacyTest {

    @Test
    fun `should return github service`() {
        val mapper = GitServiceMapperLegacy(
            listOf(
                GitLabServiceLegacy(GitLabClientFactoryLegacy()),
                GitHubServiceLegacy(GitHubClientFactoryLegacy())
            )
        )

        val service = mapper.getByType(GitServiceProvider.GITHUB)
        assertEquals(GitServiceProvider.GITHUB, service.getProviderType())
    }

    @Test
    fun `should return gitlab service`() {
        val mapper = GitServiceMapperLegacy(
            listOf(
                GitLabServiceLegacy(GitLabClientFactoryLegacy()),
                GitHubServiceLegacy(GitHubClientFactoryLegacy())
            )
        )

        val service = mapper.getByType(GitServiceProvider.GITLAB)
        assertEquals(GitServiceProvider.GITLAB, service.getProviderType())
    }

    @Test
    fun `should throw exception if requested service is not mapped`() {
        val mapper = GitServiceMapperLegacy(listOf())

        val e = assertFailsWith<BusinessExceptionLegacy> { mapper.getByType(GitServiceProvider.GITLAB) }
        assertEquals(MooveErrorCodeLegacy.GIT_ERROR_PROVIDER_NOT_FOUND, e.getErrorCode())
    }
}
