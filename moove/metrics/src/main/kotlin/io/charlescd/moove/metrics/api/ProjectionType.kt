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

package io.charlescd.moove.metrics.api

import io.charlescd.moove.metrics.domain.Period
import io.charlescd.moove.metrics.domain.PeriodUnit

enum class ProjectionType(
    val period: Int,
    val periodUnit: String,
    val sliceValue: Int,
    val sliceUnit: String
) {

    FIVE_MINUTES(5, "m", 10, "s"),
    FIFTEEN_MINUTES(15, "m", 30, "s"),
    THIRTY_MINUTES(30, "m", 1, "m"),
    ONE_HOUR(1, "h", 2, "m"),
    THREE_HOUR(3, "h", 6, "m"),
    EIGHT_HOUR(8, "h", 15, "m"),
    TWELVE_HOUR(12, "h", 24, "m"),
    TWENTY_FOUR_HOUR(24, "h", 48, "m");
}

fun ProjectionType.toPeriod(): Period {
    val periodUnit = PeriodUnit.values().find { it.unitValue == this.periodUnit } ?: PeriodUnit.SECONDS
    val sliceUnit = PeriodUnit.values().find { it.unitValue == this.sliceUnit } ?: PeriodUnit.SECONDS

    return Period(
        this.period,
        periodUnit,
        this.sliceValue,
        sliceUnit
    )
}
