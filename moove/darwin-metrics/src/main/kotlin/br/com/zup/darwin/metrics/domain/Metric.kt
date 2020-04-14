/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.metrics.domain

import br.com.zup.darwin.metrics.api.*

data class Metric(val name: String,
                  val result: List<MetricResult>)

data class MetricResult(val labels: Map<String, String>,
                        val data: List<MetricData>)

data class MetricData(val time: Long,
                      val value: Double)

fun Metric.toCircleMetricRepresentation(period: ProjectionType,
                                        type: MetricType) = CircleMetricRepresentation(
        period = period,
        type = type,
        data = result.firstOrNull()
                ?.data
                ?.map { it.toMetricDataRepresentation() }
                ?: ArrayList()
)

fun Metric.toMetricRepresentation(period: ProjectionType,
                                  type: MetricType,
                                  components: List<ComponentRepresentation>) = ComponentMetricRepresentation(
        period = period,
        type = type,
        components = components
)

fun MetricResult.toComponentRepresentation(module: String,
                                           name: String) = ComponentRepresentation(
        name = name,
        module = module,
        data = data.map { it.toMetricDataRepresentation() }
)

fun MetricData.toMetricDataRepresentation() = MetricDataRepresentation(
        timestamp = time,
        value = value
)