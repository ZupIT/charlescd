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

import com.fasterxml.jackson.annotation.JsonFormat
import com.fasterxml.jackson.annotation.JsonPropertyOrder
import com.fasterxml.jackson.databind.annotation.JsonDeserialize
import io.charlescd.moove.metrics.domain.Metric
import io.charlescd.moove.metrics.domain.MetricData
import io.charlescd.moove.metrics.domain.MetricResult

data class PrometheusMetricResponse(
    val status: String,
    val data: PrometheusMetricData
)

@JsonDeserialize(using = PrometheusResponseDeserializer::class)
data class PrometheusMetricData(
    val resultType: String,
    val result: List<PrometheusResult>
)

abstract class PrometheusResult

data class PrometheusMatrixResult(
    val metric: Map<String, String>,
    val values: List<PrometheusMetricValue>
) : PrometheusResult()

data class PrometheusVectorResult(
    val metric: Map<String, String>,
    val value: PrometheusMetricValue
) : PrometheusResult()

@JsonFormat(shape = JsonFormat.Shape.ARRAY)
data class PrometheusMetricValue(
    @JsonPropertyOrder("0") val timeStamp: Long,
    @JsonPropertyOrder("1") val value: String
)

fun PrometheusMetricResponse.toMetric(name: String) = Metric(
        name = name,
        result = this.data.result.map { it.toMetricResult(this.data.resultType) }
)

private fun PrometheusResult.toMetricResult(resultType: String): MetricResult =
        when (PrometheusResultType.valueOf(resultType.toUpperCase())) {
            PrometheusResultType.MATRIX -> (this as PrometheusMatrixResult).toMetricResult()
            PrometheusResultType.VECTOR -> (this as PrometheusVectorResult).toMetricResult()
        }

private fun PrometheusMatrixResult.toMetricResult() = MetricResult(
        labels = metric,
        data = this.values.map { it.toMetricData() }
)

private fun PrometheusVectorResult.toMetricResult() = MetricResult(
        labels = metric,
        data = listOf(this.value.toMetricData())
)

private fun PrometheusMetricValue.toMetricData() = MetricData(
        time = timeStamp,
        value = prometheusValueConverter(this.value)
)

private fun prometheusValueConverter(value: String): Double {
    val convertedValue = value.toDoubleOrNull()
    return if (convertedValue == null || convertedValue.isNaN()) 0.0 else convertedValue
}
