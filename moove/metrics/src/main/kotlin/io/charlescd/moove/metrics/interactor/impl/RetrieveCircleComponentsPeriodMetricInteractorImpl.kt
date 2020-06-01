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
import io.charlescd.moove.metrics.api.ProjectionType
import io.charlescd.moove.metrics.api.response.ComponentMetricRepresentation
import io.charlescd.moove.metrics.api.response.ComponentRepresentation
import io.charlescd.moove.metrics.api.toPeriod
import io.charlescd.moove.metrics.connector.MetricServiceFactory
import io.charlescd.moove.metrics.domain.*
import io.charlescd.moove.metrics.interactor.RetrieveCircleComponentsPeriodMetricInteractor
import org.springframework.stereotype.Service

@Service
class RetrieveCircleComponentsPeriodMetricInteractorImpl(private val serviceFactory: MetricServiceFactory,
                                                         private val componentRepository: ComponentRepository,
                                                         private val moduleRepository: ModuleRepository,
                                                         private val metricConfigurationRepository: MetricConfigurationRepository) : RetrieveCircleComponentsPeriodMetricInteractor {

    private companion object {
        private const val COMPONENT_LABEL = "destination_component"
    }

    override fun execute(circleId: String,
                         projectionType: ProjectionType,
                         metricType: MetricType,
                         workspaceId: String): ComponentMetricRepresentation {

        val metricConfiguration = this.metricConfigurationRepository.findByWorkspaceId(workspaceId)
                .orElseThrow { NotFoundException("metric configuration for workspace", workspaceId) }

        val components = componentRepository.findAllDeployedAtCircle(circleId, workspaceId)

        if (components.isEmpty()) {
            return ComponentMetricRepresentation(projectionType, metricType, emptyList())
        }

        return getMetricValues(components, metricConfiguration, circleId, metricType, projectionType)
    }

    private fun getMetricValues(components: List<Component>,
                                metricConfiguration: MetricConfiguration,
                                circleId: String,
                                metricType: MetricType,
                                projectionType: ProjectionType): ComponentMetricRepresentation {

        val modules = moduleRepository.findByIds(components.map { it.moduleId }).associateBy { it.id }

        val service = serviceFactory.getConnector(metricConfiguration.provider)

        val metric = when (metricType) {
            MetricType.REQUESTS_BY_CIRCLE -> service.getTotalRequests(SearchMetric("istio_charles_request_total")
                    .filteringBy(listOf(SearchMetricFilter("circle_source", listOf(circleId), FilterKind.EQUAL)))
                    .groupingBy(listOf(COMPONENT_LABEL))
                    .forPeriod(projectionType.toPeriod()), metricConfiguration.url)

            MetricType.REQUESTS_ERRORS_BY_CIRCLE -> service.getAverageHttpErrorsPercentage(SearchMetric("istio_charles_request_total")
                    .filteringBy(listOf(SearchMetricFilter("circle_source", listOf(circleId), FilterKind.EQUAL)))
                    .groupingBy(listOf(COMPONENT_LABEL))
                    .forPeriod(projectionType.toPeriod()), metricConfiguration.url)

            MetricType.REQUESTS_LATENCY_BY_CIRCLE -> service.getAverageLatency(SearchMetric("istio_charles_request_duration_seconds")
                    .filteringBy(listOf(SearchMetricFilter("circle_source", listOf(circleId), FilterKind.EQUAL)))
                    .groupingBy(listOf(COMPONENT_LABEL))
                    .forPeriod(projectionType.toPeriod()), metricConfiguration.url)
        }

        val resultMap = metric.result.associateBy { it.labels[COMPONENT_LABEL] }

        val componentsRepresentation = components
                .map { buildComponentRepresentation(it, resultMap[it.name], modules[it.moduleId]) }
                .sortedWith(compareBy({ it.module }, { it.name }))

        return toMetricRepresentation(projectionType, metricType, componentsRepresentation)
    }

    private fun buildComponentRepresentation(component: Component,
                                             componentMetric: MetricResult?,
                                             module: Module?): ComponentRepresentation {

        val moduleName = module?.name ?: ""

        return componentMetric?.toComponentRepresentation(moduleName, component.name)
                ?: ComponentRepresentation(component.name, moduleName, emptyList())
    }

}