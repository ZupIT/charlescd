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

package io.charlescd.moove.metrics.api

import io.charlescd.moove.metrics.api.response.*
import io.charlescd.moove.metrics.domain.HealthStatus
import io.charlescd.moove.metrics.domain.MetricType
import io.charlescd.moove.metrics.interactor.RetrieveCircleComponentsHealthInteractor
import io.charlescd.moove.metrics.interactor.RetrieveCircleComponentsPeriodMetricInteractor
import io.charlescd.moove.metrics.interactor.RetrieveCirclePeriodMetricInteractor
import io.charlescd.moove.metrics.interactor.impl.RetrieveDeploymentsMetricsInteractorImpl
import spock.lang.Specification

import java.time.LocalDate

class MetricsControllerUnitTest extends Specification {

    def retrieveCircleComponentsPeriodMetric = Mock(RetrieveCircleComponentsPeriodMetricInteractor)
    def retrieveCirclePeriodMetric = Mock(RetrieveCirclePeriodMetricInteractor)
    def retrieveCircleComponentsHealth = Mock(RetrieveCircleComponentsHealthInteractor)
    def retrieveDeploymentsMetric = Mock(RetrieveDeploymentsMetricsInteractorImpl)
    def metricsController = new MetricsController(retrieveCircleComponentsPeriodMetric, retrieveCirclePeriodMetric, retrieveCircleComponentsHealth, retrieveDeploymentsMetric)


    def circleId = "circle-id"
    def workspaceId = "workspace-id"

    def 'should get circle metrics'() {
        given:
        def period = ProjectionType.ONE_HOUR
        def metricType = MetricType.REQUESTS_BY_CIRCLE

        def metricDataList = new ArrayList()
        metricDataList.add(new MetricDataRepresentation(1580157300L, 10))

        def metricRepresentation = new CircleMetricRepresentation(period, metricType, metricDataList)

        when:
        def response = metricsController.getMetric(circleId, period, workspaceId, metricType)

        then:
        1 * retrieveCirclePeriodMetric.execute(circleId, period, metricType, workspaceId) >> metricRepresentation
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
        def period = ProjectionType.ONE_HOUR
        def metricType = MetricType.REQUESTS_BY_CIRCLE

        def metricDataList = Collections.singletonList(new MetricDataRepresentation(1580157300L, 10))
        def components = Collections.singletonList(new ComponentRepresentation("component-name", "module-name", metricDataList))

        def metricRepresentation = new ComponentMetricRepresentation(period, metricType, components)

        when:
        def response = metricsController.getComponentMetric(circleId, period, workspaceId, metricType)

        then:
        1 * retrieveCircleComponentsPeriodMetric.execute(circleId, period, metricType, workspaceId) >> metricRepresentation
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

    def 'should get components health'() {
        given:
        def requests = new CircleRequestsRepresentation(10, "req/s")
        def latency = new CircleHealthTypeRepresentation("ms", [new CircleComponentHealthRepresentation("component-name", 50, 30D, HealthStatus.STABLE)])
        def error = new CircleHealthTypeRepresentation("%", [new CircleComponentHealthRepresentation("component-name", 10, 8D, HealthStatus.WARNING)])

        def circleHealthRepresentation = new CircleHealthRepresentation(requests, latency, error)

        when:
        def response = metricsController.getComponentHealth(circleId, workspaceId)

        then:
        1 * retrieveCircleComponentsHealth.execute(circleId, workspaceId) >> circleHealthRepresentation
        0 * _

        response != null
        response.requests != null
        response.requests.unit == "req/s"
        response.requests.value == 10
        response.latency != null
        response.latency.unit == "ms"
        !response.latency.circleComponents.isEmpty()
        response.latency.circleComponents.size() == 1
        response.latency.circleComponents.get(0).name == "component-name"
        response.latency.circleComponents.get(0).status == HealthStatus.STABLE
        response.latency.circleComponents.get(0).threshold == 50
        response.latency.circleComponents.get(0).value == 30D

        !response.errors.circleComponents.isEmpty()
        response.errors.circleComponents.size() == 1
        response.errors.circleComponents.get(0).name == "component-name"
        response.errors.circleComponents.get(0).status == HealthStatus.WARNING
        response.errors.circleComponents.get(0).threshold == 10
        response.errors.circleComponents.get(0).value == 8D
    }

    def 'should get deployments metrics'() {
        given:
        def period = PeriodType.ONE_MONTH

        def deploymentsAverageTimeInPeriod = [new DeploymentAverageTimeInPeriodRepresentation(200, LocalDate.of(2020, 06, 22)),
                                              new DeploymentAverageTimeInPeriodRepresentation(175, LocalDate.of(2020, 06, 21)),
                                              new DeploymentAverageTimeInPeriodRepresentation(230, LocalDate.of(2020, 06, 20))]

        def successfulDeploymentsStatsInPeriod = [new DeploymentStatsInPeriodRepresentation(32, 155, LocalDate.of(2020, 06, 22)),
                                                  new DeploymentStatsInPeriodRepresentation(28, 235, LocalDate.of(2020, 06, 21)),
                                                  new DeploymentStatsInPeriodRepresentation(17, 200, LocalDate.of(2020, 06, 20))]

        def failedDeploymentsStatsInPeriod = [new DeploymentStatsInPeriodRepresentation(8, 0, LocalDate.of(2020, 06, 22)),
                                              new DeploymentStatsInPeriodRepresentation(5, 0, LocalDate.of(2020, 06, 20))]

        def deploymentMetricsRepresentation = new DeploymentMetricsRepresentation(123, 12, 300,
                successfulDeploymentsStatsInPeriod, failedDeploymentsStatsInPeriod, deploymentsAverageTimeInPeriod)

        when:
        def response = metricsController.getDeploymentsMetrics(workspaceId, period, null)

        then:
        1 * retrieveDeploymentsMetric.execute(workspaceId, period, null) >> deploymentMetricsRepresentation
        0 * _

        response != null
        response.successfulDeployments == 123
        response.failedDeployments == 12
        response.successfulDeploymentsAverageTime == 300
        response.successfulDeploymentsInPeriod.size() == 3
        response.failedDeploymentsInPeriod.size() == 2
        response.deploymentsAverageTimeInPeriod.size() == 3
    }

}
