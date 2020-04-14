/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.metrics.interactor.impl

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
import br.com.zup.exception.handler.exception.NotFoundException
import spock.lang.Specification

class RetrieveCircleTechMetricInteractorImplUnitTest extends Specification {

    def serviceFactory = Mock(MetricServiceFactory)
    def circleRepository = Mock(CircleRepository)
    def providerService = Mock(PrometheusService)

    def retrieveCircleTechMetricInteractorImpl = new RetrieveCircleTechMetricInteractorImpl(serviceFactory, circleRepository)

    def 'should throw NotFoundException when circle not found'() {
        when:
        retrieveCircleTechMetricInteractorImpl.execute("circle-id", ProjectionType.FIVE_MINUTES, MetricType.REQUESTS_BY_CIRCLE)
        then:
        1 * circleRepository.existsById("circle-id") >> false
        0 * _

        def ex = thrown(NotFoundException)
        ex.resource.resource == "circle"
        ex.resource.value == "circle-id"
    }

    def 'should return request total metrics data when circle exists and has metrics'() {
        given:
        def circleId = "circle-id"
        def projectionType = ProjectionType.ONE_HOUR

        def metric = new Metric("istio_charles_request_total",
                Collections.singletonList(new MetricResult(Collections.emptyMap(),
                        Collections.singletonList(new MetricData(123456L, 12)))))

        when:
        def result = retrieveCircleTechMetricInteractorImpl.execute(circleId, projectionType, MetricType.REQUESTS_BY_CIRCLE)

        then:
        1 * circleRepository.existsById("circle-id") >> true
        1 * serviceFactory.getConnector(MetricProvider.PROMETHEUS) >> providerService
        1 * providerService.getTotalRequests(_ as SearchMetric) >> metric
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
        def circleId = "circle-id"
        def projectionType = ProjectionType.ONE_HOUR

        def metric = new Metric("istio_charles_request_total",
                Collections.singletonList(new MetricResult(Collections.emptyMap(),
                        Collections.singletonList(new MetricData(123456L, 12)))))

        when:
        def result = retrieveCircleTechMetricInteractorImpl.execute(circleId, projectionType, MetricType.REQUESTS_ERRORS_BY_CIRCLE)

        then:
        1 * circleRepository.existsById("circle-id") >> true
        1 * serviceFactory.getConnector(MetricProvider.PROMETHEUS) >> providerService
        1 * providerService.getAverageHttpErrors(_ as SearchMetric) >> metric
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
        def circleId = "circle-id"
        def projectionType = ProjectionType.ONE_HOUR

        def metric = new Metric("istio_charles_request_duration_seconds",
                Collections.singletonList(new MetricResult(Collections.emptyMap(),
                        Collections.singletonList(new MetricData(123456L, 12)))))

        when:
        def result = retrieveCircleTechMetricInteractorImpl.execute(circleId, projectionType, MetricType.REQUESTS_LATENCY_BY_CIRCLE)

        then:
        1 * circleRepository.existsById("circle-id") >> true
        1 * serviceFactory.getConnector(MetricProvider.PROMETHEUS) >> providerService
        1 * providerService.getAverageLatency(_ as SearchMetric) >> metric
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
        def circleId = "circle-id"
        def projectionType = ProjectionType.ONE_HOUR

        def metric = new Metric("istio_charles_request_total", [])

        when:
        def result = retrieveCircleTechMetricInteractorImpl.execute(circleId, projectionType, MetricType.REQUESTS_BY_CIRCLE)

        then:
        1 * circleRepository.existsById("circle-id") >> true
        1 * serviceFactory.getConnector(MetricProvider.PROMETHEUS) >> providerService
        1 * providerService.getTotalRequests(_ as SearchMetric) >> metric
        0 * _

        result != null
        result.period == projectionType
        result.type == MetricType.REQUESTS_BY_CIRCLE
        result.data != null
        result.data.isEmpty()
    }
}
