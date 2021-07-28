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

package io.charlescd.moove.application.configuration.impl

import io.charlescd.moove.application.GitConfigurationService
import io.charlescd.moove.application.configuration.UpdateGitConfigurationInteractor
import io.charlescd.moove.application.configuration.request.UpdateGitConfigurationRequest
import io.charlescd.moove.application.configuration.response.GitConfigurationResponse
import javax.inject.Named

@Named
class UpdateGitConfigurationInteractorImpl(private val gitConfigurationService: GitConfigurationService) :
    UpdateGitConfigurationInteractor {
    override fun execute(
        id: String,
        workspaceId: String,
        request: UpdateGitConfigurationRequest
    ): GitConfigurationResponse {
        val gitConfiguration = gitConfigurationService.find(id)
        val updatedGitConfiguration = gitConfigurationService.update(
            request.toGitConfiguration(
                gitConfiguration.id,
                gitConfiguration.author,
                gitConfiguration.workspaceId
            )
        )
        return GitConfigurationResponse.from(updatedGitConfiguration)
    }
}
