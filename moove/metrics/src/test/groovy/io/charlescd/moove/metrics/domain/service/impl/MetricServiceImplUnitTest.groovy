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

package io.charlescd.moove.metrics.domain.service.impl


import io.charlescd.moove.metrics.api.PeriodType
import spock.lang.Specification

import java.time.LocalDate

class MetricServiceImplUnitTest extends Specification {

    def metricService = new MetricServiceImpl()

    def 'when passing a period with present date and a set of dates should return all dates between today minus period and today'() {
        given:
        def todayDate = LocalDate.now()
        def period = PeriodType.ONE_WEEK

        def dates = new HashSet<LocalDate>([todayDate, todayDate.minusDays(4)])

        when:
        def result = metricService.fillMissingDates(dates, period)

        then:
        0 * _

        result.size() == 8
        result[0] == todayDate.minusDays(7)
        result[1] == todayDate.minusDays(6)
        result[2] == todayDate.minusDays(5)
        result[3] == todayDate.minusDays(4)
        result[4] == todayDate.minusDays(3)
        result[5] == todayDate.minusDays(2)
        result[6] == todayDate.minusDays(1)
        result[7] == todayDate
    }

    def 'when passing a period with initial date and a set of dates should return all dates between today minus period and today'() {
        given:
        def todayDate = LocalDate.now()
        def period = PeriodType.ONE_WEEK

        def dates = new HashSet<LocalDate>([todayDate.minusDays(7), todayDate.minusDays(4), todayDate.minusDays(3)])

        when:
        def result = metricService.fillMissingDates(dates, period)

        then:
        0 * _

        result.size() == 8
        result[0] == todayDate.minusDays(7)
        result[1] == todayDate.minusDays(6)
        result[2] == todayDate.minusDays(5)
        result[3] == todayDate.minusDays(4)
        result[4] == todayDate.minusDays(3)
        result[5] == todayDate.minusDays(2)
        result[6] == todayDate.minusDays(1)
        result[7] == todayDate
    }
}
