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

import io.charlescd.moove.domain.exceptions.NotFoundException
import io.charlescd.moove.domain.repository.MetricConfigurationRepository
import io.charlescd.moove.metrics.api.ProjectionType
import io.charlescd.moove.metrics.api.response.CircleMetricRepresentation
import io.charlescd.moove.metrics.api.toPeriod
import io.charlescd.moove.metrics.connector.MetricServiceFactory
import io.charlescd.moove.metrics.domain.*
import io.charlescd.moove.metrics.interactor.RetrieveCirclePeriodMetricInteractor
import org.springframework.stereotype.Service

@Service
class RetrieveCirclePeriodMetricInteractorImpl(private val serviceFactory: MetricServiceFactory,
                                               private val metricConfigurationRepository: MetricConfigurationRepository) : RetrieveCirclePeriodMetricInteractor {

    override fun execute(circleId: String,
                         projectionType: ProjectionType,
                         metricType: MetricType,
                         workspaceId: String): CircleMetricRepresentation {

        val metricConfiguration = this.metricConfigurationRepository.findByWorkspaceId(workspaceId)
                .orElseThrow { NotFoundException("metric configuration for workspace", workspaceId) }

        val service = serviceFactory.getConnector(metricConfiguration.provider)

        val metric = when (metricType) {
            MetricType.REQUESTS_BY_CIRCLE -> service.getTotalRequests(SearchMetric("istio_charles_request_total")
                    .filteringBy(listOf(SearchMetricFilter("circle_source", listOf(circleId), FilterKind.EQUAL)))
                    .groupingBy(listOf("circle_source"))
                    .forPeriod(projectionType.toPeriod()), metricConfiguration.url)

            MetricType.REQUESTS_ERRORS_BY_CIRCLE -> service.getAverageHttpErrorsPercentage(SearchMetric("istio_charles_request_total")
                    .filteringBy(listOf(SearchMetricFilter("circle_source", listOf(circleId), FilterKind.EQUAL)))
                    .groupingBy(listOf("circle_source"))
                    .forPeriod(projectionType.toPeriod()), metricConfiguration.url)

            MetricType.REQUESTS_LATENCY_BY_CIRCLE -> service.getAverageLatency(SearchMetric("istio_charles_request_duration_seconds")
                    .filteringBy(listOf(SearchMetricFilter("circle_source", listOf(circleId), FilterKind.EQUAL)))
                    .groupingBy(listOf("circle_source"))
                    .forPeriod(projectionType.toPeriod()), metricConfiguration.url)
        }

        return metric.toCircleMetricRepresentation(projectionType, metricType)
    }
}