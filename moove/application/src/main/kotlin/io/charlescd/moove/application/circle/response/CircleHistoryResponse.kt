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

package io.charlescd.moove.application.circle.response

import com.fasterxml.jackson.annotation.JsonFormat
import com.fasterxml.jackson.annotation.JsonInclude
import io.charlescd.moove.application.ResourcePageResponse
import io.charlescd.moove.domain.CircleCount
import io.charlescd.moove.domain.CircleHistory
import io.charlescd.moove.domain.CircleStatusEnum
import io.charlescd.moove.domain.Page
import java.time.LocalDateTime

class CircleHistoryResponse(
    val page: ResourcePageResponse<CircleHistoryContentResponse>,
    val summary: HistorySummaryResponse
) {
    companion object {
        fun from(summary: List<CircleCount>, page: Page<CircleHistory>) = CircleHistoryResponse(
            summary = HistorySummaryResponse(
                summary.firstOrNull { it.circleStatus == CircleStatusEnum.ACTIVE }?.total ?: 0,
                summary.firstOrNull { it.circleStatus == CircleStatusEnum.INACTIVE }?.total ?: 0
            ),
            page = ResourcePageResponse.from(
                page.content.map { CircleHistoryContentResponse.from(it) }.sortedByDescending { it.lifeTime },
                page.pageNumber,
                page.pageSize,
                page.isLast(),
                page.totalPages()
            )
        )
    }
}

@JsonInclude(JsonInclude.Include.NON_NULL)
class CircleHistoryContentResponse(
    val id: String,
    val name: String,
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    val lastUpdatedAt: LocalDateTime,
    val lifeTime: Long,
    val status: CircleStatusEnum
) {
    companion object {
        fun from(circleHistory: CircleHistory) = CircleHistoryContentResponse(
            id = circleHistory.id,
            name = circleHistory.name,
            lastUpdatedAt = circleHistory.lastUpdatedAt,
            lifeTime = circleHistory.lifeTime.seconds,
            status = circleHistory.status
        )
    }
}

data class HistorySummaryResponse(
    val active: Int,
    val inactive: Int
)
