/*
 * Copyright 2020, 2021 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
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

package io.charlescd.moove.application.circle.impl

import io.charlescd.moove.application.CircleService
import io.charlescd.moove.application.ResourcePageResponse
import io.charlescd.moove.application.circle.FindAllCirclesSimpleInteractor
import io.charlescd.moove.application.circle.response.SimpleCircleResponse
import io.charlescd.moove.domain.Page
import io.charlescd.moove.domain.PageRequest
import io.charlescd.moove.domain.SimpleCircle
import javax.inject.Named

@Named
class FindAllCirclesSimpleInteractorImpl(
    private val circleService: CircleService
) : FindAllCirclesSimpleInteractor {
    override fun execute(
        name: String?,
        except: String?,
        status: Boolean?,
        workspaceId: String,
        pageRequest: PageRequest
    ): ResourcePageResponse<SimpleCircleResponse> {
        val page = circleService.find(name, except, status, workspaceId, pageRequest)
        return createResponsePage(page, convertContent(page))
    }

    private fun convertContent(page: Page<SimpleCircle>): List<SimpleCircleResponse> {
        return when (page.total > 0) {
            true -> createCircleResponseList(page)
            else -> emptyList()
        }
    }

    private fun createResponsePage(
        page: Page<SimpleCircle>,
        content: List<SimpleCircleResponse>
    ) = ResourcePageResponse.from(
        content,
        page.pageNumber,
        page.size(),
        page.isLast(),
        page.totalPages()
    )

    private fun createCircleResponseList(page: Page<SimpleCircle>): List<SimpleCircleResponse> {
        return page.content.map { circle ->
            SimpleCircleResponse.from(circle)
        }
    }
}
