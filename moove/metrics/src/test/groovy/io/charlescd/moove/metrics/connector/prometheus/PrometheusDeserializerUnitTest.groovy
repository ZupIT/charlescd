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


import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import com.fasterxml.jackson.module.kotlin.KotlinModule
import io.charlescd.moove.metrics.connector.prometheus.PrometheusResponseDeserializer
import spock.lang.Specification

class PrometheusDeserializerUnitTest extends Specification {

    def mapper = new ObjectMapper().registerModule(new KotlinModule()).registerModule(new JavaTimeModule())

    def 'should convert a matrix type metric'() {
        given:
        def json = """{
                        "status": "success",
                         "data": {
                            "resultType": "matrix",
                            "result": [
                                {
                                    "metric": {
                                     "destination_component": "component-x"
                                    },
                                    "values": [
                                        [
                                            1587645600,
                                             "1"
                                        ],
                                        [
                                            1587645900,
                                            "2"
                                        ]
                                    ]
                                }
                            ]
                        }
                    }"""
        when:
        def result = mapper.readValue(json, PrometheusMetricResponse.class)
        then:
        result.status == "success"
        result.data.resultType == "matrix"
        result.data.result.size() == 1
        result.data.result.get(0) as PrometheusMatrixResult
        (result.data.result.get(0) as PrometheusMatrixResult).metric.size() == 1
        (result.data.result.get(0) as PrometheusMatrixResult).metric.get("destination_component") == "component-x"
        (result.data.result.get(0) as PrometheusMatrixResult).values.size() == 2
        (result.data.result.get(0) as PrometheusMatrixResult).values.get(0).value == "1"
        (result.data.result.get(0) as PrometheusMatrixResult).values.get(0).timeStamp == 1587645600
        (result.data.result.get(0) as PrometheusMatrixResult).values.get(1).value == "2"
        (result.data.result.get(0) as PrometheusMatrixResult).values.get(1).timeStamp == 1587645900
    }

    def 'should convert a vector type metric'() {
        given:
        def json = """
                       {
                           "status": "success",
                            "data": {
                                "resultType": "vector",
                                "result": [
                                    {
                                        "metric": {
                                            "destination_component": "component-y"
                                        },
                                        "value": [
                                            1587646048.211,
                                            "12246"
                                        ]
                                    }
                                ]
                            }
                       }"""
        when:
        def result = mapper.readValue(json, PrometheusMetricResponse.class)
        then:
        result.status == "success"
        result.data.resultType == "vector"
        result.data.result.size() == 1
        result.data.result.get(0) as PrometheusVectorResult
        (result.data.result.get(0) as PrometheusVectorResult).metric.size() == 1
        (result.data.result.get(0) as PrometheusVectorResult).metric.get("destination_component") == "component-y"
        (result.data.result.get(0) as PrometheusVectorResult).value.value == "12246"
        (result.data.result.get(0) as PrometheusVectorResult).value.timeStamp == 1587646048
    }

    def 'should return empty result when no result were present in a matrix type metric'() {
        given:
        def json = """{
                        "status": "success",
                         "data": {
                            "resultType": "matrix"
                        }
                    }"""
        when:
        def result = mapper.readValue(json, PrometheusMetricResponse.class)
        then:
        result.status == "success"
        result.data.resultType == "matrix"
        result.data.result.empty
    }

    def 'should return empty result when parser is null'() {
        given:
        def deserializer = new PrometheusResponseDeserializer()
        when:
        def result = deserializer.deserialize(null, null)
        then:
        result.resultType == ""
        result.result.empty
    }

    def 'should return empty result when resultType is null'() {
        given:
        def json = """{
                        "status": "success",
                         "data": {
                            "result": [
                                {
                                    "metric": {
                                     "destination_component": "component-x"
                                    },
                                    "values": [
                                        [
                                            1587645600,
                                             "1"
                                        ],
                                        [
                                            1587645900,
                                            "2"
                                        ]
                                    ]
                                }
                            ]
                        }
                    }"""
        when:
        def result = mapper.readValue(json, PrometheusMetricResponse.class)
        then:
        result.status == "success"
        result.data.resultType == ""
        result.data.result.empty
    }


}
