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

import io.charlescd.moove.metrics.api.ProjectionType
import io.charlescd.moove.metrics.api.response.*

data class Metric(
        val name: String,
        val result: List<MetricResult>
)

data class MetricResult(
        val labels: Map<String, String>,
        val data: List<MetricData>
)

data class MetricData(
        val time: Long,
        val value: Double
)

fun Metric.toCircleMetricRepresentation(
        period: ProjectionType,
        type: MetricType
) = CircleMetricRepresentation(
        period = period,
        type = type,
        data = result.firstOrNull()
                ?.data
                ?.map { it.toMetricDataRepresentation() }
                ?: ArrayList()
)

fun toMetricRepresentation(
        period: ProjectionType,
        type: MetricType,
        components: List<ComponentRepresentation>
) = ComponentMetricRepresentation(
        period = period,
        type = type,
        components = components
)

fun MetricResult.toComponentRepresentation(
        module: String,
        name: String
) = ComponentRepresentation(
        name = name,
        module = module,
        data = data.map { it.toMetricDataRepresentation() }
)

fun MetricData.toMetricDataRepresentation() = MetricDataRepresentation(
        timestamp = time,
        value = value
)

fun Metric.toCircleRequestsRepresentation(unit: String) = CircleRequestsRepresentation(
        value = this.result.firstOrNull()?.data?.firstOrNull()?.value?.toLong() ?: 0,
        unit = unit
)

fun MetricResult.toCircleComponentHealthRepresentation(threshold: Int,
                                                       name: String) = CircleComponentHealthRepresentation(
        name = name,
        threshold = threshold,
        value = this.data.firstOrNull()?.value ?: 0.0,
        status = componentStatus(threshold, this.data.firstOrNull()?.value ?: 0.0)
)

private fun componentStatus(thresholdValue: Int, metricValue: Double): HealthStatus {
    if (metricValue > thresholdValue) {
        return HealthStatus.ERROR
    } else if (metricValue < thresholdValue && metricValue >= thresholdValue - (thresholdValue * 0.1)) {
        return HealthStatus.WARNING
    }

    return HealthStatus.STABLE
}
