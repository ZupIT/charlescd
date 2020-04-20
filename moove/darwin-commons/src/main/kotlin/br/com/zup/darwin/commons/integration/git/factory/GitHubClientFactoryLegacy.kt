/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.commons.integration.git.factory

import br.com.zup.darwin.entity.GitCredentials
import org.eclipse.egit.github.core.client.GitHubClient
import org.springframework.stereotype.Component

@Component
class GitHubClientFactoryLegacy {

    fun buildGitClient(gitCredentials: GitCredentials): GitHubClient =
        GitHubClient()
            .apply {
                setCredentials(
                    gitCredentials.username,
                    gitCredentials.password
                )
            }
}