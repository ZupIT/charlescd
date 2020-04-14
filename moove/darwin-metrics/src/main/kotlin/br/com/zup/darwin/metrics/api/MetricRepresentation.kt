/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.metrics.api

data class CircleMetricRepresentation(val period: ProjectionType,
                                      val type: MetricType,
                                      val data: List<MetricDataRepresentation>)

data class ComponentMetricRepresentation(val period: ProjectionType,
                                         val type: MetricType,
                                         val components: List<ComponentRepresentation>)

data class ComponentRepresentation(val name: String,
                                   val module: String,
                                   val data: List<MetricDataRepresentation>)

data class MetricDataRepresentation(val timestamp: Long,
                                    val value: Double)
