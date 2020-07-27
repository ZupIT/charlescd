package io.charlescd.moove.metrics.domain.service

import io.charlescd.moove.metrics.api.PeriodType
import java.time.LocalDate

interface MetricService {

    fun fillMissingDates(presentDates: Set<LocalDate>, period: PeriodType): List<LocalDate>
}
