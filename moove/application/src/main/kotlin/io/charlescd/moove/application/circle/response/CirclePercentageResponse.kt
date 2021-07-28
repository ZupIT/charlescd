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

import com.fasterxml.jackson.annotation.JsonInclude
import io.charlescd.moove.domain.Circle
import io.charlescd.moove.domain.Page

@JsonInclude(JsonInclude.Include.NON_NULL)
class CirclePercentageResponse(
    val circles: List<CircleResponse>,
    val sumPercentage: Int
) {
    companion object {

        fun from(circles: Page<Circle>, percentageValues: List<Int?>) = CirclePercentageResponse(
            circles = this.paginateResponse(circles.content, circles.pageNumber, circles.pageSize),
            sumPercentage = percentageValues.takeIf { it.isNotEmpty() }?.reduce { sum, percentage -> this.sumPercentage(sum!!, percentage) } ?: 0
        )

        private fun paginateResponse(content: List<Circle>, pageNumber: Int, pageSize: Int): List<CircleResponse> {
            val lastElementIndex = (pageNumber + 1) * pageSize
            val firstElementIndex = (pageNumber + 1) * pageSize - pageSize

            return content.slice(IntRange(firstElementIndex, getLastElementIndex(content.size, lastElementIndex))).map { it -> CircleResponse.from(it) }
        }

        private fun getLastElementIndex(contentSize: Int, lastElementIndex: Int): Int {
            return when (lastElementIndex > contentSize) {
                true -> contentSize - 1
                else -> lastElementIndex - 1
            }
        }

        private fun sumPercentage(sum: Int, percentage: Int?): Int {
            return percentage?.let {
                return sum + it
            } ?: sum
        }
    }
}
