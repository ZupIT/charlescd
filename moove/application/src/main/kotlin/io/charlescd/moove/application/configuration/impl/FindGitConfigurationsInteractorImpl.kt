/*
 *
 *  * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *  *
 *  * Licensed under the Apache License, Version 2.0 (the "License");
 *  * you may not use this file except in compliance with the License.
 *  * You may obtain a copy of the License at
 *  *
 *  *     http://www.apache.org/licenses/LICENSE-2.0
 *  *
 *  * Unless required by applicable law or agreed to in writing, software
 *  * distributed under the License is distributed on an "AS IS" BASIS,
 *  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  * See the License for the specific language governing permissions and
 *  * limitations under the License.
 *
 */

package io.charlescd.moove.application.configuration.impl

import io.charlescd.moove.application.ResourcePageResponse
import io.charlescd.moove.application.configuration.FindGitConfigurationsInteractor
import io.charlescd.moove.application.configuration.response.GitConfigurationResponse
import io.charlescd.moove.domain.GitConfiguration
import io.charlescd.moove.domain.Page
import io.charlescd.moove.domain.PageRequest
import io.charlescd.moove.domain.repository.GitConfigurationRepository
import javax.inject.Named

@Named
class FindGitConfigurationsInteractorImpl(private val gitConfigurationRepository: GitConfigurationRepository) :
    FindGitConfigurationsInteractor {

    override fun execute(
        workspaceId: String,
        pageRequest: PageRequest
    ): ResourcePageResponse<GitConfigurationResponse> {
        return convert(this.gitConfigurationRepository.findByWorkspaceId(workspaceId, pageRequest))
    }

    private fun convert(page: Page<GitConfiguration>): ResourcePageResponse<GitConfigurationResponse> {
        return ResourcePageResponse(
            content = page.content.map { GitConfigurationResponse.from(it) },
            page = page.pageNumber,
            size = page.size(),
            isLast = page.isLast(),
            totalPages = page.totalPages()
        )
    }
}
