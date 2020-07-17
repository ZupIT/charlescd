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
import io.charlescd.moove.domain.User
import io.charlescd.moove.domain.exceptions.NotFoundException
import io.charlescd.moove.domain.repository.ComponentRepository
import io.charlescd.moove.domain.repository.MetricConfigurationRepository
import io.charlescd.moove.domain.repository.ModuleRepository
import io.charlescd.moove.metrics.api.ProjectionType
import io.charlescd.moove.metrics.connector.MetricServiceFactory
import io.charlescd.moove.metrics.connector.prometheus.PrometheusService
import io.charlescd.moove.metrics.domain.*
import spock.lang.Specification

import java.time.LocalDateTime

class RetrieveCircleComponentsPeriodMetricInteractorImplUnitTest extends Specification {

    def serviceFactory = Mock(MetricServiceFactory)
    def moduleRepository = Mock(ModuleRepository)
    def providerService = Mock(PrometheusService)
    def metricConfigurationRepository = Mock(MetricConfigurationRepository)
    def componentRepository = Mock(ComponentRepository)

    def retrieveCircleComponentsTechMetricInteractorImpl = new RetrieveCircleComponentsPeriodMetricInteractorImpl(serviceFactory, componentRepository, moduleRepository, metricConfigurationRepository)

    def workspaceId = "workspace-id"
    def circleId = "workspace-id"

    def author = new User("81861b6f-2b6e-44a1-a745-83e298a550c9", "John Doe", "email@gmail.com",
            "https://www.photos.com/johndoe", [], false, LocalDateTime.now())

    def componentX = new Component("component-x-id", "module-id", "componentX",
            LocalDateTime.of(2019, 12, 1, 0, 0), workspaceId, 10, 50, 'host', 'gateway')

    def componentY = new Component("component-y-id", "module-id", "componentY",
            LocalDateTime.of(2019, 12, 1, 0, 0), workspaceId, 10, 50, 'host', 'gateway')

    def componentModule = new Module("module-id", "module", "gitRepositoryAddress",
            LocalDateTime.of(2019, 12, 1, 0, 0), "helm-repository", author, [], null, [componentX, componentY], workspaceId)

    def metricConfiguration = new MetricConfiguration("ae366287-0fd3-4c91-bd3e-debe455cd2cb", MetricConfiguration.ProviderEnum.PROMETHEUS, "https://metric-provider-url.com",
            LocalDateTime.now(), workspaceId, author)

    def 'when metric configuration does not exists for workspace should throw an exception'() {
        when:
        retrieveCircleComponentsTechMetricInteractorImpl.execute(circleId, ProjectionType.FIVE_MINUTES, MetricType.REQUESTS_BY_CIRCLE, workspaceId)

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
                Collections.singletonList(new MetricResult(Collections.singletonMap("destination_component", "componentX"),
                        Collections.singletonList(new MetricData(123456L, 12)))))

        when:
        def result = retrieveCircleComponentsTechMetricInteractorImpl.execute(circleId, projectionType, MetricType.REQUESTS_BY_CIRCLE, workspaceId)

        then:
        1 * metricConfigurationRepository.findByWorkspaceId(workspaceId) >> Optional.of(metricConfiguration)
        1 * componentRepository.findAllDeployedAtCircle(circleId, workspaceId) >> [componentX]
        1 * serviceFactory.getConnector(metricConfiguration.provider) >> providerService
        1 * moduleRepository.findByIds(_ as List) >> [componentModule]
        1 * providerService.getTotalRequests(_ as SearchMetric, metricConfiguration.url) >> metric
        0 * _

        result != null
        result.period == projectionType
        result.type == MetricType.REQUESTS_BY_CIRCLE
        result.components != null
        result.components.size() == 1
        result.components.get(0).module == "module"
        result.components.get(0).name == "componentX"
        result.components.get(0).data.size() == 1
        result.components.get(0).data.get(0).timestamp == 123456L
        result.components.get(0).data.get(0).value == 12
    }

    def 'should return request errors metrics data when circle exists and has metrics'() {
        given:
        def projectionType = ProjectionType.ONE_HOUR

        def metric = new Metric("istio_charles_request_total",
                Collections.singletonList(new MetricResult(Collections.singletonMap("destination_component", "componentX"),
                        Collections.singletonList(new MetricData(123456L, 12)))))

        when:
        def result = retrieveCircleComponentsTechMetricInteractorImpl.execute(circleId, projectionType, MetricType.REQUESTS_ERRORS_BY_CIRCLE, workspaceId)

        then:
        1 * metricConfigurationRepository.findByWorkspaceId(workspaceId) >> Optional.of(metricConfiguration)
        1 * componentRepository.findAllDeployedAtCircle(circleId, workspaceId) >> [componentX]
        1 * serviceFactory.getConnector(metricConfiguration.provider) >> providerService
        1 * moduleRepository.findByIds(_ as List) >> [componentModule]
        1 * providerService.getAverageHttpErrorsPercentage(_ as SearchMetric, metricConfiguration.url) >> metric
        0 * _

        result != null
        result.period == projectionType
        result.type == MetricType.REQUESTS_ERRORS_BY_CIRCLE
        result.components != null
        result.components.size() == 1
        result.components.get(0).module == "module"
        result.components.get(0).name == "componentX"
        result.components.get(0).data.size() == 1
        result.components.get(0).data.get(0).timestamp == 123456L
        result.components.get(0).data.get(0).value == 12
    }

    def 'should return latency metrics data when circle exists and has metrics'() {
        given:
        def projectionType = ProjectionType.ONE_HOUR

        def metric = new Metric("istio_charles_request_total",
                Collections.singletonList(new MetricResult(Collections.singletonMap("destination_component", "componentX"),
                        Collections.singletonList(new MetricData(123456L, 12)))))

        when:
        def result = retrieveCircleComponentsTechMetricInteractorImpl.execute(circleId, projectionType, MetricType.REQUESTS_LATENCY_BY_CIRCLE, workspaceId)

        then:
        1 * metricConfigurationRepository.findByWorkspaceId(workspaceId) >> Optional.of(metricConfiguration)
        1 * componentRepository.findAllDeployedAtCircle(circleId, workspaceId) >> [componentX]
        1 * serviceFactory.getConnector(metricConfiguration.provider) >> providerService
        1 * moduleRepository.findByIds(_ as List) >> [componentModule]
        1 * providerService.getAverageLatency(_ as SearchMetric, metricConfiguration.url) >> metric
        0 * _

        result != null
        result.period == projectionType
        result.type == MetricType.REQUESTS_LATENCY_BY_CIRCLE
        result.components != null
        result.components.size() == 1
        result.components.get(0).module == "module"
        result.components.get(0).name == "componentX"
        result.components.get(0).data.size() == 1
        result.components.get(0).data.get(0).timestamp == 123456L
        result.components.get(0).data.get(0).value == 12
    }

    def 'should order metric result by module and name'() {
        given:
        def projectionType = ProjectionType.ONE_HOUR

        def metric = new Metric("istio_charles_request_total",
                [new MetricResult(Collections.singletonMap("destination_component", "componentX"), Collections.singletonList(new MetricData(123456L, 12))),
                 new MetricResult(Collections.singletonMap("destination_component", "componentY"), Collections.singletonList(new MetricData(123456L, 12)))])

        when:
        def result = retrieveCircleComponentsTechMetricInteractorImpl.execute(circleId, projectionType, MetricType.REQUESTS_BY_CIRCLE, workspaceId)

        then:
        1 * metricConfigurationRepository.findByWorkspaceId(workspaceId) >> Optional.of(metricConfiguration)
        1 * componentRepository.findAllDeployedAtCircle(circleId, workspaceId) >> [componentX, componentY]
        1 * serviceFactory.getConnector(metricConfiguration.provider) >> providerService
        1 * moduleRepository.findByIds(_ as List) >> [componentModule]
        1 * providerService.getTotalRequests(_ as SearchMetric, metricConfiguration.url) >> metric
        0 * _

        result != null
        result.period == projectionType
        result.type == MetricType.REQUESTS_BY_CIRCLE
        result.components != null
        result.components.size() == 2
        result.components.get(0).module == "module"
        result.components.get(0).name == "componentX"
        result.components.get(0).data.size() == 1
        result.components.get(0).data.get(0).timestamp == 123456L
        result.components.get(0).data.get(0).value == 12
        result.components.get(1).module == "module"
        result.components.get(1).name == "componentY"
        result.components.get(1).data.size() == 1
        result.components.get(1).data.get(0).timestamp == 123456L
        result.components.get(1).data.get(0).value == 12
    }

    def 'should return empty result when no deployed component found'() {
        given:
        def projectionType = ProjectionType.ONE_HOUR

        when:
        def result = retrieveCircleComponentsTechMetricInteractorImpl.execute(circleId, projectionType, MetricType.REQUESTS_BY_CIRCLE, workspaceId)

        then:
        1 * metricConfigurationRepository.findByWorkspaceId(workspaceId) >> Optional.of(metricConfiguration)
        1 * componentRepository.findAllDeployedAtCircle(circleId, workspaceId) >> Collections.emptyList()
        0 * _

        result != null
        result.period == projectionType
        result.type == MetricType.REQUESTS_BY_CIRCLE
        result.components.empty
    }

    def 'should return result component with empty metrics when no metric result found for that component name'() {
        given:
        def projectionType = ProjectionType.ONE_HOUR

        def metric = new Metric("istio_charles_request_total",
                Collections.singletonList(new MetricResult(Collections.singletonMap("destination_component", "other_component"),
                        Collections.singletonList(new MetricData(123456L, 12)))))

        when:
        def result = retrieveCircleComponentsTechMetricInteractorImpl.execute(circleId, projectionType, MetricType.REQUESTS_BY_CIRCLE, workspaceId)

        then:
        1 * metricConfigurationRepository.findByWorkspaceId(workspaceId) >> Optional.of(metricConfiguration)
        1 * componentRepository.findAllDeployedAtCircle(circleId, workspaceId) >> [componentX, componentY]
        1 * serviceFactory.getConnector(metricConfiguration.provider) >> providerService
        1 * moduleRepository.findByIds(_ as List) >> [componentModule]
        1 * providerService.getTotalRequests(_ as SearchMetric, metricConfiguration.url) >> metric
        0 * _

        result != null
        result.period == projectionType
        result.type == MetricType.REQUESTS_BY_CIRCLE
        result.components != null
        result.components.size() == 2
        result.components.get(0).module == "module"
        result.components.get(0).name == "componentX"
        result.components.get(0).data.empty
        result.components.get(1).module == "module"
        result.components.get(1).name == "componentY"
        result.components.get(1).data.empty
    }

}
