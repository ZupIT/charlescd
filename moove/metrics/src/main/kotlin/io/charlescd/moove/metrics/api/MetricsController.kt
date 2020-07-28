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

import io.charlescd.moove.metrics.api.response.*
import io.charlescd.moove.metrics.domain.MetricType
import io.charlescd.moove.metrics.interactor.*
import io.swagger.annotations.Api
import io.swagger.annotations.ApiOperation
import org.springframework.web.bind.annotation.*

@Api(value = "Metrics Endpoints", tags = ["Metrics"])
@RestController
@RequestMapping("/metrics")
class MetricsController(
    private val retrieveCircleComponentsPeriodMetric: RetrieveCircleComponentsPeriodMetricInteractor,
    private val retrieveCirclePeriodMetric: RetrieveCirclePeriodMetricInteractor,
    private val retrieveCircleComponentsHealthInteractor: RetrieveCircleComponentsHealthInteractor,
    private val retrieveDeploymentsMetricsInteractor: RetrieveDeploymentsMetricsInteractor

) {

    @ApiOperation(value = "Get Request Metrics by Circle")
    @GetMapping
    fun getMetric(
        @RequestParam circleId: String,
        @RequestParam projectionType: ProjectionType,
        @RequestHeader("x-workspace-id") workspaceId: String,
        @RequestParam metricType: MetricType
    ): CircleMetricRepresentation =
        this.retrieveCirclePeriodMetric.execute(circleId, projectionType, metricType, workspaceId)

    @ApiOperation(value = "Get request Metrics by circle, grouped by component")
    @GetMapping
    @RequestMapping("/circle/{circleId}/components")
    fun getComponentMetric(
        @PathVariable circleId: String,
        @RequestParam projectionType: ProjectionType,
        @RequestHeader("x-workspace-id") workspaceId: String,
        @RequestParam metricType: MetricType
    ): ComponentMetricRepresentation =
        this.retrieveCircleComponentsPeriodMetric.execute(circleId, projectionType, metricType, workspaceId)

    @ApiOperation(value = "Get circle basic health")
    @GetMapping
    @RequestMapping("/circle/{circleId}/components/health")
    fun getComponentHealth(@PathVariable circleId: String, @RequestHeader("x-workspace-id") workspaceId: String):
            CircleHealthRepresentation = this.retrieveCircleComponentsHealthInteractor.execute(circleId, workspaceId)

    @ApiOperation(value = "Get Deployments general Metrics")
    @GetMapping
    @RequestMapping("/deployments")
    fun getDeploymentsMetrics(
        @RequestHeader("x-workspace-id") workspaceId: String,
        @RequestParam("period") period: PeriodType,
        @RequestParam(value = "circles", required = false) circlesIds: List<String>?
    ): DeploymentMetricsRepresentation {
        return retrieveDeploymentsMetricsInteractor.execute(workspaceId, period, circlesIds)
    }
}
