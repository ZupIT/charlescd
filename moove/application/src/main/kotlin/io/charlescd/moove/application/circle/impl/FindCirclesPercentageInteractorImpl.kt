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
import io.charlescd.moove.application.circle.FindCirclesPercentageInteractor
import io.charlescd.moove.application.circle.response.CirclePercentageResponse
import io.charlescd.moove.domain.PageRequest
import io.charlescd.moove.domain.repository.CircleRepository
import javax.inject.Named

@Named
class FindCirclesPercentageInteractorImpl(private val circleRepository: CircleRepository) : FindCirclesPercentageInteractor {

    override fun execute(workspaceId: String, name: String?, active: Boolean, pageRequest: PageRequest): ResourcePageResponse<CirclePercentageResponse> {
        val circlesPercentage = circleRepository.findCirclesPercentage(workspaceId, name, active, pageRequest)
        val circlePercentageResponse = CirclePercentageResponse.from(circlesPercentage, circlesPercentage.content.map { it.percentage })
        return ResourcePageResponse.from(
            listOf(circlePercentageResponse),
            circlesPercentage.pageNumber,
            circlesPercentage.pageSize,
            circlesPercentage.isLast(),
            circlesPercentage.totalPages()
        )
    }
}
