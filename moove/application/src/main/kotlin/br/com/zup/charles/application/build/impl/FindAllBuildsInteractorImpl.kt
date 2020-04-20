/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charles.application.build.impl

import br.com.zup.charles.application.build.FindAllBuildsInteractor
import br.com.zup.charles.application.build.response.BuildResponse
import br.com.zup.charles.application.build.response.ResourcePageResponse
import br.com.zup.charles.domain.Build
import br.com.zup.charles.domain.BuildStatusEnum
import br.com.zup.charles.domain.Page
import br.com.zup.charles.domain.PageRequest
import br.com.zup.charles.domain.repository.BuildRepository
import javax.inject.Inject
import javax.inject.Named

@Named
class FindAllBuildsInteractorImpl @Inject constructor(
    private val buildRepository: BuildRepository
) : FindAllBuildsInteractor {

    override fun execute(
        tagName: String?,
        status: BuildStatusEnum?,
        applicationId: String,
        pageRequest: PageRequest
    ): ResourcePageResponse<BuildResponse> {
        return convert(this.buildRepository.find(tagName, status, applicationId, pageRequest))
    }

    private fun convert(page: Page<Build>): ResourcePageResponse<BuildResponse> {
        return ResourcePageResponse(
            content = page.content.map { BuildResponse.from(it) },
            page = page.pageNumber,
            size = page.size(),
            isLast = page.isLast(),
            totalPages = page.totalPages()
        )
    }
}