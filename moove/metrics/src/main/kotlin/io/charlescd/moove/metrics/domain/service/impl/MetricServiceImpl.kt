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

package io.charlescd.moove.metrics.domain.service.impl

import io.charlescd.moove.metrics.api.PeriodType
import io.charlescd.moove.metrics.domain.service.MetricService
import java.time.LocalDate
import java.util.*
import org.springframework.stereotype.Service

@Service
class MetricServiceImpl : MetricService {

    override fun fillMissingDates(
        presentDates: Set<LocalDate>,
        period: PeriodType
    ): List<LocalDate> {

        val presentDatesStack = presentDates
            .sortedByDescending { it }
            .toCollection(Stack())

        val firstDay = LocalDate.now().minusDays(period.numberOfDays.toLong())
        val lastDay = LocalDate.now()

        val missingDays = when (presentDatesStack.peek() == firstDay) {
            true -> mutableListOf(presentDatesStack.pop())
            false -> mutableListOf(firstDay)
        }

        var lastAddedItemDate = missingDays.last()
        while (lastAddedItemDate < lastDay) {
            if (presentDatesStack.isEmpty()) {
                missingDays.addAll(getValuesUntilDate(lastAddedItemDate, lastDay.plusDays(1)))
            } else {
                if (lastAddedItemDate.until(presentDatesStack.peek()).days > 1) {
                    missingDays.addAll(getValuesUntilDate(lastAddedItemDate, presentDatesStack.peek()))
                }

                missingDays.add(presentDatesStack.pop())
            }
            lastAddedItemDate = missingDays.last()
        }

        return missingDays
    }

    private fun getValuesUntilDate(fromDate: LocalDate, toDate: LocalDate): List<LocalDate> {
        val valuesUntilToday = mutableListOf<LocalDate>()
        var fromDay = fromDate.plusDays(1)
        while (fromDay < toDate) {
            valuesUntilToday.add(fromDay)
            fromDay = fromDay.plusDays(1)
        }

        return valuesUntilToday
    }
}
