/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charles.infrastructure.service

import br.com.zup.charles.domain.GitCredentials
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