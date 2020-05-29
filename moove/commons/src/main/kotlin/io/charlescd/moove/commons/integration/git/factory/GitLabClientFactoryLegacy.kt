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

package io.charlescd.moove.commons.integration.git.factory

import io.charlescd.moove.legacy.repository.entity.GitCredentials
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
