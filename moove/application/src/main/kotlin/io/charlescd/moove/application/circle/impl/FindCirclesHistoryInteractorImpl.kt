/*
 *
 *  Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
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
 */

package io.charlescd.moove.application.circle.impl

import io.charlescd.moove.application.ResourcePageResponse
import io.charlescd.moove.application.circle.FindCirclesHistoryInteractor
import io.charlescd.moove.application.circle.response.CircleHistoryResponse
import io.charlescd.moove.domain.PageRequest
import io.charlescd.moove.domain.repository.CircleRepository
import javax.inject.Named

@Named
class FindCirclesHistoryInteractorImpl(private val circleRepository: CircleRepository) : FindCirclesHistoryInteractor {

    override fun execute(workspaceId: String, name: String?, pageRequest: PageRequest): ResourcePageResponse<CircleHistoryResponse> {
        val historyItems = circleRepository.findCirclesHistory(workspaceId, name, pageRequest)

        return ResourcePageResponse.from(
            historyItems.content.map { CircleHistoryResponse.from(it) }.sortedWith(getResponseComparator()),
            historyItems.pageNumber,
            historyItems.pageSize,
            historyItems.isLast(),
            historyItems.totalPages()
        )
    }

    private fun getResponseComparator() =
        compareBy<CircleHistoryResponse> { it.status }
            .thenByDescending { it.lifeTime }
}
