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

package io.charlescd.moove.metrics.api

import io.charlescd.moove.metrics.api.response.CircleHealthRepresentation
import io.charlescd.moove.metrics.api.response.CircleMetricRepresentation
import io.charlescd.moove.metrics.api.response.ComponentMetricRepresentation
import io.charlescd.moove.metrics.domain.MetricType
import io.charlescd.moove.metrics.interactor.RetrieveCircleComponentsHealthInteractor
import io.charlescd.moove.metrics.interactor.RetrieveCircleComponentsPeriodMetricInteractor
import io.charlescd.moove.metrics.interactor.RetrieveCirclePeriodMetricInteractor
import io.swagger.annotations.Api
import io.swagger.annotations.ApiOperation
import org.springframework.web.bind.annotation.*

@Api(value = "Metrics Endpoints", tags = ["Metrics"])
@RestController
@RequestMapping("/metrics")
class MetricsController(
    private val retrieveCircleComponentsPeriodMetric: RetrieveCircleComponentsPeriodMetricInteractor,
    private val retrieveCirclePeriodMetric: RetrieveCirclePeriodMetricInteractor,
    private val retrieveCircleComponentsHealthInteractor: RetrieveCircleComponentsHealthInteractor
) {

    @ApiOperation(value = "Get Metrics")
    @GetMapping
    fun getMetric(
        @RequestParam circleId: String,
        @RequestParam projectionType: ProjectionType,
        @RequestHeader("x-workspace-id") workspaceId: String,
        @RequestParam metricType: MetricType
    ): CircleMetricRepresentation =
            this.retrieveCirclePeriodMetric.execute(circleId, projectionType, metricType, workspaceId)

    @ApiOperation(value = "Get Compoment Metrics")
    @GetMapping
    @RequestMapping("/circle/{circleId}/components")
    fun getComponentMetric(
        @PathVariable circleId: String,
        @RequestParam projectionType: ProjectionType,
        @RequestHeader("x-workspace-id") workspaceId: String,
        @RequestParam metricType: MetricType
    ): ComponentMetricRepresentation =
            this.retrieveCircleComponentsPeriodMetric.execute(circleId, projectionType, metricType, workspaceId)

    @GetMapping
    @RequestMapping("/circle/{circleId}/components/health")
    fun getComponentHealth(@PathVariable circleId: String, @RequestHeader("x-workspace-id") workspaceId: String):
            CircleHealthRepresentation = this.retrieveCircleComponentsHealthInteractor.execute(circleId, workspaceId)
}
