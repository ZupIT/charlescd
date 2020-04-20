/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.metrics.interactor.impl

import br.com.zup.darwin.metrics.api.CircleMetricRepresentation
import br.com.zup.darwin.metrics.api.MetricType
import br.com.zup.darwin.metrics.api.ProjectionType
import br.com.zup.darwin.metrics.api.toPeriod
import br.com.zup.darwin.metrics.connector.MetricProvider
import br.com.zup.darwin.metrics.connector.MetricServiceFactory
import br.com.zup.darwin.metrics.domain.FilterKind
import br.com.zup.darwin.metrics.domain.SearchMetric
import br.com.zup.darwin.metrics.domain.SearchMetricFilter
import br.com.zup.darwin.metrics.domain.toCircleMetricRepresentation
import br.com.zup.darwin.metrics.interactor.RetrieveCircleTechMetricInteractor
import br.com.zup.darwin.repository.CircleRepository
import br.com.zup.exception.handler.exception.NotFoundException
import br.com.zup.exception.handler.to.ResourceValue
import org.springframework.stereotype.Service

@Service
class RetrieveCircleTechMetricInteractorImpl(private val serviceFactory: MetricServiceFactory,
                                             private val circleRepository: CircleRepository) : RetrieveCircleTechMetricInteractor {

    override fun execute(circleId: String,
                         projectionType: ProjectionType,
                         metricType: MetricType): CircleMetricRepresentation {

        if (!this.circleRepository.existsById(circleId)) {
            throw NotFoundException(ResourceValue("circle", circleId))
        }

        val service = serviceFactory.getConnector(MetricProvider.PROMETHEUS)

        val metric = when (metricType) {
            MetricType.REQUESTS_BY_CIRCLE -> service.getTotalRequests(SearchMetric("istio_charles_request_total", projectionType.toPeriod())
                    .filteringBy(listOf(SearchMetricFilter("circle_source", listOf(circleId), FilterKind.EQUAL)))
                    .groupingBy(listOf("circle_source")))

            MetricType.REQUESTS_ERRORS_BY_CIRCLE -> service.getAverageHttpErrors(SearchMetric("istio_charles_request_total", projectionType.toPeriod())
                    .filteringBy(listOf(SearchMetricFilter("circle_source", listOf(circleId), FilterKind.EQUAL)))
                    .groupingBy(listOf("circle_source")))

            MetricType.REQUESTS_LATENCY_BY_CIRCLE -> service.getAverageLatency(SearchMetric("istio_charles_request_duration_seconds", projectionType.toPeriod())
                    .filteringBy(listOf(SearchMetricFilter("circle_source", listOf(circleId), FilterKind.EQUAL)))
                    .groupingBy(listOf("circle_source")))
        }

        return metric.toCircleMetricRepresentation(projectionType, metricType)
    }
}