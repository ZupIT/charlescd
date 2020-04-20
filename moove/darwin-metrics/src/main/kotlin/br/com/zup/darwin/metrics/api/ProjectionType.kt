/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.metrics.api

import br.com.zup.darwin.metrics.domain.Period
import br.com.zup.darwin.metrics.domain.PeriodUnit

enum class ProjectionType(val period: Int,
                          val periodUnit: String,
                          val sliceValue: Int,
                          val sliceUnit: String) {

    FIVE_MINUTES(5, "m", 10, "s"),
    FIFTEEN_MINUTES(15, "m", 30, "s"),
    THIRTY_MINUTES(30, "m", 1, "m"),
    ONE_HOUR(1, "h", 2, "m"),
    THREE_HOUR(3, "h", 6, "m"),
    EIGHT_HOUR(8, "h", 15, "m"),
    TWELVE_HOUR(12, "h", 24, "m"),
    TWENTY_FOUR_HOUR(24, "h", 48, "m");
}

fun ProjectionType.toPeriod(): Period{
    val periodUnit = PeriodUnit.values().find { it.unitValue == this.periodUnit }?: PeriodUnit.SECONDS
    val sliceUnit = PeriodUnit.values().find { it.unitValue == this.sliceUnit }?: PeriodUnit.SECONDS

    return Period(this.period, periodUnit, this.sliceValue, sliceUnit)
}
