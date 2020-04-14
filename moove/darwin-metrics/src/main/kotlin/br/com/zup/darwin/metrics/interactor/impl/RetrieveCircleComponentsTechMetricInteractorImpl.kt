/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.metrics.interactor.impl

import br.com.zup.darwin.entity.Module
import br.com.zup.darwin.metrics.api.*
import br.com.zup.darwin.metrics.connector.MetricProvider
import br.com.zup.darwin.metrics.connector.MetricServiceFactory
import br.com.zup.darwin.metrics.domain.*
import br.com.zup.darwin.metrics.interactor.RetrieveCircleComponentsTechMetricInteractor
import br.com.zup.darwin.repository.CircleRepository
import br.com.zup.darwin.repository.ModuleRepository
import br.com.zup.exception.handler.exception.NotFoundException
import br.com.zup.exception.handler.to.ResourceValue
import org.springframework.stereotype.Service

@Service
class RetrieveCircleComponentsTechMetricInteractorImpl(private val serviceFactory: MetricServiceFactory,
                                                       private val circleRepository: CircleRepository,
                                                       private val moduleRepository: ModuleRepository) : RetrieveCircleComponentsTechMetricInteractor {

    private companion object {
        private const val COMPONENT_LABEL = "destination_component"
    }


    override fun execute(circleId: String,
                         projectionType: ProjectionType,
                         metricType: MetricType): ComponentMetricRepresentation {

        if (!this.circleRepository.existsById(circleId)) {
            throw NotFoundException(ResourceValue("circle", circleId))
        }

        val modules = moduleRepository.findAllModulesDeployedAtCircle(circleId)
                .orElseThrow { NotFoundException(ResourceValue("modules", "No module found for circle: $circleId")) }

        val service = serviceFactory.getConnector(MetricProvider.PROMETHEUS)

        val metric = when (metricType) {
            MetricType.REQUESTS_BY_CIRCLE -> service.getTotalRequests(SearchMetric("istio_charles_request_total", projectionType.toPeriod())
                    .filteringBy(listOf(SearchMetricFilter("circle_source", listOf(circleId), FilterKind.EQUAL)))
                    .groupingBy(listOf(COMPONENT_LABEL)))

            MetricType.REQUESTS_ERRORS_BY_CIRCLE -> service.getAverageHttpErrors(SearchMetric("istio_charles_request_total", projectionType.toPeriod())
                    .filteringBy(listOf(SearchMetricFilter("circle_source", listOf(circleId), FilterKind.EQUAL)))
                    .groupingBy(listOf(COMPONENT_LABEL)))

            MetricType.REQUESTS_LATENCY_BY_CIRCLE -> service.getAverageLatency(SearchMetric("istio_charles_request_duration_seconds", projectionType.toPeriod())
                    .filteringBy(listOf(SearchMetricFilter("circle_source", listOf(circleId), FilterKind.EQUAL)))
                    .groupingBy(listOf(COMPONENT_LABEL)))
        }

        val componentsRepresentation = metric.result.map { buildComponentRepresentation(it, modules) }
                .sortedWith(compareBy({ it.module }, { it.name }))

        return metric.toMetricRepresentation(projectionType, metricType, componentsRepresentation)
    }

    private fun buildComponentRepresentation(componentMetric: MetricResult,
                                             modules: List<Module>): ComponentRepresentation {

        val componentName = componentMetric.labels[COMPONENT_LABEL]
                ?: throw NotFoundException(ResourceValue("component", "No metric found"))

        val module = modules.firstOrNull { module -> module.components.any { it.name.toLowerCase() == componentName } }
        return componentMetric.toComponentRepresentation(module?.name ?: "", componentName)
    }

}