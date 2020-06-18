package io.charlescd.moove.metrics.api

enum class PeriodType(val numberOfDays: Int) {

    ONE_WEEK(7),
    TWO_WEEKS(14),
    ONE_MONTH(30),
    THREE_MONTHS(90)
}
