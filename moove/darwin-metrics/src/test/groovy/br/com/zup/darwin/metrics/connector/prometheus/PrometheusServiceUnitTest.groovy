/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.metrics.connector.prometheus

import br.com.zup.darwin.metrics.domain.*
import spock.lang.Specification

class PrometheusServiceUnitTest extends Specification {

    private PrometheusApi prometheusApi = Mock(PrometheusApi)
    private PrometheusService prometheusService = new PrometheusService(prometheusApi)

    def 'should get requests total metric with filter and group '() {
        given:
        def query = "ceil(sum(irate(istio_charles_request_total{circle_source=\"circle-id\"}[1m])) by(destination_component))[5m:15s]"
        def searchMetric = new SearchMetric("istio_charles_request_total", new Period(5, PeriodUnit.MINUTES, 15, PeriodUnit.SECONDS))
                .filteringBy(Collections.singletonList(new SearchMetricFilter("circle_source", Collections.singletonList("circle-id"), FilterKind.EQUAL)))
                .groupingBy(Collections.singletonList("destination_component"))

        def resultList = new ArrayList()
        def metricValueList = new ArrayList()
        metricValueList.add(new PrometheusMetricValue(1580157300L, "10"))
        resultList.add(new PrometheusResult(Collections.singletonMap("destination_component", "component"), metricValueList))

        def prometheusResponse = new PrometheusMetricResponse("success",
                new PrometheusMetricData("matrix", resultList))

        when:
        def response = this.prometheusService.getTotalRequests(searchMetric)

        then:
        1 * this.prometheusApi.executeQuery(query) >> prometheusResponse
        0 * _

        response != null
        response.name == "istio_charles_request_total"
        response.result != null
        !response.result.isEmpty()
        response.result.get(0).labels.size() == 1
        response.result.get(0).labels.get("destination_component") == "component"
        !response.result.get(0).data.isEmpty()
    }

    def 'should get requests total metric with filter and no group '() {
        given:
        def query = "ceil(sum(irate(istio_charles_request_total{circle_source=\"circle-id\"}[1m])) by())[5m:15s]"
        def searchMetric = new SearchMetric("istio_charles_request_total", new Period(5, PeriodUnit.MINUTES, 15, PeriodUnit.SECONDS))
                .filteringBy(Collections.singletonList(new SearchMetricFilter("circle_source", Collections.singletonList("circle-id"), FilterKind.EQUAL)))

        def resultList = new ArrayList()
        def metricValueList = new ArrayList()
        metricValueList.add(new PrometheusMetricValue(1580157300L, "10"))
        resultList.add(new PrometheusResult(Collections.emptyMap(), metricValueList))

        def prometheusResponse = new PrometheusMetricResponse("success",
                new PrometheusMetricData("matrix", resultList))

        when:
        def response = this.prometheusService.getTotalRequests(searchMetric)

        then:
        1 * this.prometheusApi.executeQuery(query) >> prometheusResponse
        0 * _

        response != null
        response.name == "istio_charles_request_total"
        response.result != null
        !response.result.isEmpty()
        response.result.get(0).labels.isEmpty()
        !response.result.get(0).data.isEmpty()
    }

    def 'should get requests total metric with no filter and grouped '() {
        given:
        def query = "ceil(sum(irate(istio_charles_request_total{}[1m])) by(destination_component))[5m:15s]"
        def searchMetric = new SearchMetric("istio_charles_request_total", new Period(5, PeriodUnit.MINUTES, 15, PeriodUnit.SECONDS))
                .groupingBy(Collections.singletonList("destination_component"))

        def resultList = new ArrayList()
        def metricValueList = new ArrayList()
        metricValueList.add(new PrometheusMetricValue(1580157300L, "10"))
        resultList.add(new PrometheusResult(Collections.singletonMap("destination_component", "component"), metricValueList))

        def prometheusResponse = new PrometheusMetricResponse("success",
                new PrometheusMetricData("matrix", resultList))

        when:
        def response = this.prometheusService.getTotalRequests(searchMetric)

        then:
        1 * this.prometheusApi.executeQuery(query) >> prometheusResponse
        0 * _

        response != null
        response.name == "istio_charles_request_total"
        response.result != null
        !response.result.isEmpty()
        response.result.get(0).labels.size() == 1
        response.result.get(0).labels.get("destination_component") == "component"
        !response.result.get(0).data.isEmpty()
    }

    def 'should get requests total metric with no filter and no group '() {
        given:
        def query = "ceil(sum(irate(istio_charles_request_total{}[1m])) by())[5m:15s]"
        def searchMetric = new SearchMetric("istio_charles_request_total", new Period(5, PeriodUnit.MINUTES, 15, PeriodUnit.SECONDS))

        def resultList = new ArrayList()
        def metricValueList = new ArrayList()
        metricValueList.add(new PrometheusMetricValue(1580157300L, "10"))
        resultList.add(new PrometheusResult(Collections.emptyMap(), metricValueList))

        def prometheusResponse = new PrometheusMetricResponse("success",
                new PrometheusMetricData("matrix", resultList))

        when:
        def response = this.prometheusService.getTotalRequests(searchMetric)

        then:
        1 * this.prometheusApi.executeQuery(query) >> prometheusResponse
        0 * _

        response != null
        response.name == "istio_charles_request_total"
        response.result != null
        !response.result.isEmpty()
        response.result.get(0).labels.isEmpty()
        !response.result.get(0).data.isEmpty()
    }

    def 'should get requests error metric with filter and group '() {
        given:
        def query = """round((sum(irate(istio_charles_request_total{circle_source="circle-id", response_status=~"^5.*\$"}[1m])) by(destination_component)
                        / scalar(sum(irate(istio_charles_request_total{circle_source="circle-id"}[1m])) by(destination_component)) * 100), 0.01)[5m:15s]"""
        def searchMetric = new SearchMetric("istio_charles_request_total", new Period(5, PeriodUnit.MINUTES, 15, PeriodUnit.SECONDS))
                .filteringBy(Collections.singletonList(new SearchMetricFilter("circle_source", Collections.singletonList("circle-id"), FilterKind.EQUAL)))
                .groupingBy(Collections.singletonList("destination_component"))

        def resultList = new ArrayList()
        def metricValueList = new ArrayList()
        metricValueList.add(new PrometheusMetricValue(1580157300L, "10"))
        resultList.add(new PrometheusResult(Collections.singletonMap("destination_component", "component"), metricValueList))

        def prometheusResponse = new PrometheusMetricResponse("success",
                new PrometheusMetricData("matrix", resultList))

        when:
        def response = this.prometheusService.getAverageHttpErrors(searchMetric)

        then:
        1 * this.prometheusApi.executeQuery(query) >> prometheusResponse
        0 * _

        response != null
        response.name == "istio_charles_request_total"
        response.result != null
        !response.result.isEmpty()
        response.result.get(0).labels.size() == 1
        response.result.get(0).labels.get("destination_component") == "component"
        !response.result.get(0).data.isEmpty()
    }

    def 'should get requests error metric with filter and no group '() {
        given:
        def query = """round((sum(irate(istio_charles_request_total{circle_source="circle-id", response_status=~"^5.*\$"}[1m])) by()
                        / scalar(sum(irate(istio_charles_request_total{circle_source="circle-id"}[1m])) by()) * 100), 0.01)[5m:15s]"""
        def searchMetric = new SearchMetric("istio_charles_request_total", new Period(5, PeriodUnit.MINUTES, 15, PeriodUnit.SECONDS))
                .filteringBy(Collections.singletonList(new SearchMetricFilter("circle_source", Collections.singletonList("circle-id"), FilterKind.EQUAL)))

        def resultList = new ArrayList()
        def metricValueList = new ArrayList()
        metricValueList.add(new PrometheusMetricValue(1580157300L, "10"))
        resultList.add(new PrometheusResult(Collections.emptyMap(), metricValueList))

        def prometheusResponse = new PrometheusMetricResponse("success",
                new PrometheusMetricData("matrix", resultList))

        when:
        def response = this.prometheusService.getAverageHttpErrors(searchMetric)

        then:
        1 * this.prometheusApi.executeQuery(query) >> prometheusResponse
        0 * _

        response != null
        response.name == "istio_charles_request_total"
        response.result != null
        !response.result.isEmpty()
        response.result.get(0).labels.isEmpty()
        !response.result.get(0).data.isEmpty()
    }

    def 'should get requests error metric with no filter and grouped '() {
        given:
        def query = """round((sum(irate(istio_charles_request_total{response_status=~"^5.*\$"}[1m])) by(destination_component)
                        / scalar(sum(irate(istio_charles_request_total{}[1m])) by(destination_component)) * 100), 0.01)[5m:15s]"""
        def searchMetric = new SearchMetric("istio_charles_request_total", new Period(5, PeriodUnit.MINUTES, 15, PeriodUnit.SECONDS))
                .groupingBy(Collections.singletonList("destination_component"))

        def resultList = new ArrayList()
        def metricValueList = new ArrayList()
        metricValueList.add(new PrometheusMetricValue(1580157300L, "10"))
        resultList.add(new PrometheusResult(Collections.singletonMap("destination_component", "component"), metricValueList))

        def prometheusResponse = new PrometheusMetricResponse("success",
                new PrometheusMetricData("matrix", resultList))

        when:
        def response = this.prometheusService.getAverageHttpErrors(searchMetric)

        then:
        1 * this.prometheusApi.executeQuery(query) >> prometheusResponse
        0 * _

        response != null
        response.name == "istio_charles_request_total"
        response.result != null
        !response.result.isEmpty()
        response.result.get(0).labels.size() == 1
        response.result.get(0).labels.get("destination_component") == "component"
        !response.result.get(0).data.isEmpty()
    }

    def 'should get requests error metric with no filter and no group '() {
        given:
        def query = """round((sum(irate(istio_charles_request_total{response_status=~"^5.*\$"}[1m])) by()
                        / scalar(sum(irate(istio_charles_request_total{}[1m])) by()) * 100), 0.01)[5m:15s]"""
        def searchMetric = new SearchMetric("istio_charles_request_total", new Period(5, PeriodUnit.MINUTES, 15, PeriodUnit.SECONDS))

        def resultList = new ArrayList()
        def metricValueList = new ArrayList()
        metricValueList.add(new PrometheusMetricValue(1580157300L, "10"))
        resultList.add(new PrometheusResult(Collections.emptyMap(), metricValueList))

        def prometheusResponse = new PrometheusMetricResponse("success",
                new PrometheusMetricData("matrix", resultList))

        when:
        def response = this.prometheusService.getAverageHttpErrors(searchMetric)

        then:
        1 * this.prometheusApi.executeQuery(query) >> prometheusResponse
        0 * _

        response != null
        response.name == "istio_charles_request_total"
        response.result != null
        !response.result.isEmpty()
        response.result.get(0).labels.isEmpty()
        !response.result.get(0).data.isEmpty()
    }

    def 'should get latency metric with filter and group'() {
        given:
        def query = """round((sum(irate(istio_charles_request_duration_seconds_sum{circle_source="circle-id"}[1m])) by(destination_component)
                        / sum(irate(istio_charles_request_duration_seconds_count{circle_source="circle-id"}[1m])) by(destination_component)) * 1000)[5m:15s]"""
        def searchMetric = new SearchMetric("istio_charles_request_duration_seconds", new Period(5, PeriodUnit.MINUTES, 15, PeriodUnit.SECONDS))
                .filteringBy(Collections.singletonList(new SearchMetricFilter("circle_source", Collections.singletonList("circle-id"), FilterKind.EQUAL)))
                .groupingBy(Collections.singletonList("destination_component"))

        def resultList = new ArrayList()
        def metricValueList = new ArrayList()
        metricValueList.add(new PrometheusMetricValue(1580157300L, "10"))
        resultList.add(new PrometheusResult(Collections.singletonMap("destination_component", "component"), metricValueList))

        def prometheusResponse = new PrometheusMetricResponse("success",
                new PrometheusMetricData("matrix", resultList))

        when:
        def response = this.prometheusService.getAverageLatency(searchMetric)

        then:
        1 * this.prometheusApi.executeQuery(query) >> prometheusResponse
        0 * _

        response != null
        response.name == "istio_charles_request_duration_seconds"
        response.result != null
        !response.result.isEmpty()
        response.result.get(0).labels.size() == 1
        response.result.get(0).labels.get("destination_component") == "component"
        !response.result.get(0).data.isEmpty()
    }

    def 'should get latency metric with filter and no group '() {
        given:
        def query = """round((sum(irate(istio_charles_request_duration_seconds_sum{circle_source="circle-id"}[1m])) by()
                        / sum(irate(istio_charles_request_duration_seconds_count{circle_source="circle-id"}[1m])) by()) * 1000)[5m:15s]"""
        def searchMetric = new SearchMetric("istio_charles_request_duration_seconds", new Period(5, PeriodUnit.MINUTES, 15, PeriodUnit.SECONDS))
                .filteringBy(Collections.singletonList(new SearchMetricFilter("circle_source", Collections.singletonList("circle-id"), FilterKind.EQUAL)))

        def resultList = new ArrayList()
        def metricValueList = new ArrayList()
        metricValueList.add(new PrometheusMetricValue(1580157300L, "10"))
        resultList.add(new PrometheusResult(Collections.emptyMap(), metricValueList))

        def prometheusResponse = new PrometheusMetricResponse("success",
                new PrometheusMetricData("matrix", resultList))

        when:
        def response = this.prometheusService.getAverageLatency(searchMetric)

        then:
        1 * this.prometheusApi.executeQuery(query) >> prometheusResponse
        0 * _

        response != null
        response.name == "istio_charles_request_duration_seconds"
        response.result != null
        !response.result.isEmpty()
        response.result.get(0).labels.isEmpty()
        !response.result.get(0).data.isEmpty()
    }

    def 'should get latency metric with no filter and grouped '() {
        given:
        def query = """round((sum(irate(istio_charles_request_duration_seconds_sum{}[1m])) by(destination_component)
                        / sum(irate(istio_charles_request_duration_seconds_count{}[1m])) by(destination_component)) * 1000)[5m:15s]"""
        def searchMetric = new SearchMetric("istio_charles_request_duration_seconds", new Period(5, PeriodUnit.MINUTES, 15, PeriodUnit.SECONDS))
                .groupingBy(Collections.singletonList("destination_component"))

        def resultList = new ArrayList()
        def metricValueList = new ArrayList()
        metricValueList.add(new PrometheusMetricValue(1580157300L, "10"))
        resultList.add(new PrometheusResult(Collections.singletonMap("destination_component", "component"), metricValueList))

        def prometheusResponse = new PrometheusMetricResponse("success",
                new PrometheusMetricData("matrix", resultList))

        when:
        def response = this.prometheusService.getAverageLatency(searchMetric)

        then:
        1 * this.prometheusApi.executeQuery(query) >> prometheusResponse
        0 * _

        response != null
        response.name == "istio_charles_request_duration_seconds"
        response.result != null
        !response.result.isEmpty()
        response.result.get(0).labels.size() == 1
        response.result.get(0).labels.get("destination_component") == "component"
        !response.result.get(0).data.isEmpty()
    }

    def 'should get latency metric with no filter and no group '() {
        given:
        def query = """round((sum(irate(istio_charles_request_duration_seconds_sum{}[1m])) by()
                        / sum(irate(istio_charles_request_duration_seconds_count{}[1m])) by()) * 1000)[5m:15s]"""
        def searchMetric = new SearchMetric("istio_charles_request_duration_seconds", new Period(5, PeriodUnit.MINUTES, 15, PeriodUnit.SECONDS))

        def resultList = new ArrayList()
        def metricValueList = new ArrayList()
        metricValueList.add(new PrometheusMetricValue(1580157300L, "10"))
        resultList.add(new PrometheusResult(Collections.emptyMap(), metricValueList))

        def prometheusResponse = new PrometheusMetricResponse("success",
                new PrometheusMetricData("matrix", resultList))

        when:
        def response = this.prometheusService.getAverageLatency(searchMetric)

        then:
        1 * this.prometheusApi.executeQuery(query) >> prometheusResponse
        0 * _

        response != null
        response.name == "istio_charles_request_duration_seconds"
        response.result != null
        !response.result.isEmpty()
        response.result.get(0).labels.isEmpty()
        !response.result.get(0).data.isEmpty()
    }


}
