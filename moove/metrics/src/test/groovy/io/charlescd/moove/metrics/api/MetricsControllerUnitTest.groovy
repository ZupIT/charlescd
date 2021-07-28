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
import io.charlescd.moove.metrics.interactor.RetrieveCirclePeriodMetricInteractor
import io.charlescd.moove.metrics.interactor.impl.RetrieveCirclesMetricsInteractorImpl
import io.charlescd.moove.metrics.interactor.impl.RetrieveDeploymentsMetricsInteractorImpl
import spock.lang.Specification

import java.time.LocalDate

class MetricsControllerUnitTest extends Specification {

    def retrieveCirclePeriodMetric = Mock(RetrieveCirclePeriodMetricInteractor)
    def retrieveDeploymentsMetric = Mock(RetrieveDeploymentsMetricsInteractorImpl)
    def retrieveCirclesMetrics = Mock(RetrieveCirclesMetricsInteractorImpl)
    def metricsController = new MetricsController(retrieveCirclePeriodMetric, retrieveDeploymentsMetric, retrieveCirclesMetrics)


    def circleId = "circle-id"
    def workspaceId = "workspace-id"

    def 'should get circle instant metrics'() {
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

   def 'should get deployments metrics'() {
        given:
        def period = PeriodType.ONE_MONTH

        def deploymentsAverageTimeInPeriod = [new DeploymentAverageTimeInPeriodRepresentation(200, LocalDate.of(2020, 06, 22)),
                                              new DeploymentAverageTimeInPeriodRepresentation(175, LocalDate.of(2020, 06, 21)),
                                              new DeploymentAverageTimeInPeriodRepresentation(230, LocalDate.of(2020, 06, 20))]

        def successfulDeploymentsStatsInPeriod = [new DeploymentStatsInPeriodRepresentation(32, LocalDate.of(2020, 06, 22)),
                                                  new DeploymentStatsInPeriodRepresentation(28, LocalDate.of(2020, 06, 21)),
                                                  new DeploymentStatsInPeriodRepresentation(17, LocalDate.of(2020, 06, 20))]

        def failedDeploymentsStatsInPeriod = [new DeploymentStatsInPeriodRepresentation(8, LocalDate.of(2020, 06, 22)),
                                              new DeploymentStatsInPeriodRepresentation(5, LocalDate.of(2020, 06, 20))]

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

    def 'should get circle general metrics'() {
        given:
        def circleMetricsRepresentation = new CirclesMetricsRepresentation(new CircleStatsRepresentation(10, 8), 50000)

        when:
        def response = metricsController.getCircleGeneralMetrics(workspaceId)

        then:
        1 * retrieveCirclesMetrics.execute(workspaceId) >> circleMetricsRepresentation
        0 * _

        response.averageLifeTime == 50000
        response.circleStats.active == 10
        response.circleStats.inactive == 8
    }

}
