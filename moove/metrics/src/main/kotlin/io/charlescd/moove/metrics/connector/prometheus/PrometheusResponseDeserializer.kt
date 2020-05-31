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

import com.fasterxml.jackson.core.JsonParser
import com.fasterxml.jackson.databind.DeserializationContext
import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.deser.std.StdDeserializer
import com.fasterxml.jackson.module.kotlin.KotlinModule
import com.fasterxml.jackson.module.kotlin.readValue

class PrometheusResponseDeserializer(vc: Class<*>?) : StdDeserializer<PrometheusMetricData>(vc) {

    constructor() : this(null)

    override fun deserialize(parser: JsonParser?, ctx: DeserializationContext?): PrometheusMetricData {
        val node: JsonNode? = parser?.codec?.readTree(parser)
        val objectMapper = ObjectMapper().registerModule(KotlinModule())

        val resultType = (node?.get("resultType")?.asText())
                ?: return PrometheusMetricData("", emptyList())

        val prometheusResult: List<PrometheusResult> = when (PrometheusResultType.valueOf(resultType.toUpperCase())) {
            PrometheusResultType.MATRIX -> objectMapper.readValue(node.get("result")?.asIterable()?.toString()
                    ?: "[]") as List<PrometheusMatrixResult>
            PrometheusResultType.VECTOR -> (objectMapper.readValue(node.get("result")?.asIterable()?.toString()
                    ?: "[]")) as List<PrometheusVectorResult>
        }

        return PrometheusMetricData(resultType, prometheusResult)
    }
}