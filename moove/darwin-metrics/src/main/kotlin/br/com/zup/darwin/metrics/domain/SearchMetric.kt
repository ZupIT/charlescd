/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.metrics.domain

data class SearchMetric(val name: String,
                        val period: Period) {

    var filters: List<SearchMetricFilter>? = null
        private set
    var groupBy: List<String>? = null
        private set

    fun filteringBy(filters: List<SearchMetricFilter>) = apply { this.filters = filters }

    fun groupingBy(groupBy: List<String>) = apply { this.groupBy = groupBy }

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