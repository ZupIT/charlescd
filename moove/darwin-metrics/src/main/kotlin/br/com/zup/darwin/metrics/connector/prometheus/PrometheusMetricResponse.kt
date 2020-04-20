/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.metrics.connector.prometheus

import br.com.zup.darwin.metrics.domain.Metric
import br.com.zup.darwin.metrics.domain.MetricData
import br.com.zup.darwin.metrics.domain.MetricResult
import com.fasterxml.jackson.annotation.JsonFormat
import com.fasterxml.jackson.annotation.JsonPropertyOrder

data class PrometheusMetricResponse(
        val status: String,
        val data: PrometheusMetricData)


data class PrometheusMetricData(
        val resultType: String,
        val result: List<PrometheusResult>)

data class PrometheusResult(
        val metric: Map<String, String>,
        val values: List<PrometheusMetricValue>)

@JsonFormat(shape = JsonFormat.Shape.ARRAY)
data class PrometheusMetricValue(@JsonPropertyOrder("0") val timeStamp: Long,
                                 @JsonPropertyOrder("1") val value: String)

fun PrometheusMetricResponse.toMetric(name: String) = Metric(
        name = name,
        result = this.data.result.map { it.toMetricResult() }
)

private fun PrometheusResult.toMetricResult() = MetricResult(
        labels = metric,
        data = this.values.map { it.toMetricData() }
)

fun PrometheusMetricValue.toMetricData() = MetricData(
        time = timeStamp,
        value = prometheusValueConverter(this.value)
)

private fun prometheusValueConverter(value: String): Double {
    val convertedValue = value.toDoubleOrNull()
    return if (convertedValue == null || convertedValue.isNaN()) 0.0 else convertedValue
}