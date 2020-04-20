/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.metrics.connector.prometheus

import br.com.zup.darwin.metrics.connector.MetricService
import br.com.zup.darwin.metrics.domain.Metric
import br.com.zup.darwin.metrics.domain.Period
import br.com.zup.darwin.metrics.domain.SearchMetric
import br.com.zup.darwin.metrics.domain.SearchMetricFilter
import org.springframework.stereotype.Service

@Service("prometheus")
class PrometheusService(
        private val prometheusApi: PrometheusApi) : MetricService {

    override fun getTotalRequests(searchMetric: SearchMetric): Metric {
        val query = """ceil(sum(irate(${searchMetric.name}{${metricFilter(searchMetric.filters)}}[1m])) by(${groupBy(searchMetric.groupBy)}))[${metricPeriod(searchMetric.period)}]"""

        return this.prometheusApi.executeQuery(query).toMetric(searchMetric.name)
    }

    override fun getAverageLatency(searchMetric: SearchMetric): Metric {
        val query = """round((sum(irate(${searchMetric.name}_sum{${metricFilter(searchMetric.filters)}}[1m])) by(${groupBy(searchMetric.groupBy)})
                        / sum(irate(${searchMetric.name}_count{${metricFilter(searchMetric.filters)}}[1m])) by(${groupBy(searchMetric.groupBy)})) * 1000)[${metricPeriod(searchMetric.period)}]"""

        return this.prometheusApi.executeQuery(query).toMetric(searchMetric.name)
    }

    override fun getAverageHttpErrors(searchMetric: SearchMetric): Metric {
        val filter = metricFilter(searchMetric.filters)
        val finalFilter = if (filter.isBlank()) "response_status=~\"^5.*\$\"" else "$filter, response_status=~\"^5.*\$\""

        val query = """round((sum(irate(${searchMetric.name}{${finalFilter}}[1m])) by(${groupBy(searchMetric.groupBy)})
                        / scalar(sum(irate(${searchMetric.name}{${filter}}[1m])) by(${groupBy(searchMetric.groupBy)})) * 100), 0.01)[${metricPeriod(searchMetric.period)}]"""

        return this.prometheusApi.executeQuery(query).toMetric(searchMetric.name)
    }

    private fun groupBy(groupBy: List<String>?): String {
        return groupBy?.joinToString(separator = ",")
                ?: ""
    }

    private fun metricFilter(filters: List<SearchMetricFilter>?): String {
        return filters?.joinToString(separator = ",") {
            StringBuilder(it.attribute)
                    .append(it.kind.symbol)
                    .append(it.values.joinToString(prefix = "\"", separator = " | ", postfix = "\""))
        }
                ?: ""
    }

    private fun metricPeriod(period: Period) = "${period.value}${period.unit.unitValue}:${period.sliceValue}${period.sliceUnit.unitValue}"

}