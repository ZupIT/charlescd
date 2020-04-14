/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.metrics.interactor.impl

import br.com.zup.darwin.entity.*
import br.com.zup.darwin.metrics.api.MetricType
import br.com.zup.darwin.metrics.api.ProjectionType
import br.com.zup.darwin.metrics.connector.MetricProvider
import br.com.zup.darwin.metrics.connector.MetricServiceFactory
import br.com.zup.darwin.metrics.connector.prometheus.PrometheusService
import br.com.zup.darwin.metrics.domain.Metric
import br.com.zup.darwin.metrics.domain.MetricData
import br.com.zup.darwin.metrics.domain.MetricResult
import br.com.zup.darwin.metrics.domain.SearchMetric
import br.com.zup.darwin.repository.CircleRepository
import br.com.zup.darwin.repository.ModuleRepository
import br.com.zup.exception.handler.exception.NotFoundException
import spock.lang.Specification

import java.time.LocalDateTime

class RetrieveCircleComponentsTechMetricInteractorImplUnitTest extends Specification {

    def serviceFactory = Mock(MetricServiceFactory)
    def circleRepository = Mock(CircleRepository)
    def moduleRepository = Mock(ModuleRepository)
    def providerService = Mock(PrometheusService)

    def retrieveCircleComponentsTechMetricInteractorImpl = new RetrieveCircleComponentsTechMetricInteractorImpl(serviceFactory, circleRepository, moduleRepository)

    def applicationId = "application-id"
    def componentId = "ee09b9e8-8ea9-4492-ace9-2bbe5a7f984e"
    def moduleId = "ee09b9e8-8ea9-4492-ace9-2bbe5a7faaaa"
    def configId = "b278d275-084f-4618-a0bc-0e3a8a3e01b2"
    def author = new User("81861b6f-2b6e-44a1-a745-83e298a550c9", "John Doe", "email@gmail.com", "https://www.photos.com/johndoe", [], LocalDateTime.now())
    def gitCredentials = new GitCredentials("address", "username", "password", null, GitServiceProvider.GITHUB)
    def gitConfiguration = new GitConfiguration(configId, "config", LocalDateTime.now(), author, applicationId, gitCredentials)
    def componentModule = new Module(moduleId, "module", "gitRepositoryAddress", LocalDateTime.of(2019, 12, 1, 0, 0), "helm-repository", author, [], [], applicationId, gitConfiguration, "cdConfigId", "registryConfigId")
    def component = new Component(componentId, "component", "path", 8080, "health", LocalDateTime.of(2019, 12, 1, 0, 0), componentModule, [], applicationId)
    def component1 = new Component(componentId, "component1", "path", 8080, "health", LocalDateTime.of(2019, 12, 1, 0, 0), componentModule, [], applicationId)

    def module = new Module(moduleId, "module", "gitRepositoryAddress", LocalDateTime.of(2019, 12, 1, 0, 0), "helm-repository", author, [], [component], applicationId, gitConfiguration, "cdConfigId", "registryConfigId")
    def module1 = new Module(moduleId, "module1", "gitRepositoryAddress", LocalDateTime.of(2019, 12, 1, 0, 0), "helm-repository", author, [], [component1], applicationId, gitConfiguration, "cdConfigId", "registryConfigId")

    def 'should throw NotFoundException when circle not found'() {
        when:
        retrieveCircleComponentsTechMetricInteractorImpl.execute("circle-id", ProjectionType.FIVE_MINUTES, MetricType.REQUESTS_BY_CIRCLE)
        then:
        1 * circleRepository.existsById("circle-id") >> false
        0 * _

        def ex = thrown(NotFoundException)
        ex.resource.resource == "circle"
        ex.resource.value == "circle-id"
    }

    def 'should throw NotFoundException when circle has no module deployed'() {
        when:
        retrieveCircleComponentsTechMetricInteractorImpl.execute("circle-id", ProjectionType.FIVE_MINUTES, MetricType.REQUESTS_BY_CIRCLE)
        then:
        1 * circleRepository.existsById("circle-id") >> true
        1 * moduleRepository.findAllModulesDeployedAtCircle("circle-id") >> Optional.empty()
        0 * _

        def ex = thrown(NotFoundException)
        ex.resource.resource == "modules"
        ex.resource.value == "No module found for circle: circle-id"
    }

    def 'should return request total metrics data when circle exists and has metrics'() {
        given:
        def circleId = "circle-id"
        def projectionType = ProjectionType.ONE_HOUR

        def metric = new Metric("istio_charles_request_total",
                Collections.singletonList(new MetricResult(Collections.singletonMap("destination_component", "component"),
                        Collections.singletonList(new MetricData(123456L, 12)))))

        when:
        def result = retrieveCircleComponentsTechMetricInteractorImpl.execute(circleId, projectionType, MetricType.REQUESTS_BY_CIRCLE)

        then:
        1 * circleRepository.existsById("circle-id") >> true
        1 * moduleRepository.findAllModulesDeployedAtCircle("circle-id") >> Optional.of([module])
        1 * serviceFactory.getConnector(MetricProvider.PROMETHEUS) >> providerService
        1 * providerService.getTotalRequests(_ as SearchMetric) >> metric
        0 * _

        result != null
        result.period == projectionType
        result.type == MetricType.REQUESTS_BY_CIRCLE
        result.components != null
        result.components.size() == 1
        result.components.get(0).module == "module"
        result.components.get(0).name == "component"
        result.components.get(0).data.size() == 1
        result.components.get(0).data.get(0).timestamp == 123456L
        result.components.get(0).data.get(0).value == 12
    }

    def 'should return request errors metrics data when circle exists and has metrics'() {
        given:
        def circleId = "circle-id"
        def projectionType = ProjectionType.ONE_HOUR

        def metric = new Metric("istio_charles_request_total",
                Collections.singletonList(new MetricResult(Collections.singletonMap("destination_component", "component"),
                        Collections.singletonList(new MetricData(123456L, 12)))))

        when:
        def result = retrieveCircleComponentsTechMetricInteractorImpl.execute(circleId, projectionType, MetricType.REQUESTS_ERRORS_BY_CIRCLE)

        then:
        1 * circleRepository.existsById("circle-id") >> true
        1 * moduleRepository.findAllModulesDeployedAtCircle("circle-id") >> Optional.of([module])
        1 * serviceFactory.getConnector(MetricProvider.PROMETHEUS) >> providerService
        1 * providerService.getAverageHttpErrors(_ as SearchMetric) >> metric
        0 * _

        result != null
        result.period == projectionType
        result.type == MetricType.REQUESTS_ERRORS_BY_CIRCLE
        result.components != null
        result.components.size() == 1
        result.components.get(0).module == "module"
        result.components.get(0).name == "component"
        result.components.get(0).data.size() == 1
        result.components.get(0).data.get(0).timestamp == 123456L
        result.components.get(0).data.get(0).value == 12
    }

    def 'should return latency metrics data when circle exists and has metrics'() {
        given:
        def circleId = "circle-id"
        def projectionType = ProjectionType.ONE_HOUR

        def metric = new Metric("istio_charles_request_total",
                Collections.singletonList(new MetricResult(Collections.singletonMap("destination_component", "component"),
                        Collections.singletonList(new MetricData(123456L, 12)))))

        when:
        def result = retrieveCircleComponentsTechMetricInteractorImpl.execute(circleId, projectionType, MetricType.REQUESTS_LATENCY_BY_CIRCLE)

        then:
        1 * circleRepository.existsById("circle-id") >> true
        1 * moduleRepository.findAllModulesDeployedAtCircle("circle-id") >> Optional.of([module])
        1 * serviceFactory.getConnector(MetricProvider.PROMETHEUS) >> providerService
        1 * providerService.getAverageLatency(_ as SearchMetric) >> metric
        0 * _

        result != null
        result.period == projectionType
        result.type == MetricType.REQUESTS_LATENCY_BY_CIRCLE
        result.components != null
        result.components.size() == 1
        result.components.get(0).module == "module"
        result.components.get(0).name == "component"
        result.components.get(0).data.size() == 1
        result.components.get(0).data.get(0).timestamp == 123456L
        result.components.get(0).data.get(0).value == 12
    }

    def 'should return metrics data with empty module name when circle exists and has metrics but no module was matched'() {
        given:
        def circleId = "circle-id"
        def projectionType = ProjectionType.ONE_HOUR

        def metric = new Metric("istio_charles_request_total",
                Collections.singletonList(new MetricResult(Collections.singletonMap("destination_component", "other-component"),
                        Collections.singletonList(new MetricData(123456L, 12)))))

        when:
        def result = retrieveCircleComponentsTechMetricInteractorImpl.execute(circleId, projectionType, MetricType.REQUESTS_LATENCY_BY_CIRCLE)

        then:
        1 * circleRepository.existsById("circle-id") >> true
        1 * moduleRepository.findAllModulesDeployedAtCircle("circle-id") >> Optional.of([module])
        1 * serviceFactory.getConnector(MetricProvider.PROMETHEUS) >> providerService
        1 * providerService.getAverageLatency(_ as SearchMetric) >> metric
        0 * _

        result != null
        result.period == projectionType
        result.type == MetricType.REQUESTS_LATENCY_BY_CIRCLE
        result.components != null
        result.components.size() == 1
        result.components.get(0).module == ""
        result.components.get(0).name == "other-component"
        result.components.get(0).data.size() == 1
        result.components.get(0).data.get(0).timestamp == 123456L
        result.components.get(0).data.get(0).value == 12
    }

    def 'should throw NotFoundException when metric returns no label with component'() {
        given:
        def circleId = "circle-id"
        def projectionType = ProjectionType.ONE_HOUR

        def metric = new Metric("istio_charles_request_total",
                Collections.singletonList(new MetricResult(Collections.emptyMap(),
                        Collections.singletonList(new MetricData(123456L, 12)))))

        when:
        retrieveCircleComponentsTechMetricInteractorImpl.execute(circleId, projectionType, MetricType.REQUESTS_LATENCY_BY_CIRCLE)

        then:
        1 * circleRepository.existsById("circle-id") >> true
        1 * moduleRepository.findAllModulesDeployedAtCircle("circle-id") >> Optional.of([module])
        1 * serviceFactory.getConnector(MetricProvider.PROMETHEUS) >> providerService
        1 * providerService.getAverageLatency(_ as SearchMetric) >> metric
        0 * _

        def ex = thrown(NotFoundException)
        ex.resource.resource == "component"
        ex.resource.value == "No metric found"
    }

    def 'should order metric result by module and name'() {
        given:
        def circleId = "circle-id"
        def projectionType = ProjectionType.ONE_HOUR

        def metric = new Metric("istio_charles_request_total",
                [new MetricResult(Collections.singletonMap("destination_component", "component"), Collections.singletonList(new MetricData(123456L, 12))),
                                new MetricResult(Collections.singletonMap("destination_component", "component1"), Collections.singletonList(new MetricData(123456L, 12)))])

        when:
        def result = retrieveCircleComponentsTechMetricInteractorImpl.execute(circleId, projectionType, MetricType.REQUESTS_BY_CIRCLE)

        then:
        1 * circleRepository.existsById("circle-id") >> true
        1 * moduleRepository.findAllModulesDeployedAtCircle("circle-id") >> Optional.of([module, module1])
        1 * serviceFactory.getConnector(MetricProvider.PROMETHEUS) >> providerService
        1 * providerService.getTotalRequests(_ as SearchMetric) >> metric
        0 * _

        result != null
        result.period == projectionType
        result.type == MetricType.REQUESTS_BY_CIRCLE
        result.components != null
        result.components.size() == 2
        result.components.get(0).module == "module"
        result.components.get(0).name == "component"
        result.components.get(0).data.size() == 1
        result.components.get(0).data.get(0).timestamp == 123456L
        result.components.get(0).data.get(0).value == 12
        result.components.get(1).module == "module1"
        result.components.get(1).name == "component1"
        result.components.get(1).data.size() == 1
        result.components.get(1).data.get(0).timestamp == 123456L
        result.components.get(1).data.get(0).value == 12
    }

}
