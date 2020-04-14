/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.metrics.api

import br.com.zup.darwin.metrics.interactor.RetrieveCircleComponentsTechMetricInteractor
import br.com.zup.darwin.metrics.interactor.RetrieveCircleTechMetricInteractor
import spock.lang.Specification

class MetricsControllerUnitTest extends Specification {

    def retrieveCircleComponentsTechMetric = Mock(RetrieveCircleComponentsTechMetricInteractor)
    def retrieveCircleTechMetric = Mock(RetrieveCircleTechMetricInteractor)
    def metricsController = new MetricsController(retrieveCircleComponentsTechMetric, retrieveCircleTechMetric)

    def 'should get circle metrics'() {
        given:
        def circleID = "fake-circle-id"
        def period = ProjectionType.ONE_HOUR
        def metricType = MetricType.REQUESTS_BY_CIRCLE

        def metricDataList = new ArrayList()
        metricDataList.add(new MetricDataRepresentation(1580157300L, 10))

        def metricRepresentation = new CircleMetricRepresentation(period, metricType, metricDataList)

        when:
        def response = metricsController.getMetric(circleID, period, metricType)

        then:
        1 * retrieveCircleTechMetric.execute(circleID, period, metricType) >> metricRepresentation
        0 * _

        response != null
        response.period == ProjectionType.ONE_HOUR
        response.type == MetricType.REQUESTS_BY_CIRCLE
        response.data != null
        response.data.size() == 1
        response.data.get(0) != null
        response.data.get(0).timestamp == 1580157300L
        response.data.get(0).value == 10
    }

    def 'should get components metrics'() {
        given:
        def circleID = "fake-circle-id"
        def period = ProjectionType.ONE_HOUR
        def metricType = MetricType.REQUESTS_BY_CIRCLE

        def metricDataList = Collections.singletonList(new MetricDataRepresentation(1580157300L, 10))
        def components = Collections.singletonList(new ComponentRepresentation("component-name", "module-name", metricDataList))

        def metricRepresentation = new ComponentMetricRepresentation(period, metricType, components)

        when:
        def response = metricsController.getComponentMetric(circleID, period, metricType)

        then:
        1 * retrieveCircleComponentsTechMetric.execute(circleID, period, metricType) >> metricRepresentation
        0 * _

        response != null
        response.period == ProjectionType.ONE_HOUR
        response.type == MetricType.REQUESTS_BY_CIRCLE
        response.components != null
        !response.components.isEmpty()
        response.components.get(0).name == "component-name"
        response.components.get(0).module == "module-name"
        response.components.get(0).data != null
        response.components.get(0).data.size() == 1
        response.components.get(0).data.get(0) != null
        response.components.get(0).data.get(0).timestamp == 1580157300L
        response.components.get(0).data.get(0).value == 10
    }

}
