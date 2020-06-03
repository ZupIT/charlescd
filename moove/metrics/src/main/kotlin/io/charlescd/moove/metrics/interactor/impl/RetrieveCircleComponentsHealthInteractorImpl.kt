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

package io.charlescd.moove.metrics.interactor.impl

import io.charlescd.moove.domain.Component
import io.charlescd.moove.domain.MetricConfiguration
import io.charlescd.moove.domain.Module
import io.charlescd.moove.domain.exceptions.NotFoundException
import io.charlescd.moove.domain.repository.ComponentRepository
import io.charlescd.moove.domain.repository.MetricConfigurationRepository
import io.charlescd.moove.domain.repository.ModuleRepository
import io.charlescd.moove.metrics.api.response.CircleComponentHealthRepresentation
import io.charlescd.moove.metrics.api.response.CircleHealthRepresentation
import io.charlescd.moove.metrics.api.response.CircleHealthTypeRepresentation
import io.charlescd.moove.metrics.api.response.CircleRequestsRepresentation
import io.charlescd.moove.metrics.connector.MetricServiceFactory
import io.charlescd.moove.metrics.domain.*
import io.charlescd.moove.metrics.interactor.RetrieveCircleComponentsHealthInteractor

@org.springframework.stereotype.Component
class RetrieveCircleComponentsHealthInteractorImpl(
    private val serviceFactory: MetricServiceFactory,
    private val componentRepository: ComponentRepository,
    private val moduleRepository: ModuleRepository,
    private val metricConfigurationRepository: MetricConfigurationRepository
) : RetrieveCircleComponentsHealthInteractor {

    private companion object {
        private const val COMPONENT_LABEL = "destination_component"
    }

    override fun execute(circleId: String, workspaceId: String): CircleHealthRepresentation {

        val metricConfiguration = this.metricConfigurationRepository.findByWorkspaceId(workspaceId)
                .orElseThrow { NotFoundException("metric configuration for workspace", workspaceId) }

        val components = componentRepository.findAllDeployedAtCircle(circleId, workspaceId)

        if (components.isEmpty()) {
            return CircleHealthRepresentation(CircleRequestsRepresentation(0, MetricType.REQUESTS_BY_CIRCLE.unit),
                    CircleHealthTypeRepresentation(MetricType.REQUESTS_LATENCY_BY_CIRCLE.unit, emptyList()),
                    CircleHealthTypeRepresentation(MetricType.REQUESTS_ERRORS_BY_CIRCLE.unit, emptyList()))
        }

        return getHealthStatus(metricConfiguration, components, circleId)
    }

    private fun getHealthStatus(metricConfiguration: MetricConfiguration, components: List<Component>, circleId: String): CircleHealthRepresentation {
        val modules = moduleRepository.findByIds(components.map { it.moduleId }).associateBy { it.id }

        val service = serviceFactory.getConnector(metricConfiguration.provider)

        val requestsTotal = service.getTotalRequests(SearchMetric("istio_charles_request_total")
                .filteringBy(listOf(SearchMetricFilter("circle_source", listOf(circleId), FilterKind.EQUAL))), metricConfiguration.url)

        val errorsPercentage = service.getAverageHttpErrorsPercentage(SearchMetric("istio_charles_request_total")
                .filteringBy(listOf(SearchMetricFilter("circle_source", listOf(circleId), FilterKind.EQUAL)))
                .groupingBy(listOf("destination_component")), metricConfiguration.url)

        val latency = service.getAverageLatency(SearchMetric("istio_charles_request_duration_seconds")
                .filteringBy(listOf(SearchMetricFilter("circle_source", listOf(circleId), FilterKind.EQUAL)))
                .groupingBy(listOf("destination_component")), metricConfiguration.url)

        return CircleHealthRepresentation(requestsTotal.toCircleRequestsRepresentation(MetricType.REQUESTS_BY_CIRCLE.unit),
                buildCircleHealthRepresentation(components, latency.result, modules, MetricType.REQUESTS_LATENCY_BY_CIRCLE),
                buildCircleHealthRepresentation(components, errorsPercentage.result, modules, MetricType.REQUESTS_ERRORS_BY_CIRCLE))
    }

    private fun buildCircleHealthRepresentation(
        components: List<Component>,
        results: List<MetricResult>,
        modules: Map<String, Module>,
        metricType: MetricType
    ): CircleHealthTypeRepresentation {

        val resultMap = results.associateBy { it.labels[COMPONENT_LABEL] }

        val componentsHealth = components
                .map { buildComponentHealth(it, resultMap[it.name], modules[it.moduleId], metricType) }

        return CircleHealthTypeRepresentation(metricType.unit, componentsHealth
                .sortedWith(compareByDescending<CircleComponentHealthRepresentation> { it.value }
                        .thenBy { it.name }))
    }

    private fun buildComponentHealth(
        component: Component,
        metricResult: MetricResult?,
        module: Module?,
        metricType: MetricType
    ): CircleComponentHealthRepresentation {

        val name = module?.name?.plus("/${component.name}") ?: component.name

        val threshold = when (metricType) {
            MetricType.REQUESTS_ERRORS_BY_CIRCLE -> component.errorThreshold
            MetricType.REQUESTS_LATENCY_BY_CIRCLE -> component.latencyThreshold
            MetricType.REQUESTS_BY_CIRCLE -> 0
        }

        return metricResult?.toCircleComponentHealthRepresentation(threshold, name)
                ?: CircleComponentHealthRepresentation(name, threshold, 0.0, HealthStatus.STABLE)
    }
}
