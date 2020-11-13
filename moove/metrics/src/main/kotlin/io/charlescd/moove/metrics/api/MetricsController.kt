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
    private val retrieveCirclePeriodMetric: RetrieveCirclePeriodMetricInteractor,
    private val retrieveDeploymentsMetricsInteractor: RetrieveDeploymentsMetricsInteractor,
    private val retrieveCirclesMetricsInteractor: RetrieveCirclesMetricsInteractor
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

    @ApiOperation(value = "Get Circles General Metrics")
    @GetMapping
    @RequestMapping("/circles")
    fun getCircleGeneralMetrics(@RequestHeader("x-workspace-id") workspaceId: String):
            CirclesMetricsRepresentation = this.retrieveCirclesMetricsInteractor.execute(workspaceId)

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
