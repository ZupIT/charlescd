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

import io.charlescd.moove.domain.MetricConfiguration
import io.charlescd.moove.domain.User
import io.charlescd.moove.domain.exceptions.NotFoundException
import io.charlescd.moove.domain.repository.MetricConfigurationRepository
import io.charlescd.moove.metrics.api.ProjectionType
import io.charlescd.moove.metrics.connector.MetricServiceFactory
import io.charlescd.moove.metrics.connector.prometheus.PrometheusService
import io.charlescd.moove.metrics.domain.*
import spock.lang.Specification

import java.time.LocalDateTime

class RetrieveCirclePeriodMetricInteractorImplUnitTest extends Specification {

    def serviceFactory = Mock(MetricServiceFactory)
    def metricConfigurationRepository = Mock(MetricConfigurationRepository)
    def providerService = Mock(PrometheusService)

    def retrieveCircleTechMetricInteractorImpl = new RetrieveCirclePeriodMetricInteractorImpl(serviceFactory, metricConfigurationRepository)

    def workspaceId = "workspace-id"
    def circleId = "circle-id"

    def author = new User("81861b6f-2b6e-44a1-a745-83e298a550c9", "John Doe", "email@gmail.com",
            "https://www.photos.com/johndoe", [], false, LocalDateTime.now())

    def metricConfiguration = new MetricConfiguration("ae366287-0fd3-4c91-bd3e-debe455cd2cb", MetricConfiguration.ProviderEnum.PROMETHEUS, "https://metric-provider-url.com",
            LocalDateTime.now(), workspaceId, author)

    def 'when metric configuration not exists for workspace'() {
        when:
        retrieveCircleTechMetricInteractorImpl.execute(circleId, ProjectionType.FIVE_MINUTES, MetricType.REQUESTS_BY_CIRCLE, workspaceId)

        then:
        1 * metricConfigurationRepository.findByWorkspaceId(workspaceId) >> Optional.empty()
        0 * _

        def ex = thrown(NotFoundException)
        ex.resourceName == "metric configuration for workspace"
        ex.id == workspaceId
    }

    def 'should return request total metrics data when circle exists and has metrics'() {
        given:
        def projectionType = ProjectionType.ONE_HOUR

        def metric = new Metric("istio_charles_request_total",
                Collections.singletonList(new MetricResult(Collections.emptyMap(),
                        Collections.singletonList(new MetricData(123456L, 12)))))

        when:
        def result = retrieveCircleTechMetricInteractorImpl.execute(circleId, projectionType, MetricType.REQUESTS_BY_CIRCLE, workspaceId)

        then:
        1 * metricConfigurationRepository.findByWorkspaceId(workspaceId) >> Optional.of(metricConfiguration)
        1 * serviceFactory.getConnector(metricConfiguration.provider) >> providerService
        1 * providerService.getTotalRequests(_ as SearchMetric, metricConfiguration.url) >> metric
        0 * _

        result != null
        result.period == projectionType
        result.type == MetricType.REQUESTS_BY_CIRCLE
        result.data != null
        result.data.size() == 1
        result.data.get(0).timestamp == 123456L
        result.data.get(0).value == 12
    }

    def 'should return request error metrics data when circle exists and has metrics'() {
        given:
        def projectionType = ProjectionType.ONE_HOUR

        def metric = new Metric("istio_charles_request_total",
                Collections.singletonList(new MetricResult(Collections.emptyMap(),
                        Collections.singletonList(new MetricData(123456L, 12)))))

        when:
        def result = retrieveCircleTechMetricInteractorImpl.execute(circleId, projectionType, MetricType.REQUESTS_ERRORS_BY_CIRCLE, workspaceId)

        then:
        1 * metricConfigurationRepository.findByWorkspaceId(workspaceId) >> Optional.of(metricConfiguration)
        1 * serviceFactory.getConnector(metricConfiguration.provider) >> providerService
        1 * providerService.getAverageHttpErrorsPercentage(_ as SearchMetric, metricConfiguration.url) >> metric
        0 * _

        result != null
        result.period == projectionType
        result.type == MetricType.REQUESTS_ERRORS_BY_CIRCLE
        result.data != null
        result.data.size() == 1
        result.data.get(0).timestamp == 123456L
        result.data.get(0).value == 12
    }

    def 'should return latency metrics data when circle exists and has metrics'() {
        given:
        def projectionType = ProjectionType.ONE_HOUR

        def metric = new Metric("istio_charles_request_duration_seconds",
                Collections.singletonList(new MetricResult(Collections.emptyMap(),
                        Collections.singletonList(new MetricData(123456L, 12)))))

        when:
        def result = retrieveCircleTechMetricInteractorImpl.execute(circleId, projectionType, MetricType.REQUESTS_LATENCY_BY_CIRCLE, workspaceId)

        then:
        1 * metricConfigurationRepository.findByWorkspaceId(workspaceId) >> Optional.of(metricConfiguration)
        1 * serviceFactory.getConnector(metricConfiguration.provider) >> providerService
        1 * providerService.getAverageLatency(_ as SearchMetric, metricConfiguration.url) >> metric
        0 * _

        result != null
        result.period == projectionType
        result.type == MetricType.REQUESTS_LATENCY_BY_CIRCLE
        result.data != null
        result.data.size() == 1
        result.data.get(0).timestamp == 123456L
        result.data.get(0).value == 12
    }

    def 'should return empty list when no metric found'() {
        given:
        def projectionType = ProjectionType.ONE_HOUR

        def metric = new Metric("istio_charles_request_total", [])

        when:
        def result = retrieveCircleTechMetricInteractorImpl.execute(circleId, projectionType, MetricType.REQUESTS_BY_CIRCLE, workspaceId)

        then:
        1 * metricConfigurationRepository.findByWorkspaceId(workspaceId) >> Optional.of(metricConfiguration)
        1 * serviceFactory.getConnector(metricConfiguration.provider) >> providerService
        1 * providerService.getTotalRequests(_ as SearchMetric, metricConfiguration.url) >> metric
        0 * _

        result != null
        result.period == projectionType
        result.type == MetricType.REQUESTS_BY_CIRCLE
        result.data != null
        result.data.isEmpty()
    }
}
