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

package io.charlescd.moove.metrics.connector.prometheus

import io.charlescd.moove.metrics.connector.MetricService
import io.charlescd.moove.metrics.domain.Metric
import io.charlescd.moove.metrics.domain.Period
import io.charlescd.moove.metrics.domain.SearchMetric
import io.charlescd.moove.metrics.domain.SearchMetricFilter
import java.net.URI
import org.springframework.stereotype.Service

@Service("prometheus")
class PrometheusService(
    private val prometheusApi: PrometheusApi
) : MetricService {

    override fun getTotalRequests(searchMetric: SearchMetric, url: String): Metric {
        val query = "ceil(sum(irate(${searchMetric.name}{${metricFilter(searchMetric.filters)}}[1m])) " +
                                "by(${groupBy(searchMetric.groupBy)}))${metricPeriod(searchMetric.period)}"

        return this.prometheusApi.executeQuery(URI.create(url), query).toMetric(searchMetric.name)
    }

    override fun getAverageLatency(searchMetric: SearchMetric, url: String): Metric {
        val query = "round((sum(irate(${searchMetric.name}_sum{${metricFilter(searchMetric.filters)}}[1m])) " +
                                "by(${groupBy(searchMetric.groupBy)}) / sum(irate(${searchMetric.name}_count{${metricFilter(searchMetric.filters)}}[1m])) " +
                                "by(${groupBy(searchMetric.groupBy)})) * 1000)${metricPeriod(searchMetric.period)}"

        return this.prometheusApi.executeQuery(URI.create(url), query).toMetric(searchMetric.name)
    }

    override fun getAverageHttpErrorsPercentage(searchMetric: SearchMetric, url: String): Metric {
        val filter = metricFilter(searchMetric.filters)
        val finalFilter = if (filter.isBlank()) "response_status=~\"^5.*\$\"" else "$filter, response_status=~\"^5.*\$\""

        val query = "round((sum(irate(${searchMetric.name}{${finalFilter}}[1m])) by(${groupBy(searchMetric.groupBy)}) / " +
                        "scalar(sum(irate(${searchMetric.name}{${filter}}[1m])) " +
                        "by(${groupBy(searchMetric.groupBy)})) * 100), 0.01)${metricPeriod(searchMetric.period)}"

        return this.prometheusApi.executeQuery(URI.create(url), query).toMetric(searchMetric.name)
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

    private fun metricPeriod(period: Period?): String {
        if (period == null) {
            return ""
        }

        return "[${period.value}${period.unit.unitValue}:${period.sliceValue}${period.sliceUnit.unitValue}]"
    }
}
