/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charles.application.configuration.impl

import br.com.zup.charles.application.build.response.ResourcePageResponse
import br.com.zup.charles.application.configuration.FindGitConfigurationsInteractor
import br.com.zup.charles.application.configuration.response.GitConfigurationResponse
import br.com.zup.charles.domain.GitConfiguration
import br.com.zup.charles.domain.Page
import br.com.zup.charles.domain.PageRequest
import br.com.zup.charles.domain.repository.GitConfigurationRepository
import javax.inject.Named

@Named
class FindGitConfigurationsInteractorImpl(private val gitConfigurationRepository: GitConfigurationRepository) :
    FindGitConfigurationsInteractor {

    override fun execute(
        applicationId: String,
        pageRequest: PageRequest
    ): ResourcePageResponse<GitConfigurationResponse> {
        return convert(this.gitConfigurationRepository.findByApplicationId(applicationId, pageRequest))
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