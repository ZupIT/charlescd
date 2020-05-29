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
import io.charlescd.moove.metrics.connector.MetricServiceFactory
import io.charlescd.moove.metrics.connector.prometheus.PrometheusService
import io.charlescd.moove.metrics.domain.*
import spock.lang.Specification

import java.time.LocalDateTime

class RetrieveCircleComponentsHealthInteractorImplUnitTest extends Specification {

    def serviceFactory = Mock(MetricServiceFactory)
    def componentRepository = Mock(ComponentRepository)
    def providerService = Mock(PrometheusService)
    def moduleRepository = Mock(ModuleRepository)
    def metricConfigurationRepository = Mock(MetricConfigurationRepository)

    def workspaceId = "workspace-id"
    def circleId = "workspace-id"

    def author = new User("81861b6f-2b6e-44a1-a745-83e298a550c9", "John Doe", "email@gmail.com",
            "https://www.photos.com/johndoe", [], false, LocalDateTime.now())

    def componentX = new Component("component-x-id", "module-id", "componentX",
            LocalDateTime.of(2019, 12, 1, 0, 0), workspaceId, 10, 50)

    def componentY = new Component("component-y-id", "module-id", "componentY",
            LocalDateTime.of(2019, 12, 1, 0, 0), workspaceId, 10, 75)

    def componentModule = new Module("module-id", "module", "gitRepositoryAddress",
            LocalDateTime.of(2019, 12, 1, 0, 0), "helm-repository", author, [], null, [componentX, componentY], workspaceId)

    def metricConfiguration = new MetricConfiguration("ae366287-0fd3-4c91-bd3e-debe455cd2cb", MetricConfiguration.ProviderEnum.PROMETHEUS, "https://metric-provider-url.com",
            LocalDateTime.now(), workspaceId, author)

    def retrieveCircleComponentsHealthInteractorImpl = new RetrieveCircleComponentsHealthInteractorImpl(serviceFactory, componentRepository, moduleRepository, metricConfigurationRepository)

    def 'when metric configuration does not exists for workspace should throw an exception'() {
        when:
        retrieveCircleComponentsHealthInteractorImpl.execute(circleId, workspaceId)

        then:
        1 * metricConfigurationRepository.findByWorkspaceId(workspaceId) >> Optional.empty()
        0 * _

        def ex = thrown(NotFoundException)
        ex.resourceName == "metric configuration for workspace"
        ex.id == workspaceId
    }

    def 'should return circle health'() {
        given:
        def requestTotal = new Metric("istio_charles_request_total",
                [new MetricResult(Collections.emptyMap(), [new MetricData(123456L, 12)])])

        def errorsPercentage = new Metric("istio_charles_request_total",
                [new MetricResult(Collections.singletonMap("destination_component", "componentX"), [new MetricData(123456L, 9)]),
                 new MetricResult(Collections.singletonMap("destination_component", "componentY"), [new MetricData(123471L, 3)])])

        def latency = new Metric("istio_charles_request_total",
                [new MetricResult(Collections.singletonMap("destination_component", "componentX"), [new MetricData(123456L, 239)]),
                 new MetricResult(Collections.singletonMap("destination_component", "componentY"), [new MetricData(123471L, 1000)])])

        when:
        def result = retrieveCircleComponentsHealthInteractorImpl.execute(circleId, workspaceId)
        then:
        1 * metricConfigurationRepository.findByWorkspaceId(workspaceId) >> Optional.of(metricConfiguration)
        1 * componentRepository.findAllDeployedAtCircle(circleId, workspaceId) >> [componentX, componentY]
        1 * serviceFactory.getConnector(metricConfiguration.provider) >> providerService
        1 * moduleRepository.findByIds(_ as List) >> [componentModule]
        1 * providerService.getTotalRequests(_ as SearchMetric, metricConfiguration.url) >> requestTotal
        1 * providerService.getAverageHttpErrorsPercentage(_ as SearchMetric, metricConfiguration.url) >> errorsPercentage
        1 * providerService.getAverageLatency(_ as SearchMetric, metricConfiguration.url) >> latency
        0 * _

        result != null
        result.requests != null
        result.errors != null
        result.latency != null

        result.requests.value == 12
        result.requests.unit == MetricType.REQUESTS_BY_CIRCLE.unit

        result.latency.unit == MetricType.REQUESTS_LATENCY_BY_CIRCLE.unit
        result.latency.circleComponents != null
        result.latency.circleComponents.size() == 2
        result.latency.circleComponents.get(0).threshold == 75
        result.latency.circleComponents.get(0).value == 1000
        result.latency.circleComponents.get(0).status == HealthStatus.ERROR
        result.latency.circleComponents.get(0).name == "module/componentY"
        result.latency.circleComponents.get(1).threshold == 50
        result.latency.circleComponents.get(1).value == 239
        result.latency.circleComponents.get(1).status == HealthStatus.ERROR
        result.latency.circleComponents.get(1).name == "module/componentX"

        result.errors.unit == MetricType.REQUESTS_ERRORS_BY_CIRCLE.unit
        result.errors.circleComponents != null
        result.errors.circleComponents.size() == 2
        result.errors.circleComponents.get(0).threshold == 10
        result.errors.circleComponents.get(0).value == 9
        result.errors.circleComponents.get(0).status == HealthStatus.WARNING
        result.errors.circleComponents.get(0).name == "module/componentX"
        result.errors.circleComponents.get(1).threshold == 10
        result.errors.circleComponents.get(1).value == 3
        result.errors.circleComponents.get(1).status == HealthStatus.STABLE
        result.errors.circleComponents.get(1).name == "module/componentY"
    }

    def 'should return circle health with empty data when no component found'() {
        when:
        def result = retrieveCircleComponentsHealthInteractorImpl.execute(circleId, workspaceId)
        then:
        1 * metricConfigurationRepository.findByWorkspaceId(workspaceId) >> Optional.of(metricConfiguration)
        1 * componentRepository.findAllDeployedAtCircle(circleId, workspaceId) >> Collections.emptyList()
        0 * _

        result != null
        result.requests != null
        result.errors != null
        result.latency != null

        result.requests.value == 0
        result.requests.unit == MetricType.REQUESTS_BY_CIRCLE.unit

        result.latency.unit == MetricType.REQUESTS_LATENCY_BY_CIRCLE.unit
        result.latency.circleComponents.empty

        result.errors.unit == MetricType.REQUESTS_ERRORS_BY_CIRCLE.unit
        result.errors.circleComponents.empty
    }

    def 'should return circle health with default data when no metric found for component name'() {
        given:

        def requestTotal = new Metric("istio_charles_request_total",
                [new MetricResult(Collections.emptyMap(), [new MetricData(123456L, 12)])])

        def errorsPercentage = new Metric("istio_charles_request_total",
                [new MetricResult(Collections.singletonMap("destination_component", "componentX"), [new MetricData(123456L, 9)])])

        def latency = new Metric("istio_charles_request_total",
                [new MetricResult(Collections.singletonMap("destination_component", "componentW"), [new MetricData(123456L, 239)]),
                 new MetricResult(Collections.singletonMap("destination_component", "componentY"), [new MetricData(123471L, 1000)])])

        when:
        def result = retrieveCircleComponentsHealthInteractorImpl.execute(circleId, workspaceId)
        then:
        1 * metricConfigurationRepository.findByWorkspaceId(workspaceId) >> Optional.of(metricConfiguration)
        1 * componentRepository.findAllDeployedAtCircle(circleId, workspaceId) >> [componentX, componentY]
        1 * serviceFactory.getConnector(metricConfiguration.provider) >> providerService
        1 * moduleRepository.findByIds(_ as List) >> [componentModule]
        1 * providerService.getTotalRequests(_ as SearchMetric, metricConfiguration.url) >> requestTotal
        1 * providerService.getAverageHttpErrorsPercentage(_ as SearchMetric, metricConfiguration.url) >> errorsPercentage
        1 * providerService.getAverageLatency(_ as SearchMetric, metricConfiguration.url) >> latency
        0 * _

        result != null
        result.requests != null
        result.errors != null
        result.latency != null

        result.requests.value == 12
        result.requests.unit == MetricType.REQUESTS_BY_CIRCLE.unit

        result.latency.unit == MetricType.REQUESTS_LATENCY_BY_CIRCLE.unit
        result.latency.circleComponents != null
        result.latency.circleComponents.size() == 2
        result.latency.circleComponents.get(0).threshold == 75
        result.latency.circleComponents.get(0).value == 1000
        result.latency.circleComponents.get(0).status == HealthStatus.ERROR
        result.latency.circleComponents.get(0).name == "module/componentY"
        result.latency.circleComponents.get(1).threshold == 50
        result.latency.circleComponents.get(1).value == 0
        result.latency.circleComponents.get(1).status == HealthStatus.STABLE
        result.latency.circleComponents.get(1).name == "module/componentX"

        result.errors.unit == MetricType.REQUESTS_ERRORS_BY_CIRCLE.unit
        result.errors.circleComponents != null
        result.errors.circleComponents.size() == 2
        result.errors.circleComponents.get(0).threshold == 10
        result.errors.circleComponents.get(0).value == 9
        result.errors.circleComponents.get(0).status == HealthStatus.WARNING
        result.errors.circleComponents.get(0).name == "module/componentX"
        result.errors.circleComponents.get(1).threshold == 10
        result.errors.circleComponents.get(1).value == 0
        result.errors.circleComponents.get(1).status == HealthStatus.STABLE
        result.errors.circleComponents.get(1).name == "module/componentY"
    }
}
