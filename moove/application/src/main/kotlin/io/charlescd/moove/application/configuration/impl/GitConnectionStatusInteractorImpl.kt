/*
 *
 * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 *
 */

package io.charlescd.moove.application.configuration.impl

import io.charlescd.moove.application.configuration.GitConnectionStatusConfigurationInteractor
import io.charlescd.moove.application.configuration.request.TestConnectionGitConfigurationRequest
import io.charlescd.moove.application.configuration.response.GitConnectionResponse
import io.charlescd.moove.domain.GitServiceProvider
import io.charlescd.moove.infrastructure.mapper.GitServiceMapper
import org.springframework.stereotype.Service

@Service
class GitConnectionStatusInteractorImpl(
    private val gitServiceMapper: GitServiceMapper
) : GitConnectionStatusConfigurationInteractor {

    override fun execute(request: TestConnectionGitConfigurationRequest): GitConnectionResponse {
        return toGitConnectionResponse(this.gitServiceMapper.getByType(request.credentials.serviceProvider).testConnection(request.credentials.toGitCredentials()))
    }

    fun toGitConnectionResponse(status: Boolean): GitConnectionResponse {
        if (status) return GitConnectionResponse("SUCCESS")
        return GitConnectionResponse("FAILED")
    }

}
