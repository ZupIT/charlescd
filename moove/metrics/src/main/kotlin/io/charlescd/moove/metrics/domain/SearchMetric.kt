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

package io.charlescd.moove.metrics.domain

data class SearchMetric(val name: String) {

    var filters: List<SearchMetricFilter>? = null
        private set
    var groupBy: List<String>? = null
        private set
    var period: Period? = null
        private set

    fun filteringBy(filters: List<SearchMetricFilter>) = apply { this.filters = filters }

    fun groupingBy(groupBy: List<String>) = apply { this.groupBy = groupBy }

    fun forPeriod(period: Period) = apply { this.period = period }
}

data class SearchMetricFilter(val attribute: String,
                              val values: List<String>,
                              val kind: FilterKind)

enum class FilterKind(val symbol: String) {
    EQUAL("="), NOT_EQUAL("!="), REGEX_MATCH("=~"), REGEX_NOT_MATCH("!~")
}

data class Period(val value: Int,
                  val unit: PeriodUnit,
                  val sliceValue: Int,
                  val sliceUnit: PeriodUnit)

enum class PeriodUnit(val unitValue: String) {
    SECONDS("s"), MINUTES("m"), HOURS("h")
}
