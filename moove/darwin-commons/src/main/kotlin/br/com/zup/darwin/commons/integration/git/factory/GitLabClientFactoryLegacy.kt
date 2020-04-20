/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.commons.integration.git.factory

import br.com.zup.darwin.entity.GitCredentials
import org.gitlab4j.api.GitLabApi
import org.springframework.stereotype.Component

@Component
class GitLabClientFactoryLegacy {

    fun buildGitClient(gitCredentials: GitCredentials): GitLabApi {
        return if (!gitCredentials.accessToken.isNullOrBlank()) {
            GitLabApi(GitLabApi.ApiVersion.V4, gitCredentials.address, gitCredentials.accessToken)
        } else {
            GitLabApi.oauth2Login(gitCredentials.address, gitCredentials.username, gitCredentials.password)
        }
    }

}