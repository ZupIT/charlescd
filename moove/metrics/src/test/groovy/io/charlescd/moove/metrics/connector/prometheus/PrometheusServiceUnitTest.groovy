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

package io.charlescd.moove.metrics.connector.prometheus

import io.charlescd.moove.metrics.domain.*
import spock.lang.Specification

class PrometheusServiceUnitTest extends Specification {

    private PrometheusApi prometheusApi = Mock(PrometheusApi)
    private PrometheusService prometheusService = new PrometheusService(prometheusApi)

    def url = "http://prometheus:9090"

    def 'should get requests total metric with filter, group and period '() {
        given:
        def query = "ceil(sum(irate(istio_charles_request_total{circle_source=\"circle-id\"}[1m])) by(destination_component))[5m:15s]"
        def searchMetric = new SearchMetric("istio_charles_request_total")
                .filteringBy(Collections.singletonList(new SearchMetricFilter("circle_source", Collections.singletonList("circle-id"), FilterKind.EQUAL)))
                .groupingBy(Collections.singletonList("destination_component"))
                .forPeriod(new Period(5, PeriodUnit.MINUTES, 15, PeriodUnit.SECONDS))

        def prometheusResponse = new PrometheusMetricResponse("success",
                new PrometheusMetricData("matrix",
                        [new PrometheusMatrixResult(Collections.singletonMap("destination_component", "component"),
                                [new PrometheusMetricValue(1580157300L, "10")])]))

        when:
        def response = this.prometheusService.getTotalRequests(searchMetric, url)

        then:
        1 * this.prometheusApi.executeQuery(URI.create(url), query) >> prometheusResponse
        0 * _

        response != null
        response.name == "istio_charles_request_total"
        response.result != null
        !response.result.isEmpty()
        response.result.get(0).labels.size() == 1
        response.result.get(0).labels.get("destination_component") == "component"
        !response.result.get(0).data.isEmpty()
    }

    def 'should get requests total metric with filter, group and without period '() {
        given:
        def query = "ceil(sum(irate(istio_charles_request_total{circle_source=\"circle-id\"}[1m])) by(destination_component))"
        def searchMetric = new SearchMetric("istio_charles_request_total")
                .filteringBy(Collections.singletonList(new SearchMetricFilter("circle_source", Collections.singletonList("circle-id"), FilterKind.EQUAL)))
                .groupingBy(Collections.singletonList("destination_component"))

        def prometheusResponse = new PrometheusMetricResponse("success",
                new PrometheusMetricData("matrix",
                        [new PrometheusMatrixResult(Collections.singletonMap("destination_component", "component"),
                                [new PrometheusMetricValue(1580157300L, "10")])]))

        when:
        def response = this.prometheusService.getTotalRequests(searchMetric, url)

        then:
        1 * this.prometheusApi.executeQuery(URI.create(url), query) >> prometheusResponse
        0 * _

        response != null
        response.name == "istio_charles_request_total"
        response.result != null
        !response.result.isEmpty()
        response.result.get(0).labels.size() == 1
        response.result.get(0).labels.get("destination_component") == "component"
        !response.result.get(0).data.isEmpty()
    }

    def 'should get requests total metric with filter and period and no grouping '() {
        given:
        def query = "ceil(sum(irate(istio_charles_request_total{circle_source=\"circle-id\"}[1m])) by())[5m:15s]"
        def searchMetric = new SearchMetric("istio_charles_request_total")
                .filteringBy(Collections.singletonList(new SearchMetricFilter("circle_source", Collections.singletonList("circle-id"), FilterKind.EQUAL)))
                .forPeriod(new Period(5, PeriodUnit.MINUTES, 15, PeriodUnit.SECONDS))

        def prometheusResponse = new PrometheusMetricResponse("success",
                new PrometheusMetricData("matrix",
                        [new PrometheusMatrixResult(Collections.emptyMap(),
                                [new PrometheusMetricValue(1580157300L, "10")])]))

        when:
        def response = this.prometheusService.getTotalRequests(searchMetric, url)

        then:
        1 * this.prometheusApi.executeQuery(URI.create(url), query) >> prometheusResponse
        0 * _

        response != null
        response.name == "istio_charles_request_total"
        response.result != null
        !response.result.isEmpty()
        response.result.get(0).labels.isEmpty()
        !response.result.get(0).data.isEmpty()
    }

    def 'should get requests total metric with filter and without period or group '() {
        given:
        def query = "ceil(sum(irate(istio_charles_request_total{circle_source=\"circle-id\"}[1m])) by())"
        def searchMetric = new SearchMetric("istio_charles_request_total")
                .filteringBy(Collections.singletonList(new SearchMetricFilter("circle_source", Collections.singletonList("circle-id"), FilterKind.EQUAL)))

        def prometheusResponse = new PrometheusMetricResponse("success",
                new PrometheusMetricData("matrix",
                        [new PrometheusMatrixResult(Collections.emptyMap(),
                                [new PrometheusMetricValue(1580157300L, "10")])]))

        when:
        def response = this.prometheusService.getTotalRequests(searchMetric, url)

        then:
        1 * this.prometheusApi.executeQuery(URI.create(url), query) >> prometheusResponse
        0 * _

        response != null
        response.name == "istio_charles_request_total"
        response.result != null
        !response.result.isEmpty()
        response.result.get(0).labels.isEmpty()
        !response.result.get(0).data.isEmpty()
    }

    def 'should get requests total metric grouped by and with period and without filter'() {
        given:
        def query = "ceil(sum(irate(istio_charles_request_total{}[1m])) by(destination_component))[5m:15s]"
        def searchMetric = new SearchMetric("istio_charles_request_total")
                .groupingBy(Collections.singletonList("destination_component"))
                .forPeriod(new Period(5, PeriodUnit.MINUTES, 15, PeriodUnit.SECONDS))

        def prometheusResponse = new PrometheusMetricResponse("success",
                new PrometheusMetricData("matrix",
                        [new PrometheusMatrixResult(Collections.singletonMap("destination_component", "component"),
                                [new PrometheusMetricValue(1580157300L, "10")])]))

        when:
        def response = this.prometheusService.getTotalRequests(searchMetric, url)

        then:
        1 * this.prometheusApi.executeQuery(URI.create(url), query) >> prometheusResponse
        0 * _

        response != null
        response.name == "istio_charles_request_total"
        response.result != null
        !response.result.isEmpty()
        response.result.get(0).labels.size() == 1
        response.result.get(0).labels.get("destination_component") == "component"
        !response.result.get(0).data.isEmpty()
    }

    def 'should get requests total metric grouped by, but without filter or period'() {
        given:
        def query = "ceil(sum(irate(istio_charles_request_total{}[1m])) by(destination_component))"
        def searchMetric = new SearchMetric("istio_charles_request_total")
                .groupingBy(Collections.singletonList("destination_component"))

        def prometheusResponse = new PrometheusMetricResponse("success",
                new PrometheusMetricData("matrix",
                        [new PrometheusMatrixResult(Collections.singletonMap("destination_component", "component"),
                                [new PrometheusMetricValue(1580157300L, "10")])]))

        when:
        def response = this.prometheusService.getTotalRequests(searchMetric, url)

        then:
        1 * this.prometheusApi.executeQuery(URI.create(url), query) >> prometheusResponse
        0 * _

        response != null
        response.name == "istio_charles_request_total"
        response.result != null
        !response.result.isEmpty()
        response.result.get(0).labels.size() == 1
        response.result.get(0).labels.get("destination_component") == "component"
        !response.result.get(0).data.isEmpty()
    }

    def 'should get requests total metric without filter and group, and with period '() {
        given:
        def query = "ceil(sum(irate(istio_charles_request_total{}[1m])) by())[5m:15s]"
        def searchMetric = new SearchMetric("istio_charles_request_total")
                .forPeriod(new Period(5, PeriodUnit.MINUTES, 15, PeriodUnit.SECONDS))

        def prometheusResponse = new PrometheusMetricResponse("success",
                new PrometheusMetricData("matrix",
                        [new PrometheusMatrixResult(Collections.emptyMap(),
                                [new PrometheusMetricValue(1580157300L, "10")])]))

        when:
        def response = this.prometheusService.getTotalRequests(searchMetric, url)

        then:
        1 * this.prometheusApi.executeQuery(URI.create(url), query) >> prometheusResponse
        0 * _

        response != null
        response.name == "istio_charles_request_total"
        response.result != null
        !response.result.isEmpty()
        response.result.get(0).labels.isEmpty()
        !response.result.get(0).data.isEmpty()
    }

    def 'should get requests error metric with filter, group and period'() {
        given:
        def query = """round((sum(irate(istio_charles_request_total{circle_source="circle-id", response_status=~"^5.*\$"}[1m])) by(destination_component)
                        / scalar(sum(irate(istio_charles_request_total{circle_source="circle-id"}[1m])) by(destination_component)) * 100), 0.01)[5m:15s]"""
        def searchMetric = new SearchMetric("istio_charles_request_total")
                .filteringBy(Collections.singletonList(new SearchMetricFilter("circle_source", Collections.singletonList("circle-id"), FilterKind.EQUAL)))
                .groupingBy(Collections.singletonList("destination_component"))
                .forPeriod(new Period(5, PeriodUnit.MINUTES, 15, PeriodUnit.SECONDS))

        def prometheusResponse = new PrometheusMetricResponse("success",
                new PrometheusMetricData("matrix",
                        [new PrometheusMatrixResult(Collections.singletonMap("destination_component", "component"),
                                [new PrometheusMetricValue(1580157300L, "10")])]))

        when:
        def response = this.prometheusService.getAverageHttpErrorsPercentage(searchMetric, url)

        then:
        1 * this.prometheusApi.executeQuery(URI.create(url), query) >> prometheusResponse
        0 * _

        response != null
        response.name == "istio_charles_request_total"
        response.result != null
        !response.result.isEmpty()
        response.result.get(0).labels.size() == 1
        response.result.get(0).labels.get("destination_component") == "component"
        !response.result.get(0).data.isEmpty()
    }

    def 'should get requests error metric with filter, period and no grouping'() {
        given:
        def query = """round((sum(irate(istio_charles_request_total{circle_source="circle-id", response_status=~"^5.*\$"}[1m])) by()
                        / scalar(sum(irate(istio_charles_request_total{circle_source="circle-id"}[1m])) by()) * 100), 0.01)[5m:15s]"""
        def searchMetric = new SearchMetric("istio_charles_request_total")
                .filteringBy(Collections.singletonList(new SearchMetricFilter("circle_source", Collections.singletonList("circle-id"), FilterKind.EQUAL)))
                .forPeriod(new Period(5, PeriodUnit.MINUTES, 15, PeriodUnit.SECONDS))

        def prometheusResponse = new PrometheusMetricResponse("success",
                new PrometheusMetricData("matrix",
                        [new PrometheusMatrixResult(Collections.emptyMap(),
                                [new PrometheusMetricValue(1580157300L, "10")])]))

        when:
        def response = this.prometheusService.getAverageHttpErrorsPercentage(searchMetric, url)

        then:
        1 * this.prometheusApi.executeQuery(URI.create(url), query) >> prometheusResponse
        0 * _

        response != null
        response.name == "istio_charles_request_total"
        response.result != null
        !response.result.isEmpty()
        response.result.get(0).labels.isEmpty()
        !response.result.get(0).data.isEmpty()
    }

    def 'should get requests error metric with filter, but without period and grouping'() {
        given:
        def query = """round((sum(irate(istio_charles_request_total{circle_source="circle-id", response_status=~"^5.*\$"}[1m])) by()
                        / scalar(sum(irate(istio_charles_request_total{circle_source="circle-id"}[1m])) by()) * 100), 0.01)"""
        def searchMetric = new SearchMetric("istio_charles_request_total")
                .filteringBy(Collections.singletonList(new SearchMetricFilter("circle_source", Collections.singletonList("circle-id"), FilterKind.EQUAL)))

        def prometheusResponse = new PrometheusMetricResponse("success",
                new PrometheusMetricData("matrix",
                        [new PrometheusMatrixResult(Collections.emptyMap(),
                                [new PrometheusMetricValue(1580157300L, "10")])]))

        when:
        def response = this.prometheusService.getAverageHttpErrorsPercentage(searchMetric, url)

        then:
        1 * this.prometheusApi.executeQuery(URI.create(url), query) >> prometheusResponse
        0 * _

        response != null
        response.name == "istio_charles_request_total"
        response.result != null
        !response.result.isEmpty()
        response.result.get(0).labels.isEmpty()
        !response.result.get(0).data.isEmpty()
    }

    def 'should get requests error metric grouped by, with period and no filter'() {
        given:
        def query = """round((sum(irate(istio_charles_request_total{response_status=~"^5.*\$"}[1m])) by(destination_component)
                        / scalar(sum(irate(istio_charles_request_total{}[1m])) by(destination_component)) * 100), 0.01)[5m:15s]"""
        def searchMetric = new SearchMetric("istio_charles_request_total")
                .groupingBy(Collections.singletonList("destination_component"))
                .forPeriod(new Period(5, PeriodUnit.MINUTES, 15, PeriodUnit.SECONDS))

        def prometheusResponse = new PrometheusMetricResponse("success",
                new PrometheusMetricData("matrix",
                        [new PrometheusMatrixResult(Collections.singletonMap("destination_component", "component"),
                                [new PrometheusMetricValue(1580157300L, "10")])]))

        when:
        def response = this.prometheusService.getAverageHttpErrorsPercentage(searchMetric, url)

        then:
        1 * this.prometheusApi.executeQuery(URI.create(url), query) >> prometheusResponse
        0 * _

        response != null
        response.name == "istio_charles_request_total"
        response.result != null
        !response.result.isEmpty()
        response.result.get(0).labels.size() == 1
        response.result.get(0).labels.get("destination_component") == "component"
        !response.result.get(0).data.isEmpty()
    }

    def 'should get requests error metric grouped by without period and filter'() {
        given:
        def query = """round((sum(irate(istio_charles_request_total{response_status=~"^5.*\$"}[1m])) by(destination_component)
                        / scalar(sum(irate(istio_charles_request_total{}[1m])) by(destination_component)) * 100), 0.01)"""
        def searchMetric = new SearchMetric("istio_charles_request_total")
                .groupingBy(Collections.singletonList("destination_component"))

        def prometheusResponse = new PrometheusMetricResponse("success",
                new PrometheusMetricData("matrix",
                        [new PrometheusMatrixResult(Collections.singletonMap("destination_component", "component"),
                                [new PrometheusMetricValue(1580157300L, "10")])]))

        when:
        def response = this.prometheusService.getAverageHttpErrorsPercentage(searchMetric, url)

        then:
        1 * this.prometheusApi.executeQuery(URI.create(url), query) >> prometheusResponse
        0 * _

        response != null
        response.name == "istio_charles_request_total"
        response.result != null
        !response.result.isEmpty()
        response.result.get(0).labels.size() == 1
        response.result.get(0).labels.get("destination_component") == "component"
        !response.result.get(0).data.isEmpty()
    }

    def 'should get requests error metric with no filter, no group, but with period '() {
        given:
        def query = """round((sum(irate(istio_charles_request_total{response_status=~"^5.*\$"}[1m])) by()
                        / scalar(sum(irate(istio_charles_request_total{}[1m])) by()) * 100), 0.01)[5m:15s]"""
        def searchMetric = new SearchMetric("istio_charles_request_total")
                .forPeriod(new Period(5, PeriodUnit.MINUTES, 15, PeriodUnit.SECONDS))

        def prometheusResponse = new PrometheusMetricResponse("success",
                new PrometheusMetricData("matrix",
                        [new PrometheusMatrixResult(Collections.emptyMap(),
                                [new PrometheusMetricValue(1580157300L, "10")])]))

        when:
        def response = this.prometheusService.getAverageHttpErrorsPercentage(searchMetric, url)

        then:
        1 * this.prometheusApi.executeQuery(URI.create(url), query) >> prometheusResponse
        0 * _

        response != null
        response.name == "istio_charles_request_total"
        response.result != null
        !response.result.isEmpty()
        response.result.get(0).labels.isEmpty()
        !response.result.get(0).data.isEmpty()
    }

    def 'should get requests error metric with no filter, no group and no period '() {
        given:
        def query = """round((sum(irate(istio_charles_request_total{response_status=~"^5.*\$"}[1m])) by()
                        / scalar(sum(irate(istio_charles_request_total{}[1m])) by()) * 100), 0.01)"""
        def searchMetric = new SearchMetric("istio_charles_request_total")

        def prometheusResponse = new PrometheusMetricResponse("success",
                new PrometheusMetricData("matrix",
                        [new PrometheusMatrixResult(Collections.emptyMap(),
                                [new PrometheusMetricValue(1580157300L, "10")])]))

        when:
        def response = this.prometheusService.getAverageHttpErrorsPercentage(searchMetric, url)

        then:
        1 * this.prometheusApi.executeQuery(URI.create(url), query) >> prometheusResponse
        0 * _

        response != null
        response.name == "istio_charles_request_total"
        response.result != null
        !response.result.isEmpty()
        response.result.get(0).labels.isEmpty()
        !response.result.get(0).data.isEmpty()
    }

    def 'should get latency metric with filter, group and latency '() {
        given:
        def query = """round((sum(irate(istio_charles_request_duration_seconds_sum{circle_source="circle-id"}[1m])) by(destination_component)
                        / sum(irate(istio_charles_request_duration_seconds_count{circle_source="circle-id"}[1m])) by(destination_component)) * 1000)[5m:15s]"""
        def searchMetric = new SearchMetric("istio_charles_request_duration_seconds")
                .filteringBy(Collections.singletonList(new SearchMetricFilter("circle_source", Collections.singletonList("circle-id"), FilterKind.EQUAL)))
                .groupingBy(Collections.singletonList("destination_component"))
                .forPeriod(new Period(5, PeriodUnit.MINUTES, 15, PeriodUnit.SECONDS))

        def prometheusResponse = new PrometheusMetricResponse("success",
                new PrometheusMetricData("matrix",
                        [new PrometheusMatrixResult(Collections.singletonMap("destination_component", "component"),
                                [new PrometheusMetricValue(1580157300L, "10")])]))

        when:
        def response = this.prometheusService.getAverageLatency(searchMetric, url)

        then:
        1 * this.prometheusApi.executeQuery(URI.create(url), query) >> prometheusResponse
        0 * _

        response != null
        response.name == "istio_charles_request_duration_seconds"
        response.result != null
        !response.result.isEmpty()
        response.result.get(0).labels.size() == 1
        response.result.get(0).labels.get("destination_component") == "component"
        !response.result.get(0).data.isEmpty()
    }

    def 'should get latency metric with filter and period, but not grouped '() {
        given:
        def query = """round((sum(irate(istio_charles_request_duration_seconds_sum{circle_source="circle-id"}[1m])) by()
                        / sum(irate(istio_charles_request_duration_seconds_count{circle_source="circle-id"}[1m])) by()) * 1000)[5m:15s]"""
        def searchMetric = new SearchMetric("istio_charles_request_duration_seconds")
                .filteringBy(Collections.singletonList(new SearchMetricFilter("circle_source", Collections.singletonList("circle-id"), FilterKind.EQUAL)))
                .forPeriod(new Period(5, PeriodUnit.MINUTES, 15, PeriodUnit.SECONDS))

        def prometheusResponse = new PrometheusMetricResponse("success",
                new PrometheusMetricData("matrix",
                        [new PrometheusMatrixResult(Collections.emptyMap(),
                                [new PrometheusMetricValue(1580157300L, "10")])]))

        when:
        def response = this.prometheusService.getAverageLatency(searchMetric, url)

        then:
        1 * this.prometheusApi.executeQuery(URI.create(url), query) >> prometheusResponse
        0 * _

        response != null
        response.name == "istio_charles_request_duration_seconds"
        response.result != null
        !response.result.isEmpty()
        response.result.get(0).labels.isEmpty()
        !response.result.get(0).data.isEmpty()
    }

    def 'should get latency metric with filter, but not grouped and without period '() {
        given:
        def query = """round((sum(irate(istio_charles_request_duration_seconds_sum{circle_source="circle-id"}[1m])) by()
                        / sum(irate(istio_charles_request_duration_seconds_count{circle_source="circle-id"}[1m])) by()) * 1000)"""
        def searchMetric = new SearchMetric("istio_charles_request_duration_seconds")
                .filteringBy(Collections.singletonList(new SearchMetricFilter("circle_source", Collections.singletonList("circle-id"), FilterKind.EQUAL)))

        def prometheusResponse = new PrometheusMetricResponse("success",
                new PrometheusMetricData("matrix",
                        [new PrometheusMatrixResult(Collections.emptyMap(),
                                [new PrometheusMetricValue(1580157300L, "10")])]))

        when:
        def response = this.prometheusService.getAverageLatency(searchMetric, url)

        then:
        1 * this.prometheusApi.executeQuery(URI.create(url), query) >> prometheusResponse
        0 * _

        response != null
        response.name == "istio_charles_request_duration_seconds"
        response.result != null
        !response.result.isEmpty()
        response.result.get(0).labels.isEmpty()
        !response.result.get(0).data.isEmpty()
    }

    def 'should get latency metric grouped by, with period, bit without filter '() {
        given:
        def query = """round((sum(irate(istio_charles_request_duration_seconds_sum{}[1m])) by(destination_component)
                        / sum(irate(istio_charles_request_duration_seconds_count{}[1m])) by(destination_component)) * 1000)[5m:15s]"""
        def searchMetric = new SearchMetric("istio_charles_request_duration_seconds")
                .groupingBy(Collections.singletonList("destination_component"))
                .forPeriod(new Period(5, PeriodUnit.MINUTES, 15, PeriodUnit.SECONDS))

        def prometheusResponse = new PrometheusMetricResponse("success",
                new PrometheusMetricData("matrix",
                        [new PrometheusMatrixResult(Collections.singletonMap("destination_component", "component"),
                                [new PrometheusMetricValue(1580157300L, "10")])]))

        when:
        def response = this.prometheusService.getAverageLatency(searchMetric, url)

        then:
        1 * this.prometheusApi.executeQuery(URI.create(url), query) >> prometheusResponse
        0 * _

        response != null
        response.name == "istio_charles_request_duration_seconds"
        response.result != null
        !response.result.isEmpty()
        response.result.get(0).labels.size() == 1
        response.result.get(0).labels.get("destination_component") == "component"
        !response.result.get(0).data.isEmpty()
    }

    def 'should get latency metric grouped by, without filter or period '() {
        given:
        def query = """round((sum(irate(istio_charles_request_duration_seconds_sum{}[1m])) by(destination_component)
                        / sum(irate(istio_charles_request_duration_seconds_count{}[1m])) by(destination_component)) * 1000)"""
        def searchMetric = new SearchMetric("istio_charles_request_duration_seconds")
                .groupingBy(Collections.singletonList("destination_component"))

        def prometheusResponse = new PrometheusMetricResponse("success",
                new PrometheusMetricData("matrix",
                        [new PrometheusMatrixResult(Collections.singletonMap("destination_component", "component"),
                                [new PrometheusMetricValue(1580157300L, "10")])]))

        when:
        def response = this.prometheusService.getAverageLatency(searchMetric, url)

        then:
        1 * this.prometheusApi.executeQuery(URI.create(url), query) >> prometheusResponse
        0 * _

        response != null
        response.name == "istio_charles_request_duration_seconds"
        response.result != null
        !response.result.isEmpty()
        response.result.get(0).labels.size() == 1
        response.result.get(0).labels.get("destination_component") == "component"
        !response.result.get(0).data.isEmpty()
    }

    def 'should get latency metric with no filter and no group, but with period '() {
        given:
        def query = """round((sum(irate(istio_charles_request_duration_seconds_sum{}[1m])) by()
                        / sum(irate(istio_charles_request_duration_seconds_count{}[1m])) by()) * 1000)[5m:15s]"""
        def searchMetric = new SearchMetric("istio_charles_request_duration_seconds")
                .forPeriod(new Period(5, PeriodUnit.MINUTES, 15, PeriodUnit.SECONDS))

        def prometheusResponse = new PrometheusMetricResponse("success",
                new PrometheusMetricData("matrix",
                        [new PrometheusMatrixResult(Collections.emptyMap(),
                                [new PrometheusMetricValue(1580157300L, "10")])]))

        when:
        def response = this.prometheusService.getAverageLatency(searchMetric, url)

        then:
        1 * this.prometheusApi.executeQuery(URI.create(url), query) >> prometheusResponse
        0 * _

        response != null
        response.name == "istio_charles_request_duration_seconds"
        response.result != null
        !response.result.isEmpty()
        response.result.get(0).labels.isEmpty()
        !response.result.get(0).data.isEmpty()
    }

    def 'should get latency metric with no filter, no group and no period '() {
        given:
        def query = """round((sum(irate(istio_charles_request_duration_seconds_sum{}[1m])) by()
                        / sum(irate(istio_charles_request_duration_seconds_count{}[1m])) by()) * 1000)"""
        def searchMetric = new SearchMetric("istio_charles_request_duration_seconds")

        def prometheusResponse = new PrometheusMetricResponse("success",
                new PrometheusMetricData("matrix",
                        [new PrometheusMatrixResult(Collections.emptyMap(),
                                [new PrometheusMetricValue(1580157300L, "10")])]))

        when:
        def response = this.prometheusService.getAverageLatency(searchMetric, url)

        then:
        1 * this.prometheusApi.executeQuery(URI.create(url), query) >> prometheusResponse
        0 * _

        response != null
        response.name == "istio_charles_request_duration_seconds"
        response.result != null
        !response.result.isEmpty()
        response.result.get(0).labels.isEmpty()
        !response.result.get(0).data.isEmpty()
    }

    def 'should convert prometheus response to metric when result type is vector'() {
        def query = "ceil(sum(irate(istio_charles_request_total{circle_source=\"circle-id\"}[1m])) by(destination_component))"
        def searchMetric = new SearchMetric("istio_charles_request_total")
                .filteringBy(Collections.singletonList(new SearchMetricFilter("circle_source", Collections.singletonList("circle-id"), FilterKind.EQUAL)))
                .groupingBy(Collections.singletonList("destination_component"))

        def prometheusResponse = new PrometheusMetricResponse("success",
                new PrometheusMetricData("vector",
                        [new PrometheusVectorResult(Collections.singletonMap("destination_component", "component"),
                                new PrometheusMetricValue(1580157300L, "10"))]))
        when:
        def result = prometheusService.getTotalRequests(searchMetric, url)
        then:
        1 * prometheusApi.executeQuery(URI.create(url), query) >> prometheusResponse
        0 * _

        result.name == "istio_charles_request_total"
        result.result.size() == 1
        result.result.get(0).labels.size() == 1
        result.result.get(0).labels.get("destination_component") == "component"
        result.result.get(0).data.size() == 1
        result.result.get(0).data.get(0).value == 10
        result.result.get(0).data.get(0).time == 1580157300
    }

    def 'should convert prometheus response to metric when result type is matrix'() {
        def query = "ceil(sum(irate(istio_charles_request_total{circle_source=\"circle-id\"}[1m])) by(destination_component))"
        def searchMetric = new SearchMetric("istio_charles_request_total")
                .filteringBy(Collections.singletonList(new SearchMetricFilter("circle_source", Collections.singletonList("circle-id"), FilterKind.EQUAL)))
                .groupingBy(Collections.singletonList("destination_component"))

        def prometheusResponse = new PrometheusMetricResponse("success",
                new PrometheusMetricData("matrix",
                        [new PrometheusMatrixResult(Collections.singletonMap("destination_component", "component"),
                                [new PrometheusMetricValue(1580157300L, "10")])]))
        when:
        def result = prometheusService.getTotalRequests(searchMetric, url)
        then:
        1 * prometheusApi.executeQuery(URI.create(url), query) >> prometheusResponse
        0 * _

        result.name == "istio_charles_request_total"
        result.result.size() == 1
        result.result.get(0).labels.size() == 1
        result.result.get(0).labels.get("destination_component") == "component"
        result.result.get(0).data.size() == 1
        result.result.get(0).data.get(0).value == 10
        result.result.get(0).data.get(0).time == 1580157300
    }

    def 'should convert prometheus response with metric value 0 when incoming value is not a double'() {
        def query = "ceil(sum(irate(istio_charles_request_total{circle_source=\"circle-id\"}[1m])) by(destination_component))"
        def searchMetric = new SearchMetric("istio_charles_request_total")
                .filteringBy(Collections.singletonList(new SearchMetricFilter("circle_source", Collections.singletonList("circle-id"), FilterKind.EQUAL)))
                .groupingBy(Collections.singletonList("destination_component"))

        def prometheusResponse = new PrometheusMetricResponse("success",
                new PrometheusMetricData("vector",
                        [new PrometheusVectorResult(Collections.singletonMap("destination_component", "component"),
                                new PrometheusMetricValue(1580157300L, "not a double"))]))
        when:
        def result = prometheusService.getTotalRequests(searchMetric, url)
        then:
        1 * prometheusApi.executeQuery(URI.create(url), query) >> prometheusResponse
        0 * _

        result.name == "istio_charles_request_total"
        result.result.size() == 1
        result.result.get(0).labels.size() == 1
        result.result.get(0).labels.get("destination_component") == "component"
        result.result.get(0).data.size() == 1
        result.result.get(0).data.get(0).value == 0D
        result.result.get(0).data.get(0).time == 1580157300
    }

    def 'should convert prometheus response with metric value 0 when incoming value is NaN'() {
        def query = "ceil(sum(irate(istio_charles_request_total{circle_source=\"circle-id\"}[1m])) by(destination_component))"
        def searchMetric = new SearchMetric("istio_charles_request_total")
                .filteringBy(Collections.singletonList(new SearchMetricFilter("circle_source", Collections.singletonList("circle-id"), FilterKind.EQUAL)))
                .groupingBy(Collections.singletonList("destination_component"))

        def prometheusResponse = new PrometheusMetricResponse("success",
                new PrometheusMetricData("vector",
                        [new PrometheusVectorResult(Collections.singletonMap("destination_component", "component"),
                                new PrometheusMetricValue(1580157300L, "NaN"))]))
        when:
        def result = prometheusService.getTotalRequests(searchMetric, url)
        then:
        1 * prometheusApi.executeQuery(URI.create(url), query) >> prometheusResponse
        0 * _

        result.name == "istio_charles_request_total"
        result.result.size() == 1
        result.result.get(0).labels.size() == 1
        result.result.get(0).labels.get("destination_component") == "component"
        result.result.get(0).data.size() == 1
        result.result.get(0).data.get(0).value == 0D
        result.result.get(0).data.get(0).time == 1580157300
    }
}
