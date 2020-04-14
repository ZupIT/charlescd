/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.metrics.api

import br.com.zup.darwin.metrics.interactor.RetrieveCircleComponentsTechMetricInteractor
import br.com.zup.darwin.metrics.interactor.RetrieveCircleTechMetricInteractor
import io.swagger.annotations.Api
import io.swagger.annotations.ApiImplicitParam
import io.swagger.annotations.ApiOperation
import org.springframework.web.bind.annotation.*

@Api(value = "Metrics Endpoints", tags = ["Metrics"])
@RestController
@RequestMapping("/metrics")
class MetricsController(private val retrieveCircleComponentsTechMetric: RetrieveCircleComponentsTechMetricInteractor,
                        private val retrieveCircleTechMetric: RetrieveCircleTechMetricInteractor) {

    @ApiOperation(value = "Get Metrics")
    @GetMapping
    fun getMetric(@RequestParam circleId: String,
                  @RequestParam projectionType: ProjectionType,
                  @RequestParam metricType: MetricType): CircleMetricRepresentation = this.retrieveCircleTechMetric.execute(circleId, projectionType, metricType)

    @ApiOperation(value = "Get Compoment Metrics")
    @GetMapping
    @RequestMapping("/circle/{circleId}/components")
    fun getComponentMetric(@PathVariable circleId: String,
                           @RequestParam projectionType: ProjectionType,
                           @RequestParam metricType: MetricType): ComponentMetricRepresentation = this.retrieveCircleComponentsTechMetric.execute(circleId, projectionType, metricType)
}