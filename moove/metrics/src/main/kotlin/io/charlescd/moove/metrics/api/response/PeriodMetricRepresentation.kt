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

package io.charlescd.moove.metrics.api.response

import io.charlescd.moove.metrics.api.ProjectionType
import io.charlescd.moove.metrics.domain.MetricType

data class CircleMetricRepresentation(
    val period: ProjectionType,
    val type: MetricType,
    val data: List<MetricDataRepresentation>
)

data class ComponentMetricRepresentation(
    val period: ProjectionType,
    val type: MetricType,
    val components: List<ComponentRepresentation>
)

data class ComponentRepresentation(
    val name: String,
    val module: String,
    val data: List<MetricDataRepresentation>
)

data class MetricDataRepresentation(
    val timestamp: Long,
    val value: Double
)
