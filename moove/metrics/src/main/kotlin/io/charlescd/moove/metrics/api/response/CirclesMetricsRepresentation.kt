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

package io.charlescd.moove.metrics.api.response

import io.charlescd.moove.domain.CircleCount
import io.charlescd.moove.domain.CircleStatusEnum
import java.time.Duration

data class CirclesMetricsRepresentation(val circleStats: CircleStatsRepresentation, val averageLifeTime: Long) {
    companion object {
        fun from(circlesCounts: List<CircleCount>, averageLifeTime: Duration): CirclesMetricsRepresentation {
            return CirclesMetricsRepresentation(
                CircleStatsRepresentation(
                    active = circlesCounts.firstOrNull { it.circleStatus == CircleStatusEnum.ACTIVE }?.total ?: 0,
                    inactive = circlesCounts.firstOrNull { it.circleStatus == CircleStatusEnum.INACTIVE }?.total ?: 0
                ),
                averageLifeTime = averageLifeTime.seconds
            )
        }
    }
}

data class CircleStatsRepresentation(val active: Int, val inactive: Int)
