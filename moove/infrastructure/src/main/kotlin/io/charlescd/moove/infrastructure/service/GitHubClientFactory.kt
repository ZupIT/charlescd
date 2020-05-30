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
import org.eclipse.egit.github.core.client.GitHubClient
import org.springframework.stereotype.Component

@Component
class GitHubClientFactory {

    fun buildGitClient(gitCredentials: GitCredentials): GitHubClient {
        return when {
            gitCredentials.isValidCredentials() -> GitHubClient().setCredentials(
                gitCredentials.username,
                gitCredentials.password
            )
            gitCredentials.isValidOAuthToken() -> GitHubClient().setOAuth2Token(
                gitCredentials.accessToken
            )
            else -> throw IllegalArgumentException("Invalid auth type")
        }
    }

}
