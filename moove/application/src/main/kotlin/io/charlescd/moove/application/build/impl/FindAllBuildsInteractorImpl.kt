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

package io.charlescd.moove.application.build.impl

import io.charlescd.moove.application.BuildService
import io.charlescd.moove.application.ResourcePageResponse
import io.charlescd.moove.application.build.FindAllBuildsInteractor
import io.charlescd.moove.application.build.response.BuildResponse
import io.charlescd.moove.domain.Build
import io.charlescd.moove.domain.BuildStatusEnum
import io.charlescd.moove.domain.Page
import io.charlescd.moove.domain.PageRequest
import javax.inject.Inject
import javax.inject.Named

@Named
class FindAllBuildsInteractorImpl @Inject constructor(
    private val buildService: BuildService
) : FindAllBuildsInteractor {

    override fun execute(
        tagName: String?,
        status: BuildStatusEnum?,
        workspaceId: String,
        pageRequest: PageRequest
    ): ResourcePageResponse<BuildResponse> {
        return convert(buildService.find(tagName, status, workspaceId, pageRequest))
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
